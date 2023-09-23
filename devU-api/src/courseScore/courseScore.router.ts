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
 */
Router.get('/', CourseScoreController.get)


/**
 * @swagger
 * /course-score/{id}:
 *  get:
 *      summary: Retrieve a single course score
 */
Router.get('/:id', asInt(), CourseScoreController.detail)

/**
 * @swagger
 * /course-score:
 *  post:
 *      summary: Create a course score
 */
Router.post('/', validator, CourseScoreController.post)

/**
 * @swagger
 * /course-score/{id}:
 *  put:
 *      summary: Update a course score
 */
Router.put('/:id', validator, asInt(), CourseScoreController.put)

/**
 * @swagger
 * /course-score/{id}:
 *  delete:
 *      summary: Delete a course score
 */
Router.delete('/:id', asInt(), CourseScoreController._delete)

export default Router
