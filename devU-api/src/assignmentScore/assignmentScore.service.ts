import { getRepository, IsNull } from "typeorm";

import AssignmentScoreModel from '../model/assignmentScore.model'

import { AssignmentScore } from 'devu-shared-modules'

const connect = () => getRepository(AssignmentScoreModel)

export async function create(assignmentScore: AssignmentScore) {
    return await connect().save(assignmentScore)
}

export async function update(assignmentScore: AssignmentScore) {
    const { id, assignmentId, userId, score } = assignmentScore

    if (!id) throw new Error('Missing Id')
    return await connect().update(id, { assignmentId, userId, score})
}

export async function _delete(id: number) {
  return await connect().softDelete({ id, deletedAt: IsNull() })
}

export async function retrieve(id: number) {
  return await connect().findOne({ id, deletedAt: IsNull() })
}

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

