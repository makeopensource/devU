export type UserCourse = {
  id?: number
  userId: number
  courseId: number
  dropped: boolean
  level: UserCourseLevel
  createdAt?: string
  updatedAt?: string
}

export type UserCourseRole = {
  label: string
  value: string
}
export const userCourseRoles: UserCourseRole[] = [
  { label: 'Student', value: 'student' },
  { label: 'TA', value: 'ta' },
  { label: 'Instructor', value: 'instructor' },
]

export const userCourseLevels = ['student', 'ta', 'instructor'] as const
export type UserCourseLevel = typeof userCourseLevels[number]
