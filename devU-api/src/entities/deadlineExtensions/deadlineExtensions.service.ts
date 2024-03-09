import { getRepository, IsNull } from 'typeorm'

import DeadlineExtension from './deadlineExtensions.model'

import { DeadlineExtensions } from 'devu-shared-modules'

const connect = () => getRepository(DeadlineExtension)

export async function create(assignment: DeadlineExtensions) {
  return await connect().save(assignment)
}

export async function update(assignment: DeadlineExtensions) {
  const {
    id,
    userId,
    creatorId,
    deadlineDate,
    assignmentId,
    newEndDate,
    newStartDate,
  } = assignment

  if (!id) throw new Error('Missing Id')

  return await connect().update(id, {
    creatorId,
    userId,
    deadlineDate,
    assignmentId,
    newStartDate,
    newEndDate,
  })
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
