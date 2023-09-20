import express from 'express'

import validator from './category.validator'
import { asInt } from '../middleware/validator/generic.validator'

import CategoryController from './category.controller'

const Router = express.Router()

/**
 * @swagger
 * /categories:
 *    get:
 *      summary: Retrieve a list of courses
 */
Router.get('/', CategoryController.get)

/**
 * @swagger
 * /categories/{id}:
 *    get:
 *     summary: Retrieve a single category
 */
Router.get('/:id', asInt(), CategoryController.detail)

/**
 * @swagger
 * /courses:
 *   post:
 *     summary: Create a category
 */
Router.post('/', validator, CategoryController.post)

/**
 * @swagger
 * /courses:
 *   put:
 *     summary: Update a category
 */
Router.put('/:id', asInt(), validator, CategoryController.put)

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete a user
 */
Router.delete('/:id', asInt(), CategoryController._delete)

export default Router