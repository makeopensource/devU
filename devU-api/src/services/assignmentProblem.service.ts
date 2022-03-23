import { getRepository, IsNull } from 'typeorm'

import AssignmentProblemModel from '../model/assignmentProblems.model'

import { AssignmentProblem } from 'devu-shared-modules'

const connect = () => getRepository(AssignmentProblemModel)

export async function create(assignmentProblem: AssignmentProblem) {
  return await connect().save(assignmentProblem)
}

export async function update(assignmentProblem: AssignmentProblem) {
  const { id, assignmentId, problemName, maxScore } = assignmentProblem
  if (!id) throw new Error('Missing Id')
  return await connect().update(id, { assignmentId, problemName, maxScore })
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
