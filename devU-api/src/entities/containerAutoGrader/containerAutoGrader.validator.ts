import { check } from 'express-validator'
import validate from '../../middleware/validator/generic.validator'

const assignmentId = check('assignmentId').isNumeric()

const dockerfile = check('dockerfile')
  .custom((value, { req }) => {
    // Dockerfile is now optional
    if (!req.files || !('dockerfile' in req.files)) {
      return true // Will use default Dockerfile
    }
    // If provided, validate it
    const file = req.files['dockerfile'][0]
    if (!file || file.size <= 0) {
      throw new Error('Provided Dockerfile is empty')
    }
    return true
  })
  .withMessage('If provided, Dockerfile must not be empty')

const jobFiles = check('jobFiles')
  .custom((value, { req }) => {
    if (!req.files || !('jobFiles' in req.files)) {
      throw new Error('Job files are required')
    }
    const files = req.files['jobFiles']
    if (!files || !files.length) {
      throw new Error('At least one job file is required')
    }
    for (const file of files) {
      if (file.size <= 0) {
        throw new Error('Job file cannot be empty')
      }
    }
    return true
  })
  .withMessage('Valid job files are required')

const timeout = check('timeoutInSeconds')
  .isNumeric()
  .custom(value => value > 0)
  .withMessage('Timeout should be a positive integer')

const memoryLimit = check('memoryLimitMB')
  .optional()
  .isNumeric()
  .custom(value => value > 0)
  .withMessage('Memory limit should be a positive integer')

const cpuCores = check('cpuCores')
  .optional()
  .isNumeric()
  .custom(value => value > 0)
  .withMessage('CPU cores should be a positive integer')

const pidLimit = check('pidLimit')
  .optional()
  .isNumeric()
  .custom(value => value > 0)
  .withMessage('PID limit should be a positive integer')

const autolabCompatible = check('autolabCompatible')
  .optional()
  .isBoolean()
  .withMessage('autolabCompatible must be a boolean value')

const entryCmd = check('entryCmd')
  .custom((value, { req }) => {
    const isautolabCompatible = req.body.autolabCompatible !== false
    if (!isautolabCompatible && (!value || value.trim() === '')) {
      throw new Error('entryCmd is required when autolabCompatible is false')
    }
    return true
  })
  .withMessage('entryCmd is required when autolabCompatible is false')

const validator = [
  assignmentId,
  dockerfile,
  jobFiles,
  timeout,
  memoryLimit,
  cpuCores,
  pidLimit,
  autolabCompatible,
  entryCmd,
  validate
]

export default validator
