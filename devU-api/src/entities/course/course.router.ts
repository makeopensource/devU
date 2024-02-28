// Libraries
import express from 'express'

// Middleware
import validator from './course.validator'
import { asInt } from '../../middleware/validator/generic.validator'

// Controller
import CourseController from './course.controller'

const Router = express.Router()

/**
 * @swagger
 * /courses:
 *   get:
 *     summary: Retrieve a list of courses
 *     tags:
 *       - Courses
 *     responses:
 *       '200':
 *         description: OK
 */
Router.get('/', CourseController.get)

/**
 * @swagger
 * /courses/{id}:
 *   get:
 *     summary: Retrieve a single course
 *     tags:
 *       - Courses
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
Router.get('/:id', asInt(), CourseController.detail)

/**
 * @swagger
 * /courses:
 *   post:
 *     summary: Create a course
 *     tags:
 *       - Courses
 *     responses:
 *       '200':
 *         description: OK
 *     requestBody:
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             $ref: '#/components/schemas/Course'
 */
Router.post('/', validator, CourseController.post)

/**
 * @swagger
 * /courses/{id}:
 *   put:
 *     summary: Update a course
 *     tags:
 *       - Courses
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
 *             $ref: '#/components/schemas/Course'
 */
Router.put('/:id', asInt(), validator, CourseController.put)

/**
 * @swagger
 * /courses/{id}:
 *   delete:
 *     summary: Delete a course
 *     tags:
 *       - Courses
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
Router.delete('/:id', asInt(), CourseController._delete)

export default Router
