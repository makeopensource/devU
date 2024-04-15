import express from 'express'

import validator from './user.validator'
import { asInt } from '../../middleware/validator/generic.validator'
import {isAuthorized} from "../../authorization/authorization.middleware";

import UserController from './user.controller'

const Router = express.Router()

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Retrieve a list of users
 *     tags:
 *       - Users
 *     responses:
 *       '200':
 *         description: OK
 */
Router.get('/', isAuthorized('admin'), UserController.get)

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Retrieve a single user
 *     tags:
 *       - Users
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
Router.get('/:id', isAuthorized(''), asInt(), UserController.detail)
// self or admin


/**
 * @swagger
 * /users/{userId}/courses:
 *   get:
 *     summary: Retrieve all courses associated with a user
 *     tags:
 *       - Users
 *     responses:
 *       '200':
 *         description: OK
 *     parameters:
 *       - name: course-id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *       - name: level
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 */
Router.get('/course/:id', isAuthorized(''), asInt(), UserController.getCoursesByUser)

/**
 * @swagger
 * /users/course/{course-id}:
 *   get:
 *     summary: Retrieve all users associated with a course
 *     tags:
 *       - Users
 *     responses:
 *       '200':
 *         description: OK
 *     parameters:
 *       - name: course-id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *       - name: level
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 */
Router.get('/course/:id', isAuthorized(''), asInt(), UserController.getByCourse)

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a user
 *     tags:
 *       - Users
 *     responses:
 *       '200':
 *         description: OK
 *     requestBody:
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             $ref: '#/components/schemas/User'
 */
Router.post('/', validator, UserController.post)
// TODO: do we need authorizer for this?

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update a user, all fields required but only preferredName is updated
 *     tags:
 *       - Users
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
 *             $ref: '#/components/schemas/User'
 */
Router.put('/:id', isAuthorized(''), asInt(), validator, UserController.put)
// TODO: self or admin

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete a user
 *     tags:
 *       - Users
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
Router.delete('/:id', isAuthorized('no one. Eventually admin only'), asInt(), UserController._delete)

export default Router
