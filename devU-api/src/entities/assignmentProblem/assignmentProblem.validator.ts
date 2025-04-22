import { check } from 'express-validator'

import validate from '../../middleware/validator/generic.validator'

const assignmentId = check('assignmentId').isNumeric()
const problemName = check('problemName').isString().trim().isLength({ max: 128 })
const maxScore = check('maxScore').isNumeric()
const metadata = check('metadata')
  .optional({ nullable: true })
  .isObject()
  .default({})

const validator = [assignmentId, problemName, maxScore, metadata, validate]

export default validator
