import { check } from 'express-validator'
import { CategoryScoreGradeType } from 'devu-shared-modules'

import validate from '../../middleware/validator/generic.validator'

const categoryChain = check('category')
  .trim()
  .isString().withMessage('Category must be a string')
  .notEmpty().withMessage('Category cannot be empty')

const gradingTypeChain = check('gradingType')
  .isString().withMessage('Grading type must be a string')
  .isIn(Object.values(CategoryScoreGradeType))
  .withMessage(`Grading type must be one of: ${Object.values(CategoryScoreGradeType).join(', ')}`)

/**
 * Validator for POST /course/{courseId}/category-score
 * Requires 'category' and 'gradingType' in the body.
 */
export const categoryScorePostValidator = [
  categoryChain,
  gradingTypeChain,
  validate,
]

/**
 * Validator for PATCH /course/{courseId}/category-score/{id}
 * Validates 'category' and 'gradingType' only if they are present in the body.
 */
export const categoryScorePatchValidator = [
  categoryChain.optional(),
  gradingTypeChain.optional(),
  validate,
]

export default { categoryScorePostValidator, categoryScorePatchValidator }