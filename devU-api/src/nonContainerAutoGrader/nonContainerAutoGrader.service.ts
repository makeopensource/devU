import { getRepository, IsNull } from 'typeorm'
import NonContainerAutoGraderModel from './nonContainerAutoGrader.model'
import { nonContainerAutoGrader } from '../../../devu-shared/devu-shared-modules'

const connect = () => getRepository(NonContainerAutoGraderModel)

export async function create(nonContainerQuestion: nonContainerAutoGrader) {
  return await connect().save(nonContainerQuestion)
}

export async function update(nonContainerQuestion: nonContainerAutoGrader) {
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

// Retrieve all the assignmentProblems linked to a particular assignment by assignmentId
export async function list(assignmentId: number) {
  return await connect().find({ assignmentId: assignmentId, deletedAt: IsNull() })
}

export default {
  create,
  retrieve,
  update,
  _delete,
  list,
}
