// Libraries
import express from 'express'
import Multer from 'multer'

// Middleware
import validator from '../submission/submission.validator'
import { asInt } from '../../middleware/validator/generic.validator'

// Controller
import SubmissionController from '../submission/submission.controller'

const Router = express.Router()
const upload = Multer()

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
 *     parameters:
 *       - name: user
 *         in: query
 *         required: false
 *         schema:
 *           type: integer
 *       - name: assignment
 *         in: query
 *         required: false
 *         schema:
 *           type: integer
 * 
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
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/Submission'
 */
Router.post('/',upload.single("files"), validator, SubmissionController.post)

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
