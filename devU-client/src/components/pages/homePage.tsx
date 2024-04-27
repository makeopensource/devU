import React, {useEffect, useState} from 'react'

import PageWrapper from 'components/shared/layouts/pageWrapper'
import LoadingOverlay from 'components/shared/loaders/loadingOverlay'
import ErrorPage from './errorPage'
import styles from './homePage.scss'
import UserCourseListItem from "../listItems/userCourseListItem";

import {useAppSelector} from 'redux/hooks'
import RequestService from 'services/request.service'
import {Assignment, Course} from 'devu-shared-modules'

const HomePage = () => {
    const userId = useAppSelector((store) => store.user.id)

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [enrollCourses, setEnrollCourses] = useState(new Array<Course>())
    const [pastCourses, setPastCourses] = useState(new Array<Course>())
    const [assignments, setAssignments] = useState(new Map<Course, Array<Assignment>>())
    const [instructorCourses, setInstructorCourses] = useState(new Array<Course>())

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        const assignmentMap = new Map<Course, Array<Assignment>>()
        try {
            const assignmentMap = new Map<Course, Array<Assignment>>()
            const allCourses = await RequestService.get<{
                instructorCourses: Course[];
                activeCourses: Course[];
                pastCourses: Course[];
                upcomingCourses: Course[];//TODO: Add upcoming courses feature
            }>(`/api/courses/user/${userId}`);
            const enrolledCourses: Course[] = allCourses.activeCourses;

            const pastCourses: Course[] = allCourses.pastCourses;
            const instructorCourses: Course[] = allCourses.instructorCourses;

            const assignmentPromises = enrolledCourses.map((course) => {
                const assignments = RequestService.get<Assignment[]>(`/api/course/${course.id}/assignments/released`)
                return Promise.all([course, assignments])
            })
            const assignmentResults = await Promise.all(assignmentPromises)
            assignmentResults.forEach(([course, assignments]) => assignmentMap.set(course, assignments))

            setAssignments(assignmentMap)
            setPastCourses(pastCourses)
            setEnrollCourses(enrolledCourses)
            setInstructorCourses(instructorCourses)

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
                {instructorCourses && instructorCourses.map((course) => (
                    <UserCourseListItem course={course} assignments={assignments.get(course)} key={course.id}
                                        instructor={true}/>
                ))}
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