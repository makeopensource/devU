import React, { useEffect, useState } from 'react'

import PageWrapper from 'components/shared/layouts/pageWrapper'
import LoadingOverlay from 'components/shared/loaders/loadingOverlay'
import ErrorPage from '../errorPage/errorPage'
import styles from './homePage.scss'
import UserCourseListItem from "../../listItems/userCourseListItem";

import { useAppSelector } from 'redux/hooks'
import RequestService from 'services/request.service'
import { Assignment, Course } from 'devu-shared-modules'
import { useHistory } from "react-router-dom";
const HomePage = () => {
    const userId = useAppSelector((store) => store.user.id)

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [enrollCourses, setEnrollCourses] = useState(new Array<Course>())
    const [upcomingCourses, setupcomingCourses] = useState(new Array<Course>())
    const [pastCourses, setPastCourses] = useState(new Array<Course>())
    const [assignments, setAssignments] = useState(new Map<Course, Array<Assignment>>())
    const [instructorCourses, setInstructorCourses] = useState(new Array<Course>())

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {

        try {
            const assignmentMap = new Map<Course, Array<Assignment>>()
            const allCourses = await RequestService.get<{
                instructorCourses: Course[];
                activeCourses: Course[];
                pastCourses: Course[];
                upcomingCourses: Course[];
            }>(`/api/courses/user/${userId}`);
            const enrolledCourses: Course[] = allCourses.activeCourses;
            const upcomingCourses: Course[] = allCourses.upcomingCourses;
            const pastCourses: Course[] = allCourses.pastCourses;
            const instructorCourses: Course[] = allCourses.instructorCourses;

            const assignmentPromises = enrolledCourses.map((course) => {
                const assignments = RequestService.get<Assignment[]>(`/api/course/${course.id}/assignments/released`)
                return Promise.all([course, assignments])
            })
            const assignmentResults = await Promise.all(assignmentPromises)
            assignmentResults.forEach(([course, assignments]) => assignmentMap.set(course, assignments))

            const assignmentPromises_instructor = instructorCourses.map((course) => {
                const assignments = RequestService.get<Assignment[]>(`/api/course/${course.id}/assignments/released`)
                return Promise.all([course, assignments])
            })
            const assignmentResults_instructor = await Promise.all(assignmentPromises_instructor)
            assignmentResults_instructor.forEach(([course, assignments]) => assignmentMap.set(course, assignments))
            //set
            setAssignments(assignmentMap)
            setPastCourses(pastCourses)
            setEnrollCourses(enrolledCourses)
            setInstructorCourses(instructorCourses)
            setupcomingCourses(upcomingCourses)

        } catch (error: any) {
            setError(error)
        } finally {
            setLoading(false)
        }
    }


    if (loading) return <LoadingOverlay delay={250} />
    if (error) return <ErrorPage error={error} />
    const history = useHistory();
    const handleCourseClick = (courseId: any) => {
        history.push(`/course/${courseId}`); // Assuming your course page route is '/course/:courseId'
    }
    return (
        <PageWrapper>
            <div className={styles.header}>
                {/* <div className={styles.smallLine}></div> */}
                <h1 className={styles.page_title}>DevU Home</h1>
                <div className={styles.buttonContainer}>
                    <button className='btnSecondary' onClick={() => {
                        history.push(`/addCoursesForm`)
                    }}>create course
                    </button>
                    <button className='btnPrimary' onClick={() => {
                        history.push(`/courses`)
                    }}>join course
                    </button>
                </div>
                {/* <div className={styles.largeLine}></div> */}
            </div>
            {/* <div className={styles.header}> */}
                {/* <div className={styles.smallLine}></div> */}
                <h2 className={styles.courses_heading}>Current Courses</h2>
                {/* <div className={styles.largeLine}></div> */}
            {/* </div> */}
            <div className={styles.coursesContainer}>
                {instructorCourses.map((course) => (
                    <div className={styles.courseCard} key={course.id}
                        onClick={() => handleCourseClick(course.id)} style={{ cursor: 'pointer' }}>
                        <UserCourseListItem course={course} assignments={assignments.get(course)} key={course.id}
                            instructor={true} />
                    </div>
                ))}

                {enrollCourses && enrollCourses.map((course) => (
                    <div className={styles.courseCard}
                        key={course.id}
                        onClick={() => handleCourseClick(course.id)} style={{ cursor: 'pointer' }}>
                        <UserCourseListItem course={course} assignments={assignments.get(course)} key={course.id} />
                    </div>
                ))}
                {enrollCourses.length === 0 && instructorCourses.length == 0 && <div className='no_items'>You do not have current enrollment yet</div>}
            </div>
            {/* <div className={styles.header}> */}
                {/* <div className={styles.smallLine}></div> */}
                <h2 className={styles.courses_heading}>Completed Courses</h2>
                {/* <div className={styles.largeLine}></div> */}
            {/* </div> */}
            <div className={styles.coursesContainer}>
                {pastCourses && pastCourses.map((course) => (
                    <div className={styles.courseCard}
                        key={course.id}
                        onClick={() => handleCourseClick(course.id)} style={{ cursor: 'pointer' }}>
                        <UserCourseListItem
                            course={course}
                            assignments={assignments.get(course)}
                            past={true}
                        />
                    </div>
                ))}
                {pastCourses.length === 0 && <div className='no_items'>No completed courses</div>}
            </div>

            {/* <div className={styles.header}> */}
                {/* <div className={styles.smallLine}></div> */}
                <h2 className={styles.courses_heading}>Upcoming Courses</h2>
                {/* <div className={styles.largeLine}></div> */}
            {/* </div> */}

            <div className={styles.coursesContainer}>
                {upcomingCourses && upcomingCourses.map((course) => (
                    <div className={styles.courseCard} key={course.id}
                        onClick={() => handleCourseClick(course.id)} style={{ cursor: 'pointer' }}>
                        <UserCourseListItem course={course} assignments={assignments.get(course)} key={course.id} />
                    </div>
                ))}

                {upcomingCourses.length === 0 && <div className='no_items'>No upcoming courses</div>}
            </div>



        </PageWrapper>
    )
}

export default HomePage