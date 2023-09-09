// Libraries
import express from 'express'

// Middleware
import validator from '../middleware/validator/assignment.validator'
import { asInt } from '../middleware/validator/generic.validator'

// Controller
import AssignmentsController from '../controller/assignment.controller'

const Router = express.Router()

/**
 * @swagger
 * /assignments:
 *   get:
 *     summary: Retrieve a list of assignments
 */
Router.get('/', AssignmentsController.get)

/**
 * @swagger
 * /assignments/{id}:
 *   get:
 *     summary: Retrieve a single assignment
 */
Router.get('/:id', asInt(), AssignmentsController.detail)

/**
 * @swagger
 * /assignments:
 *   post:
 *     summary: Create an assignment
 */
Router.post('/', validator, AssignmentsController.post)

/**
 * @swagger
 * /assignments:
 *   put:
 *     summary: Update an assignment
 */
Router.put('/:id', asInt(), validator, AssignmentsController.put)

/**
 * @swagger
 * /assignments/{id}:
 *   delete:
 *     summary: Delete an assignment
 */
Router.delete('/:id', asInt(), AssignmentsController._delete)

export default Router
