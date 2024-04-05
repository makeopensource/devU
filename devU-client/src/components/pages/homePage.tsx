import React from 'react'
import { useHistory } from 'react-router-dom'

import PageWrapper from 'components/shared/layouts/pageWrapper'
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


const HomePage = () => {
    const history = useHistory()
    const userId = useAppSelector((store) => store.user.id)

    const demoCourses = [
        {
            name : 'Test Course 1',
            semester : 'Fall 2021',
            number : 'CSCI 101',
            startDate : '2021-08-23',
            endDate : '2021-12-10'
        },
        {
            name : 'Test Course 2',
            semester : 'Fall 2022',
            number : 'CSCI 102',
            startDate : '2022-08-23',
            endDate : '2022-12-10'
        },
        {
            name : 'Test Course 3',
            semester : 'Fall 2023',
            number : 'CSCI 103',
            startDate : '2023-08-23',
            endDate : '2023-12-10'
        },
        {
            name : 'Test Course 4',
            semester : 'Fall 2024',
            number : 'CSCI 104',
            startDate : '2024-08-23',
            endDate : '2024-12-10'
        },
        {
            name : 'Test Course 5',
            semester : 'Fall 2025',
            number : 'CSCI 105',
            startDate : '2025-08-23',
            endDate : '2025-12-10'
        },
    ]

    return(
        <PageWrapper>
            <div className={styles.header}>
                <div className={styles.smallLine}></div>
                <h1>Courses</h1>
                <div className={styles.largeLine}></div>

                <Button variant='contained' onClick={() => {
                    history.push(`/users/${userId}/addCoursesForm`)
                }}>Add Course</Button>
            </div>

            <div className={styles.coursesContainer}>
                {demoCourses.map((course, index) => (
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
