import { UpdateResult } from 'typeorm'

import { AssignmentProblem } from 'devu-shared-modules'

import controller from '../assignmentProblems.controller'

import AssignmentProblemsModel from '../../model/assignmentProblems.model'

import AssignmentProblemService from '../../services/assignmentProblem.service'

import { serialize } from '../../utils/serializer/assignmentProblems.serializer'

import Testing from '../../utils/testing.utils'
import { GenericResponse, NotFound, Updated } from '../../utils/apiResponse.utils'

// Testing Globals
let req: any
let res: any
let next: any

let mockedAssignmentProblems: AssignmentProblemsModel[]
let mockedAssignmentProblem: AssignmentProblemsModel
let expectedResults: AssignmentProblem[]
let expectedResult: AssignmentProblem
let expectedError: Error

let expectedDbResult: UpdateResult

describe('AssignmentProblemController', () => {
  beforeEach(() => {
    req = Testing.fakeRequest()
    res = Testing.fakeResponse()
    next = Testing.fakeNext()

    // @ts-ignore - Not sure why this doesn't work without suppressing
    mockedAssignmentProblems = Testing.generateTypeOrmArray(AssignmentProblemsModel, 3)
    // @ts-ignore
    mockedAssignmentProblem = Testing.generateTypeOrm(AssignmentProblemsModel)

    expectedResults = mockedAssignmentProblems.map(serialize)
    expectedResult = serialize(mockedAssignmentProblem)
    expectedError = new Error('Expected Error')

    expectedDbResult = {} as UpdateResult
  })

  describe('GET - /assignment-problem', () => {
    describe('200 - Ok', () => {
      beforeEach(async () => {
        AssignmentProblemService.list = jest.fn().mockImplementation(() => Promise.resolve(mockedAssignmentProblems))
        await controller.get(req, res, next) // what we're testing
      })

      test('Returns list of assignmentProblems', () => expect(res.json).toBeCalledWith(expectedResults))
      test('Status code is 200', () => expect(res.status).toBeCalledWith(200))
    })

    describe('400 - Bad request', () => {
      test('Next called with expected error', async () => {
        AssignmentProblemService.list = jest.fn().mockImplementation(() => Promise.reject(expectedError))

        try {
          await controller.get(req, res, next)

          fail('Expected test to throw')
        } catch {
          expect(next).toBeCalledWith(expectedError)
        }
      })
    })
  })

  describe('GET - /assignment-problem/:id', () => {
    describe('200 - Ok', () => {
      beforeEach(async () => {
        AssignmentProblemService.retrieve = jest.fn().mockImplementation(() => Promise.resolve(mockedAssignmentProblem))
        await controller.detail(req, res, next)
      })

      test('Returns expected assignmentProblem', () => expect(res.json).toBeCalledWith(expectedResult))
      test('Status code is 200', () => expect(res.status).toBeCalledWith(200))
    })

    describe('404 - Not Found', () => {
      beforeEach(async () => {
        AssignmentProblemService.retrieve = jest.fn().mockImplementation(() => Promise.resolve()) // No results
        await controller.detail(req, res, next)
      })

      test('Status code is 404 on missing assignmentProblem', () => expect(res.status).toBeCalledWith(404))
      test('Responds with NotFound on missing assignmentProblem', () => expect(res.json).toBeCalledWith(NotFound))
      test('Next not called on missing assignmentProblem', () => expect(next).toBeCalledTimes(0))
    })

    describe('400 - Bad Request', () => {
      test('Next called with expected error', async () => {
        AssignmentProblemService.retrieve = jest.fn().mockImplementation(() => Promise.reject(expectedError))

        try {
          await controller.detail(req, res, next)

          fail('Expected test to throw')
        } catch {
          expect(next).toBeCalledWith(expectedError)
        }
      })
    })
  })

  describe('POST - /assignment-problem', () => {
    describe('201 - Created', () => {
      beforeEach(async () => {
        AssignmentProblemService.create = jest.fn().mockImplementation(() => Promise.resolve(mockedAssignmentProblem))
        await controller.post(req, res, next)
      })

      test('Returns expected assignmentProblem', () => expect(res.json).toBeCalledWith(expectedResult))
      test('Status code is 201', () => expect(res.status).toBeCalledWith(201))
    })

    describe('400 - Bad Request', () => {
      beforeEach(async () => {
        AssignmentProblemService.create = jest.fn().mockImplementation(() => Promise.reject(expectedError))

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

  describe('PUT - /assignment-problem/:id', () => {
    describe('200 - Ok', () => {
      beforeEach(async () => {
        expectedDbResult.affected = 1 // mocking service return shape
        AssignmentProblemService.update = jest.fn().mockImplementation(() => Promise.resolve(expectedDbResult))
        await controller.put(req, res, next)
      })

      test('Status code is 200', () => expect(res.status).toBeCalledWith(200))
      test('Returns Updated message', () => expect(res.json).toBeCalledWith(Updated))
      test('Next is not called', () => expect(next).toHaveBeenCalledTimes(0))
    })

    describe('404 - Not Found', () => {
      beforeEach(async () => {
        expectedDbResult.affected = 0 // No records affected in db
        AssignmentProblemService.update = jest.fn().mockImplementation(() => Promise.resolve(expectedDbResult))
        await controller.put(req, res, next)
      })

      test('Status code is 404', () => expect(res.status).toBeCalledWith(404))
      test('Returns Not found message', () => expect(res.json).toBeCalledWith(NotFound))
      test('Next is not called', () => expect(next).toHaveBeenCalledTimes(0))
    })

    describe('400 - Bad Request', () => {
      beforeEach(async () => {
        AssignmentProblemService.update = jest.fn().mockImplementation(() => Promise.reject(expectedError))
        await controller.put(req, res, next)
      })

      test('Next is called with error', () => expect(next).toBeCalledWith(expectedError))
    })
  })

  describe('DELETE - /assignment-problem/:id', () => {
    describe('204 - No Content', () => {
      beforeEach(async () => {
        expectedDbResult.affected = 1
        AssignmentProblemService._delete = jest.fn().mockImplementation(() => Promise.resolve(expectedDbResult))
        await controller._delete(req, res, next)
      })

      test('Status code is 204', () => expect(res.status).toBeCalledWith(204))
      test('Response to have no content', () => expect(res.send).toBeCalledWith())
      test('Next not called', () => expect(next).toBeCalledTimes(0))
    })

    describe('404 - Not Found', () => {
      beforeEach(async () => {
        expectedDbResult.affected = 0
        AssignmentProblemService._delete = jest.fn().mockImplementation(() => Promise.resolve(expectedDbResult))
        await controller._delete(req, res, next)
      })

      test('Status code is 404', () => expect(res.status).toBeCalledWith(404))
      test('Response to have no content', () => expect(res.json).toBeCalledWith(NotFound))
      test('Next not called', () => expect(next).toBeCalledTimes(0))
    })

    describe('400 - Bad Request', () => {
      beforeEach(async () => {
        AssignmentProblemService._delete = jest.fn().mockImplementation(() => Promise.reject(expectedError))
        await controller._delete(req, res, next)
      })

      test('Next called with expected error', () => expect(next).toBeCalledWith(expectedError))
    })
  })
})
