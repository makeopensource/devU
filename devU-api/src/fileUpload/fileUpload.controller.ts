import { NextFunction, Request, Response } from 'express'

import FileUploadService from './fileUpload.service'
import { serialize } from './fileUpload.serializer'
import { mappingFieldWithBucket } from '../utils/fileUpload.utils'
import { fileUploadTypes } from '../../devu-shared-modules'

import { GenericResponse, NotFound, Updated } from '../utils/apiResponse.utils'

export async function get(req: Request, res: Response, next: NextFunction) {
  try {
    const bucketName = req.params.bucketName
    const fileList = await FileUploadService.list(bucketName)

    res.status(200).json(fileList)
  } catch (err) {
    next(err)
  }
}



export async function detail(req: Request, res: Response, next: NextFunction) {
  try {
    const bucketName = req.params.bucketName
    const fileName = req.params.fileName
    const file: Buffer[] = await FileUploadService.retrieve(bucketName, fileName)

    if (!file) return res.status(404).json(NotFound)

    res.status(200).json(file)
  } catch (err) {
    next(err)
  }
}



/*
  This function is deciding which bucket to upload the file
  however, it only supports one bucket at the moment.
  It can be updated to support multiple buckets in the future

  Marking for discussion
 */
export async function post(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.files) return res.status(400).json(new GenericResponse('No file uploaded'))

    // @ts-ignore
    const inputFileField = fileUploadTypes.find(type => req.files[type])
    if (inputFileField === undefined) return res.status(403).json(new GenericResponse('File type not supported'))
    const bucketName = mappingFieldWithBucket(inputFileField)

    // @ts-ignore
    const fileUpload = await FileUploadService.create(req.files[inputFileField], bucketName)

    const response = serialize(fileUpload)

    res.status(201).json(response)
  }catch (err:Error|any){
    res.status(400).json(new GenericResponse(err.message))
  }
}

export async function put(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.files) return res.status(400).json(new GenericResponse('No file uploaded'))

    // @ts-ignore
    const inputFileField = fileUploadTypes.find(type => req.files[type])

    if (inputFileField === undefined) return res.status(403).json(new GenericResponse('File type not supported'))
    const bucketName = req.params.bucketName
    const inputBucketName = mappingFieldWithBucket(inputFileField)
    if (bucketName !== inputBucketName) return res.status(403).json(new GenericResponse('Wrong type of file uploaded'))

    // @ts-ignore
    const result = await FileUploadService.update(req.files[inputFileField], bucketName)

    if(!result) return res.status(404).json(NotFound)

    res.status(200).json(Updated)
  }catch (err){
    next(err)
  }
}



export default{
  get,
  detail,
  post,
  put,
}