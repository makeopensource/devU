import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import PageWrapper from 'components/shared/layouts/pageWrapper'
import AssignmentProblemListItem from 'components/listItems/assignmentProblemListItem'
import { Assignment, AssignmentProblem, Course, Submission, NonContainerAutoGrader /*SubmissionScore, /*ContainerAutoGrader*/ } from 'devu-shared-modules'
import RequestService from 'services/request.service'
import ErrorPage from '../errorPage/errorPage'
import LoadingOverlay from 'components/shared/loaders/loadingOverlay'
import { useActionless, useAppSelector } from 'redux/hooks'
import { SET_ALERT } from 'redux/types/active.types'
//import Card from '@mui/material/Card'
//import CardContent from '@mui/material/CardContent'
//import {Accordion, AccordionDetails, TextField, Typography} from '@mui/material'


//import Grid from '@mui/material/Unstable_Grid2'

import styles from './assignmentDetailPage.scss'
import { prettyPrintDateTime, fullWordPrintDate } from "../../../utils/date.utils";

import { useLocation } from 'react-router-dom';
import Scoreboard from '../assignments/scoreboard';
// import DragDropFile from 'components/utils/dragDropFile'

const AssignmentDetailPage = () => {
    const [setAlert] = useActionless(SET_ALERT)
    const history = useHistory()
    const { assignmentId, courseId } = useParams<{ assignmentId: string, courseId: string }>()
    const userId = useAppSelector((store) => store.user.id)
    const role = useAppSelector((store) => store.roleMode)

    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(true)
    const [formData, setFormData] = useState<{ [key: string]: string }>({})
    const [file, setFile] = useState<File | null>()
    const [assignmentProblems, setAssignmentProblems] = useState(new Array<AssignmentProblem>())
    const [submissions, setSubmissions] = useState(new Array<Submission>())
    const [assignment, setAssignment] = useState<Assignment>()
    const [course, setCourse] = useState<Course>()
    const [notClickable, setClickable] = useState(true);



    // const [containerAutograder, setContainerAutograder] = useState<ContainerAutoGrader | null>()
    // const contaierAutograder = false; //TODO: Use the above commented out code to get the container autograder
    const [nonContainerAutograders, setNonContainerAutograders] = useState(new Array<NonContainerAutoGrader>())
    const [showScoreboard, setShowScoreboard] = useState(false);
    setShowScoreboard;
    const location = useLocation();

    useEffect(() => {
        fetchData()
    }, [location]);


    const fetchData = async () => {
        try {
            const assignments = await RequestService.get<Assignment>(`/api/course/${courseId}/assignments/${assignmentId}`)
            setAssignment(assignments)

            const courses = await RequestService.get<Course>(`/api/courses/${courseId}`)
            setCourse(courses)

            const assignmentProblemsReq = await RequestService.get<AssignmentProblem[]>(`/api/course/${courseId}/assignment/${assignmentId}/assignment-problems/`)
            setAssignmentProblems(assignmentProblemsReq)

            const submissionsReq = await RequestService.get<Submission[]>(`/api/course/${courseId}/assignment/${assignmentId}/submissions/`)
            submissionsReq.sort((a, b) => (Date.parse(b.createdAt ?? '') - Date.parse(a.createdAt ?? '')))
            setSubmissions(submissionsReq)

            //  const submissionScoresPromises = submissionsReq.map(s => {
            //     return RequestService.get<SubmissionScore[]>(`/api/submission-scores?submission=${s.id}`)
            //  })
            //  const submissionScoresReq = (await Promise.all(submissionScoresPromises)).reduce((a, b) => a.concat(b), [])
            //  setSubmissionScores(submissionScoresReq)

            //  const submissionProblemScoresPromises = submissionsReq.map(s => {
            //     return RequestService.get<SubmissionProblemScore[]>(`/api/submission-problem-scores/${s.id}`)
            //
            //  const submissionProblemScoresReq = (await Promise.all(submissionProblemScoresPromises)).reduce((a, b) => a.concat(b), [])
            //  setSubmissionProblemScores(submissionProblemScoresReq)

            // const containerAutograder = (await RequestService.get<ContainerAutoGrader[]>(`/api/course/${courseId}/assignment/${assignmentId}/container-auto-graders`)).pop() ?? null
            // setContainerAutograder(containerAutograder)

            const nonContainers = await RequestService.get<NonContainerAutoGrader[]>(`/api/course/${courseId}/assignment/${assignmentId}/non-container-auto-graders`)
            setNonContainerAutograders(nonContainers)
            nonContainerAutograders


        } catch (err: any) {
            setError(err)
            const message = "Submission past due date"//Array.isArray(err) ? err.map((e) => `${e.param} ${e.msg}`).join(', ') : err.message
            setAlert({ autoDelete: false, type: 'error', message })
        } finally {
            setLoading(false)
        }
    }

    if (loading) return <LoadingOverlay delay={250} />
    if (error) return <ErrorPage error={error} />

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const type = e.target.type;
        const value = e.target.value;
        const key = e.target.id;
        if (type === 'checkbox') { // behavior for multiple choice - multiple answer questions

            const newState = e.target.checked;

            setFormData(prevState => {
                const currentValue = prevState[key] || "";
                let res = '';
                if (newState) {
                    res = currentValue + value
                } else {
                    res = currentValue.replace(value, "")
                }
                res = res.split('').sort().join('') // makes selecting answers in any order correct
                return {
                    ...prevState,
                    [key]: res
                };
            });
        } 
        else {
            setFormData(prevState => ({
                ...prevState,
                [key]: value
            }));
            console.log(formData)
        }
    };


    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFile(e.target.files?.item(0))
    }

    const handleCheckboxChange = () => {
        setClickable(!notClickable);
    };

    const handleSubmit = async () => {
        let response;
        const contentField = {
            filepaths: [],
            form: formData
        }
        const submission = {
            userId: userId,
            assignmentId: assignmentId,
            courseId: courseId,
            content: JSON.stringify(contentField),
        }

        console.log(contentField)

        setLoading(true)

        try {
            if (file) {
                const submission = new FormData
                submission.append('userId', String(userId))
                submission.append('assignmentId', assignmentId)
                submission.append('courseId', courseId)
                submission.append('content', JSON.stringify(contentField))
                submission.append('files', file)

                response = await RequestService.postMultipart(`/api/course/${courseId}/assignment/${assignmentId}/submissions`, submission);
            } else {
                response = await RequestService.post(`/api/course/${courseId}/assignment/${assignmentId}/submissions`, submission);
            }

            setAlert({ autoDelete: true, type: 'success', message: 'Submission Sent' })

            // Now you can use submissionResponse.id here
            await RequestService.post(`/api/course/${courseId}/grade/${response.id}`, {})
            setAlert({ autoDelete: true, type: 'success', message: 'Submission Graded' })

            await fetchData()
        } catch (err: any) {
            const message = Array.isArray(err) ? err.map((e) => `${e.param} ${e.msg}`).join(', ') : err.message
            setAlert({ autoDelete: false, type: 'error', message })
        } finally {
            setLoading(false)
            await fetchData()
        }
    }
    const isSubmissionDisabled = () => {
        if (assignment?.endDate) {
            const endDate = new Date(assignment.endDate);
            const now = new Date();
            return now > endDate;
        }
        return false;
    };

    handleFileChange;


    return (
        <PageWrapper>
            <div className={styles.header}>
                <h1 style={{gridColumnStart:2}}>Submit Assignment</h1> 
                <button style={{marginLeft:'auto'}} className='btnPrimary' onClick={() => {history.push(`/course/${courseId}`)}}>Back to Course</button>
            </div>

            <div className={styles.details}>
                <div className={styles.assignmentDetails}>
                    <h2 style={{ textAlign: 'left' }}>{course?.number} - {assignment?.name}</h2>
                    <div>{assignment?.description}</div>
                </div>
                <div className={styles.submissionDetails}>
                    <span className={styles.metaText}>
                        <strong>Due Date:&nbsp;</strong>{assignment?.dueDate ? fullWordPrintDate(assignment?.dueDate) : "N/A"}
                    </span>
                    <span className={styles.metaText}>
                        <strong>Available Until:&nbsp;</strong>{assignment?.endDate ? fullWordPrintDate(assignment?.endDate) : "N/A"}
                    </span>
                    <span className={styles.metaText}>
                        <strong>Submissions Made:&nbsp;</strong>{submissions.length + "/" + assignment?.maxSubmissions}
                    </span>
                    <span>
                        <a onClick={() => history.push(`/course/${courseId}/assignment/${assignmentId}/submissions`)}
                            className={styles.handinHistory}>View Handin History</a>
                    </span>
                </div>
            </div>
            <div className={styles.details} style={{ marginTop: '20px' }}>
                <div className={styles.assignmentDetails}>
                    <span className={styles.metaText}>
                        <strong>Assignment Category:&nbsp;</strong>{assignment?.categoryName}
                    </span>
                    <span className={styles.metaText}>
                        <strong>Attachments:&nbsp;</strong>{assignment?.attachmentsFilenames} {/*Need to add mapping behavior to this when I figure out file storage to add links - Diego */}
                    </span>
                </div>
                {role.isInstructor() && <div className={styles.options_section}>
                    <button className={`btnPrimary ${styles.parallel_button}`} onClick={() => {
                        history.push(`/course/${courseId}/assignment/${assignmentId}/update`)
                    }}>Edit Assignment</button>
                    <button className={`btnPrimary ${styles.parallel_button}`}>Grade Submissions</button>
                    <button className={`btnPrimary ${styles.parallel_button}`}>Scoreboard</button>
                </div>}
            </div>

            <h3 style={{ textAlign: 'center' }}>Problems</h3>
            <div className={styles.problems_section}>

                {/* <div className={styles.file_upload}>
                    <h4 className={styles.problem_header}>File Upload:</h4>
                    <DragDropFile handleFile={(e) => {console.log(e)}} />
                </div> */}

                <div className={styles.problems_list}>
                    <h2>Problems</h2>
                    {assignmentProblems.length != 0 ? (assignmentProblems.map((problem) => (
                        <>
                            <AssignmentProblemListItem problem={problem} handleChange={handleChange} />
                            <hr />
                        </>
                    ))) : <div style={{ fontStyle: 'italic', textAlign: 'center', marginTop: '10px' }}> No problems yet...</div>}
                    {!(isSubmissionDisabled()) && assignmentProblems && assignmentProblems.length > 0 ? (
                        <div className={styles.submit_container}>
                            <div className={styles.affirmation}>
                                <input type='checkbox' id='ai-check' onClick={handleCheckboxChange} />
                                <label htmlFor='ai-check' className={styles.affirmText}>I affirm that I have complied with this course’s academic integrity policy as defined in the syllabus.</label>
                            </div>
                            <button className='btnPrimary'
                                style={{ marginTop: '40px' }}
                                onClick={handleSubmit}
                                disabled={notClickable}
                            >Submit Assignment</button>
                        </div>
                    ) : null}
                </div>
            </div>


            <div>
                <div className={styles.submissionsContainer}>
                    {submissions.map((submission, index) => (
                        <div className={styles.submissionCard} key={index}>
                            <div onClick={() => {
                                history.push(`/course/${courseId}/assignment/${assignmentId}/submission/${submission.id}`)
                            }}>
                                <div>
                                    <div className={styles.submissionHeading}>{`Submission ${submissions.length - index}`}</div>
                                    <div className={styles.submissionTime}>{`Submitted at: ${submission.createdAt && prettyPrintDateTime(submission.createdAt)}`}</div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {showScoreboard && (
                        <div className={styles.scoreboardContainer}>
                            <Scoreboard courseId={courseId} assignmentId={assignmentId} />

                        </div>
                    )}
                </div>
            </div>

        </PageWrapper>
    )
}

export default AssignmentDetailPage