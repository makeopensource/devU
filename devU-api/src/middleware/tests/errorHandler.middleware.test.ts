import Testing from '../../utils/testing.utils'

import globalErrorHandler from '../errorHandler.middleware'

import { GenericResponse, Unknown, Unimplemented } from '../../utils/apiResponse.utils'

// Testing Globals
let req: any
let res: any
let next: any

let expectedErrorMessage = 'Expected Message'

describe('Global Error Handler', () => {
  beforeEach(() => {
    req = Testing.fakeRequest()
    res = Testing.fakeResponse()
    next = Testing.fakeNext()
  })

  describe('Missing error', () => {
    //@ts-ignore - if someone throws a non error 😬
    beforeEach(() => globalErrorHandler(null, req, res, next))

    test('Responds with 400', () => expect(res.status).toBeCalledWith(400))
    test('Responds with unknown without error', () => expect(res.json).toBeCalledWith(Unknown))
  })

  describe('Specific error tests', () => {
    test('Responds with Unimplemented - 501 with an "unimplemented" error message', () => {
      globalErrorHandler(new Error('Unimplemented'), req, res, next)

      expect(res.status).toBeCalledWith(501)
      expect(res.json).toBeCalledWith(Unimplemented)
    })

    test('Responds with Unknown - 400 with no error message', () => {
      globalErrorHandler(new Error(), req, res, next)

      expect(res.status).toBeCalledWith(400)
      expect(res.json).toBeCalledWith(Unknown)
    })

    test('Response with GenericResponse - 400 with "other" errors', () => {
      globalErrorHandler(new Error(expectedErrorMessage), req, res, next)

      expect(res.status).toBeCalledWith(400)
      expect(res.json).toBeCalledWith(new GenericResponse(expectedErrorMessage))
    })
  })
})
