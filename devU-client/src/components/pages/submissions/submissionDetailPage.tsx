import React, { useEffect, useState } from 'react'
import PageWrapper from 'components/shared/layouts/pageWrapper'
import LoadingOverlay from 'components/shared/loaders/loadingOverlay'
import ErrorPage from '../errorPage/errorPage'
import RequestService from 'services/request.service'
import { Assignment, AssignmentProblem, Submission, SubmissionProblemScore, SubmissionScore } from 'devu-shared-modules'
import { useParams } from 'react-router-dom'
import styles from './submissionDetailPage.scss'
import ManualGradeModal from './manualGradeModal'

const SubmissionDetailPage = () => {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const { submissionId, assignmentId, courseId } = useParams<{ submissionId: string, assignmentId: string, courseId: string }>()
    const [submissionScore, setSubmissionScore] = useState<SubmissionScore | null>(null)
    const [submissionProblemScores, setSubmissionProblemScores] = useState(new Array<SubmissionProblemScore>())
    const [submission, setSubmission] = useState<Submission>()
    const [assignmentProblems, setAssignmentProblems] = useState(new Array<AssignmentProblem>())
    const [assignment, setAssignment] = useState<Assignment>()
    const [showManualGrade, setToggleManualGrade] = useState(false)

    const fetchData = async () => {
        try {
            const submissionScore = (await RequestService.get<SubmissionScore[]>(`/api/course/${courseId}/assignment/${assignmentId}/submission-scores?submission=${submissionId}`)).pop() ?? null
            setSubmissionScore(submissionScore)

            const submission = await RequestService.get<Submission>(`/api/course/${courseId}/assignment/${assignmentId}/submissions/${submissionId}`);
            setSubmission({ ...submission });

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
                {/* TODO: link to course page */}
                <button className="pageHeaderBtn">Back to Course</button>
            </div>
            <div className={styles.container}>
                <div className={styles.left}>
                    <div className={styles.feedback_header}>
                        <h2>Feedback for: assignment name here</h2>
                    </div>
                    feedback rendered here
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
                                    <span>{problemItem.problemName}</span>
                                    <span>{correspondingScore ? correspondingScore.score : '--'}</span>
                                </div>
                            );
                        })}
                    </div>
                    <button className="btnSecondary">View Source</button>
                    <button className="btnSecondary">Download Submission</button>
                    <button className="btnPrimary" onClick={handleClick}>Manually Grade</button>
                </div>
            </div>
        </PageWrapper>
    )
}

export default SubmissionDetailPage