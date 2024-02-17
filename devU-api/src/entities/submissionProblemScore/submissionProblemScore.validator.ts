import { check } from 'express-validator'

import validate from '../../middleware/validator/generic.validator'

const submissionId = check('submissionId').isNumeric()
const assignmentProblemId = check('assignmentProblemId').isNumeric()
const score = check('score').isNumeric()
const feedback = check('feedback').isString().trim().optional({ nullable: true })
const releasedAt = check('releasedAt').isString().trim().isISO8601().toDate()

const validator = [submissionId, assignmentProblemId, score, feedback, releasedAt, validate]

export default validator
