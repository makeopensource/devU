// Libraries
import express from 'express'

// Middleware
import validator from './assignment.validator'
import { asInt } from '../../middleware/validator/generic.validator'

// Controller
import AssignmentsController from './assignment.controller'
import { isAuthorized, isAuthorizedByAssignmentStatus } from '../../authorization/authorization.middleware'

const Router = express.Router({ mergeParams: true })

/**
 * @swagger
 * /course/:courseId/assignments/released:
 *   get:
 *     summary: Retrieve a list of a course's assignments that have been released (Start date prior to current time)
 *     tags:
 *       - Assignments
 *     responses:
 *       '200':
 *         description: OK
 *     parameters:
 *       - name: courseId
 *         in: path
 *         description: Enter course id
 *         required: true
 *         schema:
 *           type: integer
 */
Router.get('/released', isAuthorized('assignmentViewReleased'), AssignmentsController.getReleased)

/**
 * @swagger
 * /course/:courseId/assignments:
 *   get:
 *     summary: Retrieve a list of a course's assignments
 *     tags:
 *       - Assignments
 *     responses:
 *       '200':
 *         description: OK
 *     parameters:
 *       - name: courseId
 *         in: path
 *         description: Enter course id
 *         required: true
 *         schema:
 *           type: integer
 */
Router.get('/', isAuthorized('assignmentViewAll'), AssignmentsController.getByCourse)

/**
 * @swagger
 * /course/:courseId/assignments/{id}:
 *   get:
 *     summary: Retrieve a single assignment
 *     tags:
 *       - Assignments
 *     responses:
 *       '200':
 *         description: OK
 *     parameters:
 *       - name: courseId
 *         in: path
 *         description: Enter course id
 *         required: true
 *         schema:
 *           type: integer
 *       - name: id
 *         in: path
 *         description: Enter assignment id
 *         required: true
 *         schema:
 *           type: integer
 */
Router.get('/:id', asInt(), isAuthorizedByAssignmentStatus, AssignmentsController.detail)

/**
 * @swagger
 * /course/:courseId/assignments:
 *   post:
 *     summary: Create an assignment
 *     tags:
 *       - Assignments
 *     responses:
 *       '200':
 *         description: OK
 *     parameters:
 *       - name: courseId
 *         in: path
 *         description: Enter course id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             $ref: '#/components/schemas/Assignment'
 */
Router.post('/', isAuthorized('assignmentEditAll'), validator, AssignmentsController.post)

/**
 * @swagger
 * /course/:courseId/assignments/{id}:
 *   put:
 *     summary: Update an assignment
 *     tags:
 *       - Assignments
 *     responses:
 *       '200':
 *         description: OK
 *     parameters:
 *       - name: courseId
 *         in: path
 *         description: Enter course id
 *         required: true
 *         schema:
 *           type: integer
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             $ref: '#/components/schemas/Assignment'
 */
Router.put('/:id', isAuthorized('assignmentEditAll'), asInt(), validator, AssignmentsController.put)

/**
 * @swagger
 * /course/:courseId/assignments/{id}:
 *   delete:
 *     summary: Delete an assignment
 *     tags:
 *       - Assignments
 *     responses:
 *       '200':
 *         description: OK
 *     parameters:
 *       - name: courseId
 *         in: path
 *         description: Enter course id
 *         required: true
 *         schema:
 *           type: integer
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 */
Router.delete('/:id', isAuthorized('assignmentEditAll'), asInt(), AssignmentsController._delete)

export default Router
