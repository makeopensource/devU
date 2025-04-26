import { IsNull } from 'typeorm'
import { dataSource } from '../../database'

import AssignmentProblemModel from './assignmentProblem.model'

import { AssignmentProblem } from 'devu-shared-modules'

const connect = () => dataSource.getRepository(AssignmentProblemModel)

export async function update(assignmentProblem: AssignmentProblem) {
  const { id, assignmentId, problemName, maxScore } = assignmentProblem
  if (!id) throw new Error('Missing Id')
  return await connect().update(id, { assignmentId, problemName, maxScore })
}

export async function _delete(id: number) {
  return await connect().softDelete({ id, deletedAt: IsNull() })
}

export async function retrieve(id: number) {
  return await connect().findOneBy({ id, deletedAt: IsNull() })
}

// Retrieve all the assignmentProblems linked to a particular assignment by assignmentId
export async function list(assignmentId: number) {
  return await connect().findBy({ assignmentId: assignmentId, deletedAt: IsNull() })
}

export async function create(
  assignmentId: number,
  problemName: string,
  maxScore: number,
  metadata?: any,
) {
  const assignmentProblem = <AssignmentProblemModel>{
    assignmentId: assignmentId,
    problemName: problemName,
    maxScore: maxScore,
    metadata: metadata,
  }

  return await connect().save(assignmentProblem)
}

export default {
  retrieve,
  update,
  _delete,
  list,
  create,
}
