import { check } from 'express-validator'

import validate from '../middleware/validator/generic.validator'



const assignmentId = check('assignmentId').isNumeric()

const graderFile = check('graderFile')
.custom((_value, { req }) => req.files['graderFile'][0].size > 0)
.withMessage('Grader file is required')

const makefileFile = check('makefileFile').isString().trim().optional({ nullable: true })
.custom((_value, { req }) => !req.files['makefileFile'] || req.files['makefileFile'][0].size > 0)
.withMessage('Makefile needed a valid size file or no file at all.')


const autogradingImage = check('autogradingImage').isString().trim()

const timeout = check('timeout').isNumeric()
.custom((value) => value > 0)
.withMessage('Timeout should be a positive integer')

const validator = [assignmentId, graderFile, makefileFile, autogradingImage, timeout, validate]

export default validator