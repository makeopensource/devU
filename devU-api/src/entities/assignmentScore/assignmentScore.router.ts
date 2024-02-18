// Libraries
import express from 'express'

//Middleware
import validator from './assignmentScore.validator'
import { asInt } from '../../middleware/validator/generic.validator'

//Controller
import AssignmentScoreController from './assignmentScore.controller'

const Router = express.Router()

/**
 * @swagger
 * /assignment-score/{assigment-id}:
 *  get:
 *    summary: Retrieve a list of assignment scores belonging to an assignment by assignment id
 *    tags:
 *      - AssignmentScore
 *    responses:
 *      '200':
 *        description: OK
 *    parameters:
 *      - name: assignment-id
 *        description: Enter Assignment Id
 *        in: path
 *        required: true
 *        schema:
 *          type: integer
 */
Router.get('/:id', asInt(), AssignmentScoreController.get)

/**
 * @swagger
 * /assigment-score/detail/{id}:
 *  get:
 *    summary: Retrieve a single assignment score's details
 *    tags:
 *      - AssignmentScore
 *    responses:
 *      '200':
 *        description: OK
 *    parameters:
 *      - name: id
 *        description: Enter AssignmentScore Id
 *        in: path
 *        required: true
 *        schema:
 *          type: integer
 *    requestBody:
 *      content:
 *        application/x-www-form-urlencoded:
 *          schema:
 *            $ref: '#/components/schemas/AssignmentScore'
 */
Router.get('/detail/:id', asInt(), AssignmentScoreController.detail)

/**
 * @swagger
 * /assignment-score:
 *  post:
 *    summary: Create an assignment score
 *    tags:
 *      - AssignmentScore
 *    responses:
 *      '200':
 *        description: OK
 *    requestBody:
 *      content:
 *        application/x-www-form-urlencoded:
 *          schema:
 *            $ref: '#/components/schemas/AssignmentScore'
 */
Router.post('/', validator, AssignmentScoreController.post)

/**
 * @swagger
 * /assignment-score/{id}:
 *  put:
 *    summary: Update an assignment score
 *    tags:
 *      - AssignmentScore
 *    responses:
 *      '200':
 *        description: OK
 *    parameters:
 *      - name: id
 *        in: path
 *        required: true
 *        schema:
 *          type: integer
 *    requestBody:
 *      content:
 *        application/x-www-form-urlencoded:
 *          schema:
 *            $ref: '#/components/schemas/AssignmentScore'
 */
Router.put('/:id', asInt(), validator, AssignmentScoreController.put)

/**
 * @swagger
 * /assignment-score/{id}:
 *  delete:
 *    summary: Delete an assignment score
 *    tags:
 *      - AssignmentScore
 *    responses:
 *      '200':
 *        description: OK
 *    parameters:
 *      - name: id
 *        in: path
 *        required: true
 *        schema:
 *          type: integer
 */
Router.delete('/:id', asInt(), AssignmentScoreController._delete)

export default Router