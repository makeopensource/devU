import { UpdateResult } from 'typeorm'

import { Submission } from 'devu-shared-modules'

import controller from '../submissions.controller'

import SubmissionModel from '../../model/submissions.model'

import SubmissionService from '../../services/submission.service'

import { serialize } from '../../utils/serializer/submissions.serializer'

import Testing from '../../utils/testing.utils'
import { GenericResponse, NotFound } from '../../utils/apiResponse.utils'

// Testing Globals
let req: any
let res: any
let next: any

let mockedSubmissions: SubmissionModel[]
let mockedSubmission: SubmissionModel
let expectedResults: Submission[]
let expectedResult: Submission
let expectedError: Error

let expectedDbResult: UpdateResult

describe('SubmissionController', () => {
  beforeEach(() => {
    req = Testing.fakeRequest()
    res = Testing.fakeResponse()
    next = Testing.fakeNext()

    mockedSubmissions = Testing.generateTypeOrmArray(SubmissionModel, 3)
    mockedSubmission = Testing.generateTypeOrm(SubmissionModel)

    expectedResults = mockedSubmissions.map(serialize)
    expectedResult = serialize(mockedSubmission)
    expectedError = new Error('Expected Error')

    expectedDbResult = {} as UpdateResult
  })

  describe('GET - /submissions', () => {
    describe('200 - Ok', () => {
      beforeEach(async () => {
        SubmissionService.list = jest.fn().mockImplementation(() => Promise.resolve(mockedSubmissions))
        await controller.get(req, res, next) // what we're testing
      })

      test('Returns list of submissions', () => expect(res.json).toBeCalledWith(expectedResults))
      test('Status code is 200', () => expect(res.status).toBeCalledWith(200))
    })

    describe('400 - Bad request', () => {
      test('Next called with expected error', async () => {
        SubmissionService.list = jest.fn().mockImplementation(() => Promise.reject(expectedError))

        try {
          await controller.get(req, res, next)

          fail('Expected test to throw')
        } catch {
          expect(next).toBeCalledWith(expectedError)
        }
      })
    })
  })

  describe('GET - /submissions/:id', () => {
    describe('200 - Ok', () => {
      beforeEach(async () => {
        SubmissionService.retrieve = jest.fn().mockImplementation(() => Promise.resolve(mockedSubmission))
        await controller.detail(req, res, next)
      })

      test('Returns expected submission', () => expect(res.json).toBeCalledWith(expectedResult))
      test('Status code is 200', () => expect(res.status).toBeCalledWith(200))
    })

    describe('404 - Not Found', () => {
      beforeEach(async () => {
        SubmissionService.retrieve = jest.fn().mockImplementation(() => Promise.resolve()) // No results
        await controller.detail(req, res, next)
      })

      test('Status code is 404 on missing submission', () => expect(res.status).toBeCalledWith(404))
      test('Responds with NotFound on missing submission', () => expect(res.json).toBeCalledWith(NotFound))
      test('Next not called on missing submission', () => expect(next).toBeCalledTimes(0))
    })

    describe('400 - Bad Reqeust', () => {
      test('Next called with expected error', async () => {
        SubmissionService.retrieve = jest.fn().mockImplementation(() => Promise.reject(expectedError))

        try {
          await controller.detail(req, res, next)

          fail('Expected test to throw')
        } catch {
          expect(next).toBeCalledWith(expectedError)
        }
      })
    })
  })

  describe('POST - /submissions/', () => {
    describe('201 - Created', () => {
      beforeEach(async () => {
        SubmissionService.create = jest.fn().mockImplementation(() => Promise.resolve(mockedSubmission))
        await controller.post(req, res, next)
      })

      test('Returns expected submission', () => expect(res.json).toBeCalledWith(expectedResult))
      test('Status code is 201', () => expect(res.status).toBeCalledWith(201))
    })

    describe('400 - Bad Reqeust', () => {
      beforeEach(async () => {
        SubmissionService.create = jest.fn().mockImplementation(() => Promise.reject(expectedError))

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

  describe('DELETE - /submissions/:id', () => {
    describe('204 - No Content', () => {
      beforeEach(async () => {
        expectedDbResult.affected = 1
        SubmissionService._delete = jest.fn().mockImplementation(() => Promise.resolve(expectedDbResult))
        await controller._delete(req, res, next)
      })

      test('Status code is 204', () => expect(res.status).toBeCalledWith(204))
      test('Response to have no content', () => expect(res.send).toBeCalledWith())
      test('Next not called', () => expect(next).toBeCalledTimes(0))
    })

    describe('404 - Not Found', () => {
      beforeEach(async () => {
        expectedDbResult.affected = 0
        SubmissionService._delete = jest.fn().mockImplementation(() => Promise.resolve(expectedDbResult))
        await controller._delete(req, res, next)
      })

      test('Status code is 404', () => expect(res.status).toBeCalledWith(404))
      test('Response to have no content', () => expect(res.json).toBeCalledWith(NotFound))
      test('Next not called', () => expect(next).toBeCalledTimes(0))
    })

    describe('400 - Not Found', () => {
      beforeEach(async () => {
        SubmissionService._delete = jest.fn().mockImplementation(() => Promise.reject(expectedError))
        await controller._delete(req, res, next)
      })

      test('Next called with expected error', () => expect(next).toBeCalledWith(expectedError))
    })
  })
})
