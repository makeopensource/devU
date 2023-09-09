import { check } from 'express-validator'

import validate from './generic.validator'

const submissionId = check('submissionId').isNumeric()
const score = check('score').isNumeric().optional({ nullable: true })
const feedback = check('feedback').isString().trim().optional({ nullable: true })
const releasedAt = check('releasedAt').trim().isISO8601().toDate()

const validator = [submissionId, score, feedback, releasedAt, validate]

export default validator
