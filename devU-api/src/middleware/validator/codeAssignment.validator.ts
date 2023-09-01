import { check } from 'express-validator'

import validate from './generic.validator'

const assignmentId = check('assignmentId').isNumeric()
const gradingImage = check('gradingImage').isString().trim().isLength({ max: 128 })

const graderFile = check('graderFile')
  .custom((_value, { req }) => req.file.fieldname === 'graderFile' && req.file.size > 0)
  .withMessage("Please submit the grading file in an input named 'graderFile'")

const validator = [assignmentId, gradingImage, graderFile, validate]

export default validator
