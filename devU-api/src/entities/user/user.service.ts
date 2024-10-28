import { IsNull } from 'typeorm'
import { dataSource } from '../../database'

import UserModel from './user.model'

import { User } from 'devu-shared-modules'

import UserCourseService from '../userCourse/userCourse.service'

const connect = () => dataSource.getRepository(UserModel)

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
  return await connect().findOneBy({ id, deletedAt: IsNull() })
}

export async function retrieveByEmail(email: string) {
  return await connect().findOneBy({ email: email, deletedAt: IsNull() })
}

export async function list() {
  return await connect().findBy({ deletedAt: IsNull() })
}

export async function listByCourse(courseId: number, userRole?: string) {
  const userCourses = await UserCourseService.listByCourse(courseId)
  const userPromises = userCourses
    // .filter(uc => !userRole || uc.role === userRole)
    .map(uc => connect().findOneBy({ id: uc.userId, deletedAt: IsNull() }))
  return await Promise.all(userPromises)
}

export async function ensure(userInfo: User) {
  const { externalId, email } = userInfo

  const user = await connect().findOneBy({ externalId })

  if (user) return { user, isNewUser: false }

  const newUser = await create({ email, externalId })

  return { user: newUser, isNewUser: true }
}

export default {
  create,
  retrieve,
  retrieveByEmail,
  update,
  _delete,
  list,
  ensure,
  listByCourse,
}
