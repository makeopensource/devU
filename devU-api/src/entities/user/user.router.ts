import express from 'express'

import validator from './user.validator'
import { asInt } from '../../../middleware/validator/generic.validator'

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
Router.get('/', UserController.get)

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
Router.get('/:id', asInt(), UserController.detail)

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

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update a user
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
Router.put('/:id', asInt(), validator, UserController.put)

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
Router.delete('/:id', asInt(), UserController._delete)

export default Router
