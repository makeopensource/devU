import { getRepository, IsNull } from 'typeorm'

import SubmissionModel from '../model/submission.model'

import { Submission } from 'devu-shared-modules'

const connect = () => getRepository(SubmissionModel)

export async function create(submission: Submission) {
  return await connect().save(submission)
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
  _delete,
  list,
}
