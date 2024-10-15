import React, {useEffect, useState} from 'react'
import {useHistory, useParams} from 'react-router-dom'
import PageWrapper from 'components/shared/layouts/pageWrapper'
import {Assignment, AssignmentProblem, Submission, NonContainerAutoGrader, /*ContainerAutoGrader*/} from 'devu-shared-modules'
import RequestService from 'services/request.service'
import ErrorPage from '../errorPage/errorPage'
import LoadingOverlay from 'components/shared/loaders/loadingOverlay'
import {useActionless, useAppSelector} from 'redux/hooks'
import {SET_ALERT} from 'redux/types/active.types'
import {getCssVariables} from 'utils/theme.utils'


import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import {Accordion, AccordionDetails, AccordionSummary, CardActionArea, TextField, Typography} from '@mui/material'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Unstable_Grid2'
import DragDropFile from 'components/utils/dragDropFile'

import styles from './assignmentDetailPage.scss'
import {prettyPrintDateTime} from "../../../utils/date.utils";

const AssignmentDetailPage = () => {
    const [theme, setTheme] = useState(getCssVariables())
    const { listItemBackground,textColor,secondaryDarker } = theme
    const [setAlert] = useActionless(SET_ALERT)
    const history = useHistory()
    const { assignmentId, courseId } = useParams<{assignmentId: string, courseId: string}>()
    const userId = useAppSelector((store) => store.user.id)
    const role = useAppSelector((store) => store.roleMode)

    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(true)
    const [formData, setFormData] = useState({})
    const [file, setFile] = useState<File | null>()
    const [assignmentProblems, setAssignmentProblems] = useState<AssignmentProblem[]>([])
    const [submissions, setSubmissions] = useState<Submission[]>([])
    // const [submissionScores, setSubmissionScores] = useState(new Array<SubmissionScore>())
    // const [submissionProblemScores, setSubmissionProblemScores] = useState(new Array<SubmissionProblemScore>())
    const [assignment, setAssignment] = useState<Assignment>()
    const [assignmentDueDate, setAssignmentDueDate] = useState<string>()

    // const [containerAutograder, setContainerAutograder] = useState<Array<ContainerAutoGrader> | null>()
    // const containerAutograder = false; 
    //TODO: Use the above commented out code to get the container autograder
    const [nonContainerAutograders, setNonContainerAutograders] = useState<NonContainerAutoGrader[]>([])

    useEffect(() => {
        const observer = new MutationObserver(() => setTheme(getCssVariables()))
        observer.observe(document.body, { attributes: true })
        return () => observer.disconnect()
    })


    useEffect(() => {
        fetchData()
    }, []);

    useEffect(() => {
        if (assignment) {
            var dueDate = assignment.dueDate.substring(0, 10);
            setAssignmentDueDate(dueDate)
        }
    }, [assignment])


    const fetchData = async () => {
        try {
            const assignments = await RequestService.get<Assignment>(`/api/course/${courseId}/assignments/${assignmentId}`)
            setAssignment(assignments)

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
            //  })
            //  const submissionProblemScoresReq = (await Promise.all(submissionProblemScoresPromises)).reduce((a, b) => a.concat(b), [])
            //  setSubmissionProblemScores(submissionProblemScoresReq)

            // const containerAutograder = (await RequestService.get<ContainerAutoGrader[]>(`/api/course/${courseId}/assignment/${assignmentId}/container-auto-graders`)).pop() ?? null
            // setContainerAutograder(containerAutograder)

            const nonContainers = await RequestService.get<NonContainerAutoGrader[]>(`/api/course/${courseId}/assignment/${assignmentId}/non-container-auto-graders`)
            setNonContainerAutograders(nonContainers)


        } catch (err:any) {
            setError(err)
            const message = Array.isArray(err) ? err.map((e) => `${e.param} ${e.msg}`).join(', ') : err.message
            setAlert({autoDelete: false, type: 'error', message})
        } finally {
            setLoading(false)
        }
    }

    if (loading) return <LoadingOverlay delay={250} />
    if (error) return <ErrorPage error={error} />

    const handleChange = (e : React.ChangeEvent<HTMLInputElement>) => {
        const key = e.target.id
        setFormData(prevState => ({...prevState,[key] : e.target.value}))
    }
    const handleFile = (file : File) => {
        setFile(file);
    }

    const handleSubmit = async () => {
        let response;
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

                response = await RequestService.postMultipart(`/api/course/${courseId}/assignment/${assignmentId}/submissions`, submission);
            } else {
                response = await RequestService.post(`/api/course/${courseId}/assignment/${assignmentId}/submissions`, submission);
            }
            
            setAlert({ autoDelete: true, type: 'success', message: 'Submission Sent' })

            await RequestService.post(`/api/course/${courseId}/grade/${response.id}`, {} )
            setAlert({ autoDelete: true, type: 'success', message: 'Submission Graded' })

            await fetchData()
        } catch (err: any) {
            const message = Array.isArray(err) ? err.map((e) => `${e.param} ${e.msg}`).join(', ') : err.message
            setAlert({ autoDelete: false, type: 'error', message })
        } finally {
            setLoading(false)
            setFormData({})
            setFile(null)
            await fetchData()
        }
    }

    return(
        <PageWrapper>
            <div className={styles.header}>
                <div className={styles.smallLine}></div>
                <h1>{assignment?.name}</h1>
                <div className={styles.largeLine}></div>
                <Stack spacing={2} direction='row'>
                    {role.isInstructor() && <Button variant='contained' className={styles.buttons} onClick={() => {
                        history.push(`/course/${courseId}/assignment/${assignmentId}/createNCAG`)
                    }}>Add NCAG</Button>}
                    {role.isInstructor() && <Button variant='contained' className={styles.buttons} onClick={() => {
                        history.push(`/course/${courseId}/assignment/${assignmentId}/createCAG`)
                    }}>Add CAG</Button>}
                    {role.isInstructor() && <Button variant='contained' className={styles.buttons} onClick={() => {
                        history.push(`/course/${courseId}/assignment/${assignmentId}/createProblem`)
                    }}>Add Problem</Button>}
                    {role.isInstructor() && <Button variant='contained' className={styles.buttons} onClick={() => {
                        history.push(`/course/${courseId}/assignment/${assignmentId}/update`)
                    }}>Edit Assignment</Button>}
                </Stack>
            </div>

        
            <Grid display='flex' justifyContent='center' alignItems='center'>
            <Card className={styles.card} sx={{bgcolor : secondaryDarker}}>

            {assignmentProblems && assignmentProblems.length > 0 ? (
                assignmentProblems.map((problem, index) => (
                    <Accordion className={styles.accordion} key={index} sx={{bgcolor: listItemBackground}}>
                        <AccordionSummary>
                            <Typography className={styles.accordionDetails}>
                                <h3 className={styles.textColor}>{`Assignment Problem ${index + 1}`}</h3>
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails className={styles.accordionDetails}>
                            <div className={styles.assignmentProblemTextContainer}>
                                <div className={styles.marginBottom}>{problem.problemName}</div>
                            </div>
                            <br/>
                            <TextField id={problem.problemName} fullWidth className={styles.textField} variant='outlined' label='Answer' onChange={handleChange} sx={{
                                "& .MuiOutlinedInput-input" : {
                                    color: textColor
                                },
                                // label text
                                "& .MuiInputLabel-outlined" : {
                                    color: textColor
                                },
                                // border
                                "& .MuiOutlinedInput-notchedOutline" : {
                                    borderColor: textColor
                                },
                            }}></TextField>
                        </AccordionDetails>
                    </Accordion>
                )) 
            ): null}

            {!(assignment?.disableHandins) && (
                <Accordion className={styles.accordion} sx={{bgcolor : listItemBackground}}>
                    <AccordionSummary>
                        <Typography className={styles.accordionDetails}>
                            <h3 className={styles.textColor}>File Submission</h3>
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails className={styles.accordionDetails}>
                        {/* <input type="file" className={styles.fileInput} onChange={handleFileChange} /> */}
                        {file && <div className={styles.marginBottom}>{`File Selected : ${file.name}`}</div>}
                        <DragDropFile handleFile={handleFile} />
                    </AccordionDetails>
                </Accordion>
                )}
            

            {assignmentProblems || nonContainerAutograders || !(assignment?.disableHandins) ? (
                <div style={{marginTop : 10}} className={styles.textColor}>
                    {/* TODO: Remove split later on when times can be applied in assignment creation */}
                    {`Due Date : ${assignmentDueDate && prettyPrintDateTime(assignmentDueDate).split(',')[0]}`}
                    <br/>
                    <Button variant='contained' style={{marginTop:10, marginBottom:10}} className={styles.submitBtn} onClick={handleSubmit}>Submit</Button>
                </div>
            ) : null}
            </Card>
            </Grid>


            <div className={styles.header}>
                <div className={styles.smallLine}></div>
                <h1>{`Submissions`}</h1>
                <div className={styles.largeLine}></div>
            </div>

            {/**Submissions List */}
            <div>
            {submissions.map((submission, index) => (
                <Card className={styles.submissionCard} key={index} sx={{bgcolor : listItemBackground}}>
                    <CardActionArea onClick={() => {
                        history.push(`/course/${courseId}/assignment/${assignmentId}/submission/${submission.id}`)
                    }}>
                        <CardContent>
                            <Typography>
                                <h3 className={styles.textColor}>{`Submission ${submissions.length - index}`}</h3>
                                <div className={styles.textColor}>{`Submitted at: ${submission.createdAt && prettyPrintDateTime(submission.createdAt)}`}</div>
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>
            ))}
            </div>
        </PageWrapper>
    )
}

export default AssignmentDetailPage
