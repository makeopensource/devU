export default {
  port: process.env.PORT || 3001,
  dbHost: process.env.DB_HOST || 'localhost',
  dbUsername: process.env.DB_USERNAME || 'typescript_user',
  dbPassword: process.env.DB_PASSWORD || 'password',
  database: process.env.DATABASE || 'typescript_api',
  logDB: process.env.LOG_DB !== undefined,
}
