import { getRepository, IsNull } from 'typeorm'

import CourseModel from './course.model'

import { Course } from 'devu-shared-modules'

const connect = () => getRepository(CourseModel)

export async function create(course: Course) {
  return await connect().save(course)
}

export async function update(course: Course) {
  const { id, name, semester, number, startDate, endDate } = course
  if (!id) throw new Error('Missing Id')
  return await connect().update(id, { name, semester, number, startDate, endDate })
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
