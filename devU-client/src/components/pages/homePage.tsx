import React, {useEffect, useState} from 'react'

import PageWrapper from 'components/shared/layouts/pageWrapper'
import LoadingOverlay from 'components/shared/loaders/loadingOverlay'
import ErrorPage from './errorPage'
import styles from './homePage.scss'
import UserCourseListItem from "../listItems/userCourseListItem";
import Button from '@mui/material/Button'


import {useAppSelector} from 'redux/hooks'
import RequestService from 'services/request.service'
import {Assignment, Course, UserCourse} from 'devu-shared-modules'
import {useHistory} from 'react-router-dom'

const HomePage = () => {
    const userId = useAppSelector((store) => store.user.id)
    const role = useAppSelector((store) => store.roleMode)
    const history = useHistory()

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [courses, setCourses] = useState(new Array<Course>())
    const [assignments, setAssignments] = useState(new Map<Course, Array<Assignment>>())

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const enrolledCourses = await RequestService.get<UserCourse[]>( `/api/courses/user/${userId}` )
            const coursePromises = enrolledCourses.map(_course => {
                const course = RequestService.get<Course>(`/api/courses/${_course.id}`) // TODO: Optimize out this redundant call
                const assignments = RequestService.get<Assignment[]>(`/api/course/${_course.id}/assignments/`)
                return Promise.all([course, assignments])

            })
            const result = await Promise.all(coursePromises)
            const courses = result.map(([course]) => course)
            const assignmentsMap = new Map<Course, Array<Assignment>>()
            result.forEach(([course, assignments]) => assignmentsMap.set(course, assignments))
            setCourses(courses)
            setAssignments(assignmentsMap)
        } catch (error) {
            setError(error)
        } finally {
            setLoading(false)
        }
    }


    if (loading) return <LoadingOverlay delay={250} />
    if (error) return <ErrorPage error={error} />

    return(
        <PageWrapper>
            <div className={styles.header}>
                <div className={styles.smallLine}></div>
                <h1>My Courses</h1>
                <div className={styles.largeLine}></div>

                {role.isInstructor() && <Button variant="contained" onClick={() => {
                    history.push(`/users/${userId}/addCoursesForm`)
                }}>Add Course</Button>
                }
            </div>

            <div className={styles.coursesContainer}>
                {courses.map((course) => (
                    <UserCourseListItem course={course} assignments={assignments.get(course)} key={course.id}/>

                ))}
            </div>
        </PageWrapper>
    )
}

export default HomePage