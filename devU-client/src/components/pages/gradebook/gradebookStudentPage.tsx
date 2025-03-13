import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useAppSelector } from 'redux/hooks';

import { Assignment, AssignmentScore, Course } from 'devu-shared-modules';

import PageWrapper from 'components/shared/layouts/pageWrapper';
import LoadingOverlay from 'components/shared/loaders/loadingOverlay';
import ErrorPage from '../errorPage/errorPage';

import RequestService from 'services/request.service';

import styles from './gradebookStudentPage.scss';

const GradebookStudentPage = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [assignmentScores, setAssignmentScores] = useState<AssignmentScore[]>([]);
    const role = useAppSelector((store) => store.roleMode);
    const { courseId } = useParams<{ courseId: string }>();
    const userId = useAppSelector((store) => store.user.id);
    const history = useHistory();
    const [courseName, setCourseName] = useState<string>(""); 
    const [categories, setCategories] = useState<String[]>([])


    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const assignments = await RequestService.get<Assignment[]>(`/api/course/${courseId}/assignments/released`);
            setAssignments(assignments);

            const assignmentScores = await RequestService.get<AssignmentScore[]>(`/api/course/${courseId}/assignment-scores/user/${userId}`);
            setAssignmentScores(assignmentScores);
            
            const courseData = await RequestService.get<Course>(`/api/courses/${courseId}`);
            setCourseName(courseData.name);
            
            const categories = [...new Set(assignments.map(a => a.categoryName))];
            setCategories(categories);

        } catch (error: any) {
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <LoadingOverlay delay={250} />;
    if (error) return <ErrorPage error={error} />;

    // Categorize assignments

    const calculateAverage = () => {
        if (assignmentScores.length === 0) return 0.0;
        const total = assignmentScores.reduce((sum, a) => sum + (a.score || 0), 0);
        return (total);
    };

    const calculateCategoryAverage = (categoryAssignments: Assignment[]) => {
        const totalScore = categoryAssignments.reduce((sum, assignment) => sum + (assignmentScores.find(a => a.assignmentId === assignment.id)?.score || 0), 0);
        return (totalScore / categories.length).toFixed(1);
    };

    return (
        <PageWrapper className={styles.pageWrapper}>
            <div className={styles.header}>
                <h1 className={styles.pageTitle}>{courseName} Gradebook</h1>

                <div className={styles.buttonContainer}>
                    {role.isInstructor() && <button className='btnSecondary' id='createCoursBtn' onClick={() => {
                        history.push(`/course/${courseId}/gradebook/instructor`)
                    }}>Instructor View</button>}
                    <button className='btnPrimary' id='backToCourse' onClick={() => {
                        history.goBack();
                    }}>Back to Course</button>
                </div>
            </div>

            <div className={styles.gradebookGrid}>                
                    {categories.map((category) => {
                        const categoryAssignments = assignments.filter(a => a.categoryName === category);
                        return (
                            <div className={styles.section}>
                            <table>
                                <thead>
                                    <tr>
                                        <th style={{minWidth:'80%'}}>{category}</th>
                                        <th className={styles.centered}>Late Days</th>
                                        <th className={styles.centered}>Score</th>
                                    </tr>
                                </thead>
                                    <tbody>
                                        {categoryAssignments.map((assignment) => (
                                                <tr key={assignment.id}>
                                                    <td><a href={`assignment/${assignment.id}`} className={styles.assignmentLink}>{assignment.name}</a></td>
                                                     <td className={styles.centered}>0</td> {/*Yell at Diego if this is not updated, should be a simple subtraction */}
                                                    <td className={styles.centered}>{assignmentScores.find(a => a.assignmentId === assignment.id)?.score ?? 'N/A'}</td>
                                                </tr>
                                            ))
                                        }
                                        <tr className={styles.categoryRow}>
                                            <td  className={styles.categoryText}>Category Average</td>
                                            <td className={styles.noBorder}></td>
                                            <td className={`${styles.categoryValue} ${styles.centered}`}>{calculateCategoryAverage(categoryAssignments)}</td>
                                        </tr>
                                    </tbody>
                            </table>
                            </div>

                        )
                    })}
            </div>
            <div className={styles.courseAverage}>
                    <span>Course Average</span>
                    <span>{calculateAverage()}</span>
                </div>
        </PageWrapper>
    );
};

export default GradebookStudentPage;