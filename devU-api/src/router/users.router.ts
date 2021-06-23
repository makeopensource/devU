import express from 'express'

import validator from '../middleware/validator/users.validator'
import { idAsInt } from '../middleware/validator/generic.validator'

import UserController from '../controller/users.controller'

const Router = express.Router()

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Retrieve a list of users
 */
Router.get('/', UserController.get)

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Retrieve a single user
 */
Router.get('/:id', idAsInt, UserController.detail)

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a user
 */
Router.post('/', validator, UserController.post)

/**
 * @swagger
 * /users:
 *   put:
 *     summary: Update a user
 */
Router.put('/:id', idAsInt, validator, UserController.put)

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete a user
 */
Router.delete('/:id', idAsInt, UserController._delete)

export default Router
