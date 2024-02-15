import React,{useEffect,useState} from 'react'

import PageWrapper from 'components/shared/layouts/pageWrapper'
import {Assignment} from 'devu-shared-modules'
import RequestService from 'services/request.service'
import ErrorPage from './errorPage'
import LoadingOverlay from 'components/shared/loaders/loadingOverlay'
import { Link } from 'react-router-dom'

import styles from './courseAssignmentsListPage.scss'


const CourseAssignmentsListPage = () => {

    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(true)
    const [assignments, setAssignments] = useState(new Array<Assignment>())

    useEffect(() => {
        fetchData()
      }, [])

    const fetchData = async () => {
        try {
            const assignments = await RequestService.get('/api/assignments')
            setAssignments(assignments)
        }catch(error){
            setError(error)
        }finally{
            setLoading(false)
        }
    }

    if (loading) return <LoadingOverlay delay={250} />
    if (error) return <ErrorPage error={error} />

    return(
        <PageWrapper>
            <h1>Course Assignments List Page</h1>
            {assignments.map(assignment => (
                <div>
                    <Link className={styles.assignmentName} to={`/courses/${assignment.courseId}/assignments/${assignment.id}`}>{assignment.name}</Link>
                </div>
            ))}
        </PageWrapper>
    )
}

export default CourseAssignmentsListPage
