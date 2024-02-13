import { Request, Response, NextFunction } from 'express'

import ContainerAutoGraderService from './containerAutoGrader.service'
import { serialize } from './containerAutoGrader.serializer'

import { GenericResponse, NotFound, Updated } from '../utils/apiResponse.utils'

export async function get(req: Request, res: Response, next: NextFunction) {
  try {
    const containerAutoGrader = await ContainerAutoGraderService.list()

    res.status(200).json(containerAutoGrader.map(serialize))
  } catch (err) {
    next(err)
  }
}

export async function detail(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id)
    const containerAutoGrader = await ContainerAutoGraderService.retrieve(id)

    if (!containerAutoGrader) return res.status(404).json(NotFound)

    const response = serialize(containerAutoGrader)

    res.status(200).json(response)
  } catch (err) {
    next(err)
  }
}

/*
  * for the post method, I changed how the upload is handled. I am now using fields instead of
  * single(for the purpose of uploading grader file and makefile). But I set the makefile to be
  * optional, since it is not required. I also added the makefile to the create method in the
  * ContainerAutoGraderService.
*/
export async function post(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.files || !('graderFilename' in req.files)) {
      return res.status(400).json(new GenericResponse('Container Auto Grader requires file upload for grader'));
    }
    const graderFile = req.files['graderFilename'][0]?.buffer
    const makefile = req.files['makefileFilename'] ? req.files['makefileFilename'][0]?.buffer : null

    const containerAutoGrader = await ContainerAutoGraderService.create(req.body, graderFile, makefile)
    const response = serialize(containerAutoGrader)

    res.status(201).json(response)
  } catch (err) {
    res.status(400).json(new GenericResponse(err.message))
  }
}


/* 
  * for the put method, I am not sure if the graderFilename is necessary, since there are two
  * files that can be uploaded, the grader and the makefile. I am currently assuming that the
  * graderFile is required(following the same logic as the post method), but it can be changed
  * to make it optional if needed.
*/
export async function put(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.files || !('graderFilename' in req.files)) {
      return res.status(400).json(new GenericResponse('Container Auto Grader requires file upload for grader'));
    }

    const graderFile = req.files['graderFilename'][0]?.buffer
    const makefile = req.files['makefileFilename'] ? req.files['makefileFilename'][0]?.buffer : null

    req.body.id = parseInt(req.params.id)
    const results = await ContainerAutoGraderService.update(req.body, graderFile, makefile)

    if (!results.affected) return res.status(404).json(NotFound)

    res.status(200).json(Updated)
    }catch (err) {
    next(err)
    }
}

export async function _delete(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id)
    const results = await ContainerAutoGraderService._delete(id)

    if (!results.affected) return res.status(404).json(NotFound)

    res.status(204).send()
  } catch (err) {
    next(err)
  }
}

export default {
  get,
  detail,
  post,
  put,
  _delete,
}