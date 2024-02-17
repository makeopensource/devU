import { serialize } from '../nonContainerAutoGrader.serializer'

import NonContainerAutoGrader from '../nonContainerAutoGrader.model'

import Testing from '../../utils/testing.utils'

let mockQuestion: NonContainerAutoGrader

describe('Category Serializer', () => {
  beforeEach(() => {
    mockQuestion = Testing.generateTypeOrm<NonContainerAutoGrader>(NonContainerAutoGrader)

    mockQuestion.id = 23
    mockQuestion.question = 'The Answer to the Ultimate Question of Life, the Universe, and Everything'
    mockQuestion.correctString = '42'
    mockQuestion.score = 1
    mockQuestion.createdAt = new Date()
    mockQuestion.updatedAt = new Date()
  })

  describe('Serializing category', () => {
    test('NonContainerAutoGrader values exist in the response', () => {
      const expectedResult = serialize(mockQuestion)

      expect(expectedResult).toBeDefined()
      expect(expectedResult.id).toEqual(mockQuestion.id)
      expect(expectedResult.correctString).toEqual(mockQuestion.correctString)
      expect(expectedResult.score).toEqual(mockQuestion.score)
      expect(expectedResult.question).toEqual(mockQuestion.question)
    })

    test('Dates are returned as ISO strings', () => {
      const expectedResult = serialize(mockQuestion)

      expect(expectedResult).toBeDefined()
      expect(expectedResult.createdAt).toEqual(mockQuestion.createdAt.toISOString())
      expect(expectedResult.updatedAt).toEqual(mockQuestion.updatedAt.toISOString())
    })
  })
})