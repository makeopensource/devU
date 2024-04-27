import React, { useEffect, useState } from 'react'

import PageWrapper from 'components/shared/layouts/pageWrapper'
import { Assignment } from 'devu-shared-modules'
import RequestService from 'services/request.service'
import ErrorPage from './errorPage'
import LoadingOverlay from 'components/shared/loaders/loadingOverlay'
import { Link, useParams } from 'react-router-dom'

import styles from './courseAssignmentsListPage.scss'
import { useAppSelector } from '../../redux/hooks'


const CourseAssignmentsListPage = () => {

  const role = useAppSelector((store) => store.roleMode)
  const { courseId } = useParams<{ courseId: string }>()
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const [assignments, setAssignments] = useState(new Array<Assignment>())

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const assignments = await RequestService.get(`/api/course/${courseId}/assignments`)
      setAssignments(assignments)
    } catch (error) {
      setError(error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <LoadingOverlay delay={250} />
  if (error) return <ErrorPage error={error} />

  return (
    <PageWrapper>
      <div className={styles.header}>
        <h1>Course Assignments List Page</h1>

        <div>
          {( role.isInstructor() &&
            <Link className={styles.button} to={`/courses/${courseId}/assignments/create`}>Add Assignments</Link>
          )}
        </div>
      </div>


      {assignments.map(assignment => (
        <div>
          <Link
            className={styles.assignmentName}
            to={{ pathname: `/courses/${assignment.courseId}/assignments/${assignment.id}`, state: assignment }}
          >
            {assignment.name}</Link>
        </div>
      ))}
    </PageWrapper>
  )
}

export default CourseAssignmentsListPage
