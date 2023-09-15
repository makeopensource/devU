import { check } from 'express-validator'

import validate from '../middleware/validator/generic.validator'

const assignmentId = check('assignmentId').isNumeric()
const userId = check('userId').isString().trim().isLength({ max: 128 })
const score = check('score').isNumeric()

const validator = [assignmentId, userId, score]

export default validator