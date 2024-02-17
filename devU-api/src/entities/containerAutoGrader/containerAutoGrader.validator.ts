import { check } from 'express-validator'

import validate from '../../middleware/validator/generic.validator'



const assignmentId = check('assignmentId').isNumeric()

const graderFile = check('graderFile').isString()

const makefileFile = check('makefileFile').isString().optional({ nullable: true })


const autogradingImage = check('autogradingImage').isString()

const timeout = check('timeout').isNumeric()
.custom((value) => value > 0)
.withMessage('Timeout should be a positive integer')

const validator = [assignmentId, graderFile, makefileFile, autogradingImage, timeout, validate]

export default validator