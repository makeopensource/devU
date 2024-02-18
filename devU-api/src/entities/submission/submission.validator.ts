import { check } from 'express-validator'

import validate from '../../middleware/validator/generic.validator'

const userId = check('userId').isNumeric()
const assignmentId = check('assignmentId').isNumeric()
const courseId = check('courseId').isNumeric()
const content = check('content').isString()

const validator = [courseId, assignmentId, userId, content, validate]

export default validator
