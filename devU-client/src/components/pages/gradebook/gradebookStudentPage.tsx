import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useAppSelector } from 'redux/hooks';

import { Assignment, AssignmentScore, AssignmentProblem, Course } from 'devu-shared-modules';

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
    const [assignmentProblems, setAssignmentProblems] = useState<Map<number, AssignmentProblem[]>>(new Map<number, AssignmentProblem[]>())
    const [maxScores, setMaxScores] = useState<Map<number, number>>(new Map<number, number>())


    useEffect(() => {
        fetchData();
    }, []);
    useEffect(() => { // get all assignment problems, map assignment ID to array containing its problems
        for(let i : number = 0; i < assignments.length; i++) {
            RequestService.get(`/api/course/${courseId}/assignment/${assignments[i].id}/assignment-problems`)
               .then((res) => {
                   setAssignmentProblems(prevState => {
                       const newMap = new Map(prevState);
                       newMap.set(Number(assignments[i].id), res);
                       return newMap
               });
           })
    }}, [assignments]);

    useEffect(() => { // add all maxScores of assignment problems to create a maxScore for the entire assignment
        for (let [assignmentId, problems] of assignmentProblems.entries()) {             
            if (problems.length != 0) { // only show possible score for assignments which have problems defined.
                const maxScore = problems.reduce((sum, problem) => sum + problem.maxScore, 0);
                    setMaxScores(prevState => {
                            const newMap = new Map(prevState);
                            newMap.set(assignmentId, maxScore);
                            return newMap;
                    });
                }
        }  
       }
    , [assignmentProblems]);

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
        const maxScoresPossible = Array.from(maxScores.values()).reduce((sum, a) => sum + (a), 0);
        return (total / maxScoresPossible * 100).toFixed(1);
    };

    const calculateCategoryAverage = (categoryAssignments: Assignment[]) => {
        const totalScore = categoryAssignments.reduce((sum, assignment) => sum + (assignmentScores.find(a => a.assignmentId === assignment.id)?.score || 0), 0);
        return (totalScore / categoryAssignments.length).toFixed(1);
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
                                        {categoryAssignments.map((assignment) => {
                                            const assignmentScore = assignmentScores.find(as => as.assignmentId === assignment.id) // if there's a submission, this will be defined
                                            const late = (assignmentScore && assignmentScore.createdAt) ? (new Date(assignmentScore.createdAt) > new Date(assignment.dueDate)) : false // If there's a submission, late is if your score was after due date.
                                            const lateDays = late && assignmentScore && assignmentScore.createdAt ? Math.floor((new Date(assignmentScore.createdAt).getTime() - new Date(assignment.dueDate).getTime()) / (1000 * 60 * 60 * 24)) : 0
                                            const problemsDefined  = (assignment.id && maxScores.has(assignment.id))
                                            return(
                                                <tr key={assignment.id}>
                                                    <td><a href={`assignment/${assignment.id}`} className={styles.assignmentLink}>{assignment.name}</a></td>
                                                    <td className={styles.centered}>{lateDays}</td> {/*Yell at Diego if this is not updated, should be a simple subtraction */}
                                                    {assignmentScore 
                                                        ? (late 
                                                            ? <td className={`${styles.centered} ${styles.late}`}>{assignmentScore.score} / {assignment.id && maxScores.get(assignment.id)}</td> 
                                                            : <td className={styles.centered}>{assignmentScore.score} / {assignment.id && maxScores.get(assignment.id)}</td> ) 
                                                        : (
                                                            problemsDefined 
                                                            ? <td className={`${styles.centered} ${styles.no_submission}`}>0 / {assignment.id && maxScores.get(assignment.id)}</td> 
                                                            : <td className={styles.centered}>N/A</td>
                                                        )}
                                                </tr> 
                                                )
                                        })
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
                    <span>{calculateAverage()}%</span>
                </div>
        </PageWrapper>
    );
};

export default GradebookStudentPage;