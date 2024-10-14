import { IsNull } from 'typeorm'
import { dataSource } from '../../database'

import AssignmentModel from './assignment.model'

import { Assignment } from 'devu-shared-modules'

const connect = () => dataSource.getRepository(AssignmentModel)

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
    attachmentsHashes,
    attachmentsFilenames,
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
    attachmentsHashes,
    attachmentsFilenames
  })
}

export async function _delete(id: number) {
  return await connect().softDelete({ id, deletedAt: IsNull() })
}

export async function retrieve(id: number, courseId: number) {
  return await connect().findOneBy({ id: id, courseId: courseId, deletedAt: IsNull() })
}

export async function list() {
  return await connect().findBy({ deletedAt: IsNull() })
}

export async function listByCourse(courseId: number) {
  return await connect().findBy({ courseId: courseId, deletedAt: IsNull() })
}

export async function listByCourseReleased(courseId: number) {
  // TODO: filter by start date after current time
  return await connect().findBy({ courseId: courseId, deletedAt: IsNull() })
}

export async function isReleased(id: number) {
  const assignment = await connect().findOneBy({ id, deletedAt: IsNull() })

  if (!assignment) {
    return false
  }

  const startDate = assignment?.startDate
  const currentDate = new Date(Date.now())

  return startDate && startDate < currentDate
}

export default {
  create,
  retrieve,
  update,
  _delete,
  list,
  listByCourse,
  listByCourseReleased,
  isReleased,
}
