import React, {useEffect, useState} from 'react'

import PageWrapper from 'components/shared/layouts/pageWrapper'
import LoadingOverlay from 'components/shared/loaders/loadingOverlay'
import ErrorPage from './errorPage'
import styles from './homePage.scss'
import UserCourseListItem from "../listItems/userCourseListItem";

import {useAppSelector} from 'redux/hooks'
import RequestService from 'services/request.service'
import {Assignment, Course, UserCourse} from 'devu-shared-modules'

const HomePage = () => {
    const userId = useAppSelector((store) => store.user.id)

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [enrollCourses, setEnrollCourses] = useState(new Array<Course>())
    const [pastCourses, setPastCourses] = useState(new Array<Course>())
    const [assignments, setAssignments] = useState(new Map<Course, Array<Assignment>>())

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const allCourses = await RequestService.get<{
                activeCourses: UserCourse[];
                pastCourses: UserCourse[]
            }>(`/api/courses/user/${userId}`);
            const enrolledCourses: UserCourse[] = allCourses.activeCourses;
            const pastCourses: UserCourse[] = allCourses.pastCourses;

            const coursePromises = enrolledCourses.map(_course => {
                const course = RequestService.get<Course>(`/api/courses/${_course.id}`) // TODO: Optimize out this redundant call
                const assignments = RequestService.get<Assignment[]>(`/api/course/${_course.id}/assignments/released`)
                return Promise.all([course, assignments])
            })
            const pastCoursePromises = pastCourses.map(_course => {
                const course = RequestService.get<Course>(`/api/courses/${_course.id}`)
                return Promise.all([course, assignments])
            })
            const pastCourseResults = await Promise.all(pastCoursePromises)
            const result = await Promise.all(coursePromises)
            const courses = result.map(([course]) => course)
            const assignmentsMap = new Map<Course, Array<Assignment>>()
            result.forEach(([course, assignments]) => assignmentsMap.set(course, assignments))
            setEnrollCourses(courses)
            setPastCourses(pastCourseResults.map(([course]) => course))
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
            </div>

            <div className={styles.coursesContainer}>
                {enrollCourses && enrollCourses.map((course) => (
                    <UserCourseListItem course={course} assignments={assignments.get(course)} key={course.id}/>

                ))}
                {enrollCourses.length === 0 && <h2>You do not have current enrollment yet</h2>}
            </div>

            <div className={styles.header}>
                <div className={styles.smallLine}></div>
                <h1>Completed Courses</h1>
                <div className={styles.largeLine}></div>
            </div>

            <div className={styles.coursesContainer}>
                {pastCourses && pastCourses.map((course) => (
                    <UserCourseListItem course={course} assignments={assignments.get(course)} key={course.id}
                                        past={true}/>
                ))}
                {pastCourses.length === 0 && <h2>You do not have completed courses yet</h2>}
            </div>

        </PageWrapper>
    )
}

export default HomePage