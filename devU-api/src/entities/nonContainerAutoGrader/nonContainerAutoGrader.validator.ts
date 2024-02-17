import { check } from 'express-validator'
import validate from '../middleware/validator/generic.validator'

const correctString = check('correctString').isString().trim().isLength({ max: 128 })
const question = check('question').isString().trim().isLength({ max: 128 })
const score = check('score').isNumeric()
const assignmentId = check('assignmentId').isNumeric()

const validator = [
  correctString,
  validate,
  question,
  score,
  assignmentId,
]

export default validator
