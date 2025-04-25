import { check } from 'express-validator'

import validate from '../../middleware/validator/generic.validator'
import { isBeforeParam, isAfterParam } from '../../middleware/validator/date.validator'
import { ScoringType } from 'devu-shared-modules'

const courseId = check('courseId').isNumeric()
const name = check('name').isString().trim().isLength({ max: 128 })
const categoryName = check('categoryName').isString().trim().isLength({ max: 128 })
const description = check('description').isString().trim()
const maxFileSize = check('maxFileSize').isNumeric()
const maxSubmissions = check('maxSubmissions').isNumeric().optional({ nullable: true })
const disableHandins = check('disableHandins').isBoolean()
const scoringType = check('scoringType')
  .optional()
  .isIn(Object.values(ScoringType))
  .withMessage(`scoringType must be one of: ${Object.values(ScoringType).join(', ')}`)

const startDate = check('startDate')
  .trim()
  .isISO8601()
  .custom(isBeforeParam('dueDate'))
  .custom(isBeforeParam('endDate'))
  .toDate()

const dueDate = check('dueDate')
  .trim()
  .isISO8601()
  .custom(isAfterParam('startDate'))
  .custom(isBeforeParam('endDate'))
  .toDate()

const endDate = check('endDate')
  .trim()
  .isISO8601()
  .custom(isAfterParam('startDate'))
  .custom(isAfterParam('dueDate'))
  .toDate()

const validator = [
  courseId,
  name,
  categoryName,
  description,
  startDate,
  dueDate,
  endDate,
  maxFileSize,
  maxSubmissions,
  disableHandins,
  scoringType,
  validate,
]

export default validator
