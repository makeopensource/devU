import { UpdateResult } from 'typeorm'

import { SubmissionScore } from 'devu-shared-modules'

import controller from '../submissionScore.controller'

import SubmissionScoreModel from '../submissionScore.model'

import SubmissionScoreService from '../submissionScore.service'

import { serialize } from '../submissionScore.serializer'

import Testing from '../../utils/testing.utils'
import { GenericResponse, NotFound, Updated } from '../../utils/apiResponse.utils'

// Testing Globals
let req: any
let res: any
let next: any

let mockedSubmissionScores: SubmissionScoreModel[]
let mockedSubmissionScore: SubmissionScoreModel
let expectedResults: SubmissionScore[]
let expectedResult: SubmissionScore
let expectedError: Error

let expectedDbResult: UpdateResult

describe('SubmissionScoreController', () => {
  beforeEach(() => {
    req = Testing.fakeRequest()
    res = Testing.fakeResponse()
    next = Testing.fakeNext()

    mockedSubmissionScores = Testing.generateTypeOrmArray(SubmissionScoreModel, 3)
    mockedSubmissionScore = Testing.generateTypeOrm(SubmissionScoreModel)

    expectedResults = mockedSubmissionScores.map(serialize)
    expectedResult = serialize(mockedSubmissionScore)
    expectedError = new Error('Expected Error')

    expectedDbResult = {} as UpdateResult
  })

  describe('GET - /submission-score', () => {
    describe('200 - Ok', () => {
      beforeEach(async () => {
        SubmissionScoreService.list = jest.fn().mockImplementation(() => Promise.resolve(mockedSubmissionScores))
        await controller.get(req, res, next) // what we're testing
      })

      test('Returns list of submissionScores', () => expect(res.json).toBeCalledWith(expectedResults))
      test('Status code is 200', () => expect(res.status).toBeCalledWith(200))
    })

    describe('400 - Bad request', () => {
      test('Next called with expected error', async () => {
        SubmissionScoreService.list = jest.fn().mockImplementation(() => Promise.reject(expectedError))

        try {
          await controller.get(req, res, next)

          fail('Expected test to throw')
        } catch {
          expect(next).toBeCalledWith(expectedError)
        }
      })
    })
  })

  describe('GET - /submission-score/:id', () => {
    describe('200 - Ok', () => {
      beforeEach(async () => {
        SubmissionScoreService.retrieve = jest.fn().mockImplementation(() => Promise.resolve(mockedSubmissionScore))
        await controller.detail(req, res, next)
      })

      test('Returns expected submissionScore', () => expect(res.json).toBeCalledWith(expectedResult))
      test('Status code is 200', () => expect(res.status).toBeCalledWith(200))
    })

    describe('404 - Not Found', () => {
      beforeEach(async () => {
        SubmissionScoreService.retrieve = jest.fn().mockImplementation(() => Promise.resolve()) // No results
        await controller.detail(req, res, next)
      })

      test('Status code is 404 on missing submissionScore', () => expect(res.status).toBeCalledWith(404))
      test('Responds with NotFound on missing submissionScore', () => expect(res.json).toBeCalledWith(NotFound))
      test('Next not called on missing submissionScore', () => expect(next).toBeCalledTimes(0))
    })

    describe('400 - Bad Request', () => {
      test('Next called with expected error', async () => {
        SubmissionScoreService.retrieve = jest.fn().mockImplementation(() => Promise.reject(expectedError))

        try {
          await controller.detail(req, res, next)

          fail('Expected test to throw')
        } catch {
          expect(next).toBeCalledWith(expectedError)
        }
      })
    })
  })

  describe('POST - /submission-score/', () => {
    describe('201 - Created', () => {
      beforeEach(async () => {
        SubmissionScoreService.create = jest.fn().mockImplementation(() => Promise.resolve(mockedSubmissionScore))
        await controller.post(req, res, next)
      })

      test('Returns expected submissionScore', () => expect(res.json).toBeCalledWith(expectedResult))
      test('Status code is 201', () => expect(res.status).toBeCalledWith(201))
    })

    describe('400 - Bad Request', () => {
      beforeEach(async () => {
        SubmissionScoreService.create = jest.fn().mockImplementation(() => Promise.reject(expectedError))

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

  describe('PUT - /submission-score/:id', () => {
    describe('200 - Ok', () => {
      beforeEach(async () => {
        expectedDbResult.affected = 1 // mocking service return shape
        SubmissionScoreService.update = jest.fn().mockImplementation(() => Promise.resolve(expectedDbResult))
        await controller.put(req, res, next)
      })

      test('Status code is 200', () => expect(res.status).toBeCalledWith(200))
      test('Returns Updated message', () => expect(res.json).toBeCalledWith(Updated))
      test('Next is not called', () => expect(next).toHaveBeenCalledTimes(0))
    })

    describe('404 - Not Found', () => {
      beforeEach(async () => {
        expectedDbResult.affected = 0 // No records affected in db
        SubmissionScoreService.update = jest.fn().mockImplementation(() => Promise.resolve(expectedDbResult))
        await controller.put(req, res, next)
      })

      test('Status code is 404', () => expect(res.status).toBeCalledWith(404))
      test('Returns Not found message', () => expect(res.json).toBeCalledWith(NotFound))
      test('Next is not called', () => expect(next).toHaveBeenCalledTimes(0))
    })

    describe('400 - Bad Request', () => {
      beforeEach(async () => {
        SubmissionScoreService.update = jest.fn().mockImplementation(() => Promise.reject(expectedError))
        await controller.put(req, res, next)
      })

      test('Next is called with error', () => expect(next).toBeCalledWith(expectedError))
    })
  })

  describe('DELETE - /submission-score/:id', () => {
    describe('204 - No Content', () => {
      beforeEach(async () => {
        expectedDbResult.affected = 1
        SubmissionScoreService._delete = jest.fn().mockImplementation(() => Promise.resolve(expectedDbResult))
        await controller._delete(req, res, next)
      })

      test('Status code is 204', () => expect(res.status).toBeCalledWith(204))
      test('Response to have no content', () => expect(res.send).toBeCalledWith())
      test('Next not called', () => expect(next).toBeCalledTimes(0))
    })

    describe('404 - Not Found', () => {
      beforeEach(async () => {
        expectedDbResult.affected = 0
        SubmissionScoreService._delete = jest.fn().mockImplementation(() => Promise.resolve(expectedDbResult))
        await controller._delete(req, res, next)
      })

      test('Status code is 404', () => expect(res.status).toBeCalledWith(404))
      test('Response to have no content', () => expect(res.json).toBeCalledWith(NotFound))
      test('Next not called', () => expect(next).toBeCalledTimes(0))
    })

    describe('400 - Bad Request', () => {
      beforeEach(async () => {
        SubmissionScoreService._delete = jest.fn().mockImplementation(() => Promise.reject(expectedError))
        await controller._delete(req, res, next)
      })

      test('Next called with expected error', () => expect(next).toBeCalledWith(expectedError))
    })
  })
})
