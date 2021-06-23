import { check } from 'express-validator'

import validate from './generic.validator'

const email = check('email').isString().trim().isEmail()
const preferredName = check('preferredName').isString().trim().isLength({ max: 128 }).optional({ nullable: true })
const externalId = check('externalId').isString().trim().isLength({ max: 128 })

const validator = [email, preferredName, externalId, validate]

export default validator
