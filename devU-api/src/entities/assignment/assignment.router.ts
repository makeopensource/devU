// Libraries
import express from 'express'

// Middleware
import validator from './assignment.validator'
import {asInt} from '../../middleware/validator/generic.validator'

// Controller
import AssignmentsController from './assignment.controller'
import {isAuthorized} from "../../authorization/authorization.middleware";

const Router = express.Router()

/**
 * @swagger
 * /assignments:
 *   get:
 *     summary: Retrieve a list of assignments
 *     tags:
 *       - Assignments
 *     responses:
 *       '200':
 *         description: OK
 */
Router.get('/', isAuthorized, AssignmentsController.get)

// TODO: What endpoints to have?
Router.get('/released', isAuthorized, AssignmentsController.get)
Router.get('/unreleased', isAuthorized, AssignmentsController.get)

/**
 * @swagger
 * /assignments/{id}:
 *   get:
 *     summary: Retrieve a single assignment
 *     tags:
 *       - Assignments
 *     responses:
 *       '200':
 *         description: OK
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Enter assignment id
 *         required: true
 *         schema:
 *           type: integer
 */
Router.get('/:id', isAuthorized, asInt(), AssignmentsController.detail)


/**
 * @swagger
 * /assignments/course/{courseId}:
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
Router.get('/course/:courseId', isAuthorized, asInt('courseId'), AssignmentsController.getByCourse)

/**
 * @swagger
 * /assignments:
 *   post:
 *     summary: Create an assignment
 *     tags:
 *       - Assignments
 *     responses:
 *       '200':
 *         description: OK
 *     requestBody:
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             $ref: '#/components/schemas/Assignment'
 */
Router.post('/', isAuthorized, validator, AssignmentsController.post)

/**
 * @swagger
 * /assignments/{id}:
 *   put:
 *     summary: Update an assignment
 *     tags:
 *       - Assignments
 *     responses:
 *       '200':
 *         description: OK
 *     parameters:
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
Router.put('/:id', isAuthorized, asInt(), validator, AssignmentsController.put)

/**
 * @swagger
 * /assignments/{id}:
 *   delete:
 *     summary: Delete an assignment
 *     tags:
 *       - Assignments
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
Router.delete('/:id', isAuthorized, asInt(), AssignmentsController._delete)

export default Router
