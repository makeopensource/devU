// Libraries
import express from 'express'

// Middleware
import validator from './nonContainerAutoGrader.validator'
import { asInt } from '../middleware/validator/generic.validator'

// Controller
import nonContainerQuestions from './nonContainerAutoGrader.controller'

const Router = express.Router()

/**
 * @swagger
 * /nonContainerAutoGrader:
 *   get:
 *     summary: Retrieve a list of all nonContainerAutoGraders
 */
Router.get('/', nonContainerQuestions.get)

/**
 * @swagger
 * /nonContainerAutoGrader/byAssignmentId/{assignmentId}:
 *   get:
 *     summary: Retrieve a list of all nonContainerAutoGrader with the assignment ID
 */
Router.get('/byAssignmentId/:assignmentId', nonContainerQuestions.getByAssignmentId)

/**
 * @swagger
 * /nonContainerAutoGrader/byId/{id}:
 *   get:
 *     summary: Retrieve a single question
 */
Router.get('/byId/:id', asInt(), nonContainerQuestions.detail)

/**
 * @swagger
 * /nonContainerAutoGrader:
 *   post:
 *     summary: Create a question
 */
Router.post('/', validator, nonContainerQuestions.post)

/**
 * @swagger
 * /nonContainerAutoGrader:
 *   put:
 *     summary: Update a question
 */
Router.put('/:id', asInt(), validator, nonContainerQuestions.put)

/**
 * @swagger
 * /nonContainerAutoGrader/{id}:
 *   delete:
 *     summary: Delete a question
 */
Router.delete('/:id', asInt(), nonContainerQuestions._delete)

export default Router
