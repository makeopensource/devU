import express from 'express'
import multer from 'multer'

import validator from '../middleware/validator/codeAssignments.validator'
import { asInt } from '../middleware/validator/generic.validator'

import CodeAssignmentController from '../controller/codeAssignments.controller'

const Router = express.Router()
const upload = multer()

/**
 * @swagger
 * /code-assignments:
 *   get:
 *     summary: Retrieve a list of all code assignments
 */
Router.get('/', CodeAssignmentController.get)

/**
 * @swagger
 * /code-assignments/{id}:
 *   get:
 *     summary: Retrieve a single code assignment
 */
Router.get('/:id', asInt(), CodeAssignmentController.detail)

/**
 * @swagger
 * /code-assignments:
 *   post:
 *     summary: Create a new code assignment
 */
Router.post('/', upload.single('graderFile'), validator, CodeAssignmentController.post)

/**
 * @swagger
 * /code-assignments/{id}:
 *   put:
 *     summary: Update a code assignment
 */
Router.put('/:id', asInt(), upload.single('graderFile'), validator, CodeAssignmentController.put)

/**
 * @swagger
 * /code-assignments/{id}:
 *   delete:
 *     summary: Delete a code assignment
 */
Router.delete('/:id', asInt(), CodeAssignmentController._delete)

export default Router
