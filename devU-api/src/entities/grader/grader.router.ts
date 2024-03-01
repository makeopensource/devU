// Libraries
import express from 'express'

// Middleware
//import validator from './grader.validator'
import { asInt } from '../../middleware/validator/generic.validator'

// Controller
import GraderController from './grader.controller'

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
Router.post('/:id', asInt(), GraderController.grade)

export default Router