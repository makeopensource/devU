import React,{useState,useEffect} from 'react'

import PageWrapper from 'components/shared/layouts/pageWrapper'
import RequestService from 'services/request.service'
import { SubmissionScore } from 'devu-shared-modules'

const SubmissionDetailPage = (props : any) => { 
    const { state } = props.location
    const [submissionScore, setSubmissionScore] = useState<SubmissionScore | null>(null)

    const fetchData = async () => {
        try {
            const data = await RequestService.get<SubmissionScore>(
                `/api/submission-scores/${state.id}`
            )
            console.log(data)
            console.log(typeof(data))
            setSubmissionScore(data)
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
            {submissionScore ? (
                <div>
                    <h1>{submissionScore.submissionId}</h1>
                    <h2>{submissionScore.score}</h2>
                    <h3>{submissionScore.feedback}</h3>
                    <br></br>
                </div>
            ) : null}
        </PageWrapper>
    )
}

export default SubmissionDetailPage
