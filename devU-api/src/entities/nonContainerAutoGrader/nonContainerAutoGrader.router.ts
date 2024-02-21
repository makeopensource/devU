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
 * /nonContainerAutoGrader:
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
 * /nonContainerAutoGrader/byAssignmentId/{assignmentId}:
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
 * /nonContainerAutoGrader/byId/{id}:
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
 * /nonContainerAutoGrader:
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
 * /nonContainerAutoGrader:
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
 * /nonContainerAutoGrader/{id}:
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
