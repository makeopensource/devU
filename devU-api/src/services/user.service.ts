import { getRepository, IsNull } from 'typeorm'

import UserModel from '../model/users.model'

import { User } from 'devu-shared-modules'

const connect = () => getRepository(UserModel)

export async function create(user: User) {
  return await connect().save(user)
}

export async function update(user: User) {
  const { id, preferredName } = user

  if (!id) throw new Error('Missing Id')

  return await connect().update(id, { preferredName })
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

export async function ensure(userInfo: User) {
  const { externalId, email } = userInfo

  const user = await connect().findOne({ externalId })

  if (user) return { user, isNewUser: false }

  const newUser = await create({ email, externalId })

  return { user: newUser, isNewUser: true }
}

export default {
  create,
  retrieve,
  update,
  _delete,
  list,
  ensure,
}
