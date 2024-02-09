import z from "zod";
import { randomUUID } from "node:crypto";
import { prisma } from "../../lib/prisma";
import { FastifyInstance } from "fastify";
import { redis } from "../../lib/redis";
import { voting } from "../../utils/voting-pub-sub";

export async function voteOnPoll(app: FastifyInstance) {
  app.post("/polls/:pollId/votes", async (request, reply) => {
    const voteOnPollBody = z.object({
      pollOptionId: z.string().uuid(),
    });

    const voteOnPollParams = z.object({
      pollId: z.string().uuid(),
    });

    const { pollId } = voteOnPollParams.parse(request.params);
    const { pollOptionId } = voteOnPollBody.parse(request.body);

    let { sessionId } = request.cookies;

    if (sessionId) {
        const userPreviousVoteOnPoll = await prisma.vote.findUnique({
            where: {
                sessionId_pollId: {
                    sessionId,
                    pollId,
                },
            }
        })

        if (userPreviousVoteOnPoll && userPreviousVoteOnPoll.pollOptionId !== pollOptionId) {
            await prisma.vote.delete({
                where: {
                    id: userPreviousVoteOnPoll.id,
                }
            })

            const votes = await redis.zincrby(pollId, -1, userPreviousVoteOnPoll.pollOptionId)

            voting.publish(pollId, {
                pollOptionId: userPreviousVoteOnPoll.pollOptionId,
                votes: Number(votes)
            })
        } else {
            return reply.status(400).send({ message: 'You already voted on this poll.'})
        }
    }

    if (!sessionId) {
      sessionId = randomUUID();

      reply.setCookie("sessionId", sessionId, {
        path: "/", // visible to all routes
        maxAge: 60 * 60 * 24 * 30, // 30 days
        signed: true, // prevent user from update it and grants that cookie info was set from this application
        httpOnly: true, // accessible only for backend application
      });
    }

    await prisma.vote.create({
        data: {
            sessionId,
            pollId,
            pollOptionId,
        }
    })

    const votes = await redis.zincrby(pollId, 1, pollOptionId)

    voting.publish(pollId, {
        pollOptionId,
        votes: Number(votes),
    })

    return reply.status(201).send();
  });
}
