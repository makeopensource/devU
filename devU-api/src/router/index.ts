import express, { Request, Response, NextFunction } from 'express'
import swaggerUi from 'swagger-ui-express'

import swagger from '../utils/swagger.utils'

import userCourse from '../entities/userCourse/userCourse.router'
import assignments from '../entities/assignment/assignment.router'
import courses from '../entities/course/course.router'
import login from '../authentication/login/login.router'
import logout from '../authentication/logout/logout.router'
import status from '../status/status.router'
import submissions from '../entities/submission/submission.router'
import users from '../entities/user/user.router'
import submissionScore from '../entities/submissionScore/submissionScore.router'
import containerAutoGrader from '../entities/containerAutoGrader/containerAutoGrader.router'
import assignmentProblem from '../entities/assignmentProblem/assignmentProblem.router'
import submissionProblemScore from '../entities/submissionProblemScore/submissionProblemScore.router'
import deadlineExtensions from "../entities/deadlineExtensions/deadlineExtensions.router";
import fileUpload from '../fileUpload/fileUpload.router'
import category from '../entities/category/category.router'
import grader from '../entities/grader/grader.router'
import categories from '../entities/category/category.router'
import assignmentScore from '../entities/assignmentScore/assignmentScore.router'

import { isAuthenticated } from '../authentication/auth.middleware'

import { NotFound } from '../utils/apiResponse.utils'
import nonContainerAutoGraderRouter from "../entities/nonContainerAutoGrader/nonContainerAutoGrader.router";

const Router = express.Router()

Router.use('/assignments', isAuthenticated, assignments)
Router.use('/assignment-problems', isAuthenticated, assignmentProblem)
Router.use('/users', isAuthenticated, users)
Router.use('/courses', isAuthenticated, courses)
Router.use('/categories', isAuthenticated, category)
Router.use('/user-courses', isAuthenticated, userCourse)
Router.use('/submissions', isAuthenticated, submissions)
Router.use('/submission-scores', isAuthenticated, submissionScore)
Router.use('/nonContainerAutoGrader', isAuthenticated, nonContainerAutoGraderRouter)
Router.use('/container-auto-graders', isAuthenticated, containerAutoGrader)
Router.use('/submission-problem-scores', isAuthenticated, submissionProblemScore)
Router.use('/file-upload', isAuthenticated, fileUpload)
Router.use('/deadline-extensions', isAuthenticated, deadlineExtensions)
Router.use('/grade', isAuthenticated, grader)
Router.use('/categories', isAuthenticated, categories)
Router.use('/assignment-scores', isAuthenticated, assignmentScore)

Router.use('/login', login)
Router.use('/logout', logout)

//To access docs, go to localhost:3001/docs in your browser
Router.use('/docs', swaggerUi.serve, swaggerUi.setup(swagger))

Router.use('/status', status)
Router.use('/', (req: Request, res: Response, next: NextFunction) => res.status(404).send(NotFound))

export default Router
