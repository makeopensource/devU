//Libraries
import express from 'express'

//validators
import validator from './courseScore.validator'
import { asInt } from '../middleware/validator/generic.validator'

//Controller
import CourseScoreController from './courseScore.controller'

const Router = express.Router()

/**
 * @swagger
 * /course-score:
 *  get:
 *      summary: Retrieve a list of all course scores
 *      tags:
 *        - CourseScores
 *      responses:
 *        '200':
 *          description: OK
 */
Router.get('/', CourseScoreController.get)


/**
 * @swagger
 * /course-score/{id}:
 *  get:
 *      summary: Retrieve a single course score
 *      tags:
 *        - CourseScores
 *      responses:
 *        '200':
 *          description: OK
 *      parameters:
 *        - name: id
 *          in: path
 *          required: true
 *          schema:
 *            type: integer
 */
Router.get('/:id', asInt(), CourseScoreController.detail)

/**
 * @swagger
 * /course-score:
 *  post:
 *      summary: Create a course score
 *      tags:
 *        - CourseScores
 *      responses:
 *        '200':
 *          description: OK
 *      requestBody:
 *        content:
 *          application/x-www-form-urlencoded:
 *            schema:
 *              $ref: '#/components/schemas/CourseScore'
 */
Router.post('/', validator, CourseScoreController.post)

/**
 * @swagger
 * /course-score/{id}:
 *  put:
 *      summary: Update a course score
 *      tags:
 *        - CourseScores
 *      responses:
 *        '200':
 *          description: OK
 *      parameters:
 *        - name: id
 *          in: path
 *          required: true
 *          schema:
 *            type: integer
 *      requestBody:
 *        content:
 *          application/x-www-form-urlencoded:
 *            schema:
 *              $ref: '#/components/schemas/CourseScore'
 */
Router.put('/:id', validator, asInt(), CourseScoreController.put)

/**
 * @swagger
 * /course-score/{id}:
 *  delete:
 *      summary: Delete a course score
 *      tags:
 *        - CourseScores
 *      responses:
 *        '200':
 *          description: OK
 *      parameters:
 *        - name: id
 *          in: path
 *          required: true
 *          schema:
 *            type: integer
 */
Router.delete('/:id', asInt(), CourseScoreController._delete)

export default Router
