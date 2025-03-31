import express from 'express'
import multer from 'multer'

import validator from './containerAutoGrader.validator'
import { asInt } from '../../middleware/validator/generic.validator'
import { isAuthorized } from '../../authorization/authorization.middleware'
import ContainerAutoGraderController from './containerAutoGrader.controller'

const Router = express.Router({ mergeParams: true })
const upload = multer()

/**
 * @swagger
 * /course/:courseId/assignment/:assignmentId/container-auto-graders/{id}:
 *   get:
 *     summary: Retrieve a single container auto grader
 *     tags:
 *       - ContainerAutoGraders
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
Router.get('/:id', isAuthorized('assignmentViewAll'), asInt(), ContainerAutoGraderController.detail)

/**
 * @swagger
 * /course/:courseId/assignment/:assignmentId/container-auto-graders:
 *   get:
 *     summary: Retrieve an assignment's container auto grader
 *     tags:
 *       - ContainerAutoGraders
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
Router.get('/assignment/:id', asInt(), ContainerAutoGraderController.getAllByAssignment)

/**
 * @swagger
 * /container-auto-graders:
 * /course/:courseId/assignment/:assignmentId/container-auto-graders:
 *   post:
 *     summary: Create a new container auto grader
 *     tags:
 *       - ContainerAutoGraders
 *     responses:
 *       '201':
 *         description: Created
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - jobFiles
 *               - assignmentId
 *               - timeoutInSeconds
 *             properties:
 *               dockerfile:
 *                 type: string
 *                 format: binary
 *                 description: The Dockerfile for the auto grader. If not provided, a default multi-language Dockerfile will be used.
 *               jobFiles:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: List of job files for the auto grader
 *               assignmentId:
 *                 type: integer
 *               timeoutInSeconds:
 *                 type: integer
 *                 minimum: 1
 *               memoryLimitMB:
 *                 type: integer
 *                 minimum: 1
 *                 default: 512
 *                 description: Memory limit in megabytes
 *               cpuCores:
 *                 type: integer
 *                 minimum: 1
 *                 default: 1
 *                 description: Number of CPU cores to allocate
 *               pidLimit:
 *                 type: integer
 *                 minimum: 1
 *                 default: 100
 *                 description: Maximum number of processes allowed
 */
Router.post(
  '/',
  isAuthorized('assignmentEditAll'),
  upload.fields([
    { name: 'dockerfile', maxCount: 1 },
    { name: 'jobFiles', maxCount: 10 } // Limit to 10 job files per upload
  ]),
  validator,
  ContainerAutoGraderController.post as express.RequestHandler
)

/**
 * @swagger
 * /course/:courseId/assignment/:assignmentId/container-auto-graders/{id}:
 *   put:
 *     summary: Update a container auto grader
 *     tags:
 *       - ContainerAutoGraders
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
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               dockerfile:
 *                 type: string
 *                 format: binary
 *                 description: The Dockerfile for the auto grader
 *               jobFiles:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: List of job files for the auto grader
 *               assignmentId:
 *                 type: integer
 *               timeoutInSeconds:
 *                 type: integer
 *                 minimum: 1
 *               memoryLimitMB:
 *                 type: integer
 *                 minimum: 1
 *                 default: 512
 *                 description: Memory limit in megabytes
 *               cpuCores:
 *                 type: integer
 *                 minimum: 1
 *                 default: 1
 *                 description: Number of CPU cores to allocate
 *               pidLimit:
 *                 type: integer
 *                 minimum: 1
 *                 default: 100
 *                 description: Maximum number of processes allowed
 */
Router.put(
  '/:id',
  isAuthorized('assignmentEditAll'),
  asInt(),
  upload.fields([
    { name: 'dockerfile', maxCount: 1 },
    { name: 'jobFiles', maxCount: 10 } // Limit to 10 job files per upload
  ]),
  validator,
  ContainerAutoGraderController.put as express.RequestHandler
)

/**
 * @swagger
 * /course/:courseId/assignment/:assignmentId/container-auto-graders/{id}:
 *   delete:
 *     summary: Delete a container auto grader
 *     tags:
 *       - ContainerAutoGraders
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
Router.delete('/:id', isAuthorized('assignmentEditAll'), asInt(), ContainerAutoGraderController._delete)

export default Router
