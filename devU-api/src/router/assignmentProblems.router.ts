// Libraries
import express from 'express'

// Middleware
import validator from '../middleware/validator/assignmentProblems.validator'
import { asInt } from '../middleware/validator/generic.validator'

// Controller
import AssignmentProblemController from '../controller/assignmentProblems.controller'

const Router = express.Router()

/**
 * @swagger
 * /assignment-problems/{assignment-id}:
 *   get:
 *     summary: Retrieve a list of assignment problems belonging to an assignment by assignment id
 */
Router.get('/:id', asInt(), AssignmentProblemController.get)

/**
 * @swagger
 * /assignment-problems/detail/{id}:
 *   get:
 *     summary: Retrieve a single assignment problem's details
 */
Router.get('/detail/:id', asInt(), AssignmentProblemController.detail)

/**
 * @swagger
 * /assignment-problems:
 *   post:
 *     summary: Create an assignment problem
 */
Router.post('/', validator, AssignmentProblemController.post)

/**
 * @swagger
 * /assignment-problems:
 *   put:
 *     summary: Update an assignment problem
 */
Router.put('/:id', asInt(), validator, AssignmentProblemController.put)

/**
 * @swagger
 * /assignment-problems/{id}:
 *   delete:
 *     summary: Delete an assignment problem
 */
Router.delete('/:id', asInt(), AssignmentProblemController._delete)

export default Router
