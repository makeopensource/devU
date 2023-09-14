import { check } from 'express-validator'

import validate from './generic.validator'

const name = check('name').isString().trim().isLength({ max: 128 })

const validator = [name, validate]

export default validator