import express from 'express'
import multer from 'multer'

import validator from './codeAssignment.validator'
import { asInt } from '../middleware/validator/generic.validator'

import CodeAssignmentController from './codeAssignment.controller'

const Router = express.Router()
const upload = multer()

/**
 * @swagger
 * /code-assignments:
 *   get:
 *     summary: Retrieve a list of all code assignments
 *     tags:
 *       - CodeAssignments
 *     responses:
 *       '200':
 *         description: OK
 */
Router.get('/', CodeAssignmentController.get)

/**
 * @swagger
 * /code-assignments/{id}:
 *   get:
 *     summary: Retrieve a single code assignment
 *     tags:
 *       - CodeAssignments
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
Router.get('/:id', asInt(), CodeAssignmentController.detail)

/**
 * @swagger
 * /code-assignments:
 *   post:
 *     summary: Create a new code assignment
 *     tags:
 *       - CodeAssignments
 *     responses:
 *       '200':
 *         description: OK
 *     requestBody:
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             $ref: '#/components/schemas/CodeAssignment'
 */
Router.post('/', upload.single('graderFile'), validator, CodeAssignmentController.post)

/**
 * @swagger
 * /code-assignments/{id}:
 *   put:
 *     summary: Update a code assignment
 *     tags:
 *       - CodeAssignments
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
 *             $ref: '#/components/schemas/CodeAssignment'
 */
Router.put('/:id', asInt(), upload.single('graderFile'), validator, CodeAssignmentController.put)

/**
 * @swagger
 * /code-assignments/{id}:
 *   delete:
 *     summary: Delete a code assignment
 *     tags:
 *       - CodeAssignments
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
Router.delete('/:id', asInt(), CodeAssignmentController._delete)

export default Router
