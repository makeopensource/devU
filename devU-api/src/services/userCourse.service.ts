import { getRepository, IsNull } from 'typeorm'

import { UserCourse as UserCourseType } from 'devu-shared-modules'

import UserCourse from '../model/userCourse.model'

const connect = () => getRepository(UserCourse)

export async function create(userCourse: UserCourseType) {
  return await connect().save(userCourse)
}

export async function update(userCourse: UserCourseType) {
  const { id, level, dropped } = userCourse

  if (!id) throw new Error('Missing Id')

  return await connect().update(id, { level, dropped })
}

export async function _delete(id: number) {
  return await connect().softDelete({ id, deletedAt: IsNull() })
}

export async function retrieve(id: number) {
  return await connect().findOne({ id, deletedAt: IsNull() })
}

export async function list(userId: number) {
  return await connect().find({ deletedAt: IsNull(), userId })
}

export default {
  create,
  retrieve,
  update,
  _delete,
  list,
}
