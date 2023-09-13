import { ConnectionOptions } from 'typeorm'

import environment from './environment'

const typeORMConfiguration: ConnectionOptions = {
  type: 'postgres',
  host: environment.dbHost,
  username: environment.dbUsername,
  password: environment.dbPassword,
  database: environment.database,
  port: 5432,
  synchronize: false, // prevents api from auto migrating to match models on startup
  logging: environment.logDB,
  maxQueryExecutionTime: 1000, // logs queries longer than 1 second
  entities: [`${__dirname}/**/*.model.{ts,js}`],
  migrations: [`${__dirname}/migration/**/*.{ts,js}`],
  subscribers: [`${__dirname}/migration/**/*.{ts,js}`],
  cli: {
    entitiesDir: `./src/model`,
    migrationsDir: `./src/migration`,
    subscribersDir: `./src/subscriber`,
  },
}

export default typeORMConfiguration
