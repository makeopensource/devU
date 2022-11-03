import { serialize } from '../user.serializer'

import UserModel from '../../../model/user.model'

import Testing from '../../testing.utils'

let mockUser: UserModel

describe('User Serializer', () => {
  beforeEach(() => {
    mockUser = Testing.generateTypeOrm<UserModel>(UserModel)
  })

  test('CreatedAt and ModifiedAt are ISO strings for all users', () => {
    const serializedUser = serialize(mockUser)

    expect(serializedUser.updatedAt).toEqual(mockUser.updatedAt.toISOString())
    expect(serializedUser.createdAt).toEqual(mockUser.updatedAt.toISOString())
  })
})
