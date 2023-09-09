import { serialize } from '../submission.serializer'

import SubmissionModel from '../../../model/submission.model'

import Testing from '../../testing.utils'

let mockSubmission: SubmissionModel

describe('Submission Serializer', () => {
  beforeEach(() => {
    mockSubmission = Testing.generateTypeOrm<SubmissionModel>(SubmissionModel)

    mockSubmission.id = 10
    mockSubmission.createdAt = new Date()
    mockSubmission.updatedAt = new Date()
    mockSubmission.courseId = 1
    mockSubmission.assignmentId = 2
    mockSubmission.userId = 456
    mockSubmission.type = 'filepath'
    mockSubmission.content = 'LARGE STRING'
    mockSubmission.submitterIp = '1A2B3C4D5yes'
    mockSubmission.originalSubmissionId = null
    mockSubmission.submittedBy = 1
  })

  describe('Serializing submissions', () => {
    test('submission values exist in the response', () => {
      const expectedResult = serialize(mockSubmission)

      expect(expectedResult).toBeDefined()
      expect(expectedResult.id).toEqual(mockSubmission.id)
      expect(expectedResult.courseId).toEqual(mockSubmission.courseId)
      expect(expectedResult.assignmentId).toEqual(mockSubmission.assignmentId)
      expect(expectedResult.userId).toEqual(mockSubmission.userId)
      expect(expectedResult.type).toEqual(mockSubmission.type)
      expect(expectedResult.content).toEqual(mockSubmission.content)
      expect(expectedResult.submitterIp).toEqual(mockSubmission.submitterIp)
      expect(expectedResult.originalSubmissionId).toEqual(mockSubmission.originalSubmissionId)
      expect(expectedResult.submittedBy).toEqual(mockSubmission.submittedBy)
    })

    test('CreatedAt and ModifiedAt are ISO strings for all submissions', () => {
      const expectedResult = serialize(mockSubmission)

      expect(expectedResult).toBeDefined()
      expect(expectedResult.updatedAt).toEqual(mockSubmission.updatedAt.toISOString())
      expect(expectedResult.createdAt).toEqual(mockSubmission.createdAt.toISOString())
    })
  })
})
