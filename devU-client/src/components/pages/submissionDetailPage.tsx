import React,{useState,useEffect} from 'react'

import PageWrapper from 'components/shared/layouts/pageWrapper'
import RequestService from 'services/request.service'
import { SubmissionScore } from 'devu-shared-modules'
import Button from 'components/shared/inputs/button'
import TextField from 'components/shared/inputs/textField'
import { useActionless } from 'redux/hooks'
import { SET_ALERT } from 'redux/types/active.types'

const SubmissionDetailPage = (props : any) => { 
    const { state } = props.location
    const [setAlert] = useActionless(SET_ALERT)
    const [submissionScore, setSubmissionScore] = useState<SubmissionScore | null>(null)
    const [showManualGrade, setToggleManualGrade] = useState<boolean>(false)
    const [formData, setFormData] = useState({
        submissionId: state.id,
        score: 0,
        feedback: '',
        releasedAt: "2024-10-05T14:48:00.000Z",
    })

    const fetchData = async () => {
        try {
            const data = await RequestService.get<SubmissionScore>(
                `/api/submission-scores/${state.id}`
            )
            setSubmissionScore(data)
        } catch (error) {
            console.log('Error fetching submission problem scores', error)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    const handleClick = () => {
        setToggleManualGrade(!showManualGrade)
    }

    const handleChange = (value : string, e : React.ChangeEvent<HTMLInputElement>) => {
        const key = e.target.id
        setFormData(prevState => ({...prevState,[key] : value}))
    }

    const handleManualGrade = async () => {
        if (submissionScore) {
            // Update the submission score
            console.log('Submission Exists')
            await RequestService.put( `/api/submission-scores/${submissionScore.id}`, formData)
            .then(() => {
                setAlert({ autoDelete: true, type: 'success', message: 'Submission Score Updated' })
            
            })
        }
        else {
            // Create a new submission score
            console.log('No Submission')
            await RequestService.post( `/api/submission-scores`, formData)
            .then(() => {
                setAlert({ autoDelete: true, type: 'success', message: 'Submission Score Created' })
            })
        }
    }

    return(
        <PageWrapper>
            <h1>Submission Detail</h1>

            <Button onClick={handleClick}>Manually Grade</Button>

            {showManualGrade && (
                <div>
                    <TextField id="score" placeholder="Score" onChange={handleChange}/>
                    <TextField id="feedback" placeholder="Feedback" onChange={handleChange}/>
                    <Button onClick={handleManualGrade}>Submit</Button>
                </div>
            )}

            {submissionScore ? (
                <div>
                    <h1>{submissionScore.submissionId}</h1>
                    <h2>{submissionScore.score}</h2>
                    <h3>{submissionScore.feedback}</h3>
                    <br></br>
                </div>
            ) : (
                <h1>No submission score/feedback available</h1>
            )}
        </PageWrapper>
    )
}

export default SubmissionDetailPage
