import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

import { UserCourse, Course } from 'devu-shared-modules'
import { useAppSelector } from 'redux/hooks'

import LoadingOverlay from 'components/shared/loaders/loadingOverlay'
import PageWrapper from 'components/shared/layouts/pageWrapper'
import UserCourseListItem from 'components/listItems/userCourseListItem'
import Dropdown, { Option } from 'components/shared/inputs/dropdown'
import ErrorPage from './errorPage'

import RequestService from 'services/request.service'
import LocalStorageService from 'services/localStorage.service'

import styles from './userCoursesListPage.scss'
//import Button from 'components/shared/inputs/button'

const FILTER_LOCAL_STORAGE_KEY = 'courses_filter'

type Filter = 'all' | 'active' | 'inactive' | 'dropped'

const filterOptions: Option<Filter>[] = [
  { label: 'All', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
  { label: 'Dropped', value: 'dropped' },
]

const UserCoursesListPage = () => {
  const userId = useAppSelector((store) => store.user.id)

  const defaultFilter = LocalStorageService.get<Filter>(FILTER_LOCAL_STORAGE_KEY) || 'active'

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [userCourses, setUserCourses] = useState(new Array<UserCourse>())
  const [courses, setCourses] = useState<Record<string, Course>>({})
  const [filter, setFilter] = useState<Filter>(defaultFilter)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      // The filter isn't implemented by the API yet
      const userCourses = await RequestService.get<UserCourse[]>(`/api/user-courses?filterBy=${filter}`)
      const courseRequests = userCourses.map((u) => RequestService.get<Course>(`/api/courses/${u.courseId}`))
      const courses = await Promise.all(courseRequests)

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

  const handleFilterChange = (updatedFilter: Filter) => {
    setFilter(updatedFilter)
    fetchData()

    LocalStorageService.set(FILTER_LOCAL_STORAGE_KEY, updatedFilter)
  }

  if (loading) return <LoadingOverlay delay={250} />
  if (error) return <ErrorPage error={error} />

  const defaultOption = filterOptions.find((o) => o.value === filter)


  return (
    <PageWrapper>
      <div className={styles.header}>
        <h1>My Courses</h1>

        <div>
          <Link className={styles.addCourseBtn} to={`/users/${userId}/courses/courseForm`}>
            Add Courses
          </Link>
        </div>

        <div className={styles.filters}>
          <Dropdown
            label='Filter Courses'
            className={styles.dropdown}
            options={filterOptions}
            onChange={handleFilterChange}
            defaultOption={defaultOption}
          />
        </div>
      </div>
      {userCourses.map((userCourse) => (
        <UserCourseListItem
          key={userCourse.courseId}
          userCourse={userCourse}
          course={courses[userCourse.courseId || '']}
        />
      ))}
    </PageWrapper>
  )
}

export default UserCoursesListPage
