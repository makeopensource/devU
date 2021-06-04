import { getRepository } from 'typeorm'

import User from '../model/users.model'
import UserType from '../shared/types/user.type'

const connect = () => getRepository(User)

export async function create(user: UserType) {
  return await connect().save(user)
}

export async function update(user: UserType) {
  const { id, email, schoolId, preferredName } = user
  return await connect().update(id, { email, schoolId, preferredName })
}

export async function _delete(id: number) {
  return await connect().softDelete({ id, deletedAt: null })
}

export async function retrieve(id: number) {
  return await connect().findOne({ id, deletedAt: null })
}

export async function list() {
  return await connect().find({ deletedAt: null })
}

export default {
  create,
  retrieve,
  update,
  _delete,
  list,
}
