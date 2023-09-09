import { UpdateResult } from 'typeorm'

import { SubmissionProblemScore } from 'devu-shared-modules'

import controller from '../submissionProblemScore.controller'

import SubmissionProblemScoreModel from '../../model/submissionProblemScore.model'

import SubmissionProblemScoreService from '../../services/submissionProblemScore.service'

import { serialize } from '../../utils/serializer/submissionProblemScore.serializer'

import Testing from '../../utils/testing.utils'
import { GenericResponse, NotFound } from '../../utils/apiResponse.utils'

let req: any
let res: any
let next: any

let mockedSubmissionProblemScores: SubmissionProblemScoreModel[]
let mockedSubmissionProblemScore: SubmissionProblemScoreModel
let expectedResults: SubmissionProblemScore[]
let expectedResult: SubmissionProblemScore
let expectedError: Error

let expectedDbResult: UpdateResult

describe('SubmissionProblemScoreController', () => {
  beforeEach(() => {
    req = Testing.fakeRequest()
    res = Testing.fakeResponse()
    next = Testing.fakeNext()

    mockedSubmissionProblemScores = Testing.generateTypeOrmArray(SubmissionProblemScoreModel, 3)
    mockedSubmissionProblemScore = Testing.generateTypeOrm(SubmissionProblemScoreModel)

    expectedResults = mockedSubmissionProblemScores.map(serialize)
    expectedResult = serialize(mockedSubmissionProblemScore)
    expectedError = new Error('Expected Error')

    expectedDbResult = {} as UpdateResult
  })

  describe('Get - /submission-problem-scores', () => {
    describe('200 - Ok', () => {
      beforeEach(async () => {
        SubmissionProblemScoreService.list = jest
          .fn()
          .mockImplementation(() => Promise.resolve(mockedSubmissionProblemScores))
        await controller.get(req, res, next) // what we're testing
      })

      test('Returns list of submissionProblemScores', () => expect(res.json).toBeCalledWith(expectedResults))
      test('Status code is 200', () => expect(res.status).toBeCalledWith(200))
    })

    describe('400 - Bad request', () => {
      test('Next called with expected error', async () => {
        SubmissionProblemScoreService.list = jest.fn().mockImplementation(() => Promise.reject(expectedError))

        try {
          await controller.get(req, res, next)

          fail('Expected test to throw')
        } catch {
          expect(next).toBeCalledWith(expectedError)
        }
      })
    })
  })

  describe('Get - /submission-problem-scores/:id', () => {
    describe('200 - Ok', () => {
      beforeEach(async () => {
        SubmissionProblemScoreService.retrieve = jest
          .fn()
          .mockImplementation(() => Promise.resolve(mockedSubmissionProblemScore))
        await controller.detail(req, res, next)
      })

      test('Returns expected submissionProblemScore', () => expect(res.json).toBeCalledWith(expectedResult))
      test('Status code is 200', () => expect(res.status).toBeCalledWith(200))
    })

    describe('404 - Not Found', () => {
      beforeEach(async () => {
        SubmissionProblemScoreService.retrieve = jest.fn().mockImplementation(() => Promise.resolve())
        await controller.detail(req, res, next)
      })

      test('Status code is 404 on missing submissionProblemScore', () => expect(res.status).toBeCalledWith(404))
      test('Responds with NotFound on missing submissionProblemScore', () => expect(res.json).toBeCalledWith(NotFound))
      test('Next not called on missing submissionProblemScore', () => expect(next).toBeCalledTimes(0))
    })

    describe('400 - Bad Request', () => {
      test('Next called with expected error', async () => {
        SubmissionProblemScoreService.retrieve = jest.fn().mockImplementation(() => Promise.reject(expectedError))

        try {
          await controller.detail(req, res, next)

          fail('Expected test to throw')
        } catch {
          expect(next).toBeCalledWith(expectedError)
        }
      })
    })
  })

  describe('Post - /submission-problem-scores/', () => {
    describe('201 - Created', () => {
      beforeEach(async () => {
        SubmissionProblemScoreService.create = jest
          .fn()
          .mockImplementation(() => Promise.resolve(mockedSubmissionProblemScore))
        await controller.post(req, res, next)
      })

      test('Returns expected submissionProblemScore', () => expect(res.json).toBeCalledWith(expectedResult))
      test('Status code is 201', () => expect(res.status).toBeCalledWith(201))
    })

    describe('400 - Bad Request', () => {
      beforeEach(async () => {
        SubmissionProblemScoreService.create = jest.fn().mockImplementation(() => Promise.reject(expectedError))

        try {
          await controller.post(req, res, next)

          fail('Expected test to throw')
        } catch {}
      })

      test('Status code is 400', () => expect(res.status).toBeCalledWith(400))
      test('Responds with generic error', () =>
        expect(res.json).toBeCalledWith(new GenericResponse(expectedError.message)))
      test('Next not called', () => expect(next).toBeCalledTimes(0))
    })
  })

  describe('DELETE - /submission-problem-scores/:id', () => {
    describe('204 - No Content', () => {
      beforeEach(async () => {
        expectedDbResult.affected = 1
        SubmissionProblemScoreService._delete = jest.fn().mockImplementation(() => Promise.resolve(expectedDbResult))
        await controller._delete(req, res, next)
      })

      test('Status code is 204', () => expect(res.status).toBeCalledWith(204))
      test('Response to have no content', () => expect(res.send).toBeCalledWith())
      test('Next not called', () => expect(next).toBeCalledTimes(0))
    })

    describe('404 - Not Found', () => {
      beforeEach(async () => {
        expectedDbResult.affected = 0
        SubmissionProblemScoreService._delete = jest.fn().mockImplementation(() => Promise.resolve(expectedDbResult))
        await controller._delete(req, res, next)
      })

      test('Status code is 404', () => expect(res.status).toBeCalledWith(404))
      test('Response to have no content', () => expect(res.json).toBeCalledWith(NotFound))
      test('Next not called', () => expect(next).toBeCalledTimes(0))
    })

    describe('400 - Not Found', () => {
      beforeEach(async () => {
        SubmissionProblemScoreService._delete = jest.fn().mockImplementation(() => Promise.reject(expectedError))
        await controller._delete(req, res, next)
      })

      test('Next called with expected error', () => expect(next).toBeCalledWith(expectedError))
    })
  })
})
