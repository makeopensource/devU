import { check } from 'express-validator'

import validate from '../middleware/validator/generic.validator'
import { fileUploadTypes } from '../../devu-shared-modules'

/*
  * This file is a validator for the file upload routes.
  * It now only checks if the file is uploaded
  * It does not check the file type or size because this entity handles multiple files uploads
  * This can be added in the future
 */

const checkFiles = check('files')
  .custom((_value, { req }) =>{
    fileUploadTypes.map(name => {
      if (req.files && req.files[name]){
        return req.files[name].length > 0
      }
      return true
    })
  })
  .withMessage('No file uploaded')


const validator = [checkFiles, validate]

export default validator
