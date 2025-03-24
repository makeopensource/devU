// Libraries
import 'reflect-metadata'

import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'

import passport from 'passport'
import { dataSource } from './database'

import environment from './environment'
import { initializeMinio } from './fileStorage'

// Middleware
import router from './router'
import errorHandler from './middleware/errorHandler.middleware'

// Authentication Handlers
import './utils/passport.utils'
import { responseInterceptor } from './entities/webhooks/webhooks.middleware'

const app = express()

async function main() {
  try {
    await initializeMinio()
    await dataSource.initialize()

    app.use(helmet())
    app.use(express.urlencoded({ extended: true }))
    app.use(express.json())
    app.use(cookieParser())
    app.use(cors({ origin: environment.clientUrl, credentials: true }))
    app.use(morgan('combined'))
    app.use(passport.initialize())

    console.log(`API${environment.isDocker ? '' : ' not'} running in docker`)
    app.use(responseInterceptor) // webhooks
    app.use('/', router)
    app.use(errorHandler)

    app.listen(environment.port, () =>
      console.log(`API listening at port - ${environment.port}`),
    )
  } catch (e: any) {
    console.error(`Error during initialization ${e.toString()}`)
  }
}

main().catch((err: any) => {
  console.error(err)
})