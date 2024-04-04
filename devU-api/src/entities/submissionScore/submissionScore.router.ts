// Libraries
import express from 'express'

// Middleware
import validator from './submissionScore.validator'
import { asInt } from '../../middleware/validator/generic.validator'

// Controller
import SubmissionScoreController from './submissionScore.controller'

const Router = express.Router()

/**
 * @swagger
 * /submission-scores:
 *   get:
 *     summary: Retrieve a list of submission score
 *     tags:
 *       - SubmissionScores
 *     responses:
 *       '200':
 *         description: OK
 *     parameters:
 *       - name: submission
 *         in: query
 *         required: false
 *         schema:
 *           type: integer
 */
Router.get('/', SubmissionScoreController.get)

/**
 * @swagger
 * /submission-scores/{id}:
 *   get:
 *     summary: Retrieve a single submission score
 *     tags:
 *       - SubmissionScores
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
Router.get('/:id', asInt(), SubmissionScoreController.detail)

/**
 * @swagger
 * /submission-scores:
 *   post:
 *     summary: Create a submission score
 *     tags:
 *       - SubmissionScores
 *     responses:
 *       '200':
 *         description: OK
 *     requestBody:
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             $ref: '#/components/schemas/SubmissionScore'
 */
Router.post('/', validator, SubmissionScoreController.post)

/**
 * @swagger
 * /submission-scores:
 *   put:
 *     summary: Update a submission score
 *     tags:
 *       - SubmissionScores
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
 *             $ref: '#/components/schemas/SubmissionScore'
 */
Router.put('/:id', asInt(), validator, SubmissionScoreController.put)

/**
 * @swagger
 * /submission-scores/{id}:
 *   delete:
 *     summary: Delete a submission score
 *     tags:
 *       - SubmissionScores
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
Router.delete('/:id', asInt(), SubmissionScoreController._delete)

export default Router
