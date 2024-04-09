import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

import PageWrapper from 'components/shared/layouts/pageWrapper'
import LoadingOverlay from 'components/shared/loaders/loadingOverlay'
import ErrorPage from './errorPage'
import { Assignment, AssignmentProblem, Submission, SubmissionProblemScore, SubmissionScore } from 'devu-shared-modules'
import RequestService from 'services/request.service'

const SubmissionFeedbackPage = () => {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const { submissionId } = useParams<{submissionId: string}>()
    const [submissionScore, setSubmissionScore] = useState<SubmissionScore | null>(null)
    const [submissionProblemScores, setSubmissionProblemScores] = useState(new Array<SubmissionProblemScore>())
    const [assignmentProblems, setAssignmentProblems] = useState(new Array<AssignmentProblem>())
    const [assignment, setAssignment] = useState<Assignment>()

    const fetchData = async () => {
        try {
            const submissionScore = (await RequestService.get<SubmissionScore[]>( `/api/submission-scores?submission=${submissionId}` )).pop() ?? null
            setSubmissionScore(submissionScore)

            const submissionProblemScores = await RequestService.get<SubmissionProblemScore[]>( `/api/submission-problem-scores/${submissionId}` )
            setSubmissionProblemScores(submissionProblemScores)

            const submission = await RequestService.get<Submission>( `/api/submissions/${submissionId}` )
            const assignment = await RequestService.get<Assignment>( `/api/assignments/${submission.assignmentId}` )
            setAssignment(assignment)

            const assignmentProblems = await RequestService.get<AssignmentProblem[]>( `/api/assignment-problems/${assignment.id}` )
            setAssignmentProblems(assignmentProblems)  

        } catch (error) {
            setError(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    if (loading) return <LoadingOverlay delay={250} />
    if (error) return <ErrorPage error={error} />

    return(
        <PageWrapper>
            <h1>Feedback for {assignment?.name}</h1>
            {submissionScore?.feedback ? (
                <div>
                    <h2>Overall Feedback:</h2>
                    <pre>{submissionScore.feedback}</pre>
                </div>
            ) : null} <br/>
            {submissionProblemScores.map(sps => (
                <div>
                    <h2>Feedback for {assignmentProblems.find(ap => ap.id === sps.assignmentProblemId)?.problemName}:</h2>
                    <pre>{sps.feedback}</pre>
                </div>
            ))}
        </PageWrapper>
    )
}

export default SubmissionFeedbackPage