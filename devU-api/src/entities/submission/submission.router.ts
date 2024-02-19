// Libraries
import express from 'express'

// Middleware
import validator from '../submission/submission.validator'
import { asInt } from '../../middleware/validator/generic.validator'

// Controller
import SubmissionController from '../submission/submission.controller'

const Router = express.Router()

/**
 * @swagger
 * /submissions:
 *   get:
 *     summary: Retrieve a list of submissions
 *     tags:
 *       - Submissions
 *     responses:
 *       '200':
 *         description: OK
 */
Router.get('/', SubmissionController.get)

/**
 * @swagger
 * /submissions/{id}:
 *   get:
 *     summary: Retrieve a single submission
 *     tags:
 *       - Submissions
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
Router.get('/:id', asInt(), SubmissionController.detail)

/**
 * @swagger
 * /submissions:
 *   post:
 *     summary: Create a submission
 *     tags:
 *       - Submissions
 *     responses:
 *       '200':
 *         description: OK
 *     requestBody:
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             $ref: '#/components/schemas/Submission'
 */
Router.post('/', validator, SubmissionController.post)

/**
 * @swagger
 * /submissions/{id}:
 *   delete:
 *     summary: Delete a submission
 *     tags:
 *       - Submissions
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
Router.delete('/:id', asInt(), SubmissionController._delete)

export default Router
