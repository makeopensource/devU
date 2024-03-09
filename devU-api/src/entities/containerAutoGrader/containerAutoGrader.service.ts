import { getRepository, IsNull } from 'typeorm'

import { ContainerAutoGrader, FileUpload } from 'devu-shared-modules'

import ContainerAutoGraderModel from './containerAutoGrader.model'
import FileModel from "../../fileUpload/fileUpload.model";

import { uploadFile } from '../../fileStorage'
import {generateFilename} from "../../utils/fileUpload.utils";

const connect = () => getRepository(ContainerAutoGraderModel)
const fileConn = () => getRepository(FileModel)

async function filesUpload(bucket: string, file: Express.Multer.File, containerAutoGrader: ContainerAutoGrader,filename: string) {
    const Etag: string = await uploadFile(bucket, file)
    const assignmentId = containerAutoGrader.assignmentId

    const fileModel: FileUpload = {
        etags: Etag,
        fieldName: bucket,
        originalName: file.originalname,
        filename: filename,
        assignmentId: assignmentId,
    }
    //TODO: This is a temporary fix to get the function to pass. CourseId and UserId should be modified in the future
    fileModel.courseId = 1
    fileModel.userId = 1

    await fileConn().save(fileModel)

  return Etag
}



export async function create(containerAutoGrader: ContainerAutoGrader, graderInputFile: Express.Multer.File, makefileInputFile: Express.Multer.File | null = null) {
    const bucket: string = 'graders'
    const filename: string = generateFilename(graderInputFile.originalname)
    await filesUpload(bucket, graderInputFile, containerAutoGrader, filename)
    containerAutoGrader.graderFile = filename

    if (makefileInputFile) {
        const makefileFilename: string = generateFilename(makefileInputFile.originalname)
        await filesUpload(bucket, makefileInputFile, containerAutoGrader, makefileFilename)
        containerAutoGrader.makefileFile = makefileFilename
    }

    const { id, assignmentId, graderFile, makefileFile, autogradingImage, timeout } = containerAutoGrader
    return await connect().save({ id, assignmentId, graderFile, makefileFile, autogradingImage, timeout })
}

export async function update(containerAutoGrader: ContainerAutoGrader, graderInputFile: Express.Multer.File | null = null, makefileInputFile: Express.Multer.File | null = null) {
    if (!containerAutoGrader.id) throw new Error('Missing Id')
    if (graderInputFile) {
        const bucket: string = 'graders'
        const filename: string = generateFilename(graderInputFile.originalname)
        await filesUpload(bucket, graderInputFile, containerAutoGrader, filename)
        containerAutoGrader.graderFile = filename
    }

    if (makefileInputFile) {
        const bucket: string = 'makefiles'
        const makefileFilename: string = generateFilename(makefileInputFile.originalname)
        await filesUpload(bucket, makefileInputFile, containerAutoGrader, makefileFilename)
        containerAutoGrader.makefileFile = makefileFilename
    }

    const { id, assignmentId, graderFile, makefileFile, autogradingImage, timeout } = containerAutoGrader
    return await connect().update(id, { assignmentId, graderFile, makefileFile, autogradingImage, timeout })
}

export async function _delete(id: number) {
  return await connect().softDelete({ id, deletedAt: IsNull() })
}

export async function retrieve(id: number) {
  return await connect().findOne({ id, deletedAt: IsNull() })
}

export async function list() {
  return await connect().find({ deletedAt: IsNull() })
}

//Currently only used in grader.service.ts, not yet defined in router
export async function listByAssignmentId(assignmentId: number) {
  if (!assignmentId) throw new Error('Missing AssignmentId')
  return await connect().find({ assignmentId: assignmentId, deletedAt: IsNull() })
}

export default {
  create,
  retrieve,
  update,
  _delete,
  list,
  listByAssignmentId,
}