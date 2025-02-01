// Libraries
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'

import passport from 'passport'
import { dataSource } from './database'

import environment from './environment'
import { initializeMinio } from './fileStorage'

import { initLeviathan } from './autograder/leviathan/leviathan'

// Middleware
import router from './router'
import errorHandler from './middleware/errorHandler.middleware'

// Authentication Handlers
import './utils/passport.utils'
import { webhookInterceptor } from './entities/webhooks/webhooks.middleware'
import { initTango } from './autograder/tango/tango.service'


async function main() {
  // file storage
  await initializeMinio()
  // database - typeorm
  await dataSource.initialize()

  await initLeviathan()
  await initTango()

  const app = express()
  // middleware stuff
  app.use(helmet())
  app.use(express.urlencoded({ extended: true }))
  app.use(express.json())
  app.use(cookieParser())
  app.use(cors({ origin: environment.clientUrl, credentials: true }))
  app.use(morgan('combined'))
  app.use(passport.initialize())
  app.use(webhookInterceptor)

  console.log(`DevU api is ${environment.isDocker ? '' : 'not'} running in docker`)

  // main routes
  app.use('/', router)
  app.use(errorHandler)

  app.listen(environment.port, () =>
    console.log(`API listening at port - ${environment.port}\n
    If you are running the full app, the front end should be accessible at http://localhost:9000`),
  )
}

main().then(_ => {
  console.log('DevU initialized')
}).catch(error => {
  console.log('An error occurred while initializing devU')
  console.error(error)
})
