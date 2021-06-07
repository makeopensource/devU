import serializer from '../users.serializer'

import User from '../../../model/users.model'

import Testing from '../../../utils/testing.utils'
import { Unknown } from '../../../utils/apiResponse.utils'

// Testing Globals
let req
let res
let next

let expectedResults: User[]
let expectedResult: User
let expectedStatusCode: number

describe('User Serializer', () => {
  beforeEach(() => {
    req = Testing.fakeRequest()
    res = Testing.fakeResponse()
    next = Testing.fakeNext()

    expectedResults = Testing.generateTypeOrmArray<User>(User, 3)
    expectedResult = Testing.generateTypeOrm<User>(User)

    expectedResult.createdAt = new Date()
    expectedResult.updatedAt = new Date()

    expectedStatusCode = 200
  })

  describe('Missing user and users', () => {
    // by default fakeReq has no user || users so we're good to test with the defualts
    beforeEach(() => serializer(req, res, next))

    test('400 without user or users', () => expect(res.status).toBeCalledWith(400))
    test('Unknown request meessage without user or users', () => expect(res.json).toBeCalledWith(Unknown))
    test('Next is not called', () => expect(next).toBeCalledTimes(0))
  })

  describe('Serializing User list (users)', () => {
    beforeEach(() => {
      req.users = expectedResults // user list
      req.statusCode = expectedStatusCode
      serializer(req, res, next)
    })

    test('Status code from req', () => expect(res.status).toBeCalledWith(expectedStatusCode))
    test('CreatedAt and ModifiedAt are ISO strings for all users', () => {
      expect(res.json).toBeCalledTimes(1)

      const response = res.json.mock.calls[0][0]

      expect(Array.isArray(response)).toBe(true)

      for (const index in response) {
        const expectedUser = expectedResults[index]
        const serializedUser = response[index]

        expect(serializedUser.updatedAt).toEqual(expectedUser.updatedAt.toISOString())
        expect(serializedUser.createdAt).toEqual(expectedUser.updatedAt.toISOString())
      }
    })
  })

  describe('Serializing User (user)', () => {
    beforeEach(() => {
      req.user = expectedResult // user list
      req.statusCode = expectedStatusCode
      serializer(req, res, next)
    })

    test('Status code from req', () => expect(res.status).toBeCalledWith(expectedStatusCode))
    test('CreatedAt and ModifiedAt are ISO strings', () => {
      expect(res.json).toBeCalledTimes(1)

      const response = res.json.mock.calls[0][0]

      expect(response).toBeDefined()
      expect(response.updatedAt).toEqual(expectedResult.updatedAt.toISOString())
      expect(response.createdAt).toEqual(expectedResult.updatedAt.toISOString())
    })
  })
})
