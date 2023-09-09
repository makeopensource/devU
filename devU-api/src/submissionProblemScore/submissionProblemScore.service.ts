import { getRepository, IsNull } from 'typeorm'

import { SubmissionProblemScore as SubmissionProblemScoreModel } from 'devu-shared-modules'

import SubmissionProblemScore from '../model/submissionProblemScore.model'

const connect = () => getRepository(SubmissionProblemScore)

export async function create(submissionProblemScore: SubmissionProblemScoreModel) {
  return await connect().save(submissionProblemScore)
}

export async function update(submissionProblemScore: SubmissionProblemScoreModel) {
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
