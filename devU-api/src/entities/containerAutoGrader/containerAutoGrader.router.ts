import express from 'express'
import multer from 'multer'

import validator from './containerAutoGrader.validator'
import { asInt } from '../../middleware/validator/generic.validator'
import { isAuthorized } from '../../authorization/authorization.middleware'
import ContainerAutoGraderController from './containerAutoGrader.controller'

const Router = express.Router({ mergeParams: true })
const upload = multer()

/**
 * @openapi
 * /course/:courseId/assignment/:assignmentId/container-auto-graders:
 *   get:
 *     summary: Retrieve all container auto graders for an assignment
 *     tags:
 *       - Container Auto Graders
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ContainerAutoGrader'
 */
Router.get('/', isAuthorized('assignmentViewAll'), ContainerAutoGraderController.getAllByAssignment)

/**
 * @openapi
 * /course/:courseId/assignment/:assignmentId/container-auto-graders/{id}:
 *   get:
 *     summary: Retrieve a specific container auto grader by ID
 *     tags:
 *       - Container Auto Graders
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ContainerAutoGrader'
 */
Router.get('/:id', isAuthorized('assignmentViewAll'), asInt(), ContainerAutoGraderController.detail)

/**
 * @openapi
 * /course/:courseId/assignment/:assignmentId/container-auto-graders:
 *   post:
 *     summary: Create a new container auto grader
 *     tags:
 *       - Container Auto Graders
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - jobFiles
 *               - timeoutInSeconds
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
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ContainerAutoGrader'
 */
Router.post(
  '/',
  isAuthorized('assignmentEditAll'),
  upload.fields([
    { name: 'dockerfile', maxCount: 1 },
    { name: 'jobFiles', maxCount: 10 }
  ]),
  validator,
  ContainerAutoGraderController.post as express.RequestHandler
)

/**
 * @openapi
 * /course/:courseId/assignment/:assignmentId/container-auto-graders/{id}:
 *   put:
 *     summary: Update an existing container auto grader
 *     tags:
 *       - Container Auto Graders
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
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
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ContainerAutoGrader'
 */
Router.put(
  '/:id',
  isAuthorized('assignmentEditAll'),
  asInt(),
  upload.fields([
    { name: 'dockerfile', maxCount: 1 },
    { name: 'jobFiles', maxCount: 10 }
  ]),
  validator,
  ContainerAutoGraderController.put as express.RequestHandler
)

/**
 * @openapi
 * /course/:courseId/assignment/:assignmentId/container-auto-graders/{id}:
 *   delete:
 *     summary: Delete a container auto grader
 *     tags:
 *       - Container Auto Graders
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: OK
 */
Router.delete('/:id', isAuthorized('assignmentEditAll'), asInt(), ContainerAutoGraderController._delete)

export default Router
