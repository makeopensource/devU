// Libraries
import express from 'express'

// Middleware
import validator from './deadlineExtensions.validator'
import { asInt } from '../../middleware/validator/generic.validator'

// Controller
import DeadlineExtensionsController from './deadlineExtensions.controller'

const Router = express.Router()

/**
 * @swagger
 * /deadline-extensions:
 *   get:
 *     summary: Retrieve all deadline-extensions
 *     tags:
 *       - DeadlineExtensionsModel
 *     responses:
 *       '200':
 *         description: OK
 */
Router.get('/', DeadlineExtensionsController.get)

/**
 * @swagger
 * /deadline-extensions/{id}:
 *   get:
 *     summary: Retrieve a single Deadline-Extension
 *     tags:
 *       - DeadlineExtensionsModel
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
Router.get('/:id', asInt(), DeadlineExtensionsController.detail)

/**
 * @swagger
 * /deadline-extensions:
 *   post:
 *     summary: Create a Deadline-Extension
 *     tags:
 *       - DeadlineExtensionsModel
 *     responses:
 *       '200':
 *         description: OK
 *     requestBody:
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             $ref: '#/components/schemas/DeadlineExtensionsModel'
 */
Router.post('/', validator, DeadlineExtensionsController.post)

/**
 * @swagger
 * /deadline-extensions/{id}:
 *   put:
 *     summary: Update a Deadline-Extensions
 *     tags:
 *       - DeadlineExtensionsModel
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
 *             $ref: '#/components/schemas/DeadlineExtensionsModel'
 */
Router.put('/:id', asInt(), validator, DeadlineExtensionsController.put)

/**
 * @swagger
 * /deadline-extensions/{id}:
 *   delete:
 *     summary: Delete a Deadline-Extension
 *     tags:
 *       - DeadlineExtensionsModel
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
Router.delete('/:id', asInt(), DeadlineExtensionsController._delete)

export default Router
