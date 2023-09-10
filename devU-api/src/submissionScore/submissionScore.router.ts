// Libraries
import express from 'express'

// Middleware
import validator from './submissionScore.validator'
import { asInt } from '../middleware/validator/generic.validator'

// Controller
import SubmissionScoreController from './submissionScore.controller'

const Router = express.Router()

/**
 * @swagger
 * /submission-score:
 *   get:
 *     summary: Retrieve a list of submission score
 */
Router.get('/', SubmissionScoreController.get)

/**
 * @swagger
 * /submission-score/{id}:
 *   get:
 *     summary: Retrieve a single submission score
 */
Router.get('/:id', asInt(), SubmissionScoreController.detail)

/**
 * @swagger
 * /submission-score:
 *   post:
 *     summary: Create a submission score
 */
Router.post('/', validator, SubmissionScoreController.post)

/**
 * @swagger
 * /submission-score:
 *   put:
 *     summary: Update a submission score
 */
Router.put('/:id', asInt(), validator, SubmissionScoreController.put)

/**
 * @swagger
 * /submission-score/{id}:
 *   delete:
 *     summary: Delete a submission score
 */
Router.delete('/:id', asInt(), SubmissionScoreController._delete)

export default Router
