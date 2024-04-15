import { getRepository, IsNull } from 'typeorm'

import { Role as RoleType } from 'devu-shared-modules'

import Role from './role.model'

const connect = () => getRepository(Role)

export async function create(role: RoleType) {
  return await connect().save(role)
}

export async function update(role: RoleType) {
  const { id, level, dropped } = role

  if (!id) throw new Error('Missing Id')

  return await connect().update(id, { level, dropped })
}

export async function _delete(id: number) {
  return await connect().softDelete({ id, deletedAt: IsNull() })
}

export async function retrieve(id: number) {
  return await connect().findOne({id, deletedAt: IsNull()})
}

export async function retrieveByCourseAndName(courseId: number, name: string) {
  return await connect().findOne({ 'courseId': courseId, 'name': name, deletedAt: IsNull() })
}

export async function list(userId: number) {
  return await connect().find({ userId, deletedAt: IsNull() })
}
export async function listAll() {
  return await connect().find({ deletedAt: IsNull() })
}

export async function listByCourse(courseId: number) {
  return await connect().find({ 'courseId': courseId, deletedAt: IsNull() })
}

export default {
  create,
  retrieve,
  retrieveByCourseAndName,
  update,
  _delete,
  list,
  listAll,
  listByCourse,
}
