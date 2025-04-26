import express from 'express'

import { categoryScorePatchValidator, categoryScorePostValidator } from './categoryScore.validator'
import { asInt } from '../../middleware/validator/generic.validator'
import { isAuthorized } from '../../authorization/authorization.middleware'

import CategoryScoreController from './categoryScore.controller'

/**
 * @swagger
 * components:
 *   schemas:
 *     CategoryScoreGradeType:
 *       type: string
 *       enum:
 *         - AVERAGE
 *         - SUM
 *     CategoryScoreBase:
 *       type: object
 *       properties:
 *         courseId:
 *           type: integer
 *           description: The ID of the course this category score belongs to.
 *         category:
 *           type: string
 *           description: The name of the category.
 *         gradingType:
 *           $ref: '#/components/schemas/CategoryScoreGradeType'
 *       required:
 *         - courseId
 *         - category
 *         - gradingType
 *     CategoryScorePost:
 *       description: DTO for creating a Category Score (POST request body). courseId is expected in the path parameter, not in the body.
 *       type: object
 *       properties:
 *         category:
 *           type: string
 *           description: The name of the category.
 *         gradingType:
 *           $ref: '#/components/schemas/CategoryScoreGradeType'
 *       required:
 *         # Only category and gradingType are required in the request body
 *         - category
 *         - gradingType
 *     CategoryScorePatch:
 *       description: DTO for updating a Category Score (PATCH request body). All fields are optional.
 *       type: object
 *       properties:
 *         courseId:
 *           type: integer
 *           description: The ID of the course this category score belongs to.
 *         category:
 *           type: string
 *           description: The name of the category.
 *         gradingType:
 *           $ref: '#/components/schemas/CategoryScoreGradeType'
 *     CategoryScoreGet:
 *       description: DTO for retrieving a Category Score (GET response body).
 *       allOf:
 *         - $ref: '#/components/schemas/CategoryScoreBase'
 *         - type: object
 *           properties:
 *             id:
 *               type: integer
 *               description: Unique identifier for the category score.
 *             createdAt:
 *               type: string
 *               format: date-time
 *               description: Timestamp when the category score was created.
 *             updatedAt:
 *               type: string
 *               format: date-time
 *               description: Timestamp when the category score was last updated.
 *           required:
 *             - id
 *             - createdAt
 *             - updatedAt
 *       required:
 *         - id
 *         - createdAt
 *         - updatedAt
 *         - courseId
 *         - category
 *         - gradingType
 *     NotFound:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: 'Not Found'
 *       required:
 *         - message
 *     Updated:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: 'Updated'
 *       required:
 *         - message
 *     BadRequest:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: 'Invalid ID format' # Or other specific validation error
 *       required:
 *         - message
 *     Unauthorized:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: 'Unauthorized'
 *       required:
 *         - message
 *     Forbidden:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: 'Forbidden'
 *       required:
 *         - message
 */

const Router = express.Router({ mergeParams: true })

/**
 * @swagger
 * /course/{courseId}/category-score:
 *   get:
 *     summary: Retrieve category scores for a specific course
 *     tags:
 *       - CategoryScores
 *     parameters:
 *       - name: courseId
 *         in: path
 *         required: true
 *         description: ID of the course.
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: OK. A list of category scores for the course.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CategoryScoreGet'
 *       '400':
 *         description: Bad Request - Invalid course ID format.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BadRequest'
 *       '401':
 *         description: Unauthorized.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Unauthorized'
 *       '403':
 *         description: Forbidden.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Forbidden'
 */
Router.get('/',
  isAuthorized('scoresViewAll'),
  asInt('courseId'),
  CategoryScoreController.listByCourse,
)

/**
 * @swagger
 * /course/{courseId}/category-score/{id}:
 *   get:
 *     summary: Retrieve a single category score by its ID
 *     tags:
 *       - CategoryScores
 *     parameters:
 *       - name: courseId
 *         in: path
 *         required: true
 *         description: ID of the course.
 *         schema:
 *           type: integer
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the category score to retrieve.
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: OK. The requested category score.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CategoryScoreGet'
 *       '400':
 *         description: Bad Request - Invalid ID format.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BadRequest'
 *       '401':
 *         description: Unauthorized.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Unauthorized'
 *       '403':
 *         description: Forbidden.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Forbidden'
 *       '404':
 *         description: Not Found - Category score with the specified ID does not exist.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotFound'
 */
Router.get('/:id',
  isAuthorized('scoresViewSelfReleased'),
  asInt('courseId'),
  asInt('id'),
  CategoryScoreController.detailById,
)

/**
 * @swagger
 * /course/{courseId}/category-score/category/{categoryName}:
 *   get:
 *     summary: Retrieve a single category score by its category name within a course
 *     tags:
 *       - CategoryScores
 *     parameters:
 *       - name: courseId
 *         in: path
 *         required: true
 *         description: ID of the course.
 *         schema:
 *           type: integer
 *       - name: categoryName
 *         in: path
 *         required: true
 *         description: Name of the category to retrieve.
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: OK. The requested category score.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CategoryScoreGet'
 *       '400':
 *         description: Bad Request - Invalid course ID format or category name missing.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BadRequest'
 *       '401':
 *         description: Unauthorized.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Unauthorized'
 *       '403':
 *         description: Forbidden.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Forbidden'
 *       '404':
 *         description: Not Found - Category score with the specified name does not exist in this course.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotFound'
 */
Router.get('/category/:categoryName',
  isAuthorized('scoresViewSelfReleased'),
  asInt('courseId'),
  CategoryScoreController.detailByName,
)


/**
 * @swagger
 * /course/{courseId}/category-score:
 *   post:
 *     summary: Create a new category score
 *     tags:
 *       - CategoryScores
 *     parameters:
 *       - name: courseId
 *         in: path
 *         required: true
 *         description: ID of the course for which to create the category score.
 *         schema:
 *           type: integer
 *     requestBody:
 *       description: Category score data to create.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CategoryScorePost'
 *     responses:
 *       '201':
 *         description: Created. Returns the newly created category score.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CategoryScoreGet' # Response is the created entity
 *       '400':
 *         description: Bad Request - Invalid input data or course ID format.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BadRequest'
 *       '401':
 *         description: Unauthorized.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Unauthorized'
 *       '403':
 *         description: Forbidden.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Forbidden'
 */
Router.post('/',
  isAuthorized('scoresEditAll'),
  asInt('courseId'),
  categoryScorePostValidator,
  CategoryScoreController.post,
)

/**
 * @swagger
 * /course/{courseId}/category-score/{id}:
 *   patch:
 *     summary: Update an existing category score
 *     tags:
 *       - CategoryScores
 *     parameters:
 *       - name: courseId
 *         in: path
 *         required: true
 *         description: ID of the course containing the category score.
 *         schema:
 *           type: integer
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the category score to update.
 *         schema:
 *           type: integer
 *     requestBody:
 *       description: Category score data fields to update. Only include fields that need changing.
 *       required: true
 *       content:
 *         application/json: # Updated content type
 *           schema:
 *             $ref: '#/components/schemas/CategoryScorePatch' # Updated schema reference
 *     responses:
 *       '200':
 *         description: OK. Update successful.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Updated' # Reflects the { message: 'Updated' } response
 *       '400':
 *         description: Bad Request - Invalid input data or ID format.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BadRequest'
 *       '401':
 *         description: Unauthorized.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Unauthorized'
 *       '403':
 *         description: Forbidden.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Forbidden'
 *       '404':
 *         description: Not Found - Category score with the specified ID does not exist.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotFound'
 */
Router.patch('/:id',
  isAuthorized('scoresEditAll'),
  asInt('courseId'),
  asInt('id'),
  categoryScorePatchValidator,
  CategoryScoreController.update,
)

/**
 * @swagger
 * /course/{courseId}/category-score/{id}:
 *   delete:
 *     summary: Delete a category score
 *     tags:
 *       - CategoryScores
 *     parameters:
 *       - name: courseId
 *         in: path
 *         required: true
 *         description: ID of the course containing the category score.
 *         schema:
 *           type: integer
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the category score to delete.
 *         schema:
 *           type: integer
 *     responses:
 *       '204':
 *         description: No Content. Successfully deleted.
 *       '400':
 *         description: Bad Request - Invalid ID format.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BadRequest'
 *       '401':
 *         description: Unauthorized.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Unauthorized'
 *       '403':
 *         description: Forbidden.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Forbidden'
 *       '404':
 *         description: Not Found - Category score with the specified ID does not exist.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotFound'
 */
Router.delete('/:id',
  isAuthorized('scoresEditAll'),
  asInt('courseId'),
  asInt('id'),
  CategoryScoreController._delete,
)

export default Router