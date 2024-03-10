import { getRepository, IsNull } from 'typeorm'

import AssignmentModel from './assignment.model'

import { Assignment } from 'devu-shared-modules'

const connect = () => getRepository(AssignmentModel)

export async function create(assignment: Assignment) {
  return await connect().save(assignment)
}

export async function update(assignment: Assignment) {
  const {
    id,
    name,
    startDate,
    dueDate,
    endDate,
    categoryName,
    description,
    maxFileSize,
    maxSubmissions,
    disableHandins,
  } = assignment

  if (!id) throw new Error('Missing Id')

  return await connect().update(id, {
    name,
    startDate,
    dueDate,
    endDate,
    categoryName,
    description,
    maxFileSize,
    maxSubmissions,
    disableHandins,
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

export async function listByCourse(courseId: number) {
  return await connect().find({ courseId, deletedAt: IsNull() })
}

export default {
  create,
  retrieve,
  update,
  _delete,
  list,
  listByCourse,
}
