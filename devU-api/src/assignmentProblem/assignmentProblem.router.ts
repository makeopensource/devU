// Libraries
import express from 'express'

// Middleware
import validator from './assignmentProblem.validator'
import { asInt } from '../middleware/validator/generic.validator'

// Controller
import AssignmentProblemController from './assignmentProblem.controller'

const Router = express.Router()

/**
 * @swagger
 * /assignment-problems/{assignment-id}:
 *   get:
 *     summary: Retrieve a list of assignment problems belonging to an assignment by assignment id
 *     tags:
 *       - AssignmentProblems
 *     responses:
 *       '200':
 *         description: OK
 *     parameters:
 *       - name: assignment-id
 *         description: Enter Assignment Id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer   
 */
Router.get('/:id', asInt(), AssignmentProblemController.get)

/**
 * @swagger
 * /assignment-problems/detail/{id}:
 *   get:
 *     summary: Retrieve a single assignment problem's details
 *     tags:
 *       - AssignmentProblems
 *     responses:
 *       '200':
 *         description: OK
 *     parameters:
 *       - name: id
 *         description: Enter AssignmentProblem Id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer 
 */
Router.get('/detail/:id', asInt(), AssignmentProblemController.detail)

/**
 * @swagger
 * /assignment-problems:
 *   post:
 *     summary: Create an assignment problem
 *     tags:
 *       - AssignmentProblems
 *     responses:
 *       '200':
 *         description: OK
 *     requestBody:
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             $ref: '#/components/schemas/AssignmentProblem'
 */
Router.post('/', validator, AssignmentProblemController.post)

/**
 * @swagger
 * /assignment-problems:
 *   put:
 *     summary: Update an assignment problem
 *     tags:
 *       - AssignmentProblems
 *     responses:
 *       '200':
 *         description: OK
 *     requestBody:
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             $ref: '#/components/schemas/AssignmentProblem'
 */
Router.put('/:id', asInt(), validator, AssignmentProblemController.put)

/**
 * @swagger
 * /assignment-problems/{id}:
 *   delete:
 *     summary: Delete an assignment problem
 *     tags:
 *       - AssignmentProblems
 *     responses:
 *       '200':
 *         description: OK
 *     requestBody:
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             $ref: '#/components/schemas/AssignmentProblem'
 */
Router.delete('/:id', asInt(), AssignmentProblemController._delete)

export default Router
