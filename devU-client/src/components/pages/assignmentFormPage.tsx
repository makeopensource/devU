import React,{useState} from 'react'

import { ExpressValidationError } from 'devu-shared-modules'

import PageWrapper from 'components/shared/layouts/pageWrapper'

import RequestService from 'services/request.service'

import { useActionless } from 'redux/hooks'
import TextField from 'components/shared/inputs/textField'
import Button from 'components/shared/inputs/button'
import { SET_ALERT } from 'redux/types/active.types'

const EditAssignmentFormPage = () => {
    const [setAlert] = useActionless(SET_ALERT)

    const [formData, setFormData] = useState({
        name: '',
        startDate: '',
        dueDate: '',
        endDate: '',
        description: '',
        gradingType: '',
        maxSubmissions: ''
    })
    const [loading, setLoading] = useState(false)

    const handleChange = (value: String, e : React.ChangeEvent<HTMLInputElement>) => {
        const key = e.target.id
        console.log(formData)
        setFormData(prevState => ({...prevState,[key] : value}))
    }

    const handleSubmit = () => {
        setLoading(true)

        RequestService.post('/api/assignments/', formData)
            .then(() => {
                setAlert({ autoDelete: true, type: 'success', message: 'Assignment Added' })
            })
            .catch((err: ExpressValidationError[] | Error) => {
                const message = Array.isArray(err) ? err.map((e) => `${e.param} ${e.msg}`).join(', ') : err.message

                setAlert({ autoDelete: false, type: 'error', message })
            })
            .finally(() => setLoading(false))
    }

    return(
        <PageWrapper>
            <h1>Assignment Form</h1>
            <TextField id='name' label='Assignemnt Name' onChange={handleChange}/>
            <TextField id='startDate' label='Start Date' onChange={handleChange} placeholder='Ex. 12/05/2024, 01/25/2025'/>
            <TextField id='dueDate' label='Due Date' onChange={handleChange} placeholder='Ex. 12/05/2024, 01/25/2025'/>
            <TextField id='endDate' label='End Date' onChange={handleChange} placeholder='Ex. 12/05/2024, 01/25/2025'/>
            <TextField id='description' label='Description of the Assignment' onChange={handleChange}/>
            <TextField id='maxSubmission' label='Maximum Submissions' onChange={handleChange}/>
            {/* <select id='gradingType' value="Grading" onChange={handleChange}>
                <option value={"Code - AutoGrader"}>Code - AutoGrader</option>
                <option value={"Non-Code - AutoGrader"}>Non-Code AutoGrader</option>
                <option value={"Manual Grader"}>Manual Grader</option>
            </select> */}

        
            <Button onClick={handleSubmit} loading={loading}>Create assignment</Button>

        </PageWrapper>
    )
}

export default EditAssignmentFormPage