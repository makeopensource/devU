import {getRepository, IsNull} from 'typeorm'

import CategoryScoreModel from './categoryScore.model'

import {CategoryScore} from 'devu-shared-modules'

const connect = () => getRepository(CategoryScoreModel)

export async function create(categoryScore: CategoryScore) {
    return await connect().save(categoryScore)
}

export async function update(categoryScore: CategoryScore) {
    const {id, courseId, userId, categoryId, score} = categoryScore

    if (!id) throw new Error('Missing Id')

    return await connect().update(id, {courseId, userId, categoryId, score})
}

export async function _delete(id: number) {
    return await connect().softDelete({id, deletedAt: IsNull()})
}

export async function retrieve(id: number) {
    return await connect().findOne({id, deletedAt: IsNull()})
}

// Retrieve all the categoryScores linked to a particular category (TODO: This endpoint doesn't have a path)
// export async function listByCategory(categoryId: number) {
//   return await connect().find({ categoryId: categoryId, deletedAt: IsNull() })


export async function list() {
    return await connect().find({deletedAt: IsNull()})
}

export async function listByCourse(courseId: number) {
    return await connect().find({courseId, deletedAt: IsNull()})
}

export default {
    create,
    retrieve,
    update,
    _delete,
    listByCourse,
    list,
}
