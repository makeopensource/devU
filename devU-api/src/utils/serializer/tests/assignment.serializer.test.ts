import { serialize } from '../assignments.serializer'

import AssignmentModel from '../../../model/assignments.model'

import Testing from '../../testing.utils'

let mockAssignment: AssignmentModel

describe('Assignment Serializer', () => {
  beforeEach(() => {
    mockAssignment = Testing.generateTypeOrm<AssignmentModel>(AssignmentModel)

    mockAssignment.id = 10
    mockAssignment.courseId = 123
    mockAssignment.name = 'qwerty'
    mockAssignment.startDate = new Date()
    mockAssignment.dueDate = new Date()
    mockAssignment.endDate = new Date()
    mockAssignment.gradingType = 'code'
    mockAssignment.categoryName = 'Super Awesome Category Name'
    mockAssignment.description = 'Woww! Such a description'
    mockAssignment.maxFileSize = 1
    mockAssignment.maxSubmissions = null
    mockAssignment.disableHandins = true
    mockAssignment.createdAt = new Date()
    mockAssignment.updatedAt = new Date()
    mockAssignment.deletedAt = new Date()
  })

  describe('Serializing assignments', () => {
    test('assignment values exist in the response', () => {
      const expectedResult = serialize(mockAssignment)

      expect(expectedResult).toBeDefined()
      expect(expectedResult.id).toEqual(mockAssignment.id)
      expect(expectedResult.courseId).toEqual(mockAssignment.courseId)
      expect(expectedResult.name).toEqual(mockAssignment.name)
      expect(expectedResult.gradingType).toEqual(mockAssignment.gradingType)
      expect(expectedResult.categoryName).toEqual(mockAssignment.categoryName)
      expect(expectedResult.description).toEqual(mockAssignment.description)
      expect(expectedResult.maxFileSize).toEqual(mockAssignment.maxFileSize)
      expect(expectedResult.maxSubmissions).toEqual(mockAssignment.maxSubmissions)
      expect(expectedResult.disableHandins).toEqual(mockAssignment.disableHandins)
    })

    test('Dates are returned as ISO strings for all assignments', () => {
      const expectedResult = serialize(mockAssignment)

      expect(expectedResult).toBeDefined()

      expect(expectedResult.updatedAt).toEqual(mockAssignment.updatedAt.toISOString())
      expect(expectedResult.createdAt).toEqual(mockAssignment.createdAt.toISOString())
      expect(expectedResult.startDate).toEqual(mockAssignment.startDate.toISOString())
      expect(expectedResult.dueDate).toEqual(mockAssignment.dueDate.toISOString())
      expect(expectedResult.endDate).toEqual(mockAssignment.endDate.toISOString())
    })
  })
})
