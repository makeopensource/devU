import React, {useEffect, useState} from 'react'
import {Link, useParams} from 'react-router-dom'
import PageWrapper from 'components/shared/layouts/pageWrapper'
import {
    Assignment,
    AssignmentProblem,
    ContainerAutoGrader,
    Submission,
    SubmissionProblemScore,
    SubmissionScore
} from 'devu-shared-modules'
import RequestService from 'services/request.service'
import ErrorPage from './errorPage'
import LoadingOverlay from 'components/shared/loaders/loadingOverlay'
import TextField from 'components/shared/inputs/textField'
import Button from 'components/shared/inputs/button'
import {useActionless, useAppSelector} from 'redux/hooks'
import {SET_ALERT} from 'redux/types/active.types'

import styles from './assignmentDetailPage.scss'

const AssignmentDetailPage = () => {
    const [setAlert] = useActionless(SET_ALERT)
    const { assignmentId, courseId } = useParams<{assignmentId: string, courseId: string}>()
    const userId = useAppSelector((store) => store.user.id)

    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(true)
    const [formData, setFormData] = useState({})
    const [file, setFile] = useState<File | null>()
    const [assignmentProblems, setAssignmentProblems] = useState(new Array<AssignmentProblem>())
    const [submissions, setSubmissions] = useState(new Array<Submission>())
    const [submissionScores, setSubmissionScores] = useState(new Array<SubmissionScore>())
    const [submissionProblemScores, setSubmissionProblemScores] = useState(new Array<SubmissionProblemScore>())
    const [assignment, setAssignment] = useState<Assignment>()
    const [containerAutograder, setContainerAutograder] = useState<ContainerAutoGrader | null>()

    useEffect(() => {
        fetchData()
    }, []);


    const fetchData = async () => {
        try {
            const assignment = await RequestService.get<Assignment>(`/api/course/${courseId}/assignments/${assignmentId}`)
            setAssignment(assignment)

            const assignmentProblemsReq = await RequestService.get<AssignmentProblem[]>(`/api/assignment-problems/${assignmentId}`)
            setAssignmentProblems(assignmentProblemsReq)

            const submissionsReq = await RequestService.get<Submission[]>(`/api/submissions/assignments/${assignmentId}`)
            submissionsReq.sort((a, b) => (Date.parse(b.createdAt ?? '') - Date.parse(a.createdAt ?? '')))
            setSubmissions(submissionsReq)

            const submissionScoresPromises = submissionsReq.map(s => {
                return RequestService.get<SubmissionScore[]>(`/api/submission-scores?submission=${s.id}`)
            })
            const submissionScoresReq = (await Promise.all(submissionScoresPromises)).reduce((a, b) => a.concat(b), [])
            setSubmissionScores(submissionScoresReq)

            const submissionProblemScoresPromises = submissionsReq.map(s => {
                return RequestService.get<SubmissionProblemScore[]>(`/api/submission-problem-scores/${s.id}`)
            })
            const submissionProblemScoresReq = (await Promise.all(submissionProblemScoresPromises)).reduce((a, b) => a.concat(b), [])
            setSubmissionProblemScores(submissionProblemScoresReq)

            const containerAutograder = (await RequestService.get<ContainerAutoGrader[]>(`/api/container-auto-graders/assignment/${assignmentId}`)).pop() ?? null
            setContainerAutograder(containerAutograder)

        } catch (error) {
            setError(error)
        } finally {
            setLoading(false)
        }
    }

    if (loading) return <LoadingOverlay delay={250} />
    if (error) return <ErrorPage error={error} />

    const handleChange = (value : string, e : React.ChangeEvent<HTMLInputElement>) => {
        const key = e.target.id
        setFormData(prevState => ({...prevState,[key] : value}))
    }
    const handleFileChange = (e : React.ChangeEvent<HTMLInputElement>) => {
        setFile(e.target.files?.item(0))
    }

    const handleSubmit = async () => {
        const contentField = {
            filepaths : [],
            form : formData,
        }
        const submission = {
            userId : userId,
            assignmentId : assignmentId,
            courseId : courseId,
            content : JSON.stringify(contentField),
        }

        setLoading(true)

        try {
            if (file) {
                const submission = new FormData
                submission.append('userId', String(userId))
                submission.append('assignmentId', assignmentId)
                submission.append('courseId', courseId)
                submission.append('content', JSON.stringify(contentField))
                submission.append('files', file)

                var response = await RequestService.postMultipart('/api/submissions', submission)
            } else {
                var response = await RequestService.post('/api/submissions', submission)
            }
            
            setAlert({ autoDelete: true, type: 'success', message: 'Submission Sent' })

            // Now you can use submissionResponse.id here
            await RequestService.post(`/api/grade/${response.id}`, {} )
            setAlert({ autoDelete: true, type: 'success', message: 'Submission Graded' })

            fetchData()
        } catch (err) {
            const message = Array.isArray(err) ? err.map((e) => `${e.param} ${e.msg}`).join(', ') : err.message
            setAlert({ autoDelete: false, type: 'error', message })
        } finally {
            setLoading(false)
        }
    }

    return(
        <PageWrapper>
            <h1>{assignment?.name}</h1>

            <Link to = {`/courses/${courseId}/assignments/${assignmentId}/update`} className = {styles.button}>Update Assignment</Link>
            <br/><br/><br/>
            <Link to={`/courses/${courseId}/assignments/${assignmentId}/createNCAG`} className={styles.button}>Add
                Non-Container Auto-Graders</Link>
            <br/><br/><br/>
            <Link to={`/courses/${courseId}/assignments/${assignmentId}/createCAG`} className={styles.button}>Add
                Container Auto-Grader</Link>

            {/**Assignment Problems & Submission */}
            {assignmentProblems.map(assignmentProblem => (
                <div>
                    <h2>{assignmentProblem.problemName}</h2>
                    <TextField id={assignmentProblem.problemName} label='Answer' onChange={handleChange} />
                </div>
            ))}
            {containerAutograder && (<input type="file" onChange={handleFileChange} />)}
            <Button onClick={handleSubmit}>Submit</Button>
            <br/>

            {/**Submissions List */}
            {submissions.map((s, index) => (
                <SubmissionComponent
                    index={submissions.length - (index)}
                    submission={s}
                    submissionScore={submissionScores.find(ss => ss.submissionId === s.id)}
                    submissionProblemScores={submissionProblemScores.filter(sps => sps.submissionId === s.id)}
                    assignmentProblems={assignmentProblems}
                    courseId={courseId}
                    assignmentId={assignmentId}
                />
            ))}
        </PageWrapper>
    )
}

type SubmissionProps = {
    index: number, 
    submission: Submission, 
    submissionScore?: SubmissionScore, 
    submissionProblemScores: SubmissionProblemScore[],
    assignmentProblems: AssignmentProblem[],
    courseId: string
    assignmentId: string
}
const SubmissionComponent = ({
                                 index,
                                 submission,
                                 submissionScore,
                                 submissionProblemScores,
                                 assignmentProblems,
                                 courseId,
                                 assignmentId
                             }: SubmissionProps) => {
    return (
        <div>
            <h2>Submission {index}:</h2>
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
            <br/>
            <Link to={`/courses/${courseId}/assignments/${assignmentId}/submissions/${submission.id}`}
                  className={styles.button}>Submission Details</Link>
            <Link to={`/courses/${courseId}/assignments/${assignmentId}/submissions/${submission.id}/feedback`}
                  className={styles.button}>Submission Feedback</Link>
            <br/><br/><br/>
        </div>
    )
}
export default AssignmentDetailPage
