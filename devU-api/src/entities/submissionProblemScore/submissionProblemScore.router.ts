// Libraries
import express from 'express'

// Middleware
import validator from '../submissionProblemScore/submissionProblemScore.validator'
import { asInt } from '../../middleware/validator/generic.validator'

// Controller
import SubmissionProblemScoreController from '../submissionProblemScore/submissionProblemScore.controller'

const Router = express.Router()

/**
 * @swagger
 * /submission-problem-scores/{submission-id}:
 *   get:
 *    summary: Retrieve a list of submission problem scores belonging to a submission by submission id
 *    tags:
 *      - SubmissionProblemScores
 *    responses:
 *      '200':
 *        description: OK
 *    parameters:
 *      - name: submission-id
 *        description: Enter Submission Id
 *        in: path
 *        required: true
 *        schema:
 *          type: integer
 */
Router.get('/:id', asInt(), SubmissionProblemScoreController.get)

/**
 * @swagger
 * /submission-problem-scores/detail/{id}:
 *   get:
 *     summary: Retrieve a single submission problem score
 *     tags:
 *       - SubmissionProblemScores
 *     responses:
 *       '200':
 *         description: OK
 *     parameters:
 *       - name: id
 *         description: Enter SubmissionProblemScore Id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 */
Router.get('/detail/:id', asInt(), SubmissionProblemScoreController.detail)

/**
 * @swagger
 * /submission-problem-scores:
 *   post:
 *     summary: Create a submission problem score
 *     tags:
 *       - SubmissionProblemScores
 *     responses:
 *       '200':
 *         description: OK
 *     requestBody:
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             $ref: '#/components/schemas/SubmissionProblemScore'
 */
Router.post('/', validator, SubmissionProblemScoreController.post)

/**
 * @swagger
 * /submission-problem-scores:
 *   put:
 *     summary: Update a submission problem score
 *     tags:
 *       - SubmissionProblemScores
 *     responses:
 *       '200':
 *         description: OK
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             $ref: '#/components/schemas/SubmissionProblemScore'
 */
Router.put('/:id', asInt(), validator, SubmissionProblemScoreController.put)

/**
 * @swagger
 * /submission-problem-scores/{id}:
 *   delete:
 *     summary: Delete a submission problem score
 *     tags:
 *       - SubmissionProblemScores
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
Router.delete('/:id', asInt(), SubmissionProblemScoreController._delete)

export default Router
