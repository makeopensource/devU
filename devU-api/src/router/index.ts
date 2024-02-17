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
import assignmentProblem from '../assignmentProblem/assignmentProblem.router'
import submissionProblemScore from '../submissionProblemScore/submissionProblemScore.router'
import fileUpload from '../fileUpload/fileUpload.router'

import { isAuthorized } from '../auth/auth.middleware'

import { NotFound } from '../utils/apiResponse.utils'
import nonContainerAutoGraderRouter from "../nonContainerAutoGrader/nonContainerAutoGrader.router";

const Router = express.Router()

Router.use('/assignments', isAuthorized, assignments)
Router.use('/assignment-problems', isAuthorized, assignmentProblem)
Router.use('/users', isAuthorized, users)
Router.use('/courses', isAuthorized, courses)
Router.use('/user-courses', isAuthorized, userCourse)
Router.use('/code-assignments', isAuthorized, codeAssignment)
Router.use('/submissions', isAuthorized, submissions)
Router.use('/submission-scores', isAuthorized, submissionScore)
Router.use('/nonContainerAutoGrader', isAuthorized, nonContainerAutoGraderRouter)
Router.use('/container-auto-graders', isAuthorized, containerAutoGrader)
Router.use('/submission-problem-scores', isAuthorized, submissionProblemScore)
Router.use('/file-upload', isAuthorized, fileUpload)

Router.use('/login', login)
Router.use('/logout', logout)

//To access docs, go to localhost:3001/docs in your browser
Router.use('/docs', swaggerUi.serve, swaggerUi.setup(swagger))

Router.use('/status', status)
Router.use('/', (req: Request, res: Response, next: NextFunction) => res.status(404).send(NotFound))

export default Router
