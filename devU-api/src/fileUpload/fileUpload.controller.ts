import { Request, Response, NextFunction} from 'express'

import FileUploadService from './fileUpload.service'
import { serialize } from './fileUpload.serializer'

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
    const file = await FileUploadService.retrieve(bucketName, fileName)

    if (!file) return res.status(404).json(NotFound)

    res.status(200).json(file)
  } catch (err) {
    next(err)
  }
}


export async function post(req: Request, res: Response, next: NextFunction) {
  try {
    const files = req.files

    if (!files) return res.status(400).json(new GenericResponse('No file uploaded'))

    const file = await FileUploadService.create(req.body, files)


    const response = serialize(file)

    res.status(201).json(response)
  }catch (err){
    res.status(400).json(new GenericResponse(err.message))
  }
}

export async function put(req: Request, res: Response, next: NextFunction) {
  try {
    const bucketName = req.params.bucketName
    const files = req.files

    const file = await FileUploadService.update(bucketName, files)
    const response = serialize(file)

    res.status(200).json(response)
  }catch (err){
    res.status(400).json(new GenericResponse(err.message))
  }
}



export default{
  get,
  detail,
  post,
  put,
}