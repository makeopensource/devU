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
 * /assignment-scores/{assignment-id}:
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
 * /assignment-scores/{assignment-id}/{user-id}:
 *  get:
 *    summary: Retrieve a list of assignment scores belonging to a specific assignment and user
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
 *      - name: user-id
 *        description: Enter User Id
 *        in: path
 *        required: true
 *        schema:
 *          type: integer
 */
Router.get('/:id/:userId', asInt(), asInt('userId'), AssignmentScoreController.getByUser)

/**
 * @swagger
 * /assignment-scores/detail/{id}:
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
 * /assignment-scores:
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
 * /assignment-scores/{id}:
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
 * /assignment-scores/{id}:
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