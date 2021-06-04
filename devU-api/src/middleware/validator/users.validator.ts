import { check } from 'express-validator'

import validate from './generic.validator'

const email = check('email').isString().trim().isEmail()
const preferredName = check('preferredName').isString().trim().isLength({ max: 128 }).optional({ nullable: true })
const schoolId = check('schoolId').isString().trim().isLength({ max: 128 }).optional({ nullable: true })

const validator = [email, preferredName, schoolId, validate]

export default validator
