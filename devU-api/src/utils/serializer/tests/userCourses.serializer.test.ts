import { serialize } from '../userCourses.serializer'

import UserCourseModel from '../../../model/userCourses.model'

import Testing from '../../testing.utils'

let mockUserCourse: UserCourseModel

describe('UserCourse Serializer', () => {
  beforeEach(() => {
    mockUserCourse = Testing.generateTypeOrm<UserCourseModel>(UserCourseModel)

    mockUserCourse.id = 10
    mockUserCourse.userId = 50
    mockUserCourse.courseId = 100
    mockUserCourse.level = 'ta'
    mockUserCourse.dropped = false
    mockUserCourse.createdAt = new Date()
    mockUserCourse.updatedAt = new Date()
  })

  describe('Serializing UserCourse', () => {
    test('CourseUser values exist in the response', () => {
      const expectedResult = serialize(mockUserCourse)

      expect(expectedResult).toBeDefined()
      expect(expectedResult.id).toEqual(mockUserCourse.id)
      expect(expectedResult.userId).toEqual(mockUserCourse.userId)
      expect(expectedResult.courseId).toEqual(mockUserCourse.courseId)
      expect(expectedResult.level).toEqual(mockUserCourse.level)
      expect(expectedResult.dropped).toEqual(mockUserCourse.dropped)
    })

    test('CreatedAt and ModifiedAt are ISO strings', () => {
      const expectedResult = serialize(mockUserCourse)

      expect(expectedResult).toBeDefined()
      expect(expectedResult.updatedAt).toEqual(mockUserCourse.updatedAt.toISOString())
      expect(expectedResult.createdAt).toEqual(mockUserCourse.createdAt.toISOString())
    })
  })
})
