import React, { useEffect, useState } from 'react'
import PageWrapper from 'components/shared/layouts/pageWrapper'
import LoadingOverlay from 'components/shared/loaders/loadingOverlay'
import ErrorPage from '../errorPage/errorPage'
import RequestService from 'services/request.service'
import { Assignment, AssignmentProblem, Submission, SubmissionProblemScore, SubmissionScore } from 'devu-shared-modules'
import { useParams } from 'react-router-dom'
import styles from './submissionDetailPage.scss'
import 'react-datepicker/dist/react-datepicker.css'
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
    // const [submissions, setSubmissions] = useState(new Array<Submission>())
    const [showManualGrade, setToggleManualGrade] = useState(false)
    const [formData, setFormData] = useState({
        submissionId: submissionId,
        score: 0,
        feedback: '',
        releasedAt: "2024-10-05T14:48:00.00Z"
    })

    const fetchData = async () => {
        try {
            //const submission = await RequestService.get<Submission>(`/api/course/${courseId}/assignment/${assignmentId}/submissions/${submissionId}`)
            //setSubmission(submission)

            const submissionScore = (await RequestService.get<SubmissionScore[]>(`/api/course/${courseId}/assignment/${assignmentId}/submission-scores?submission=${submissionId}`)).pop() ?? null
            setSubmissionScore(submissionScore)

            const submission = await RequestService.get<Submission>(`/api/course/${courseId}/assignment/${assignmentId}/submissions/${submissionId}`);
            setSubmission(submission);

            const submissionProblemScores = await RequestService.get<SubmissionProblemScore[]>(`/api/course/${courseId}/assignment/${assignmentId}/submission-problem-scores/submission/${submissionId}`)
            setSubmissionProblemScores(submissionProblemScores)

            const assignment = await RequestService.get<Assignment>(`/api/course/${courseId}/assignments/${submission.assignmentId}`)
            setAssignment(assignment)

            const assignmentProblems = await RequestService.get<AssignmentProblem[]>(`/api/course/${courseId}/assignment/${assignment.id}/assignment-problems`)
            setAssignmentProblems(assignmentProblems)

            // const submissionsReq = await RequestService.get<Submission[]>(`/api/course/${courseId}/assignment/${assignmentId}/submissions/`)
            // submissionsReq.sort((a, b) => (Date.parse(b.createdAt ?? '') - Date.parse(a.createdAt ?? '')))
            // setSubmissions(submissionsReq)
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
            <ManualGradeModal open={showManualGrade} onClose={handleClick} submissionScore={submissionScore}/>
            <div className={styles.left}>
                <div className={styles.feedback_header}></div>
            </div>
            <div className={styles.right}>
                <div className={styles.scores}>

                </div>
                <button className="btnSecondary">View Source</button>
                <button className="btnSecondary">Download Submission</button>
                <button className="btnPrimary">Manually Grade</button>
            </div>
        </PageWrapper>
    )
}

export default SubmissionDetailPage
