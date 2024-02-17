import { getRepository, IsNull } from 'typeorm'
import NonContainerAutoGraderModel from './nonContainerAutoGrader.model'
import { NonContainerAutoGrader } from 'devu-shared-modules'

const connect = () => getRepository(NonContainerAutoGraderModel)

export async function create(nonContainerQuestion: NonContainerAutoGrader) {
  return await connect().save(nonContainerQuestion)
}

export async function update(nonContainerQuestion: NonContainerAutoGrader) {
  const { id, question, score, correctString } = nonContainerQuestion
  if (!id) throw new Error('Missing Id')

  return await connect().update(id, { score, question, correctString })
}

export async function _delete(id: number) {
  return await connect().softDelete({ id, deletedAt: IsNull() })
}

export async function retrieve(id: number) {
  return await connect().findOne({ id, deletedAt: IsNull() })
}

// Retrieve all the nonContainerQuestions linked to a particular assignment by assignmentId
export async function listByAssignmentId(assignmentId: number) {
  if (!assignmentId) throw new Error('Missing AssignmentId')
  return await connect().find({ assignmentId: assignmentId, deletedAt: IsNull() })
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
  listByAssignmentId,
}
