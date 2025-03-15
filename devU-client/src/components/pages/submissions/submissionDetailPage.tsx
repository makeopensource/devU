import React, { useEffect, useState } from 'react'
import { useAppSelector } from "../../../redux/hooks";
import PageWrapper from 'components/shared/layouts/pageWrapper'
import LoadingOverlay from 'components/shared/loaders/loadingOverlay'
import ErrorPage from '../errorPage/errorPage'
import RequestService from 'services/request.service'
import { Assignment, AssignmentProblem, Submission, SubmissionProblemScore, SubmissionScore } from 'devu-shared-modules'
import { useParams, useHistory, Link } from 'react-router-dom'
import styles from './submissionDetailPage.scss'
import ManualGradeModal from './manualGradeModal'

const SubmissionDetailPage = () => {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const history = useHistory()

    const { submissionId, assignmentId, courseId } = useParams<{ submissionId: string, assignmentId: string, courseId: string }>()
    const [submissionScore, setSubmissionScore] = useState<SubmissionScore | null>(null)
    const [submissionProblemScores, setSubmissionProblemScores] = useState(new Array<SubmissionProblemScore>())
    const [assignmentProblems, setAssignmentProblems] = useState(new Array<AssignmentProblem>())
    const [assignment, setAssignment] = useState<Assignment>()
    const [showManualGrade, setToggleManualGrade] = useState(false)
    const role = useAppSelector((store) => store.roleMode);

    const fetchData = async () => {
        try {
            const submissionScore = (await RequestService.get<SubmissionScore[]>(`/api/course/${courseId}/assignment/${assignmentId}/submission-scores?submission=${submissionId}`)).pop() ?? null
            setSubmissionScore(submissionScore)

            const submission = await RequestService.get<Submission>(`/api/course/${courseId}/assignment/${assignmentId}/submissions/${submissionId}`);
            // setSubmission(submission);
            // ^^doesn't need to be read outside this block

            const submissionProblemScores = await RequestService.get<SubmissionProblemScore[]>(`/api/course/${courseId}/assignment/${assignmentId}/submission-problem-scores/submission/${submissionId}`)
            setSubmissionProblemScores(submissionProblemScores)

            const assignment = await RequestService.get<Assignment>(`/api/course/${courseId}/assignments/${submission.assignmentId}`)
            setAssignment(assignment)

            const assignmentProblems = await RequestService.get<AssignmentProblem[]>(`/api/course/${courseId}/assignment/${assignment.id}/assignment-problems`)
            setAssignmentProblems(assignmentProblems)
        } catch (error: any) {
            setError(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    const handleClick = () => {
        setToggleManualGrade(!showManualGrade)
    }

    if (loading) return <LoadingOverlay delay={250} />
    if (error) return <ErrorPage error={error} />

    return (
        <PageWrapper>
            <ManualGradeModal open={showManualGrade} onClose={handleClick} submissionScore={submissionScore} />
            <div className="pageHeader">
                <h1>View Feedback</h1>
                <button className="pageHeaderBtn" onClick={() => {
                    history.push(`/course/${courseId}`)
                }}>Back to Course</button>
            </div>
            <div className={styles.container}>
                <div className={styles.left}>
                    <div className={styles.feedback_header}>
                        <h2>Feedback for: <Link to={`/course/${courseId}/assignment/${assignmentId}`}>{assignment?.name}</Link></h2>
                    </div>
                    
                    <p><strong>Instructor Feedback:</strong></p>
                    <pre className={styles.feedback}>{submissionScore ? submissionScore.feedback : 'no feedback provided'}</pre>
                    
                    <p><strong>Autograder Feedback:</strong></p>
                    {submissionProblemScores.map((problemItem) => (
                        <pre className={styles.feedback}>{problemItem ? problemItem.feedback : 'no feedback provided'}</pre>
                    ))}
                </div>
                <div className={styles.right}>
                    <div className={styles.scores}>
                        <div className={styles.section_header}>
                            <h2>Scores</h2>
                        </div>
                        {assignmentProblems.map((problemItem) => {
                            // Find the corresponding submissionProblemScore for the current problem
                            const correspondingScore = submissionProblemScores.find(
                                (scoreItem) => scoreItem.assignmentProblemId === problemItem.id
                            );

                            return (
                                <div key={problemItem.id} className={styles.score_item}>
                                    <span style={{maxWidth: '90%'}}>{problemItem.problemName}</span>
                                    <span>{correspondingScore ? correspondingScore.score : '--'}</span>
                                </div>
                            );
                        })}
                        <div className={styles.score_item}>
                            <span><strong>Assignment Score:</strong></span>
                            <span><strong>{submissionScore ? submissionScore.score : '--'}</strong></span>
                        </div>
                    </div>
                    <button className="btnSecondary" onClick={() => {
                        history.push(`/course/${courseId}/assignment/${assignmentId}/submission/${submissionId}/fileView`)
                    }}>View Source</button>
                    <button className="btnSecondary">Download Submission</button>
                    {role.isInstructor() && (
                        <button className="btnPrimary" onClick={handleClick}>Manually Grade</button>
                    )}
                </div>
            </div>
        </PageWrapper>
    )
}

export default SubmissionDetailPage