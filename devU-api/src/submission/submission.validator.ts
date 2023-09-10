import { check } from 'express-validator'

import { submissionTypes } from 'devu-shared-modules'

import validate from '../middleware/validator/generic.validator'

const userId = check('userId').isNumeric()
const assignmentId = check('assignmentId').isNumeric()
const courseId = check('courseId').isNumeric()
const content = check('content').isString().trim()
const originalSubmissionId = check('originalSubmissionId').isNumeric().optional({ nullable: true })

const type = check('type')
  .trim()
  .isIn([...submissionTypes])

const validator = [courseId, assignmentId, userId, type, content, originalSubmissionId, validate]

export default validator
