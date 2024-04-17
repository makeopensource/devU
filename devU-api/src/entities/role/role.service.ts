import {getRepository, IsNull} from 'typeorm'

import {Role as RoleType} from 'devu-shared-modules'

import Role from './role.model'
import Defaults from './role.defaults'

const connect = () => getRepository(Role)

export async function create(role: RoleType) {
    return await connect().save(role)
}

export async function update(role: RoleType) {
    const {id, name, assignmentViewAll, assignmentEditAll, assignmentViewReleased, courseEdit, courseViewAll, enrolled, roleEditAll, roleViewAll, roleViewSelf, scoresEditAll, scoresViewAll, scoresViewSelfReleased, submissionChangeState, submissionCreateAll, submissionCreateSelf, submissionViewAll, userCourseEditAll} = role

    if (!id) throw new Error('Missing Id')

    return await connect().update(id, {name, assignmentViewAll, assignmentEditAll, assignmentViewReleased, courseEdit, courseViewAll, enrolled, roleEditAll, roleViewAll, roleViewSelf, scoresEditAll, scoresViewAll, scoresViewSelfReleased, submissionChangeState, submissionCreateAll, submissionCreateSelf, submissionViewAll, userCourseEditAll})
}

export async function _delete(id: number) {
    return await connect().softDelete({id, deletedAt: IsNull()})
}

export async function retrieve(id: number) {
    return await connect().findOne({id, deletedAt: IsNull()})
}

export async function retrieveByCourseAndName(courseId: number, name: string) {
    return await connect().findOne({'courseId': courseId, 'name': name, deletedAt: IsNull()})
}


export function retrieveDefaultByName(name: string) {
    return Defaults.get(name)
}

export async function listAll() {
    return await connect().find({deletedAt: IsNull()})
}

export async function listByCourse(courseId: number) {
    return await connect().find({'courseId': courseId, deletedAt: IsNull()})
}

export default {
    create,
    retrieve,
    retrieveByCourseAndName,
    retrieveDefaultByName,
    update,
    _delete,
    listAll,
    listByCourse,
}
