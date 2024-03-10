import { serialize } from '../deadlineExtensions.serializer'

import DeadlineExtensionsModel from '../deadlineExtensions.model'

import Testing from '../../../utils/testing.utils'

let mockAssignment: DeadlineExtensionsModel

describe('Deadline-Extensions Serializer', () => {
  beforeEach(() => {
    mockAssignment = Testing.generateTypeOrm<DeadlineExtensionsModel>(DeadlineExtensionsModel)

    mockAssignment.id = 10
    mockAssignment.newEndDate = new Date()
    mockAssignment.newStartDate = new Date()
    mockAssignment.deadlineDate = new Date()
    mockAssignment.userId = 1
    mockAssignment.creatorId = 2
    mockAssignment.assignmentId = 20
    mockAssignment.createdAt = new Date()
    mockAssignment.updatedAt = new Date()
    mockAssignment.deletedAt = new Date()
  })

  describe('Serializing Deadline-Extensions', () => {
    test('Deadline-Extensions values exist in the response', () => {
      const expectedResult = serialize(mockAssignment)

      expect(expectedResult).toBeDefined()
      expect(expectedResult.id).toEqual(mockAssignment.id)
      expect(expectedResult.creatorId).toEqual(mockAssignment.creatorId)
      expect(expectedResult.assignmentId).toEqual(mockAssignment.assignmentId)
    })

    test('Dates are returned as ISO strings for all Deadline-Extensions', () => {
      const expectedResult = serialize(mockAssignment)

      expect(expectedResult).toBeDefined()

      expect(expectedResult.updatedAt).toEqual(mockAssignment.updatedAt.toISOString())
      expect(expectedResult.createdAt).toEqual(mockAssignment.createdAt.toISOString())
      expect(expectedResult.deadlineDate).toEqual(mockAssignment.deadlineDate.toISOString())
      expect(expectedResult.newStartDate).toEqual(mockAssignment.newStartDate!.toISOString())
      expect(expectedResult.newEndDate).toEqual(mockAssignment.newEndDate!.toISOString())
    })
  })
})
