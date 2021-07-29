import React, { useState, useEffect } from 'react'
import { UserCourse, Course } from 'devu-shared-modules'


import PageWrapper from 'components/shared/layouts/pageWrapper'
import UserCourseListItem from 'components/listItems/userCourseListItem'
import Dropdown from 'components/shared/inputs/dropdown'
import ErrorPage from './errorPage'

import RequestService from 'services/request.service'

import styles from './userCoursesListPage.scss'
import LoadingOverlay from 'components/shared/loaders/loadingOverlay'

const filterOptions = [
  { label: 'All', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
  { label: 'Dropped', value: 'dropped' },
]

const UserCoursesListPage = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [userCourses, setUserCourses] = useState(new Array<UserCourse>())
  const [courses, setCourses] = useState<Record<string, Course>>({})
  const currentFilter = JSON.parse(localStorage.getItem('status') || '')
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive' | 'dropped'>(currentFilter)

  const fetchData = async () => {
    try {
      // The filter isn't implemented by the API yet
      const userCourses: UserCourse[] = await RequestService.get(`/api/user-courses?filterBy=${filter}`)
      const courseRequests = userCourses.map((u) => RequestService.get(`/api/courses/${u.courseId}`))
      const courses: Course[] = await Promise.all(courseRequests)

      localStorage.setItem('status', JSON.stringify(filter) || '')

      // Mapify course ids so we can look them up more easilly via their id
      const courseMap: Record<string, Course> = {}
      for (const course of courses) courseMap[course.id || ''] = course

      setUserCourses(userCourses)
      setCourses(courseMap)
    } catch (error) {
      setError(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [filter])

  if (loading) return <LoadingOverlay />
  if (error) return <ErrorPage error={error} />

  const defaultOption = filterOptions.find((o) => o.value === filter)

  return (
    <PageWrapper>
      <div className={styles.header}>
        <h2 className={styles.myCourses}>My Courses</h2>
        <div className={styles.filters}>
          <Dropdown
            label='Filter Courses'
            className={styles.dropdown}
            options={filterOptions}
            onChange={setFilter}
            defaultOption={defaultOption}
          />
        </div>
      </div>
      {userCourses.map((userCourse) => (
        <UserCourseListItem key={userCourse.courseId} userCourse={userCourse} course={courses[userCourse.id || '']} />
      ))}
    </PageWrapper>
  )
}

export default UserCoursesListPage
