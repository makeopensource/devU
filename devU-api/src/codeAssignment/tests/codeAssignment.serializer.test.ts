import { serialize } from '../codeAssignment.serializer'

import CodeAssignmentsModel from '../codeAssignment.model'

import Testing from '../../utils/testing.utils'

let mockCodeAssignment: CodeAssignmentsModel

describe('CodeAssignment Serializer', () => {
  beforeEach(() => {
    mockCodeAssignment = Testing.generateTypeOrm<CodeAssignmentsModel>(CodeAssignmentsModel)

    mockCodeAssignment.id = 5
    mockCodeAssignment.assignmentId = 12
    mockCodeAssignment.grader = 'path/to/grader/on/blobby'
    mockCodeAssignment.gradingImage = 'autograding_image_3'
    mockCodeAssignment.createdAt = new Date()
    mockCodeAssignment.updatedAt = new Date()
  })

  describe('Serializing CodeAssignment', () => {
    test('CodeAssignment values exist in the response', () => {
      const actualResult = serialize(mockCodeAssignment)

      expect(actualResult).toBeDefined()
      expect(actualResult.id).toEqual(mockCodeAssignment.id)
      expect(actualResult.assignmentId).toEqual(mockCodeAssignment.assignmentId)
      expect(actualResult.grader).toEqual(mockCodeAssignment.grader)
      expect(actualResult.gradingImage).toEqual(mockCodeAssignment.gradingImage)
    })

    test('CreatedAt and ModifiedAt are ISO strings', () => {
      const actualResult = serialize(mockCodeAssignment)

      expect(actualResult).toBeDefined()
      expect(actualResult.updatedAt).toEqual(mockCodeAssignment.updatedAt.toISOString())
      expect(actualResult.createdAt).toEqual(mockCodeAssignment.createdAt.toISOString())
    })
  })
})
