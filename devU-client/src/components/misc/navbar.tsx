import React, { useEffect, useState } from 'react'
import withBreadcrumbs from 'react-router-breadcrumbs-hoc'
import { Link } from 'react-router-dom'
import styles from './navbar.scss'
import RequestService from 'services/request.service'
import { Assignment, Course, User } from 'devu-shared-modules'

const UserBreadcrumb = ({ match }: any) => {
    const [userName, setUserName] = useState('')

    useEffect(() => {
        getUser()
    }, [])

    const getUser = async () => { 
        const user = await RequestService.get<User>( `/api/users/${match.params.userId}` ) 
        setUserName(user.externalId)
    }

    return (<>{userName}</>)
}

const CourseBreadcrumb = ({ match }: any) => {
    const [courseName, setCourseName] = useState('')

    useEffect(() => {
        getCourse()
    }, [])

    const getCourse = async () => { 
        const course = await RequestService.get<Course>( `/api/courses/${match.params.courseId}` ) 
        setCourseName(course.name)
    }

    return (<>{courseName}</>)
}

const AssignmentBreadcrumb = ({ match }: any) => {
    const [assignmentName, setAssignmentName] = useState('')

    useEffect(() => {
        getAssignment()
    }, [])

    const getAssignment = async () => { 
        const assignment = await RequestService.get<Assignment>( `/api/assignments/${match.params.assignmentId}` ) 
        setAssignmentName(assignment.name)
    }

    return (<>{assignmentName}</>)
}

const routes = [
    { path: '/', breadcrumb: 'Home' },
    { path: '/users/:userId', breadcrumb: UserBreadcrumb},
    { path: '/courses/:courseId', breadcrumb: CourseBreadcrumb},
    { path: '/courses/:courseId/assignments/:assignmentId', breadcrumb: AssignmentBreadcrumb},
]

const Navbar = ({breadcrumbs}: any) => {

    return (
        <div>
            {breadcrumbs.map(({breadcrumb, match}: any, index: number) => (
                <span>
                    <Link to={match.url} className={styles.link}> {breadcrumb} </Link>
                    {index < (breadcrumbs.length - 1) ? ' > ' : ''}
                </span>
            ))}
        </div>
    )
        
}

export default withBreadcrumbs(routes, { disableDefaults: true })(Navbar)