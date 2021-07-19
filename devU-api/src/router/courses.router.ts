// Libraries
import express from 'express'

// Middleware
import validator from '../middleware/validator/courses.validator'
import { asInt } from '../middleware/validator/generic.validator'

// Controller
import CourseController from '../controller/courses.controller'

const Router = express.Router()

/**
 * @swagger
 * /courses:
 *   get:
 *     summary: Retrieve a list of courses
 */
Router.get('/', CourseController.get)

/**
 * @swagger
 * /courses/{id}:
 *   get:
 *     summary: Retrieve a single course
 */
Router.get('/:id', asInt(), CourseController.detail)

/**
 * @swagger
 * /courses:
 *   post:
 *     summary: Create a course
 */
Router.post('/', validator, CourseController.post)

/**
 * @swagger
 * /courses:
 *   put:
 *     summary: Update a course
 */
Router.put('/:id', asInt(), validator, CourseController.put)

/**
 * @swagger
 * /courses/{id}:
 *   delete:
 *     summary: Delete a course
 */
Router.delete('/:id', asInt(), CourseController._delete)

export default Router
