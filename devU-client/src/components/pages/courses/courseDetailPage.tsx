import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import RequestService from 'services/request.service';
import { Assignment, Course } from 'devu-shared-modules';
import PageWrapper from 'components/shared/layouts/pageWrapper';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';

import styles from './courseDetailPage.scss';
//import { SET_ALERT } from '../../../redux/types/active.types';
import { useAppSelector } from "../../../redux/hooks";
import AddAssignmentModal from '../forms/assignments/assignmentFormPage';
import { prettyPrintSemester } from 'utils/semester.utils';
import { wordPrintDate } from 'utils/date.utils';

const CourseDetailPage = () => {
    const { courseId } = useParams<{ courseId: string }>();
    const [courseInfo, setCourseInfo] = useState<Course | null>(null);
    const [categoryMap, setCategoryMap] = useState<Record<string, Assignment[]>>({});
    const history = useHistory();
    const role = useAppSelector((store) => store.roleMode);

    const [openModal, setOpenModal] = useState(false);

    const handleCloseModal = () => {
        fetchNewAssignments()
        setOpenModal(false);
    };

    // const[User, setUser]= useState < User <string>,preferredName>>({})

    // const role = useAppSelector((store) => store.roleMode)
    /* const fetchUserinfo = async () => {
         RequestService.get< typeof User>('api/users')
             .then((User) =>{
                 setUser(User)
 
     })
 */


    const fetchCourseInfo = async () => {
        RequestService.get<Course>(`/api/courses/${courseId}`).then((course) => {
            setCourseInfo(course);
        });

        fetchNewAssignments();
    };

    const fetchNewAssignments = async () => {
        RequestService.get<Assignment[]>(`/api/course/${courseId}/assignments/released`).then((assignments) => {
            let categoryMap: Record<string, Assignment[]> = {};
            assignments.forEach((assignment: Assignment) => {
                if (assignment.categoryName in categoryMap) {
                    categoryMap[assignment.categoryName].push(assignment);
                } else {
                    categoryMap[assignment.categoryName] = [assignment];
                }
            });
            setCategoryMap(categoryMap);
        });
    };


    useEffect(() => {
        fetchCourseInfo();
    }, []);

    return (
        <PageWrapper>
            <div className={styles.courseDetailPage}>
                {courseInfo ? (
                    <div>
                        {/* Course Title */}
                        <div className={styles.header}>
                            <h1 className={styles.class_title}>{courseInfo.number}: {courseInfo.name}</h1>
                            {role.isInstructor() && (
                                <button className='btnPrimary' id={styles.parallel_button} onClick={() => {
                                    history.push(`/course/${courseId}/update`)
                                }}>Edit Course
                                </button>
                            )}
                        </div>
                        <div className={styles.subheader}>
                            <div className={styles.meta_container}>
                                <div>
                                    <h4>Instructor:</h4>
                                </div>
                                <div>
                                    <h4>Section:</h4>
                                </div>
                                <div>
                                    <h4>Semester: </h4><span>{prettyPrintSemester(courseInfo.semester)}</span>
                                </div>
                            </div>
                            <div>
                                <h3>Course Links</h3>
                                <div className={styles.buttons_container}>
                                    <button className='btnSecondary' onClick={() => {
                                        history.push(`/course/${courseId}/gradebook`)
                                    }}>Gradebook
                                    </button>
                                </div>
                                <AddAssignmentModal open={openModal} onClose={handleCloseModal} />
                            </div>
                        </div>
                        <div className={styles.subheader}><h3>Assignments</h3>
                            {role.isInstructor() &&(
                                <button className='btnPrimary' id={styles.parallel_button} onClick={() => {
                                    setOpenModal(true)}}>Add Assignment
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
            </div>
        </PageWrapper>
    );
};

export default CourseDetailPage;
