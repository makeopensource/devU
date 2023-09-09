import { UpdateResult } from 'typeorm'
// import * as Multer from 'multer'

import { CodeAssignment } from 'devu-shared-modules'

import controller from '../codeAssignment.controller'

import CodeAssignmentModel from '../../model/codeAssignment.model'

import CodeAssignmentService from '../../services/codeAssignment.service'

import { serialize } from '../../utils/serializer/codeAssignment.serializer'

import Testing from '../../utils/testing.utils'
import { GenericResponse, NotFound, Updated } from '../../utils/apiResponse.utils'

// Testing Globals
let req: any
let res: any
let next: any

let mockedCodeAssignments: CodeAssignmentModel[]
let mockedCodeAssignment: CodeAssignmentModel
let expectedResults: CodeAssignment[]
let expectedResult: CodeAssignment
let expectedError: Error

let expectedDbResult: UpdateResult

describe('CodeAssignmentController', () => {
  beforeEach(() => {
    req = Testing.fakeRequest()
    res = Testing.fakeResponse()
    next = Testing.fakeNext()

    mockedCodeAssignments = Testing.generateTypeOrmArray(CodeAssignmentModel, 3)
    mockedCodeAssignment = Testing.generateTypeOrm(CodeAssignmentModel)

    expectedResults = mockedCodeAssignments.map(serialize)
    expectedResult = serialize(mockedCodeAssignment)
    expectedError = new Error('Expected Error')

    expectedDbResult = {} as UpdateResult
  })

  describe('GET - /code-assignments', () => {
    describe('200 - Ok', () => {
      beforeEach(async () => {
        CodeAssignmentService.list = jest.fn().mockImplementation(() => Promise.resolve(mockedCodeAssignments))
        await controller.get(req, res, next) // what we're testing
      })

      test('Returns list of codeAssignments', () => expect(res.json).toBeCalledWith(expectedResults))
      test('Status code is 200', () => expect(res.status).toBeCalledWith(200))
    })

    describe('400 - Bad request', () => {
      test('Next called with expected error', async () => {
        CodeAssignmentService.list = jest.fn().mockImplementation(() => Promise.reject(expectedError))

        try {
          await controller.get(req, res, next)

          fail('Expected test to throw')
        } catch {
          expect(next).toBeCalledWith(expectedError)
        }
      })
    })
  })

  describe('GET - /code-assignments/:id', () => {
    describe('200 - Ok', () => {
      beforeEach(async () => {
        CodeAssignmentService.retrieve = jest.fn().mockImplementation(() => Promise.resolve(mockedCodeAssignment))
        await controller.detail(req, res, next)
      })

      test('Returns expected code assignment', () => expect(res.json).toBeCalledWith(expectedResult))
      test('Status code is 200', () => expect(res.status).toBeCalledWith(200))
    })

    describe('404 - Not Found', () => {
      beforeEach(async () => {
        CodeAssignmentService.retrieve = jest.fn().mockImplementation(() => Promise.resolve()) // No results
        await controller.detail(req, res, next)
      })

      test('Status code is 404 on missing codeAssignment', () => expect(res.status).toBeCalledWith(404))
      test('Responds with NotFound on missing codeAssignment', () => expect(res.json).toBeCalledWith(NotFound))
      test('Next not called on missing codeAssignment', () => expect(next).toBeCalledTimes(0))
    })

    describe('400 - Bad Request', () => {
      test('Next called with expected error', async () => {
        CodeAssignmentService.retrieve = jest.fn().mockImplementation(() => Promise.reject(expectedError))

        try {
          await controller.detail(req, res, next)

          fail('Expected test to throw')
        } catch {
          expect(next).toBeCalledWith(expectedError)
        }
      })
    })
  })

  describe('POST - /code-assignments', () => {
    describe('201 - Created', () => {
      beforeEach(async () => {
        CodeAssignmentService.create = jest.fn().mockImplementation(() => Promise.resolve(mockedCodeAssignment))
        req.file = { stream: 'content' }
        await controller.post(req, res, next)
      })

      test('Returns expected code assignment', () => expect(res.json).toBeCalledWith(expectedResult))
      test('Status code is 201', () => expect(res.status).toBeCalledWith(201))
    })

    describe('400 - Bad Request', () => {
      beforeEach(async () => {
        CodeAssignmentService.create = jest.fn().mockImplementation(() => Promise.reject(expectedError))
        req.file = { stream: 'content' }

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

  describe('PUT - /code-assignments/:id', () => {
    describe('200 - Ok', () => {
      beforeEach(async () => {
        expectedDbResult.affected = 1 // mocking service return shape
        CodeAssignmentService.update = jest.fn().mockImplementation(() => Promise.resolve(expectedDbResult))
        req.file = { stream: 'content' }
        await controller.put(req, res, next)
      })

      test('Status code is 200', () => expect(res.status).toBeCalledWith(200))
      test('Returns Updated message', () => expect(res.json).toBeCalledWith(Updated))
      test('Next is not called', () => expect(next).toHaveBeenCalledTimes(0))
    })

    describe('404 - Not Found', () => {
      beforeEach(async () => {
        expectedDbResult.affected = 0 // No records affected in db
        CodeAssignmentService.update = jest.fn().mockImplementation(() => Promise.resolve(expectedDbResult))
        req.file = { stream: 'content' }
        await controller.put(req, res, next)
      })

      test('Status code is 404', () => expect(res.status).toBeCalledWith(404))
      test('Returns Not found message', () => expect(res.json).toBeCalledWith(NotFound))
      test('Next is not called', () => expect(next).toHaveBeenCalledTimes(0))
    })

    describe('400 - Bad Request', () => {
      beforeEach(async () => {
        CodeAssignmentService.update = jest.fn().mockImplementation(() => Promise.reject(expectedError))
        req.file = { stream: 'content' }
        await controller.put(req, res, next)
      })

      test('Next is called with error', () => expect(next).toBeCalledWith(expectedError))
    })
  })

  describe('DELETE - /code-assignments/:id', () => {
    describe('204 - No Content', () => {
      beforeEach(async () => {
        expectedDbResult.affected = 1
        CodeAssignmentService._delete = jest.fn().mockImplementation(() => Promise.resolve(expectedDbResult))
        await controller._delete(req, res, next)
      })

      test('Status code is 204', () => expect(res.status).toBeCalledWith(204))
      test('Response to have no content', () => expect(res.send).toBeCalledWith())
      test('Next not called', () => expect(next).toBeCalledTimes(0))
    })

    describe('404 - Not Found', () => {
      beforeEach(async () => {
        expectedDbResult.affected = 0
        CodeAssignmentService._delete = jest.fn().mockImplementation(() => Promise.resolve(expectedDbResult))
        await controller._delete(req, res, next)
      })

      test('Status code is 404', () => expect(res.status).toBeCalledWith(404))
      test('Response to have no content', () => expect(res.json).toBeCalledWith(NotFound))
      test('Next not called', () => expect(next).toBeCalledTimes(0))
    })

    describe('400 - Bad Request', () => {
      beforeEach(async () => {
        CodeAssignmentService._delete = jest.fn().mockImplementation(() => Promise.reject(expectedError))
        await controller._delete(req, res, next)
      })

      test('Next called with expected error', () => expect(next).toBeCalledWith(expectedError))
    })
  })
})
