import express, { Request, Response, NextFunction } from 'express'
import swaggerUi from 'swagger-ui-express'

import swagger from '../utils/swagger.utils'

import status from './status.router'
import users from './users.router'

import { NotFound } from '../utils/apiResponse.utils'

const Router = express.Router()

Router.use('/status', status)
Router.use('/users', users)
Router.use('/docs', swaggerUi.serve, swaggerUi.setup(swagger))

Router.use('/', (req: Request, res: Response, next: NextFunction) => res.status(404).send(NotFound))

export default Router
