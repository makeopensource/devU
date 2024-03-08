import React,{useState,useEffect} from 'react'

import PageWrapper from 'components/shared/layouts/pageWrapper'
import RequestService from 'services/request.service'
import { SubmissionScore } from 'devu-shared-modules'


const SubmissionDetailPage = (props : any) => { 
    const { state } = props.location
    const [submissionScores, setSubmissionScores] = useState(new Array<SubmissionScore>())


    const fetchData = async () => {
        try {
            const data = await RequestService.get<SubmissionScore[]>(
                `/api/submission-scores/${state.id}`
            )
            setSubmissionScores(data)
        } catch (error) {
            console.log('Error fetching submission problem scores', error)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    return(
        <PageWrapper>
            <h1>Submission Detail</h1>
            {submissionScores.map(score => (
                <div>
                    <h1>{score.submissionId}</h1>
                    <h2>{score.score}</h2>
                    <h3>{score.feedback}</h3>
                    <br></br>
                </div>
            ))}
        </PageWrapper>
    )
}

export default SubmissionDetailPage
