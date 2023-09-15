// Libraries
import express from 'express'

//Middleware
import validator from './assignmentScore.validator'
import { asInt } from '../middleware/validator/generic.validator'

//Controller
import AssignmentScoreController from './assignmentScore.controller'
import Assignment from '../assignment/assignment.model'

const Router = express.Router()

/**
 * @swagger
 * /assignment-score/{assigment-id}:
 *  get:
 *    summary: Retrieve a list of assigmnet scores belonging to an assignment by assignment id
 */
Router.get('/:id', asInt(), AssignmentScoreController.get)

/**
 * @swagger
 * /assigment-score/detail/{id}:
 *  get:
 *    summary: Retrieve a single assignment score's details
 */
Router.get('/detail/:id', asInt(), AssignmentScoreController.detail)

/**
 * @swagger
 * /assignment-score:
 *  post:
 *    summary: Create an assignment score
 */
Router.post('/', validator, AssignmentScoreController.post)

/**
 * @swagger
 * /assignment-score :
 *  put:
 *    summary: Update an assignment score
 */
Router.put('/:id', asInt(), validator, AssignmentScoreController.put)

/**
 * @swagger
 * /assignment-score/{id}:
 *  delete:
 *      summary: Delete an assingment score
 */
Router.delete('/:id', asInt(), AssignmentScoreController._delete)

export default Router