import { getRepository, IsNull } from 'typeorm'

import CategoryScoreModel from '../model/categoryScore.model'

import { CategoryScore } from 'devu-shared-modules'

const connect = () => getRepository(CategoryScoreModel)

export async function create(categoryScore: CategoryScore) {
  return await connect().save(categoryScore)
}

export async function update(categoryScore: CategoryScore) {
  const { id, courseId, userId, category, score, letterGrade } = categoryScore

  if (!id) throw new Error('Missing Id')

  return await connect().update(id, { courseId, userId, category, score, letterGrade })
}

export async function _delete(id: number) {
  return await connect().softDelete({ id, deletedAt: IsNull() })
}

export async function retrieve(id: number) {
  return await connect().findOne({ id, deletedAt: IsNull() })
}

// Retrieve all the categoryScores linked to a particular category
export async function list(category: string) {
  return await connect().find({ category, deletedAt: IsNull() })
}

export default {
  create,
  retrieve,
  update,
  _delete,
  list,
}
