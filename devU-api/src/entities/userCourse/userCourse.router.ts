// Libraries
import express from 'express'

// Middleware
import validator from './userCourse.validator'
import { asInt } from '../../middleware/validator/generic.validator'

// Controller
import UserCourseController from './userCourse.controller'

const Router = express.Router()

/**
 * @swagger
 * /user-courses/user/{user-id}:
 *   get:
 *     summary: Retrieve a list of all of a user's user-course associations.
 *     tags:
 *       - UserCourses
 *     responses:
 *       '200':
 *         description: OK
 *     parameters:
 *       - name: user-id
 *         description: Enter User Id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 */
Router.get('/user/:id', asInt(), UserCourseController.get)

/**
 * @swagger
 * /user-courses/{id}:
 *   get:
 *     summary: Retrieve a single user-course association
 *     tags:
 *       - UserCourses
 *     responses:
 *       '200':
 *         description: OK
 *     parameters:
 *       - name: id
 *         description: Enter User-Course Id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 */
Router.get('/:id', asInt(), UserCourseController.detail)

/**
 * @swagger
 * /user-courses:
 *   post:
 *     summary: Create a new user-course association
 *     tags:
 *       - UserCourses
 *     responses:
 *       '200':
 *         description: OK
 *     requestBody:
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             $ref: '#/components/schemas/UserCourse'
 */
Router.post('/', validator, UserCourseController.post)

/**
 * @swagger
 * /users-courses/{id}:
 *   put:
 *     summary: Update a user-course association
 *     tags:
 *       - UserCourses
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
 *             $ref: '#/components/schemas/UserCourse'
 */
Router.put('/:id', asInt(), validator, UserCourseController.put)

/**
 * @swagger
 * /user-courses/{id}:
 *   delete:
 *     summary: Delete a user-course association
 *     tags:
 *       - UserCourses
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
Router.delete('/:id', asInt(), UserCourseController._delete)

export default Router
