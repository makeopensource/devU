import { check } from 'express-validator'

import validate from '../middleware/validator/generic.validator'

const courseId = check('courseId').isNumeric()
const userId = check('userId').isString().trim().isLength({ max: 128 })
const score = check('score').isNumeric()

const validator = [courseId, userId, score]

export default validator
