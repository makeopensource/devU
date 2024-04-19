import React,{useState} from 'react'
import DatePicker from 'react-datepicker'
import { ExpressValidationError } from 'devu-shared-modules'
import 'react-datepicker/dist/react-datepicker.css'
import PageWrapper from 'components/shared/layouts/pageWrapper'

import RequestService from 'services/request.service'
import { useActionless } from 'redux/hooks'
import TextField from 'components/shared/inputs/textField'
import Button from 'components/shared/inputs/button'

import { SET_ALERT } from 'redux/types/active.types'
import { useParams } from 'react-router-dom'

const AssignmentCreatePage = () => {
    const [setAlert] = useActionless(SET_ALERT)
    const {courseId} = useParams<{courseId : string}>()

    const [formData, setFormData] = useState({
        courseId: courseId,
        name: '',
        categoryName: null,
        description: null,
        maxFileSize: 0,
        maxSubmissions: null,
        disableHandins: false,
    })
    const [loading, setLoading] = useState(false)
    const [endDate, setEndDate] = useState(new Date())
    const [dueDate, setDueDate] = useState(new Date())
    const [startDate, setStartDate] = useState(new Date())


    const handleChange = (value: String, e : React.ChangeEvent<HTMLInputElement>) => {
        const key = e.target.id
      
        setFormData(prevState => ({...prevState,[key] : value}))
    }

    const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prevState => ({...prevState,disableHandins : e.target.checked}))
    }

    const handleStartDateChange = (date : Date) => {setStartDate(date)}
    const handleEndDateChange = (date : Date) => {setEndDate(date)}
    const handleDueDateChange = (date: Date) => {setDueDate(date)}

    const handleSubmit = () => {
        const finalFormData = {
            courseId: formData.courseId,
            name: formData.name,
            startDate : startDate.toISOString(),
            dueDate: dueDate.toISOString(),
            endDate : endDate.toISOString(),
            categoryName: formData.categoryName,
            description: formData.description,
            maxFileSize: formData.maxFileSize,
            maxSubmissions: formData.maxSubmissions,
            disableHandins: formData.disableHandins,
        }
       
        setLoading(true)
        RequestService.post('/api/assignments/', finalFormData)
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
            <TextField id='name' label='Assignment Name' onChange={handleChange}/>
            
            <label htmlFor='start_date'>Start Date</label>
            <br/>
            <DatePicker id='start_date' selected={startDate} onChange={handleStartDateChange} />
            <br/>
            <label htmlFor='due_date'>Due Date</label>
            <br/>
            <DatePicker id='due_date' selected={dueDate}  onChange={handleDueDateChange} />
            <br/>
            <label htmlFor='end_date'>End Date</label>
            <br/>
            <DatePicker id='end_date' selected={endDate}  onChange={handleEndDateChange}/>
            <TextField id='categoryName' label='Category Name' onChange={handleChange}/>
            <TextField id='description' label='Description of the Assignment' onChange={handleChange}/>
            <TextField id='maxFileSize' label='Maximum allowable file Size' onChange={handleChange}/>
            <TextField id='maxSubmission' label='Maximum Submissions' onChange={handleChange}/>

            <label htmlFor='disableHandins'>Disable Handins</label>
            <input type='checkbox' id='disableHandins' checked={formData.disableHandins} onChange={handleCheckbox}/>
            <br/>
            
            <Button onClick={handleSubmit} loading={loading}>Create assignment</Button>

        </PageWrapper>
    )
}

export default AssignmentCreatePage