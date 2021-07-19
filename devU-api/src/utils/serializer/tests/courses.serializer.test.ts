import { serialize } from '../courses.serializer'

import CourseModel from '../../../model/courses.model'

import Testing from '../../testing.utils'

let mockCourse: CourseModel

describe('Course Serializer', () => {
  beforeEach(() => {
    mockCourse = Testing.generateTypeOrm<CourseModel>(CourseModel)

    mockCourse.id = 10
    mockCourse.name = 'qwerty'
    mockCourse.semester = 'f2021'
    mockCourse.number = 'CSE123'
    mockCourse.startDate = new Date()
    mockCourse.endDate = new Date()
    mockCourse.createdAt = new Date()
    mockCourse.updatedAt = new Date()
  })

  describe('Serializing courses', () => {
    test('course values exist in the response', () => {
      const expectedResult = serialize(mockCourse)

      expect(expectedResult).toBeDefined()
      expect(expectedResult.id).toEqual(mockCourse.id)
      expect(expectedResult.name).toEqual(mockCourse.name)
      expect(expectedResult.semester).toEqual(mockCourse.semester)
      expect(expectedResult.number).toEqual(mockCourse.number)
    })

    test('Dates are returned as ISO strings for all courses', () => {
      const expectedResult = serialize(mockCourse)

      expect(expectedResult).toBeDefined()
      expect(expectedResult.updatedAt).toEqual(mockCourse.updatedAt.toISOString())
      expect(expectedResult.createdAt).toEqual(mockCourse.createdAt.toISOString())
      expect(expectedResult.startDate).toEqual(mockCourse.startDate.toISOString())
      expect(expectedResult.endDate).toEqual(mockCourse.endDate.toISOString())
    })
  })
})
