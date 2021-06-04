// Libraries
import express from 'express'

// Middleware
import validator from '../middleware/validator/users.validator'
import serializer from '../middleware/serializer/users.serizalizer'
import { idAsInt } from '../middleware/validator/generic.validator'

// Controller
import UserController from '../controller/users.controller'

const Router = express.Router()

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Retrieve a list of users
 */
Router.get('/', UserController.get, serializer)

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Retrieve a single user
 */
Router.get('/:id', idAsInt, UserController.detail, serializer)

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a user
 */
Router.post('/', validator, UserController.post, serializer)

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
