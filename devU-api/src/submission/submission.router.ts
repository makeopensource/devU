// Libraries
import express from 'express'

// Middleware
import validator from '../middleware/validator/submission.validator'
import { asInt } from '../middleware/validator/generic.validator'

// Controller
import SubmissionController from '../controller/submission.controller'

const Router = express.Router()

/**
 * @swagger
 * /submissions:
 *   get:
 *     summary: Retrieve a list of submissions
 */
Router.get('/', SubmissionController.get)

/**
 * @swagger
 * /submissions/{id}:
 *   get:
 *     summary: Retrieve a single submission
 */
Router.get('/:id', asInt(), SubmissionController.detail)

/**
 * @swagger
 * /submissions:
 *   post:
 *     summary: Create a submission
 */
Router.post('/', validator, SubmissionController.post)

/**
 * @swagger
 * /submissions/{id}:
 *   delete:
 *     summary: Delete a submission
 */
Router.delete('/:id', asInt(), SubmissionController._delete)

export default Router
