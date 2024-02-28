import { getRepository, IsNull } from 'typeorm'

import { SubmissionProblemScore } from 'devu-shared-modules'

import SubmissionProblemScoreModel from './submissionProblemScore.model'

const connect = () => getRepository(SubmissionProblemScoreModel)

export async function create(submissionProblemScore: SubmissionProblemScore) {
  return await connect().save(submissionProblemScore)
}

export async function update(submissionProblemScore: SubmissionProblemScore) {
  const { id, submissionId, assignmentProblemId, score, feedback, releasedAt } = submissionProblemScore

  if (!id) throw new Error('Missing Id')

  return await connect().update(id, { submissionId, assignmentProblemId, score, feedback, releasedAt })
}

export async function _delete(id: number) {
  return await connect().softDelete({ id, deletedAt: IsNull() })
}

export async function retrieve(id: number) {
  return await connect().findOne({ id, deletedAt: IsNull() })
}

export async function list(submissionId: number) {
  return await connect().find({ submissionId: submissionId, deletedAt: IsNull() })
}

export default {
  create,
  retrieve,
  update,
  _delete,
  list,
}
