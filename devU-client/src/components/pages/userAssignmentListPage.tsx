import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

import { Assignment} from 'devu-shared-modules'

import LoadingOverlay from 'components/shared/loaders/loadingOverlay'
import PageWrapper from 'components/shared/layouts/pageWrapper'
import ErrorPage from './errorPage'
import RequestService from 'services/request.service'

import styles from './userAssignmentsListPage.scss'
import UserAssignmentListItem from 'components/listItems/userAssignmentListItem'
//import Button from 'components/shared/inputs/button'

const UserAssignmentListPage = () => {

  
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [userAssignments, setUserAssignments] = useState(new Array<Assignment>())
  const [assignments, setAssignments] = useState<Record<string, Assignment>>({})

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      // The filter isn't implemented by the API yet
      const userAssignments = await RequestService.get<Assignment[]>(`/api/user-assignments`)
      const assignmentRequests = userAssignments.map((u) => RequestService.get<Assignment>(`/api/assignments/${u.assignmentId}`))
      const assignments = await Promise.all(assignmentRequests)
    
          // Mapify course ids so we can look them up more easilly via their id
      const assignmentMap: Record<string, Assignment> = {}
      for (const assignment of assignments) assignmentMap[assignment.id || ''] = assignment

      setUserAssignments(userAssignments)
      setAssignments(assignmentMap)
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
        <h1>My Assignments</h1>
      </div>
    
      {userAssignments.map((assignment) => (
        <UserAssignmentListItem
          key={assignments.Id}
          assignment={assignment}

          course={assignments[assignment.courseId || '']} 
        />
      ))}
    </PageWrapper>
  )
}
    
export default UserAssignmentListPage