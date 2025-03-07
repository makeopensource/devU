import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useAppSelector } from 'redux/hooks';

import { Assignment, AssignmentScore, Course } from 'devu-shared-modules';

import PageWrapper from 'components/shared/layouts/pageWrapper';
import LoadingOverlay from 'components/shared/loaders/loadingOverlay';
import ErrorPage from '../errorPage/errorPage';

import RequestService from 'services/request.service';

import styles from './gradebookPage.scss';

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
        
        } catch (error: any) {
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <LoadingOverlay delay={250} />;
    if (error) return <ErrorPage error={error} />;

    // Categorize assignments
    const homeworks = assignments.filter(a => a.categoryName === "Homework");
    const lectureQuestions = assignments.filter(a => a.categoryName === "Lecture Questions");
    const projects = assignments.filter(a => a.categoryName === "Project");

    const calculateAverage = () => {
        if (assignmentScores.length === 0) return 0.0;
        const total = assignmentScores.reduce((sum, a) => sum + (a.score || 0), 0);
        return (total / assignmentScores.length).toFixed(1);
    };

    const calculateHomeworkAverage = () => {
        if (homeworks.length === 0) return "N/A";
        const totalScore = homeworks.reduce((sum, assignment) => sum + (assignmentScores.find(a => a.assignmentId === assignment.id)?.score || 0), 0);
        return (totalScore / homeworks.length).toFixed(1);
    };

    return (
        <PageWrapper className={styles.pageWrapper}>
            {/* Top Section with Back to Course Button */}
            <div className={styles.topSection}>
                <h1 className={styles.gradebookTitle}>{courseName} Gradebook</h1> 
                {role.isInstructor() && (
                    <button className='btnPrimary' onClick={() => history.push(`/course/${courseId}/courses`)}>
                        Back to Course
                    </button>
                )}
            </div>

            <div className={styles.gradebookGrid}>
                {/* Homework - Left Column */}
                <div className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <span>Homeworks</span>
                        <span className={styles.headerRight}>
                            <span>Late Days</span>
                            <span>Score</span>
                        </span>
                    </div>
                    <table className={styles.gradeTable}>
                        <tbody>
                            {homeworks.length > 0 ? (
                                homeworks.map((assignment) => (
                                    <tr key={assignment.id}>
                                        <td><a href={`/assignment/${assignment.id}`} className={styles.assignmentLink}>{assignment.name}</a></td>
                                        <td>0</td>
                                        <td>{assignmentScores.find(a => a.assignmentId === assignment.id)?.score ?? 'N/A'}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={3} className={styles.noAssignments}>No assignments yet</td>
                                </tr>
                            )}
                            <tr className={styles.categoryRow}>
                                <td colSpan={2} className={styles.categoryText}>Category Average</td>
                                <td className={styles.categoryValue}>{calculateHomeworkAverage()}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Lecture Questions Section */}
                <div className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <span>Lecture Questions</span>
                        <span className={styles.headerRight}>
                            <span>Late Days</span>
                            <span>Score</span>
                        </span>
                    </div>
                    {lectureQuestions.length > 0 ? (
                        <table className={styles.gradeTable}>
                            <tbody>
                                {lectureQuestions.map((assignment) => (
                                    <tr key={assignment.id}>
                                        <td>{assignment.name}</td>
                                        <td>0</td>
                                        <td>{assignmentScores.find(a => a.assignmentId === assignment.id)?.score ?? 'N/A'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className={styles.noAssignments}>No assignments yet</div>
                    )}
                </div>

                {/* Project Section */}
                <div className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <span>Project</span>
                        <span className={styles.headerRight}>
                            <span>Late Days</span>
                            <span>Score</span>
                        </span>
                    </div>
                    {projects.length > 0 ? (
                        <table className={styles.gradeTable}>
                            <tbody>
                                {projects.map((assignment) => (
                                    <tr key={assignment.id}>
                                        <td>{assignment.name}</td>
                                        <td>0</td>
                                        <td>{assignmentScores.find(a => a.assignmentId === assignment.id)?.score ?? 'N/A'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className={styles.noAssignments}>No assignments yet</div>
                    )}
                </div>

                {/* Course Average Section */}
                <div className={styles.courseAverage}>
                    <span>Course Average</span>
                    <span>{calculateAverage()}</span>
                </div>
            </div>
        </PageWrapper>
    );
};

export default GradebookStudentPage;