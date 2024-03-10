import React from 'react'
import { Link, useParams } from 'react-router-dom'

import PageWrapper from 'components/shared/layouts/pageWrapper'
import styles from './courseDetailPage.scss'

const CourseDetailPage = () => {
    const { courseId } = useParams<{courseId: string}>()

    return(
        <PageWrapper>
            <h1>Course Detail Page</h1>
            <Link className = {styles.assignmentName} to={`/courses/${courseId}/assignments`}>See Assignments</Link> <br/>
            <Link className = {styles.assignmentName} to={`/courses/${courseId}/gradebook`}>View Gradebook</Link>
        </PageWrapper>
    )
}

export default CourseDetailPage