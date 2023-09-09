import { check } from 'express-validator'

import { userCourseLevels } from 'devu-shared-modules'

import validate from './generic.validator'

const userId = check('userId').isNumeric()
const courseId = check('courseId').isNumeric()
const dropped = check('dropped').isBoolean()

const level = check('level')
  .trim()
  .isIn([...userCourseLevels])

const validator = [userId, courseId, level, dropped, validate]

export default validator
