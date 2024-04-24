import { getRepository, IsNull } from 'typeorm'

import { UserCourse as UserCourseType } from 'devu-shared-modules'

import UserCourse from './userCourse.model'

const connect = () => getRepository(UserCourse)

export async function create(userCourse: UserCourseType) {
    const userId = userCourse.userId
    const hasEnrolled = await connect().findOne({userId, courseId: userCourse.courseId})
    if (hasEnrolled) throw new Error('User already enrolled in course')
  return await connect().save(userCourse)
}


export async function update(userCourse: UserCourseType, currentUser: number) {
    const {courseId, level, dropped} = userCourse
    if (!courseId) throw new Error('Missing Id')
    const userCourseData = await connect().findOne({courseId, userId: currentUser})
    if (!userCourseData) throw new Error('User not enrolled in course')
    userCourseData.level = level
    userCourseData.dropped = dropped
    return await connect().update(userCourse.id, userCourseData)
}

export async function _delete(courseId: number, userId: number) {
    const userCourse = await connect().findOne({courseId, userId})
    if (!userCourse) throw new Error('User Not Found in Course')
    return await connect().softDelete({courseId, userId, deletedAt: IsNull()})
}

export async function retrieve(id: number) {
  return await connect().findOne({ id, deletedAt: IsNull() })
}

export async function retrieveByCourseAndUser(courseId: number, userId: number) {
  return await connect().findOne({ courseId: courseId, userId: userId, deletedAt: IsNull() })
}

export async function list(userId: number) {
  // TODO: look into/test this
  return await connect().find({ userId, deletedAt: IsNull() })
}
export async function listAll() {
  return await connect().find({ deletedAt: IsNull() })
}

export async function listByCourse(courseId: number) {
  // TODO: look into/test this
  return await connect().find({ courseId, deletedAt: IsNull() })
}

export async function checking(userId: number, courseId: number) {
    return await connect().findOne({userId, courseId, dropped: false, deletedAt: IsNull()})
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
    checking
}
