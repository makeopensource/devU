import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

import { Course, User } from 'devu-shared-modules'
import { useActionless } from 'redux/hooks'
import { UPDATE_USER } from 'redux/types/user.types'
import { SET_ALERT } from 'redux/types/active.types'

import RequestService from 'services/request.service'

import ErrorPage from 'components/pages/errorPage/errorPage'
import PageWrapper from 'components/shared/layouts/pageWrapper'
import LoadingOverlay from 'components/shared/loaders/loadingOverlay'
import EditUserForm from 'components/forms/editUserForm'
import FaIcon from 'components/shared/icons/faIcon'


import styles from './userDetailPage.scss'

type UrlParams = {
  userId: string
}

const UserDetailPage = ({}) => {
  const { userId } = useParams<UrlParams>()
  const [updateUser] = useActionless(UPDATE_USER)
  const [setAlert] = useActionless(SET_ALERT)

  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState({} as User)
  const [error, setError] = useState(null)
  const [courses, setCourses] = useState<Course[]>([])

  useEffect(() => {
    // Fetch user info
    RequestService.get<User>(`/api/users/${userId}`)
      .then(setUser)
      .catch(setError)

    // Get activeCourses first
    RequestService.get<{
      instructorCourses: { id: number }[];
      activeCourses: { id: number }[];
      pastCourses: { id: number }[];
      upcomingCourses: { id: number }[];
    }>(`/api/courses/user/${userId}`)
      .then(async (data) => {
        const activeCourses = data.activeCourses

        const courseFetches = await Promise.all(
          activeCourses.map(async (c) => {
            try {
              const courseDetails = await RequestService.get<Course>(`/api/courses/${c.id}`)
              return courseDetails
            } catch {
              return {
                id: c.id,
                name: '[No title]',
                semester: '',
                number: '',
                startDate: '',
                endDate: ''
              } as Course
            }
          })
        )

        setCourses(courseFetches)
      })
      .catch((err) => {
        setAlert({ autoDelete: false, type: 'error', message: 'Failed to load courses' })
        console.error('Course fetch error:', err)
      })
      .finally(() => setLoading(false))
  }, [])

  const handleDropCourse = (courseId: number) => {
    const confirmDrop = window.confirm("Are you sure you want to drop?");
    if (confirmDrop) {
      RequestService.delete(`/api/course/${courseId}/user-courses`)
        .then(() => {
          setAlert({ autoDelete: true, type: 'success', message: 'Course Dropped' })
          setCourses((prev) => prev.filter((c) => c.id !== courseId))
        })
        .catch((error: Error) => {
          setAlert({ autoDelete: false, type: 'error', message: error.message })
        });
    }
  }

  if (loading) return <LoadingOverlay delay={250} />
  if (error) return <ErrorPage error={error} />

  return (
    <PageWrapper className={styles.container}>
      <div className={styles.userPageLayout}>
        <div className={styles.userFormSection}>
          <EditUserForm user={user} onSubmit={updateUser} />
        </div>

        <div className={styles.dropCoursesSection}>
          <h2>Drop Course</h2>
          <ul className={styles.courseList}>
            {courses.length > 0 ? (
              courses.map((course) => (
                <li key={course.id} className={styles.courseItem}>
                  <span className={styles.courseTitle}>
                    {course.name} {course.number && `(${course.number})`}
                  </span>
                  <span
                    className={styles.trashIcon}
                    onClick={() => handleDropCourse(course.id!)}
                    title="Drop Course"
                  >
                    <FaIcon regularIcon='trash'/>
               </span>
                </li>
              ))
            ) : (
              <p style={{textAlign: 'center'}}>No enrolled courses.</p>
            )}
          </ul>
        </div>
      </div>
    </PageWrapper>
  )
}

export default UserDetailPage
