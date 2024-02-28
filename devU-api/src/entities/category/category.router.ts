import express from 'express'

import validator from './category.validator'
import { asInt } from '../../middleware/validator/generic.validator'

import CategoryController from './category.controller'

const Router = express.Router()

/**
 * @swagger
 * /categories:
 *    get:
 *      summary: Retrieve a list of categories
 *      tags:
 *        - Categories
 *      responses:
 *        '200':
 *          description: OK
 */
Router.get('/', CategoryController.get)

/**
 * @swagger
 * /categories/{id}:
 *    get:
 *      summary: Retrieve a single category
 *      tags:
 *        - Categories
 *      responses:
 *        '200':
 *          description: OK
 *      parameters:
 *        - name: id
 *          in: path
 *          required: true
 *          schema:
 *           type: integer
 */
Router.get('/:id', asInt(), CategoryController.detail)

/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Create a category
 *     tags:
 *       - Categories
 *     responses:
 *       '200':
 *         description: OK
 *     requestBody:
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             $ref: '#/components/schemas/Category'
 */ 
Router.post('/', validator, CategoryController.post)

/**
 * @swagger
 * /categories:
 *   put:
 *     summary: Update a category
 *     tags:
 *       - Categories
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
 *             $ref: '#/components/schemas/Category'
 */
Router.put('/:id', asInt(), validator, CategoryController.put)

/**
 * @swagger
 * /categories/{id}:
 *   delete:
 *     summary: Delete a category
 *     tags:
 *       - Categories
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
Router.delete('/:id', asInt(), CategoryController._delete)

export default Router