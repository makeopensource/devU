import React, {useEffect, useState} from 'react'
import {Course, UserCourse} from 'devu-shared-modules'
import LoadingOverlay from 'components/shared/loaders/loadingOverlay'
import PageWrapper from 'components/shared/layouts/pageWrapper'
import Dropdown, {Option} from 'components/shared/inputs/dropdown'
import ErrorPage from './errorPage'
import RequestService from 'services/request.service'
import styles from './coursesListPage.scss'
import CourseListItem from "../listItems/courseListItem";
import {useAppSelector} from "../../redux/hooks";
import Button from "@mui/material/Button";
import {useHistory} from "react-router-dom";

type Filter = true | false

const filterOptions: Option<Filter>[] = [
    {label: 'Expand All', value: true},
    {label: 'Collapse All', value: false},
]

const UserCoursesListPage = () => {


    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [userCourses, setUserCourses] = useState(new Array<UserCourse>())
    const [filter, setFilter] = useState<Filter>(false )
    const role = useAppSelector((store) => store.roleMode)
    const history = useHistory()

    //Temporary place to store state for all courses
    const [allCourses, setAllCourses] = useState(new Array<Course>())

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            // const userCourses = await RequestService.get<UserCourse[]>(`/api/user-courses?filterBy=${filter}`)
            const courseRequests = userCourses.map((u) => RequestService.get<Course>(`/api/courses/${u.courseId}`))
            const courses = await Promise.all(courseRequests)

            // Mapify course ids so we can look them up more easilly via their id
            const courseMap: Record<string, Course> = {}
            for (const course of courses) courseMap[course.id || ''] = course

            // Temporary place to grab and display all courses
            const allCourses = await RequestService.get('/api/courses')
            setAllCourses(allCourses)

            setUserCourses(userCourses)
        } catch (error: any) {
            setError(error)
        } finally {
            setLoading(false)
        }
    }

    const handleFilterChange = (updatedFilter: Filter) => {
        setFilter(updatedFilter)
    }

    if (loading) return <LoadingOverlay delay={250}/>
    if (error) return <ErrorPage error={error}/>

    const defaultOption = filterOptions.find((o) => o.value === filter)


    return (
        <PageWrapper>
            <div className={styles.header}>
                <div className={styles.smallLine}></div>
                <h1>All Courses</h1>
                <div className={styles.largeLine}></div>

                {role.isInstructor() && <Button variant="contained" onClick={() => {
                    history.push(`/addCoursesForm`)
                }}>Add Course</Button>
                }
                <div className={styles.filters}>
                    <Dropdown
                        label='Courses Display Options'
                        className={styles.dropdown}
                        options={filterOptions}
                        onChange={handleFilterChange}
                        defaultOption={defaultOption}
                    />
                </div>
            </div>
            {allCourses.map(course => (
                <CourseListItem course={course} key={course.id} isOpen={filter}/>
            ))}
        </PageWrapper>
    )


}

export default UserCoursesListPage
