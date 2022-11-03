import express, { Request, Response, NextFunction } from 'express'
import swaggerUi from 'swagger-ui-express'

import swagger from '../utils/swagger.utils'

import userCourse from './userCourse.router'
import assignments from './assignment.router'
import assignmentProblems from './assignmentProblem.router'
import courses from './course.router'
import login from './login.router'
import logout from './logout.router'
import status from './status.router'
import submissions from './submission.router'
import users from './user.router'
import submissionProblemScores from './submissionProblemScore.router'

import { isAuthorized } from '../middleware/auth.middleware'

import { NotFound } from '../utils/apiResponse.utils'

const Router = express.Router()

Router.use('/assignments', isAuthorized, assignments)
Router.use('/assignment-problems', isAuthorized, assignmentProblems)
Router.use('/courses', isAuthorized, courses)
Router.use('/user-courses', isAuthorized, userCourse)
Router.use('/docs', swaggerUi.serve, swaggerUi.setup(swagger))
Router.use('/submissions', isAuthorized, submissions)
Router.use('/users', isAuthorized, users)
Router.use('/submission-problem-scores', isAuthorized, submissionProblemScores)

Router.use('/login', login)
Router.use('/logout', logout)

Router.use('/docs', swaggerUi.serve, swaggerUi.setup(swagger))
Router.use('/status', status)
Router.use('/', (req: Request, res: Response, next: NextFunction) => res.status(404).send(NotFound))

export default Router
