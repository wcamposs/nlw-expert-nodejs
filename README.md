# Polls voting backend app
App created with Nodejs to Rocketseat's NLW-Expert Nodejs course.

## Files required to run properly:
To ensure the database runs properly, you should create a .env file into the repository root and add this single line:
```
DATABASE_URL="postgresql://docker:docker@localhost:5432/polls?schema=public"
```
In case you're not using the default credentials mentioned into docker-compose file, it should look like this:
```
DATABASE_URL="postgresql://${user}:${password}@localhost:${dbport}/${applicationName}?schema=public"
```
Remember to pass your own credentials, the first example is using the default postgreSQL credentials.

## Useful commands:
Those commands should be useful in order to run properly the application and test the features.

#### Run server:
```
npm run dev
```

#### Run docker compose:
Assuming you already installed docker on your machine
```
docker compose up -d
```

#### Run prisma studio to see the records on your database:
```
npx prisma studio
```

#### Run migrations on prisma:
```
npx prisma migrate dev
```
## Techs used:
 - [NodeJS](https://nodejs.org/en)
 - [Typescript](https://www.typescriptlang.org)
 - [Fastify](https://fastify.dev) - Framework used.
 - [Docker](https://www.docker.com).
 - [Postgres](https://www.postgresql.org) - Relational DB used.
 - [Redis](https://redis.io) - NoSQL database used to store voting count.
 - [Prisma](https://www.prisma.io) - ORM used to deal with relational DB in an simple way.
 - [Zod](https://zod.dev) - Typescript schema validation with static type inferece.
 - [Ioredis](https://github.com/redis/ioredis) - Redis client for NodeJS.
 - [Hoppscotch](https://hoppscotch.io/) - Used to see backend requests. Required hoppscotch browser extention, recommended chrome browser.
