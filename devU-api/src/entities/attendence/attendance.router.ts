import express from 'express'

import { asInt } from '../../middleware/validator/generic.validator'
import { isAuthorized } from '../../authorization/authorization.middleware'
import { validateAttendanceCreation, validateAttendanceSubmission } from './attendance.validator'
import AttendanceController from './attendance.controller'

const Router = express.Router({ mergeParams: true })

/**
 //
 * tags:
 * name: Attendance
 * description: Attendance session management and submission
 */

/**
 // //
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
 *         - courseId
 *         - timeLimitSeconds
 *         - maxTries
 *       properties:
 *         courseId:
 *           type: integer
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
 *     AttendanceSubmissionResponse:
 *       type: object
 *       properties:
 *         isCorrect:
 *           type: boolean
 *           description: Whether the submitted code was correct for the session.
 *         triesLeft:
 *           type: integer
 *           description: Number of attempts made (including this one). Placeholder - logic might differ.
 */

/**
 //
 * /attendance/course/{courseId}:
 *   get:
 *     summary: Retrieve all active attendance sessions for a specific course (Requires course editing privileges)
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

Router.get(
  '/:id/results',
  isAuthorized('courseEdit'),
  asInt('id'),
  AttendanceController.getAllSubmissions,
)


/**
 //
 * /attendance/{id}:
 *   get:
 *     summary: Retrieve a specific attendance session by its ID (Requires course editing privileges)
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
 //
 * /attendance:
 *   post:
 *     summary: Create a new attendance session (Requires course editing privileges)
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
 //
 * /attendance/{sessionId}/submit:
 *   post:
 *     summary: Submit an attendance code for a student (Requires permission to create self-submissions)
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
  isAuthorized('submissionCreateAll'),
  asInt('sessionId'),
  validateAttendanceSubmission,
  AttendanceController.submitAttendance,
)

/**
 //
 * /attendance/{id}:
 *   delete:
 *     summary: Delete (soft delete) an attendance session (Requires course editing privileges)
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