import React,{useState} from 'react'

import PageWrapper from 'components/shared/layouts/pageWrapper'
import TextField from 'components/shared/inputs/textField'
import Button from 'components/shared/inputs/button'
import { SET_ALERT } from 'redux/types/active.types'
import { useActionless } from 'redux/hooks'
import { ExpressValidationError } from 'devu-shared-modules'
import RequestService from 'services/request.service'

const AssignmentUpdatePage = () => {
    const [setAlert] = useActionless(SET_ALERT)

    const [toggleForm,setToggleForm] = useState(false)
    const [formData,setFormData] = useState({
        assignmentId: '',
        problemName: '',
        maxScore: '',
    })
    const [problemCount,setProblemCount] = useState(1)
    const [loading, setLoading] = useState(false)


    const toggleProblemForm = () => { setToggleForm(!toggleForm) }

    const handleSubmit = () => {
        setLoading(true)
        const finalFormData = {
            assignmentId: parseInt(formData.assignmentId),
            problemName: formData.problemName,
            maxScore: parseInt(formData.maxScore),
        }         
        
        RequestService.post('/api/assignment-problems/', finalFormData)
        .then(() => {
            setAlert({ autoDelete: true, type: 'success', message: 'Assignment Problem Added' })
        })
        .catch((err: ExpressValidationError[] | Error) => {
            const message = Array.isArray(err) ? err.map((e) => `${e.param} ${e.msg}`).join(', ') : err.message

            setAlert({ autoDelete: false, type: 'error', message })
        })
        .finally(() => {
            setLoading(false)
            setProblemCount(problemCount+1)
            setFormData({
                assignmentId: '',
                problemName: '',
                maxScore: '',
            })
        })
    }
    
    const handleChange = (value : String, e : React.ChangeEvent<HTMLInputElement>) => {
        const key = e.target.id
        setFormData(prevState => ({...prevState,[key] : value}))
    }

    return (
    <PageWrapper>
        <h1>Assignment Detail Update</h1>
        <Button onClick={toggleProblemForm}>Add Problem</Button>
        {toggleForm && (
            <div>
                <TextField id='assignmentId' label='Assignment Id' onChange={handleChange} value={formData.assignmentId}/>
                <TextField id='problemName' label='Problem Question' onChange={handleChange} value={formData.problemName}/>
                <TextField id='maxScore' label='Max Score' onChange={handleChange} value={formData.maxScore}/>
                <Button onClick={handleSubmit} loading={loading}>Create Problem</Button>
            </div>
        )}
    </PageWrapper>
    )
}

export default AssignmentUpdatePage
