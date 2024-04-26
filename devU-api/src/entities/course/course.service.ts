import { getRepository, IsNull } from 'typeorm'

import CourseModel from './course.model'

import { Course } from 'devu-shared-modules'
import { initializeMinio } from '../../fileStorage'
import UserCourseService from "../userCourse/userCourse.service";

const connect = () => getRepository(CourseModel)

export async function create(course: Course) {
  const output = await connect().save(course)
  const bucketName = (course.number + course.semester + course.id).replace(/ /g, '-').toLowerCase()
  await initializeMinio(bucketName)
  return output
}

export async function update(course: Course) {
  const { id, name, semester, number, startDate, endDate } = course
  if (!id) throw new Error('Missing Id')
  return await connect().update(id, { name, semester, number, startDate, endDate })
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
export async function listByUser(userId: number) {
  const userCourses = await UserCourseService.listByUser(userId)
  const courses: CourseModel[] = []
  // TODO: There is a more efficient way to do this than a query in a loop.. I'm too rusty on SQL to think of it rn
  for(const userCourse of userCourses) {
    const course = await connect().findOne({id: userCourse.courseId, deletedAt: IsNull()})
    if(course){
    courses.push()
      }
  }
  return courses
}

export default {
  create,
  retrieve,
  update,
  _delete,
  list,
  listByUser,
}
