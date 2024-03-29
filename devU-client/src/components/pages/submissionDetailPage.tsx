import React,{useState,useEffect} from 'react'

import PageWrapper from 'components/shared/layouts/pageWrapper'
import LoadingOverlay from 'components/shared/loaders/loadingOverlay'
import ErrorPage from './errorPage'
import RequestService from 'services/request.service'
import { SubmissionScore, SubmissionProblemScore, Submission, Assignment, AssignmentProblem } from 'devu-shared-modules'
import { Link, useParams } from 'react-router-dom'


const SubmissionDetailPage = () => { 
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    
    const { submissionId } = useParams<{submissionId: string}>()
    const [submissionScore, setSubmissionScore] = useState<SubmissionScore | null>(null)
    const [submissionProblemScores, setSubmissionProblemScores] = useState(new Array<SubmissionProblemScore>())
    const [submission, setSubmission] = useState<Submission>()
    const [assignmentProblems, setAssignmentProblems] = useState(new Array<AssignmentProblem>())
    const [assignment, setAssignment] = useState<Assignment>()

    const fetchData = async () => {
        try {
            const submissionScore = await RequestService.get<SubmissionScore>( `/api/submission-scores/${submissionId}` )
            setSubmissionScore(submissionScore)

            const submissionProblemScores = await RequestService.get<SubmissionProblemScore[]>( `/api/submission-problem-scores/${submissionId}` )
            setSubmissionProblemScores(submissionProblemScores)

            const submission = await RequestService.get<Submission>( `/api/submissions/${submissionId}` )
            setSubmission(submission)

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
            <h1>Submission Detail for {assignment?.name}</h1>
            <h2>Submission Grades:</h2>
            <table>
                {assignmentProblems.map(ap => (
                    <th>{ap.problemName} ({ap.maxScore})</th>
                ))}
                <th>Total Score</th>
                <tr>
                    {assignmentProblems.map(ap => (
                        <td>{submissionProblemScores.find(sps => sps.assignmentProblemId === ap.id)?.score ?? "N/A"}</td>
                    ))}
                    <td>{submissionScore?.score ?? "N/A"}</td>
                </tr>
            </table> 
            <Link to = {`/submissions/${submission?.id}/feedback`}>View Feedback</Link> 
            <br/>
            
            <h2>Submission Content:</h2>
            <pre>{submission?.content}</pre>
        </PageWrapper>
    )
}

export default SubmissionDetailPage
