import { getRepository, IsNull } from 'typeorm'

import { CodeAssignment } from 'devu-shared-modules'

import CodeAssignmentsModel from './codeAssignment.model'
import { minioClient, BucketNames } from '../fileStorage'

const connect = () => getRepository(CodeAssignmentsModel)

function assignmentGraderFileRecordName(codeAssignment: CodeAssignment) {
  if (!codeAssignment.id) throw new Error('Missing Id')
  return codeAssignment.id.toString()
}

export async function create(codeAssignment: CodeAssignment, graderFile: Buffer) {
  // I hope someone has a better idea for this function. The issue is with the grader file record naming.
  // The name should depend on the codeAssignmentId to ensure there are no name conflicts, but we don't
  // get that id until a record is created. So I create a record, grab the id and use it for the file record
  // name, save the file, then update the record with the filename.
  codeAssignment.grader = "Temp value. You'll see this if the file upload to MinIO fails"
  const newAssignment = await connect().save(codeAssignment)
  const graderFileRecordName: string = assignmentGraderFileRecordName(newAssignment)

  await minioClient.putObject(BucketNames.GRADERS, graderFileRecordName, graderFile)
  newAssignment.grader = graderFileRecordName

  const { id, assignmentId, grader, gradingImage } = newAssignment
  await connect().update(id, { assignmentId, grader, gradingImage })

  return newAssignment
}

export async function update(codeAssignment: CodeAssignment, graderFile: Buffer) {
  if (!codeAssignment.id) throw new Error('Missing Id')

  const graderFileRecordName: string = assignmentGraderFileRecordName(codeAssignment)

  await minioClient.putObject('graders', graderFileRecordName, graderFile)
  codeAssignment.grader = graderFileRecordName

  const { id, assignmentId, grader, gradingImage } = codeAssignment
  return await connect().update(id, { assignmentId, grader, gradingImage })
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
