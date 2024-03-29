import React,{ useState, useEffect } from 'react'
import {Link} from 'react-router-dom'
import PageWrapper from 'components/shared/layouts/pageWrapper'
import { AssignmentProblem, Submission, SubmissionScore, SubmissionProblemScore } from 'devu-shared-modules' 
import RequestService from 'services/request.service'
import ErrorPage from './errorPage'
import LoadingOverlay from 'components/shared/loaders/loadingOverlay'
import TextField from 'components/shared/inputs/textField'
import Button from 'components/shared/inputs/button'
import { useAppSelector,useActionless } from 'redux/hooks'
import { SET_ALERT } from 'redux/types/active.types'
import { useParams } from 'react-router-dom'

import styles from './assignmentDetailPage.scss'

const AssignmentDetailPage = () => {
    const [setAlert] = useActionless(SET_ALERT)
    const { assignmentId, courseId } = useParams<{assignmentId: string, courseId: string}>()
    const userId = useAppSelector((store) => store.user.id)

    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(true)
    const [formData, setFormData] = useState({})
    const [assignmentProblems, setAssignmentProblems] = useState(new Array<AssignmentProblem>())
    const [submissions, setSubmissions] = useState(new Array<Submission>())
    const [submissionScores, setSubmissionScores] = useState(new Array<SubmissionScore>())
    const [submissionProblemScores, setSubmissionProblemScores] = useState(new Array<SubmissionProblemScore>())

    
    useEffect(() => {
          fetchData()
    }, []);


    const fetchData = async () => {
         try {
             const assignmentProblemsReq = await RequestService.get<AssignmentProblem[]>(`/api/assignment-problems/${assignmentId}`)
             setAssignmentProblems(assignmentProblemsReq)

             const submissionsReq = await RequestService.get<Submission[]>(`/api/submissions?assignment=${assignmentId}&user=${userId}`)
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

                
             
         }catch(error){
             setError(error)
         }finally{
             setLoading(false)
         }
    }

    if (loading) return <LoadingOverlay delay={250} />
    if (error) return <ErrorPage error={error} />

    const handleChange = (value : string, e : React.ChangeEvent<HTMLInputElement>) => {
        const key = e.target.id
        setFormData(prevState => ({...prevState,[key] : value}))
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
            const response = await RequestService.post('/api/submissions', submission)
            setAlert({ autoDelete: true, type: 'success', message: 'Submission Sent' })
    
            // Now you can use submissionResponse.id here
            await RequestService.post(`/api/grade/${response.id}`, {} )
            setAlert({ autoDelete: true, type: 'success', message: 'Submission Graded' })
        } catch (err) {
            const message = Array.isArray(err) ? err.map((e) => `${e.param} ${e.msg}`).join(', ') : err.message
            setAlert({ autoDelete: false, type: 'error', message })
        } finally {
            setLoading(false)
        }

    }

    return(
        <PageWrapper>
            <Link to = {`/courses/${courseId}/assignments/${assignmentId}/update`} className = {styles.button}>Update Assignment</Link>
            <br/><br/><br/>
            <Link to = {`/ncagtest`} className = {styles.button}>Add Non-Container Auto-Graders</Link>
            <h1>Assignment Detail</h1>
            {assignmentProblems.map(assignmentProblem => (
                <div>
                    <h2>{assignmentProblem.problemName}</h2>
                    <TextField id={assignmentProblem.problemName} label='Answer' onChange={handleChange} />
                </div>
            ))}
            <Button onClick={handleSubmit}>Submit</Button>
            <br/>
            {console.log(submissionProblemScores)}
            {console.log(submissionScores)}
            {submissions.map((s, index) => (
                <div>
                    <h2>Submission {submissions.length - (index)}:</h2>
                    <Link to = {`/submissions/${s.id}`} className = {styles.button}>View Submission Details</Link>
                    <br/><br/>
                    <table>
                        {assignmentProblems.map(ap => (
                            <th>{ap.problemName} ({ap.maxScore})</th>
                        ))}
                        <th>Total Score</th>
                        <tr>
                            {assignmentProblems.map(ap => (
                                <td>{submissionProblemScores.find(sps => (sps.assignmentProblemId === ap.id && sps.submissionId === s.id))?.score ?? "N/A"}</td>
                            ))}
                            <td>{submissionScores.find(ss => ss.submissionId === s.id)?.score ?? "N/A"}</td>
                        </tr>
                    </table> <br/>
                </div>
            ))}
        </PageWrapper>
    )
}
export default AssignmentDetailPage
