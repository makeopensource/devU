import { check } from 'express-validator'

import validate from '../middleware/validator/generic.validator'

const courseId = check('courseId').isNumeric()
const score = check('score').isNumeric()

const validator = [courseId,  score, validate]

export default validator
