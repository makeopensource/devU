import { getRepository, IsNull } from 'typeorm'

import { ContainerAutoGrader } from 'devu-shared-modules'

import ContainerAutoGraderModel from './containerAutoGrader.model'
import { BucketNames, minioClient } from '../../fileStorage'

const connect = () => getRepository(ContainerAutoGraderModel)

function assignmentGraderFileRecordName(containerAutoGrader: ContainerAutoGrader) {
  if (!containerAutoGrader.id) throw new Error('Missing Id')
  return containerAutoGrader.id.toString()
}

export async function create(containerAutoGrader: ContainerAutoGrader, graderInputFile: Buffer, makefileInputFile: Buffer | null = null) {
    containerAutoGrader.graderFile = "Temp value. You'll see this if the file upload to MinIO fails"
    const newContainerAutoGrader = await connect().save(containerAutoGrader)
    const FileRecordName: string = assignmentGraderFileRecordName(newContainerAutoGrader)

    /*
      * For the minioClient.putObject method, I am not sure how the objectName is, but it seems like
      * the objectName is the id of the containerAutoGrader.(inherits from the codeAssignment.service.ts file),
      * but I am not sure if the makefile should also use the same objectName as the grader. Marking this 
      * for review. Same with the update method.
    */
    await minioClient.putObject(BucketNames.GRADERS, FileRecordName, graderInputFile)
    newContainerAutoGrader.graderFile = FileRecordName

    if (makefileInputFile) {
        await minioClient.putObject(BucketNames.MAKEFILES, FileRecordName, makefileInputFile)
        newContainerAutoGrader.makefileFile = FileRecordName
    }

    const { id, assignmentId, graderFile, makefileFile, autogradingImage, timeout } = newContainerAutoGrader

    await connect().update(id, { assignmentId, graderFile, makefileFile, autogradingImage, timeout })

    return newContainerAutoGrader
}

export async function update(containerAutoGrader: ContainerAutoGrader, graderInputFile: Buffer, makefileInputFile: Buffer | null = null) {
    if (!containerAutoGrader.id) throw new Error('Missing Id')
    const FileRecordName: string = assignmentGraderFileRecordName(containerAutoGrader)

    await minioClient.putObject(BucketNames.GRADERS, FileRecordName, graderInputFile)
    containerAutoGrader.graderFile = FileRecordName

    if (makefileInputFile) {
        await minioClient.putObject(BucketNames.MAKEFILES, FileRecordName, makefileInputFile)
        containerAutoGrader.makefileFile = FileRecordName
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

export default {
  create,
  retrieve,
  update,
  _delete,
  list,
}