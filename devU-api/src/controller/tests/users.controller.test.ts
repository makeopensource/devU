import { UpdateResult } from 'typeorm'

import controller from '../users.controller'

import User from '../../model/users.model'

import UserService from '../../services/user.service'

import Testing from '../../utils/testing.utils'
import { GenericResponse, NotFound, Updated } from '../../utils/apiResponse.utils'

// Testing Globals
let req
let res
let next

let expectedResults: User[]
let expectedResult: User
let expectedError: Error

let expectedDbResult: UpdateResult

describe('UserController', () => {
  beforeEach(() => {
    req = Testing.fakeRequest()
    res = Testing.fakeResponse()
    next = Testing.fakeNext()

    expectedResults = Testing.generateTypeOrmArray(User, 3)
    expectedResult = Testing.generateTypeOrm(User)
    expectedError = new Error('Expected Error')

    expectedDbResult = {} as UpdateResult
  })

  describe('GET - /users', () => {
    describe('200 - Ok', () => {
      beforeEach(async () => {
        UserService.list = jest.fn().mockImplementation(() => Promise.resolve(expectedResults))
        await controller.get(req, res, next) // what we're testing
      })

      test('Returns list of users', () => expect(req.users).toEqual(expectedResults))
      test('Status code is 200', () => expect(req.statusCode).toEqual(200))
      test('Next called empty', () => expect(next).toBeCalledWith())
    })

    describe('400 - Bad request', () => {
      test('Next called with expected error', async () => {
        UserService.list = jest.fn().mockImplementation(() => Promise.reject(expectedError))

        try {
          await controller.get(req, res, next)

          fail('Expected test to throw')
        } catch {
          expect(next).toBeCalledWith(expectedError)
        }
      })
    })
  })

  describe('GET - /users/:id', () => {
    describe('200 - Ok', () => {
      beforeEach(async () => {
        UserService.retrieve = jest.fn().mockImplementation(() => Promise.resolve(expectedResult))
        await controller.detail(req, res, next)
      })

      test('Returns expected user', () => expect(req.user).toEqual(expectedResult))
      test('Status code is 200', () => expect(req.statusCode).toEqual(200))
      test('Next called empty', () => expect(next).toBeCalledWith())
    })

    describe('404 - Not Found', () => {
      beforeEach(async () => {
        UserService.retrieve = jest.fn().mockImplementation(() => Promise.resolve()) // No results
        await controller.detail(req, res, next)
      })

      test('Status code is 404 on missing user', () => expect(res.status).toBeCalledWith(404))
      test('Responds with NotFound on missing user', () => expect(res.json).toBeCalledWith(NotFound))
      test('Next not called on missing user', () => expect(next).toBeCalledTimes(0))
    })

    describe('400 - Bad Reqeust', () => {
      test('Next called with expected error', async () => {
        UserService.retrieve = jest.fn().mockImplementation(() => Promise.reject(expectedError))

        try {
          await controller.detail(req, res, next)

          fail('Expected test to throw')
        } catch {
          expect(next).toBeCalledWith(expectedError)
        }
      })
    })
  })

  describe('POST - /users/', () => {
    describe('201 - Created', () => {
      beforeEach(async () => {
        UserService.create = jest.fn().mockImplementation(() => Promise.resolve(expectedResult))
        await controller.post(req, res, next)
      })

      test('Resturns expected user', () => expect(req.user).toEqual(expectedResult))
      test('Status code is 201', () => expect(req.statusCode).toEqual(201))
      test('Next called empty', () => expect(next).toBeCalledWith())
    })

    describe('400 - Bad Reqeust', () => {
      beforeEach(async () => {
        UserService.create = jest.fn().mockImplementation(() => Promise.reject(expectedError))

        try {
          await controller.post(req, res, next)

          fail('Expected test to throw')
        } catch {
          // continue to tests
        }
      })

      test('Status code is 400', () => expect(res.status).toBeCalledWith(400))
      test('Responds with generic error', () =>
        expect(res.json).toBeCalledWith(new GenericResponse(expectedError.message)))
      test('Next not called', () => expect(next).toBeCalledTimes(0))
    })
  })

  describe('PUT - /users/:id', () => {
    describe('200 - Ok', () => {
      beforeEach(async () => {
        expectedDbResult.affected = 1 // mocking service return shape
        UserService.update = jest.fn().mockImplementation(() => Promise.resolve(expectedDbResult))
        await controller.put(req, res, next)
      })

      test('Status code is 200', () => expect(res.status).toBeCalledWith(200))
      test('Returns Updated message', () => expect(res.json).toBeCalledWith(Updated))
      test('Next is not called', () => expect(next).toHaveBeenCalledTimes(0))
    })

    describe('404 - Not Found', () => {
      beforeEach(async () => {
        expectedDbResult.affected = 0 // No records affected in db
        UserService.update = jest.fn().mockImplementation(() => Promise.resolve(expectedDbResult))
        await controller.put(req, res, next)
      })

      test('Status code is 404', () => expect(res.status).toBeCalledWith(404))
      test('Returns Not found message', () => expect(res.json).toBeCalledWith(NotFound))
      test('Next is not called', () => expect(next).toHaveBeenCalledTimes(0))
    })

    describe('400 - Bad Request', () => {
      beforeEach(async () => {
        UserService.update = jest.fn().mockImplementation(() => Promise.reject(expectedError))
        await controller.put(req, res, next)
      })

      test('Next is called with error', () => expect(next).toBeCalledWith(expectedError))
    })
  })

  describe('DELETE - /users/:id', () => {
    describe('204 - No Content', () => {
      beforeEach(async () => {
        expectedDbResult.affected = 1
        UserService._delete = jest.fn().mockImplementation(() => Promise.resolve(expectedDbResult))
        await controller._delete(req, res, next)
      })

      test('Status code is 204', () => expect(res.status).toBeCalledWith(204))
      test('Response to have no content', () => expect(res.send).toBeCalledWith())
      test('Next not called', () => expect(next).toBeCalledTimes(0))
    })

    describe('404 - Not Found', () => {
      beforeEach(async () => {
        expectedDbResult.affected = 0
        UserService._delete = jest.fn().mockImplementation(() => Promise.resolve(expectedDbResult))
        await controller._delete(req, res, next)
      })

      test('Status code is 404', () => expect(res.status).toBeCalledWith(404))
      test('Response to have no content', () => expect(res.json).toBeCalledWith(NotFound))
      test('Next not called', () => expect(next).toBeCalledTimes(0))
    })

    describe('400 - Not Found', () => {
      beforeEach(async () => {
        UserService._delete = jest.fn().mockImplementation(() => Promise.reject(expectedError))
        await controller._delete(req, res, next)
      })

      test('Next called with expected error', () => expect(next).toBeCalledWith(expectedError))
    })
  })
})
