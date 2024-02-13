import { getRepository, IsNull } from 'typeorm'

import { ContainerAutoGrader } from '../../../devu-shared/src'

import ContainerAutoGraderModel from './containerAutoGrader.model'
import { minioClient, BucketNames } from '../fileStorage'

const connect = () => getRepository(ContainerAutoGraderModel)

function assignmentGraderFileRecordName(containerAutoGrader: ContainerAutoGrader) {
  if (!containerAutoGrader.id) throw new Error('Missing Id')
  return containerAutoGrader.id.toString()
}

export async function create(containerAutoGrader: ContainerAutoGrader, graderInputFile: Buffer, makefileInputFile: Buffer | null = null) {
    containerAutoGrader.graderFilename = "Temp value. You'll see this if the file upload to MinIO fails"
    const newContainerAutoGrader = await connect().save(containerAutoGrader)
    const graderFileRecordName: string = assignmentGraderFileRecordName(newContainerAutoGrader)

    /*
      * For the minioClient.putObject method, I am not sure how the objectName is, but it seems like
      * the objectName is the id of the containerAutoGrader.(inherits from the codeAssignment.service.ts file),
      * but I am not sure if the makefile should also use the same objectName as the grader. Marking this 
      * for review. Same with the update method.
    */
    await minioClient.putObject(BucketNames.GRADERS, graderFileRecordName, graderInputFile)
    newContainerAutoGrader.graderFilename = graderFileRecordName

    if (makefileInputFile) {
        await minioClient.putObject(BucketNames.MAKEFILES, 'makefile', makefileInputFile)
        newContainerAutoGrader.makefileFilename = 'makefile'
    }

    const { id, assignmentId, graderFilename, makefileFilename, autogradingImage, timeout } = newContainerAutoGrader

    await connect().update(id, { assignmentId, graderFilename, makefileFilename, autogradingImage, timeout })

    return newContainerAutoGrader
}

export async function update(containerAutoGrader: ContainerAutoGrader, graderInputFile: Buffer, makefileInputFile: Buffer | null = null) {
    const graderFileRecordName: string = assignmentGraderFileRecordName(containerAutoGrader)

    await minioClient.putObject(BucketNames.GRADERS, graderFileRecordName, graderInputFile)
    containerAutoGrader.graderFilename = graderFileRecordName

    if (makefileInputFile) {
        await minioClient.putObject(BucketNames.MAKEFILES, 'makefile', makefileInputFile)
        containerAutoGrader.makefileFilename = 'makefile'
    }

    const { id, assignmentId, graderFilename, makefileFilename, autogradingImage, timeout } = containerAutoGrader
    return await connect().update(id, { assignmentId, graderFilename, makefileFilename, autogradingImage, timeout })
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