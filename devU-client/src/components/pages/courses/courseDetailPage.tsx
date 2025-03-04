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
//import { useAppSelector} from "../../../redux/hooks";

const CourseDetailPage = () => {
    const { courseId } = useParams<{ courseId: string }>();
    const [courseInfo, setCourseInfo] = useState<Course | null>(null);
    const [categoryMap, setCategoryMap] = useState<Record<string, Assignment[]>>({});
    const history = useHistory();
    //const role = useAppSelector((store) => store.roleMode);

    const fetchCourseInfo = async () => {
        RequestService.get<Course>(`/api/courses/${courseId}`).then((course) => {
            setCourseInfo(course);
        });

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
                            <h1>
                                {courseInfo.number}: {courseInfo.name} ({courseInfo.semester})
                            </h1>

                            {/* Updated Buttons Below the Course Title */}
                            <div className={styles.buttonContainer}>
                                <button className='btnSecondary' onClick={() => history.push(`/course/${courseId}/gradebook`)}>
                                    Gradebook
                                </button>
                                <button className='btnSecondary' onClick={() => window.open('URL_TO_COURSE_WEBSITE', '_blank')}>
                                    Course Website
                                </button>
                                <button className='btnSecondary' onClick={() => window.open('URL_TO_PIAZZA', '_blank')}>
                                    Piazza
                                </button>

                                
                            </div>
                        </div>

                        <h3>Assignments</h3>

                        <div className={styles.assignmentsContainer}>
                            {Object.keys(categoryMap).length > 0 ? (
                                <div className={styles.coursesContainer}>
                                    {Object.keys(categoryMap).map((category, index) => (
                                        <Card key={index} className={styles.courseCard}>
                                            <CardContent>
                                                <Typography variant="h5" className={styles.color} style={{ textAlign: 'center' }}>
                                                    {category}
                                                </Typography>
                                            </CardContent>
                                            <List>
                                                {categoryMap[category].map((assignment, index) => (
                                                    <ListItem key={index} disablePadding>
                                                        <ListItemButton onClick={() => history.push(`/course/${courseId}/assignment/${assignment.id}`)}>
                                                            <ListItemText
                                                                className={styles.assignmentName}
                                                                primary={
                                                                    <Typography style={{ textAlign: 'center' }}>{assignment.name}</Typography>
                                                                }
                                                                secondary={
                                                                    <Typography variant="body2" color="grey">
                                                                        Start: {new Date(assignment.startDate).toLocaleDateString()} | Due: {new Date(assignment.dueDate).toLocaleDateString()}
                                                                    </Typography>
                                                                }
                                                            />
                                                        </ListItemButton>
                                                    </ListItem>
                                                ))}
                                            </List>
                                        </Card>
                                    ))}
                                </div>
                            ) : (
                                <p>No assignments available</p>
                            )}
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
