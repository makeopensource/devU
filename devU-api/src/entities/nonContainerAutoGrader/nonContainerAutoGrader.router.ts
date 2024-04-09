// Libraries
import express from 'express'

// Middleware
import validator from './nonContainerAutoGrader.validator'
import { asInt } from '../../middleware/validator/generic.validator'

// Controller
import nonContainerQuestions from './nonContainerAutoGrader.controller'

const Router = express.Router()

/**
 * @swagger
 * /nonContainerAutoGraders:
 *   get:
 *     summary: Retrieve a list of all nonContainerAutoGraders
 *     tags:
 *       - NonContainerAutoGraders
 *     responses:
 *       '200':
 *         description: OK
 */
Router.get('/', nonContainerQuestions.get)

/**
 * @swagger
 * /nonContainerAutoGraders/byAssignmentId/{assignmentId}:
 *   get:
 *     summary: Retrieve a list of all nonContainerAutoGrader with the assignment ID
 *     tags:
 *       - NonContainerAutoGraders
 *     responses:
 *       '200':
 *         description: OK
 *     parameters:
 *       - name: assignmentId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 */
Router.get('/byAssignmentId/:assignmentId', asInt("assignmentId"), nonContainerQuestions.getByAssignmentId)

/**
 * @swagger
 * /nonContainerAutoGraders/byId/{id}:
 *   get:
 *     summary: Retrieve a single question
 *     tags:
 *       - NonContainerAutoGraders
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
Router.get('/byId/:id', asInt(), nonContainerQuestions.detail)

/**
 * @swagger
 * /nonContainerAutoGraders:
 *   post:
 *     summary: Create a question
 *     tags:
 *       - NonContainerAutoGraders
 *     responses:
 *       '200':
 *         description: OK
 *     requestBody:
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             $ref: '#/components/schemas/NonContainerAutoGrader'
 */
Router.post('/', validator, nonContainerQuestions.post)

/**
 * @swagger
 * /nonContainerAutoGraders:
 *   put:
 *     summary: Update a question
 *     tags:
 *       - NonContainerAutoGraders
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
 *             $ref: '#/components/schemas/NonContainerAutoGrader'
 */
Router.put('/:id', asInt(), validator, nonContainerQuestions.put)

/**
 * @swagger
 * /nonContainerAutoGraders/{id}:
 *   delete:
 *     summary: Delete a question
 *     tags:
 *       - NonContainerAutoGraders
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
Router.delete('/:id', asInt(), nonContainerQuestions._delete)

export default Router
