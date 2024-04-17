import { getRepository, IsNull } from 'typeorm'

import { UserCourse as UserCourseType } from 'devu-shared-modules'

import UserCourse from './userCourse.model'

const connect = () => getRepository(UserCourse)

export async function create(userCourse: UserCourseType) {
  return await connect().save(userCourse)
}

export async function update(userCourse: UserCourseType) {
  const { id, role, dropped } = userCourse

  if (!id) throw new Error('Missing Id')

  return await connect().update(id, { role: role, dropped })
}

export async function _delete(id: number) {
  return await connect().softDelete({ id, deletedAt: IsNull() })
}

export async function retrieve(id: number) {
  return await connect().findOne({ id, deletedAt: IsNull() })
}

export async function retrieveByCourseAndUser(courseId: number, userId: number) {
  return await connect().findOne({ 'courseId': courseId, 'userId': userId, deletedAt: IsNull() })
}

export async function list(userId: number) { // TODO: look into/test this
  return await connect().find({ userId, deletedAt: IsNull() })
}
export async function listAll() {
  return await connect().find({ deletedAt: IsNull() })
}

export async function listByCourse(courseId: number) { // TODO: look into/test this
  return await connect().find({ courseId, deletedAt: IsNull() })
}

export default {
  create,
  retrieve,
  retrieveByCourseAndUser,
  update,
  _delete,
  list,
  listAll,
  listByCourse,
}
