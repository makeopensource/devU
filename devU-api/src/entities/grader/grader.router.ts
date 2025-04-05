// Libraries
import express from 'express'

// Middleware
//import validator from './grader.validator'
import { asInt } from '../../middleware/validator/generic.validator'
//import { isAuthorized } from '../../authorization/authorization.middleware'

// Controller
import GraderController from './grader.controller'
import { isAuthenticated } from '../../authentication/authentication.middleware'

const Router = express.Router()

/**
 * @swagger
 * tags:
 *    - name: Grader
 *      description:
 * /grade/{id}:
 *   post:
 *     summary: Grade a submission, currently only with non-container autograders
 *     tags:
 *       - Grader
 *     responses:
 *       '200':
 *         description: OK
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 */
Router.post('/:id', asInt(), isAuthenticated, /*isAuthorized('enrolled'),*/ GraderController.grade)

export default Router
