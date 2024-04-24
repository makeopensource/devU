import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'

import PageWrapper from 'components/shared/layouts/pageWrapper'
import LoadingOverlay from 'components/shared/loaders/loadingOverlay'
import ErrorPage from './errorPage'
import styles from './homePage.scss'


import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import { CardActionArea } from '@mui/material'
import Button from '@mui/material/Button'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'

import { useAppSelector } from 'redux/hooks'
import RequestService from 'services/request.service'
import { Course, UserCourse } from 'devu-shared-modules'


const HomePage = () => {
    const history = useHistory()
    const userId = useAppSelector((store) => store.user.id)
    const role = useAppSelector((store) => store.roleMode)

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [courses, setCourses] = useState(new Array<Course>())

    useEffect(() => {
        fetchData()
      }, [])

    const fetchData = async () => {
        try {
            const userCourses = await RequestService.get<UserCourse[]>( `/api/user-courses/user/${userId}` )
            const coursePromises = userCourses.map(uc => (
                RequestService.get<Course>( `/api/courses/${uc.courseId}` )
            ))
            setCourses(await Promise.all(coursePromises))

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
                <h1>Courses</h1>
                <div className={styles.largeLine}></div>

                {role.isInstructor() && <Button variant="contained" onClick={() => {
                    history.push(`/users/${userId}/addCoursesForm`)
                }}>Add Course</Button>
                }
            </div>

            <div className={styles.coursesContainer}>
                {courses.map((course, index) => (
                    <Card sx={{maxWidth: 345}} key={index}>
                    <CardActionArea>
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="div">
                                {course.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {course.number}
                                <br/>
                                {course.semester}
                                <br/>
                                {course.startDate} - {course.endDate}
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                    <List>
                        <ListItem disablePadding>
                            <ListItemButton>
                                <ListItemText primary='Assignment 1' />
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton>
                                <ListItemText primary='Assignment 2' />
                            </ListItemButton>
                        </ListItem>
                    </List>
                    </Card>
               ))}
            </div>

            <div className={styles.header}>
                <div className={styles.smallLine}></div>
                <h1>Previous Courses</h1>
                <div className={styles.largeLine}></div>                
            </div>

        </PageWrapper>
    )
}

export default HomePage
