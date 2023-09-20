import { serialize } from '../../category/category.serializer'

import CategoryModel from '../../category/category.model'

import Testing from '../../utils/testing.utils'

let mockCategory: CategoryModel

describe('Category Serializer', () => {
  beforeEach(() => {
  mockCategory = Testing.generateTypeOrm<CategoryModel>(CategoryModel)
  
  mockCategory.id = 10
  mockCategory.courseId = 123
  mockCategory.userId = 50
  mockCategory.category = 1
  mockCategory.score = 100
  mockCategory.letterGrade = "A"
  })

  describe('Serializing category', () => {
    test('category values in the response', () => {
      const expectedResult = serialize(mockCategory)

      expect(expectedResult).toBeDefined()
      expect(expectedResult.id).toEqual(mockCategory.id)
      expect(expectedResult.courseId).toEqual(mockCategory.courseId)
      expect(expectedResult.userId).toEqual(mockCategory.userId)
      expect(expectedResult.category).toEqual(mockCategory.category)
      expect(expectedResult.score).toEqual(mockCategory.score)
      expect(expectedResult.letterGrade).toEqual(mockCategory.letterGrade)
    })
  })
})
