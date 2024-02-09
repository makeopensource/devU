import express from 'express';
import multer from 'multer';

import validator from './containerAutoGrader.validator';
import { asInt } from '../middleware/validator/generic.validator';

import ContainerAutoGraderController from './containerAutoGrader.controller';

const Router = express.Router();
const upload = multer();

/**
 * @swagger
 * /container-auto-graders:
 *   get:
 *     summary: Retrieve a list of all container auto graders
 */
Router.get('/', ContainerAutoGraderController.get);

/**
 * @swagger
 * /container-auto-graders/{id}:
 *   get:
 *     summary: Retrieve a single container auto grader
 */
Router.get('/:id', asInt(), ContainerAutoGraderController.detail);

/**
 * @swagger
 * /container-auto-graders:
 *   post:
 *     summary: Create a new container auto grader
 */
Router.post('/', upload.fields([{name: 'graderFilename'},{name: 'makefileFilename'}]), validator, ContainerAutoGraderController.post);

/**
 * @swagger
 * /container-auto-graders/{id}:
 *   put:
 *     summary: Update a container auto grader's grader file and/or makefile
 */
Router.put('/:id', asInt(), upload.fields([{name: 'graderFilename'},{name: 'makefileFilename'}]), validator, ContainerAutoGraderController.put);

/**
 * @swagger
 * /container-auto-graders/{id}:
 *   delete:
 *     summary: Delete a container auto grader
 */
Router.delete('/:id', asInt(), ContainerAutoGraderController._delete);

export default Router;