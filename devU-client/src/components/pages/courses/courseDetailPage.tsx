import React, {useEffect, useState} from 'react'
import {useHistory, useParams} from 'react-router-dom'
import RequestService from 'services/request.service'
import {Assignment, Course} from 'devu-shared-modules'
//import {useHistory} from "react-router-dom";
import PageWrapper from 'components/shared/layouts/pageWrapper'
import {wordPrintDate} from 'utils/date.utils'


import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
//import Button from '@mui/material/Button'



import styles from './courseDetailPage.scss'
//import {SET_ALERT} from "../../../redux/types/active.types";
import {useAppSelector} from "../../../redux/hooks"; //useActionless, 
import {prettyPrintSemester} from "../../../utils/semester.utils";

//import TextField from "../../shared/inputs/textField";
//import {useActionless, useAppSelector} from "redux/hooks";





const CourseDetailPage = () => {
    const { courseId } = useParams<{courseId: string}>()
    const [courseInfo, setCourseInfo] = useState<Course | null>(null)
    const [categoryMap, setCategoryMap] = useState<Record<string, Assignment[]>>({})
    //const [setAlert] = useActionless(SET_ALERT)
    const role = useAppSelector((store) => store.roleMode);
    const history = useHistory()


    const fetchCourseInfo = async () => {
        RequestService.get<Course>(`/api/courses/${courseId}`)
        .then((course) => {
            setCourseInfo(course)

        })
        RequestService.get<Assignment[]>(`/api/course/${courseId}/assignments/released`)
        .then((assignments) => {
            console.log(assignments)
            let categoryMap : Record<string, Assignment[]> = {}
            assignments.forEach((assignment : Assignment) => {
                if (assignment.categoryName in categoryMap) {
                    categoryMap[assignment.categoryName].push(assignment)
                }
                else {
                    categoryMap[assignment.categoryName] = [assignment]
                }
            })
            setCategoryMap(categoryMap)
        })


    }


    useEffect(() => {
        fetchCourseInfo();
        console.log("User Role:", role);
        console.log("Is Instructor?", role.isInstructor ? role.isInstructor() : "role.isInstructor() is undefined");
    }, []);


    

    return (
        <PageWrapper>
            {courseInfo ? (
                        <div>
1.
                                {role.isInstructor() &&(
                                <button className={styles.assignment_actual_button} onClick={() => {
                                    history.push(`/course/${courseId}/createAssignment`)
                                }}>Add Assignment
                                </button>
                                    )}
                                
                                {role.isInstructor() &&(
                                <button className={styles.edit_actual_button} onClick={() => {
                                    history.push(`/course/${courseId}/createAssignment`)
                                }}>Edit Course
                                </button>
                                    )}
                        </div>

                            



                            <div className={styles.coursesContainer}>
                            {Object.keys(categoryMap).map((category, index) => (

                                <Card key={index} className={styles.courseCard} style = {{borderRadius: '15px', height: 'fit-content', boxShadow: 'none', backgroundColor: 'var(--primary)'}}>
                                    <CardContent sx={{padding:'0'}}>
                                        <Typography variant="h5" className={styles.categoryName} style={{ textAlign : 'center', fontWeight : 600, fontSize: '1.2rem' }}>
                                            {category}
                                        </Typography>
                                    </CardContent>
                                    <List disablePadding style={{backgroundColor:'var(--background)'}}>
                                        {categoryMap[category].map((assignment, index) => (
                                            <ListItem key={index}  disablePadding>
                                                <ListItemButton sx={{padding: 0}} onClick={() => {
                                                    history.push(`/course/${courseId}/assignment/${assignment.id}`)
                                                }}>
                                                    <ListItemText style={{margin : 0}}
                                                        className = {styles.assignmentName}
                                                        primary={
                                                            <Typography>
                                                                {assignment.name}
                                                            </Typography>
                                                        }
                                                                  secondary={
                                                                      <React.Fragment>
                                                                          <div className={styles.due_end}>
                                                                            <span style={{fontWeight:'700'}}>Due:&nbsp;</span>{wordPrintDate(assignment.dueDate)} | &nbsp;
                                                                            <span style={{fontWeight:'700'}}>End:&nbsp;</span>{wordPrintDate(assignment.endDate)}
                                                                        </div>
                                                                      </React.Fragment>
                                                                  }
                                                    />

                                                </ListItemButton>
                                            </ListItem>
                                        ))}
                                    </List>
                                </Card>

                            ))} 
                            </div>
                            <div>
                                {Object.keys(categoryMap).length === 0 && <div className='no_items'>No assignments yet</div>}
                            </div>
                        </div>




                    ) : (
                    <h1>Error fetching Course Information</h1>
                    )}


                </PageWrapper>
            )
            }


            export default CourseDetailPage