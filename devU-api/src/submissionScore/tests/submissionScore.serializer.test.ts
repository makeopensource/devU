import { serialize } from '../submissionScore.serializer'

import SubmissionScoreModel from '../../../model/submissionScore.model'

import Testing from '../../testing.utils'

let mockSubmissionScore: SubmissionScoreModel

describe('SubmissionScore Serializer', () => {
  beforeEach(() => {
    mockSubmissionScore = Testing.generateTypeOrm<SubmissionScoreModel>(SubmissionScoreModel)

    mockSubmissionScore.id = 10
    mockSubmissionScore.submissionId = 50
    mockSubmissionScore.score = 100
    mockSubmissionScore.feedback = 'Great Job!'
    mockSubmissionScore.releasedAt = new Date()
    mockSubmissionScore.createdAt = new Date()
    mockSubmissionScore.updatedAt = new Date()
  })

  describe('Serializing SubmissionScore', () => {
    test('SubmissionScore values exist in the response', () => {
      const expectedResult = serialize(mockSubmissionScore)

      expect(expectedResult).toBeDefined()
      expect(expectedResult.id).toEqual(mockSubmissionScore.id)
      expect(expectedResult.submissionId).toEqual(mockSubmissionScore.submissionId)
      expect(expectedResult.score).toEqual(mockSubmissionScore.score)
      expect(expectedResult.feedback).toEqual(mockSubmissionScore.feedback)
    })

    test('createdAt, modifiedAt, and releasedAt are ISO strings', () => {
      const expectedResult = serialize(mockSubmissionScore)

      expect(expectedResult).toBeDefined()
      expect(expectedResult.updatedAt).toEqual(mockSubmissionScore.updatedAt.toISOString())
      expect(expectedResult.createdAt).toEqual(mockSubmissionScore.createdAt.toISOString())
      expect(expectedResult.releasedAt).toEqual(mockSubmissionScore.releasedAt?.toISOString())
    })
  })
})
