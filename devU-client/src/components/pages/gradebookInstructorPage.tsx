import React, { useEffect, useState } from 'react'
//import { Link } from 'react-router-dom'

import { User, UserCourse, Assignment, AssignmentScore } from 'devu-shared-modules'

import PageWrapper from 'components/shared/layouts/pageWrapper'
import LoadingOverlay from 'components/shared/loaders/loadingOverlay'
import ErrorPage from './errorPage'

import RequestService from 'services/request.service'

import styles from './gradebookPage.scss'
import { useParams } from 'react-router-dom'

type TableProps = {
    users: User[]
    userCourses: UserCourse[]
    assignments: Assignment[]
    assignmentScores: AssignmentScore[]
}
type RowProps = {
    
}

const TableRow = ({}: RowProps) => {
    return (
        <div>
            hi
        </div>
    )
}

const GradebookTable = ({users, userCourses, assignments, assignmentScores}: TableProps) => {
    
    return (
        <div>
            {users}
            <TableRow/>
        </div>
    )
}

const GradebookInstructorPage = () => {

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [users, setUsers] = useState(new Array<User>()) //All users in the course
    const [userCourses, setUserCourses] = useState(new Array<UserCourse>()) //All user-course connections for the course
    const [assignments, setAssignments] = useState(new Array<Assignment>()) //All assignments in the course
    const [assignmentScores, setAssignmentScores] = useState(new Array<AssignmentScore>()) //All assignment scores for assignments in the course
    
    const { courseId } = useParams<{courseId: string}>()
    
    useEffect(() => {
        fetchData()
      }, [])
    
    const fetchData = async () => {
        try {
            const users = new Array<User>()
            const assignmentScores = new Array<AssignmentScore>()

            const userCourses = await RequestService.get<UserCourse[]>( `/api/user-courses/course/${courseId}` )
            setUserCourses(userCourses)

            userCourses.map(async (uc) => {
                if (uc.level === 'student') {
                     users.push(await RequestService.get<User>( `/api/users/${uc.userId}`))
                }
            })
            setUsers(users)

            const assignments = await RequestService.get<Assignment[]>( `/api/assignments/course/${courseId}` )
            setAssignments(assignments)

            assignments.map(async (a) => {
                assignmentScores.push(... await RequestService.get<AssignmentScore[]>( `/api/assignment-scores/${a.id}`))
            })
            setAssignmentScores(assignmentScores)

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
                Instructor Gradebook
            </div>
            <div>
                <GradebookTable 
                    users={users}
                    userCourses={userCourses}
                    assignments={assignments}
                    assignmentScores={assignmentScores}
                />
            </div>
            
        </PageWrapper>
    )
}

export default GradebookInstructorPage
