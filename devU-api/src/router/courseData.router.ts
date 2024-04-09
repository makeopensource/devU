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
import grader from '../entities/grader/grader.router'
import categories from '../entities/category/category.router'
import assignmentScore from '../entities/assignmentScore/assignmentScore.router'


import nonContainerAutoGraderRouter from "../entities/nonContainerAutoGrader/nonContainerAutoGrader.router";

import {isAuthorized} from "../authorization/authorization.middleware";
import {asInt} from "../middleware/validator/generic.validator";

const Router = express.Router()

Router.use('/file-upload', isAuthorized, fileUpload)

Router.use('/user-courses', isAuthorized, userCourse)
Router.use('/categories', isAuthorized, categories)

Router.use('/assignments', assignments)
Router.use('/assignment-scores', isAuthorized, assignmentScore)
Router.use('/assignment/:assignmentId/assignment-problems', asInt('assignmentId'), assignmentProblem)
// Router.use('/submissions', isAuthorized, submissions)
Router.use('/assignment/:assignmentId/submissions/', isAuthorized, submissions)
Router.use('/assignment/:assignmentId/submission-scores', isAuthorized, submissionScore)
Router.use('/assignment/:assignmentId/nonContainerAutoGraders', isAuthorized, nonContainerAutoGraderRouter, isAuthorized)
Router.use('/assignment/:assignmentId/container-auto-graders', isAuthorized, containerAutoGrader)
Router.use('/assignment/:assignmentId/submission-problem-scores', isAuthorized, submissionProblemScore)
Router.use('/assignment/:assignmentId/deadline-extensions', isAuthorized, deadlineExtensions)

Router.use('/grade', isAuthorized, grader)

export default Router
