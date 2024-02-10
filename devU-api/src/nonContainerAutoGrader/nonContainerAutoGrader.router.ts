// Libraries
import express from 'express'

// Middleware
import validator from './nonContainerAutoGrader.validator'
import {asInt} from '../middleware/validator/generic.validator'

// Controller
import nonContainerQuestions from './nonContainerAutoGrader.controller'

const Router = express.Router()

/**
 * @swagger
 * /questions:
 *   get:
 *     summary: Retrieve a list of all questions
 */
Router.get('/', nonContainerQuestions.get)

/**
 * @swagger
 * /questions/{id}:
 *   get:
 *     summary: Retrieve a single question
 */
Router.get('/:id', asInt(), nonContainerQuestions.detail)

/**
 * @swagger
 * /questions:
 *   post:
 *     summary: Create a question
 */
Router.post('/', validator, nonContainerQuestions.post)

/**
 * @swagger
 * /questions:
 *   put:
 *     summary: Update a question
 */
Router.put('/:id', asInt(), validator, nonContainerQuestions.put)

/**
 * @swagger
 * /questions/{id}:
 *   delete:
 *     summary: Delete a question
 */
Router.delete('/:id', asInt(), nonContainerQuestions._delete)

export default Router
