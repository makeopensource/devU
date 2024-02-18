import { getRepository, IsNull } from 'typeorm'

import CategoryModel from './category.model'

import { Category } from 'devu-shared-modules'

const connect = () => getRepository(CategoryModel)

export async function create(category: Category) {
  return await connect().save(category)
}

export async function update(category: Category) {
  const { id, name } = category
  if (!id) throw new Error('Missing Id')
  return await connect().update(id, { name })
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