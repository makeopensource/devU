// Libraries
import express from 'express'

// Middleware
//import validator from './grader.validator'
import { asInt } from '../../middleware/validator/generic.validator'

import { isAuthorized } from '../../authorization/authorization.middleware'


// Controller
import GraderController from './grader.controller'

const Router = express.Router({ mergeParams: true })

/**
 * @swagger
 * tags:
 *    - name: Grader
 *      description:
 * /course/:courseId/grade/{id}:
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

/**
 * @swagger
 * tags:
 *    - name: Grader callback
 *      description: 
 * /grade/callback/{outputFilename}:
 *   post:
 *     summary: Not directly called by the user. Tells the API that a container grading job has finished and creates relevant entities from the results.
 *     tags:
 *       - Grader
 *     responses:
 *       '200':
 *         description: OK
 *     parameters:
 *       - name: outputFilename
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 */
Router.post('/callback/:outputFile', GraderController.tangoCallback) //Unauthorized route so tango can make callback without needing token

// TODO: This one might be tricky for authorization. Can every student hit this endpoint for their own submissions? That's probably
//       the easiest way to handle it. If not, how does this endpoint get hit when they make a submission without
//       sacrificing RESTfullness? eg. Sometimes we want to make submissions without running the grader so the front end
//       should have control of this endpoint
//       -or- do we only let students hit this once per submission. Regrades must be by someone with permission. Then
//            add a second endpoint that is /regrade


export default Router
