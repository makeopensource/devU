import { check } from 'express-validator'



import validate from '../middleware/validator/generic.validator'

const userId = check('userId').isNumeric()
const assignmentId = check('assignmentId').isNumeric()
const courseId = check('courseId').isNumeric()
const filenames = check('filenames').isArray()


const validator = [courseId, assignmentId, userId, filenames, validate]

export default validator
