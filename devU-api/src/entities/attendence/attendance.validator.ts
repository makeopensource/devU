import { check } from 'express-validator'
import validate from '../../middleware/validator/generic.validator' // Adjust path as needed

// Route: POST /attendance
// Body expected: { courseId: number, timeLimitSeconds: number, maxTries: number }

// const courseId = check('courseId')
//   .notEmpty().withMessage('courseId is required.')
//   .isInt({ min: 1 }).withMessage('courseId must be a positive integer.')

const timeLimitSeconds = check('timeLimitSeconds')
  .notEmpty().withMessage('timeLimitSeconds is required.')
  .isInt({ min: 1 }).withMessage('timeLimitSeconds must be a positive integer representing seconds.')

const maxTries = check('maxTries')
  .notEmpty().withMessage('maxTries is required.')
  .isInt({ min: 1 }).withMessage('maxTries must be a positive integer.')


// Route: POST /attendance/:sessionId/submit
// Body expected: { attendanceCode: string }

const attendanceCode = check('attendanceCode')
  .trim()
  .notEmpty().withMessage('attendanceCode is required and cannot be empty.')
  .isString().withMessage('attendanceCode must be a string.')


/**
 * Validator array for creating attendance sessions.
 * Use this in the POST /attendance route.
 */
export const validateAttendanceCreation = [
  timeLimitSeconds,
  maxTries,
  validate, // Middleware that executes the checks
]

/**
 * Validator array for submitting attendance codes.
 * Use this in the POST /attendance/:sessionId/submit route.
 */
export const validateAttendanceSubmission = [
  attendanceCode,
  validate, // Middleware that executes the checks
]

export default {
  validateAttendanceCreation,
  validateAttendanceSubmission,
}