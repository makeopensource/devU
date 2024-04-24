import { ConnectionOptions, Repository } from 'typeorm'

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

/*
  This function is used to group the data by the specified column
  @param connection: the specific connection to the database
  @param columnList: the list of columns to be used to group the data
  @param query: the query object
  @param filter: the filter object
  @returns the grouped data
*/
export async function groupBy<T>(
  connection: Repository<T>,
  columnList: string[],
  query: any,
  filter: { index: string; value: number }
) {
  let orders = query
  // The filteredOrders currently only filters the orders by the columnList, any other orders are removed
  // and only set to 'ASC' since no input is provided for the order
  const filteredOrders = Object.entries(orders)
    .filter(([key]) => columnList.includes(orders[key]))
    .reduce((acc, [key]) => ({ ...acc, [orders[key]]: 'ASC' }), {})

  orders = Object.keys(filteredOrders).length === 0 ? { id: 'ASC' } : filteredOrders

  return await connection.find({
    where: {
      [filter.index]: filter.value,
    },
    order: orders,
    withDeleted: false,
  })
}
