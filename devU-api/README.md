# Typescript Example Project

## Project Dependencies (install these)

- [Node](https://nodejs.org/en/)
- [Docker](https://www.docker.com/get-started) (this is for the DB)

Once you've got these installed, we can build our container and run it

```
docker run \
  --name typeorm-postgres \
  -p 5432:5432 \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=typescript_api \
  -e POSTGRES_USER=typescript_user \
  -d postgres
```

Install node all dependancies. All of these postgres database environment variables can change, and can be set as environment varibales on your machine if you want to change them.

```
npm install
```

Run the initial migrations to setup our DB schema

```
npm run typeorm -- migration:run
```

## Running the project

Once you've got all the dependancies installed you can run the project via

```
npm start
```

By defualt the project runs at `localhost:3001`, but you can change the port by setting an alternate `PORT` environment variable if you so choose.

If you're working in vscode, a configuration has been included to allow for debugging. Open up the VS Code Run and Debug section and click `Debug API`.

## Working in the Project

This projet is built using

- [Typescript](https://www.typescriptlang.org/) - A superset of JavaScript. The language of the applciation
- [Express](https://expressjs.com/) - A Node REST framework.
- [TypeORM](https://typeorm.io/#/) - A Typescript ORM (manages the DB and all DB calls)

### Common TypeORM Commands

If the schema needs to be updated, you can do so by updating the models and running

```
npm run typeorm -- migration:generate -n generatedMigrationName
```
