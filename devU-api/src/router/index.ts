import express, { Request, Response, NextFunction } from 'express'
import swaggerUi from 'swagger-ui-express'

import swagger from '../utils/swagger.utils'

import userCourse from '../entities/userCourse/userCourse.router'
import assignments from '../entities/assignment/assignment.router'
import courses from '../entities/course/course.router'
import login from '../auth/login/login.router'
import logout from '../auth/logout/logout.router'
import status from '../status/status.router'
import submissions from '../entities/submission/submission.router'
import users from '../entities/user/user.router'
import submissionScore from '../entities/submissionScore/submissionScore.router'
import containerAutoGrader from '../entities/containerAutoGrader/containerAutoGrader.router'
import assignmentProblem from '../entities/assignmentProblem/assignmentProblem.router'
import submissionProblemScore from '../entities/submissionProblemScore/submissionProblemScore.router'
import deadlineExtensions from "../entities/deadlineExtensions/deadlineExtensions.router";
import fileUpload from '../fileUpload/fileUpload.router'
import grader from '../entities/grader/grader.router'

import { isAuthorized } from '../auth/auth.middleware'

import { NotFound } from '../utils/apiResponse.utils'
import nonContainerAutoGraderRouter from "../entities/nonContainerAutoGrader/nonContainerAutoGrader.router";

const Router = express.Router()

Router.use('/assignments', isAuthorized, assignments)
Router.use('/assignment-problems', isAuthorized, assignmentProblem)
Router.use('/users', isAuthorized, users)
Router.use('/courses', isAuthorized, courses)
Router.use('/user-courses', isAuthorized, userCourse)
Router.use('/submissions', isAuthorized, submissions)
Router.use('/submission-scores', isAuthorized, submissionScore)
Router.use('/nonContainerAutoGrader', isAuthorized, nonContainerAutoGraderRouter)
Router.use('/container-auto-graders', isAuthorized, containerAutoGrader)
Router.use('/submission-problem-scores', isAuthorized, submissionProblemScore)
Router.use('/file-upload', isAuthorized, fileUpload)
Router.use('/deadline-extensions', isAuthorized, deadlineExtensions)
Router.use('/grade', isAuthorized, grader)

Router.use('/login', login)
Router.use('/logout', logout)

//To access docs, go to localhost:3001/docs in your browser
Router.use('/docs', swaggerUi.serve, swaggerUi.setup(swagger))

Router.use('/status', status)
Router.use('/', (req: Request, res: Response, next: NextFunction) => res.status(404).send(NotFound))

export default Router
