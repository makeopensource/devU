import React, {useEffect, useState} from 'react'
import {Assignment, Course, Submission} from 'devu-shared-modules'

import LoadingOverlay from 'components/shared/loaders/loadingOverlay'
import PageWrapper from 'components/shared/layouts/pageWrapper'
import SubmissionListItem from 'components/listItems/submissionListItem'
import Dropdown, {Option} from 'components/shared/inputs/dropdown'
import ErrorPage from './errorPage'

import RequestService from 'services/request.service'
import LocalStorageService from 'services/localStorage.service'

import styles from './userSubmissionsListPage.scss'
import {useAppSelector} from 'redux/hooks'

const ORDER_BY_STORAGE_KEY = 'submissions_order_by'
const GROUP_BY_STORAGE_KEY = 'submissions_group_by'

type OrderBy = 'submittedAt' | 'dueAt' | 'assignmentName' | 'courseName'
type GroupBy = 'id' | 'assignmentId' | 'courseId'

const orderByOptions: Option<OrderBy>[] = [
  { label: 'Submitted At', value: 'submittedAt' },
  { label: 'Due At', value: 'dueAt' },
  { label: 'Assignment', value: 'assignmentName' },
  { label: 'Course', value: 'courseName' },
]

const groupByOptions: Option<GroupBy>[] = [
  { label: 'None', value: 'id' },
  { label: 'Assignment', value: 'assignmentId' },
  { label: 'Course', value: 'courseId' },
]

const UserCoursesListPage = () => {
  const defaultOrderBy = LocalStorageService.get<OrderBy>(ORDER_BY_STORAGE_KEY) || 'submittedAt'
  const defaultGroupBy = LocalStorageService.get<GroupBy>(GROUP_BY_STORAGE_KEY) || 'id'

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [submissions, setSubmissions] = useState(new Array<Submission>())
  const [courses, setCourses] = useState<Record<string, Course>>({})
  const [assignments, setAssignments] = useState<Record<string, Assignment>>({})

  const [orderBy, setOrderBy] = useState<OrderBy>(defaultOrderBy)
  const [groupBy, setGroupBy] = useState<GroupBy>(defaultGroupBy)

  const userId = useAppSelector((store) => store.user.id)

  useEffect(() => {
    fetchData(orderBy, groupBy)
  }, [])

  const fetchData = async (orderBy: OrderBy, groupBy: GroupBy) => {
    try {
      const submissions = await RequestService.get<Submission[]>(
        `/api/submissions?orderBy=${orderBy}&groupBy=${groupBy}&user=${userId}`,
      )

      const courseRequests = submissions.map((s) => RequestService.get<Course>(`/api/courses/${s.courseId}`))
      const assignmentRequests = submissions.map((s) =>
          // TODO: Get courseId and update path
        RequestService.get<Assignment>(`/api/course/???/assignments/${s.assignmentId}`),
      )

      const courses = await Promise.all(courseRequests)
      const assignments = await Promise.all(assignmentRequests)

      // Mapify course & assignment ids so we can look them up more easilly with our submission
      const courseMap: Record<string, Course> = {}
      for (const course of courses) courseMap[course.id || ''] = course

      const assignmentMap: Record<string, Assignment> = {}
      for (const assignment of assignments) assignmentMap[assignment.id || ''] = assignment

      setSubmissions(submissions)
      setAssignments(assignmentMap)
      setCourses(courseMap)
    } catch (error) {
      setError(error)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (updatedOrderBy: OrderBy) => {
    setOrderBy(updatedOrderBy)
    fetchData(updatedOrderBy, groupBy)

    LocalStorageService.set(ORDER_BY_STORAGE_KEY, updatedOrderBy)
  }

  const handleGroupByChange = (updatedGroupBy: GroupBy) => {
    setGroupBy(updatedGroupBy)
    fetchData(orderBy, updatedGroupBy)

    LocalStorageService.set(GROUP_BY_STORAGE_KEY, updatedGroupBy)
  }

  if (loading) return <LoadingOverlay delay={250} />
  if (error) return <ErrorPage error={error} />

  const defaultOrderByOption = orderByOptions.find((o) => o.value === orderBy)
  const defaultGroupByOption = groupByOptions.find((o) => o.value === groupBy)


  return (
    <PageWrapper>
      <div className={styles.header}>
        <div className={styles.smallLine}></div>

        <h1>My Submissions</h1>
        <div className={styles.largeLine}></div>
        <div className={styles.filters}>
          <Dropdown
              label='Group By'
              className={styles.dropdown}
              options={groupByOptions}
              onChange={handleGroupByChange}
              defaultOption={defaultGroupByOption}
          />
          <Dropdown
              label='Order By'
              className={styles.dropdown}
              options={orderByOptions}
              onChange={handleFilterChange}
              defaultOption={defaultOrderByOption}
          />
        </div>
      </div>
      {submissions.map((submission) => (
          <SubmissionListItem
              key={submission.id}
              submission={submission}
          assignment={assignments[submission.assignmentId]}
          course={courses[submission.courseId]}
        />
      ))}
    </PageWrapper>
  )
}

export default UserCoursesListPage
