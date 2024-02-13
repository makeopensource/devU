import { check } from 'express-validator'

import validate from '../middleware/validator/generic.validator'



const assignmentId = check('assignmentId').isNumeric()

const graderFilename = check('graderFilename')
.custom((_value, { req }) => req.file.size > 0)
.withMessage('Grader file is required')

const makefileFilename = check('makefileFilename').isString().trim().optional({ nullable: true })

const autogradingImage = check('autogradingImage').isString().trim()

const timeout = check('timeout').isNumeric()
.custom((value) => value > 0)
.withMessage('Timeout should be a positive integer')

const validator = [assignmentId, graderFilename, makefileFilename, autogradingImage, timeout, validate]

export default validator