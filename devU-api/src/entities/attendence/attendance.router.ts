import express from 'express'

import { asInt } from '../../middleware/validator/generic.validator'
import { isAuthorized } from '../../authorization/authorization.middleware'
import { validateAttendanceCreation, validateAttendanceSubmission } from './attendance.validator'
import AttendanceController from './attendance.controller'

const Router = express.Router({ mergeParams: true })

/**
 * @swagger
 * tags:
 *  name: Attendance
 *  description: Attendance session management and submission
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     AttendanceSessionResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The unique identifier for the attendance session.
 *         courseId:
 *           type: integer
 *           description: The ID of the course this session belongs to.
 *         attendanceCode:
 *           type: string
 *           description: The code required for attendance submission (often instructor-only).
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the session was created.
 *         expiresAt:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the session expires.
 *         timeLimitSeconds:
 *           type: integer
 *           description: The duration of the session in seconds.
 *         maxTries:
 *           type: integer
 *           description: Maximum number of submission attempts allowed.
 *         createdByUserId:
 *           type: integer
 *           description: The ID of the user who created the session.
 *     AttendanceRequest:
 *       type: object
 *       required:
 *         - timeLimitSeconds
 *         - maxTries
 *       properties:
 *         timeLimitSeconds:
 *           type: integer
 *         maxTries:
 *           type: integer
 *     AttendanceSubmissionRequest:
 *       type: object
 *       required:
 *         - attendanceCode
 *       properties:
 *         attendanceCode:
 *           type: string
 *           description: The code submitted by the student.
 *
 *     AttendanceSubmissionResponse:
 *       type: object
 *       properties:
 *         isCorrect:
 *           type: boolean
 *           description: Whether the submitted code was correct for the session.
 *         triesLeft:
 *           type: integer
 *           description: Number of attempts made (including this one). Placeholder - logic might differ.
 *
 *     AttendanceSubmission:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: Unique identifier for this submission record.
 *           example: 543
 *         sessionId:
 *           type: integer
 *           description: The ID of the attendance session this submission belongs to.
 *           example: 101
 *         success:
 *           type: boolean
 *           description: Whether this specific submission attempt was successful (code matched the session's code at the time).
 *           example: true
 *         submittedAt:
 *           type: string
 *           format: date-time
 *           description: The exact time the submission was recorded by the system.
 *           example: "2025-04-21T11:20:05.123Z" # Example timestamp
 *         submission:
 *           type: string
 *           description: The actual code string submitted by the user.
 *           example: "ABCD12"
 *       required:
 *         - id
 *         - sessionId
 *         - success
 *         - submittedAt
 *         - submission
 */

/**
 * @swagger
 * /attendance/course/{courseId}:
 *   get:
 *     summary: Retrieve all active attendance sessions for a specific course
 *     tags:
 *       - Attendance
 *     parameters:
 *       - name: courseId
 *         in: path
 *         required: true
 *         description: ID of the course to retrieve sessions for
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: A list of attendance sessions.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/AttendanceSessionResponse' # Use a serialized response schema
 *       '400':
 *         description: Invalid Course ID.
 *       '401':
 *         description: Unauthorized (Not logged in).
 *       '403':
 *         description: Forbidden (User lacks 'courseEdit' permission).
 */
Router.get(
  '/',
  isAuthorized('courseEdit'),
  AttendanceController.getSessionsByCourse,
)

/**
 * @swagger
 * /attendance/{id}/results:
 *   get:
 *     summary: Retrieve all submissions for a specific attendance session
 *     tags:
 *       - Attendance
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the attendance session to retrieve results for
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: A list of all submission records for the specified attendance session.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/AttendanceSubmission'
 *       '400':
 *         description: Invalid session ID supplied (e.g., not an integer).
 *       '401':
 *         description: Unauthorized (User is not logged in).
 *       '403':
 *         description: Forbidden (User lacks 'courseEdit' permission).
 *       '404':
 *         description: Attendance session with the specified ID not found.
 * */
Router.get(
  '/:id/results',
  isAuthorized('courseEdit'),
  asInt('id'),
  AttendanceController.getAllSubmissions,
)


/**
 @swagger
 * /attendance/{id}:
  *   get:
  *     summary: Retrieve a specific attendance session by its ID
  *     tags:
  *       - Attendance
  *     parameters:
  *       - name: id
  *         in: path
  *         required: true
  *         description: Unique ID of the attendance session
  *         schema:
  *           type: integer
  *     responses:
  *       '200':
  *         description: Details of the attendance session.
  *         content:
  *           application/json:
  *             schema:
  *               $ref: '#/components/schemas/AttendanceSessionResponse' # Use a serialized response schema
  *       '400':
  *         description: Invalid ID supplied.
  *       '401':
  *         description: Unauthorized.
  *       '403':
  *         description: Forbidden (User lacks 'courseEdit' permission).
  *       '404':
  *         description: Attendance session not found.
 */
Router.get(
  '/:id',
  isAuthorized('courseEdit'),
  asInt('id'),
  AttendanceController.getSessionById,
)
/**
 @swagger
 * /attendance:
  *   post:
  *     summary: Create a new attendance session
  *     tags:
  *       - Attendance
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             $ref: '#/components/schemas/AttendanceRequest'
  *     responses:
  *       '201':
  *         description: Attendance session created successfully.
  *         content:
  *           application/json:
  *             schema:
  *               $ref: '#/components/schemas/AttendanceSessionResponse'
  *       '400':
  *         description: Invalid request body or input data.
  *       '401':
  *         description: Unauthorized (Not logged in).
  *       '403':
  *         description: Forbidden (User lacks 'courseEdit' permission).
  *       '500':
  *         description: Server error during session creation.
 */

Router.post(
  '/',
  isAuthorized('courseEdit'),
  validateAttendanceCreation,
  AttendanceController.createSession,
)

/**
 * @swagger
 * /attendance/{sessionId}/submit:
 *   post:
 *     summary: Submit an attendance code for a student
 *     tags:
 *       - Attendance
 *     parameters:
 *       - name: sessionId
 *         in: path
 *         required: true
 *         description: ID of the attendance session to submit to
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AttendanceSubmissionRequest'
 *     responses:
 *       '200':
 *         description: Submission processed. Check 'isCorrect' in the response.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AttendanceSubmissionResponse'
 *       '400':
 *         description: Invalid request body, invalid session ID, or submission error (e.g., max tries exceeded).
 *       '401':
 *         description: Unauthorized (Not logged in).
 *       '403':
 *         description: Forbidden (User lacks 'submissionCreateSelf' permission, might not be enrolled).
 *       '404':
 *         description: Attendance session not found.
 * */
Router.post(
  '/:sessionId/submit',
  isAuthorized('submissionCreateSelf'),
  asInt('sessionId'),
  validateAttendanceSubmission,
  AttendanceController.submitAttendance,
)

/**
 @swagger
 * /attendance/{id}:
  *   delete:
  *     summary: Delete (soft delete) an attendance session
  *     tags:
  *       - Attendance
  *     parameters:
  *       - name: id
  *         in: path
  *         required: true
  *         description: ID of the attendance session to delete
  *         schema:
  *           type: integer
  *     responses:
  *       '204':
  *         description: Session deleted successfully (No Content).
  *       '400':
  *         description: Invalid ID supplied.
  *       '401':
  *         description: Unauthorized.
  *       '403':
  *         description: Forbidden (User lacks 'courseEdit' permission).
  *       '404':
  *         description: Attendance session not found.
 */
Router.delete(
  '/:id',
  isAuthorized('courseEdit'),
  asInt('id'),
  AttendanceController.deleteSession,
)

export default Router