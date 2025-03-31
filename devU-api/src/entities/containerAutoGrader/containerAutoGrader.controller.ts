import { NextFunction, Request, Response } from 'express'
import * as ContainerAutoGraderService from './containerAutoGrader.service'
import { serialize } from './containerAutoGrader.serializer'
import { GenericResponse, NotFound, Updated } from '../../utils/apiResponse.utils'
import ContainerAutoGraderModel from './containerAutoGrader.model'
import { FileWithMetadata } from './containerAutoGrader.service'
import { UpdateResult } from 'typeorm'

export interface FileRequest extends Request {
  files: {
    [fieldname: string]: Express.Multer.File[]
  }
}

export interface ContainerAutoGraderResponse {
  model: ContainerAutoGraderModel
  files: {
    dockerfile: FileWithMetadata
    jobFiles: FileWithMetadata[]
  }
}

export async function get(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id)
    const result = await ContainerAutoGraderService.retrieve(id)
    if (!result) return res.status(404).json(NotFound)
    return res.json(result)
  } catch (error) {
    next(error)
  }
}

export async function detail(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id)
    const containerAutoGrader = await ContainerAutoGraderService.retrieve(id)

    if (!containerAutoGrader) return res.status(404).json(NotFound)

    const response = serialize(containerAutoGrader.model)
    res.status(200).json(response)
  } catch (err) {
    next(err)
  }
}

export async function getAllByAssignment(req: Request, res: Response, next: NextFunction) {
  try {
    const assignmentId = parseInt(req.params.id)
    if (!assignmentId) return res.status(404).json({ message: 'invalid assignment ID' })

    const containerAutoGrader = await ContainerAutoGraderService.getAllGradersByAssignment(assignmentId)
    res.status(200).json(containerAutoGrader.map(serialize))
  } catch (err) {
    next(err)
  }
}

export async function post(req: FileRequest, res: Response, next: NextFunction) {
  try {
    const dockerfile = req.files['dockerfile'][0]
    const jobFiles = req.files['jobFiles']
    const requestBody = {
      assignmentId: parseInt(req.body.assignmentId),
      timeoutInSeconds: parseInt(req.body.timeoutInSeconds),
      memoryLimitMB: req.body.memoryLimitMB ? parseInt(req.body.memoryLimitMB) : 512,
      cpuCores: req.body.cpuCores ? parseInt(req.body.cpuCores) : 1,
      pidLimit: req.body.pidLimit ? parseInt(req.body.pidLimit) : 100,
      entryCmd: req.body.entryCmd,
      autolabCompatible: req.body.autolabCompatible === undefined ? true : req.body.autolabCompatible === 'true',
    }
    const userId = req.currentUser!.userId

    const containerAutoGrader = await ContainerAutoGraderService.create(requestBody, dockerfile, jobFiles, userId)
    const response = serialize(containerAutoGrader)

    res.status(201).json(response)
  } catch (err) {
    if (err instanceof Error) {
      res.status(400).json(new GenericResponse(err.message))
    } else {
      next(err)
    }
  }
}

export async function put(req: FileRequest, res: Response, next: NextFunction) {
  try {
    const hasFiles = req.files && ('dockerfile' in req.files || 'jobFiles' in req.files)
    if (!hasFiles && Object.keys(req.body).length === 0) {
      return res.status(400).json(new GenericResponse('No updates provided'))
    }

    // If job files are being updated, ensure at least one is provided
    if (req.files?.['jobFiles']) {
      const jobFiles = req.files['jobFiles']
      if (!jobFiles.length) {
        return res.status(400).json(new GenericResponse('At least one job file is required'))
      }
      // Check for empty files
      for (const file of jobFiles) {
        if (file.size <= 0) {
          return res.status(400).json(new GenericResponse('Job file cannot be empty'))
        }
      }
    }

    const dockerfile = req.files?.dockerfile?.[0] || null
    const jobFiles = req.files?.jobFiles || null

    const requestBody = {
      id: parseInt(req.params.id),
      assignmentId: req.body.assignmentId ? parseInt(req.body.assignmentId) : undefined,
      timeoutInSeconds: req.body.timeoutInSeconds ? parseInt(req.body.timeoutInSeconds) : undefined,
      memoryLimitMB: req.body.memoryLimitMB ? parseInt(req.body.memoryLimitMB) : undefined,
      cpuCores: req.body.cpuCores ? parseInt(req.body.cpuCores) : undefined,
      pidLimit: req.body.pidLimit ? parseInt(req.body.pidLimit) : undefined,
      entryCmd: req.body.entryCmd,
      autolabCompatible: req.body.autolabCompatible === undefined ? true : req.body.autolabCompatible === 'true',
    }
    const userId = req.currentUser!.userId

    const result: UpdateResult = await ContainerAutoGraderService.update(requestBody, dockerfile, jobFiles, userId)
    if (!result.affected) return res.status(404).json(NotFound)
    return res.json(Updated)
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json(new GenericResponse(error.message))
    } else {
      next(error)
    }
  }
}

export async function _delete(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id)
    const results = await ContainerAutoGraderService._delete(id)
    if (!results.affected) return res.status(404).json(NotFound)
    res.status(200).json(Updated)
  } catch (err) {
    next(err)
  }
}

export default {
  get,
  detail,
  getAllByAssignment,
  post,
  put,
  _delete,
}
