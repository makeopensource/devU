import express, { Request, Response, NextFunction } from 'express'
import swaggerUi from 'swagger-ui-express'

import swagger from '../utils/swagger.utils'

import codeAssignment from '../codeAssignment/codeAssignment.router'
import userCourse from '../userCourse/userCourse.router'
import assignments from '../assignment/assignment.router'
import courses from '../course/course.router'
import login from '../auth/login/login.router'
import logout from '../auth/logout/logout.router'
import status from '../status/status.router'
import submissions from '../submission/submission.router'
import users from '../user/user.router'
import submissionScore from '../submissionScore/submissionScore.router'
import containerAutoGrader from '../containerAutoGrader/containerAutoGrader.router'

import { isAuthorized } from '../auth/auth.middleware'

import { NotFound } from '../utils/apiResponse.utils'

const Router = express.Router()

Router.use('/assignments', isAuthorized, assignments)
Router.use('/courses', isAuthorized, courses)
Router.use('/user-courses', isAuthorized, userCourse)
Router.use('/code-assignments', isAuthorized, codeAssignment)
Router.use('/docs', swaggerUi.serve, swaggerUi.setup(swagger))
Router.use('/submissions', isAuthorized, submissions)
Router.use('/users', isAuthorized, users)
Router.use('/submission-scores', isAuthorized, submissionScore)
Router.use('/container-auto-graders', isAuthorized, containerAutoGrader)

Router.use('/login', login)
Router.use('/logout', logout)

Router.use('/docs', swaggerUi.serve, swaggerUi.setup(swagger))
Router.use('/status', status)
Router.use('/', (req: Request, res: Response, next: NextFunction) => res.status(404).send(NotFound))

export default Router
