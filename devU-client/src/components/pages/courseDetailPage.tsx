import React from 'react'
import { Link } from 'react-router-dom'

import PageWrapper from 'components/shared/layouts/pageWrapper'
import styles from './courseDetailPage.scss'

const CourseDetailPage = (props : any) => {
    const { state } = props.location

    return(
        <PageWrapper>
            <h1>Course Detail Page</h1>
            <Link className = {styles.assignmentName} to={`/courses/${state.id}/assignments`}>See Assignments</Link>
        </PageWrapper>
    )
}

export default CourseDetailPage