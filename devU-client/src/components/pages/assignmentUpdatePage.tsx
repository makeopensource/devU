import React, {useState}from 'react'
import { ExpressValidationError } from 'devu-shared-modules'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

import PageWrapper from 'components/shared/layouts/pageWrapper'

import RequestService from 'services/request.service'

import { useActionless } from 'redux/hooks'
import TextField from 'components/shared/inputs/textField'
import Button from 'components/shared/inputs/button'

import { SET_ALERT } from 'redux/types/active.types'



const AssignmentUpdatePage = () => {
    const [setAlert] = useActionless(SET_ALERT)

    const [formData, setFormData] = useState({
        courseId: 0,
        name: '',
        startDate: '',
        dueDate: '',
        endDate: '',
        categoryName: null,
        description: null,
        maxFileSize: 0,
        maxSubmissions: null,
        disableHandins: false,
    })  
    const [startDate, setStartDate] = useState(new Date())
    const [endDate, setEndDate] = useState(new Date())
    const [dueDate, setDueDate] = useState(new Date())
    const [loading, setLoading] = useState(false)

    const handleChange = (value: String, e : React.ChangeEvent<HTMLInputElement>) => {
        const key = e.target.id

        setFormData(prevState => ({...prevState,[key] : value}))
    }
    const handleStartDateChange = (date : Date) => {setStartDate(date)}
    const handleEndDateChange = (date : Date) => {setEndDate(date)}
    const handleDueDateChange = (date: Date) => {setDueDate(date)}

    const handleAssignmentUpdate = () => {
        const finalFormData = {
            name: formData.name,
            startDate : startDate.toISOString(),
            dueDate: dueDate.toISOString(),
            endDate : endDate.toISOString(),
            gradingType: '',
            categoryName: formData.categoryName,
            description: formData.description,
            maxFileSize: formData.maxFileSize,
            maxSubmissions: formData.maxSubmissions,
            disableHandins: formData.disableHandins,

        }
        setLoading(true)

        RequestService.put('/api/assignments/:assignmentId/update', finalFormData)
            .then(() => {
                
                setAlert({ autoDelete: true, type: 'success', message: 'Assignment Updated' })
            })
            .catch((err: ExpressValidationError[] | Error) => {
                const message = Array.isArray(err) ? err.map((e) => `${e.param} ${e.msg}`).join(', ') : err.message

                setAlert({ autoDelete: false, type: 'error', message })
            })
            .finally(() => setLoading(false))
    }

    return (
    <PageWrapper>
        <h1>Assignment Detail Update</h1>
        
        <TextField id = 'courseId' label = 'Course Id' onChange={handleChange}/>
        <TextField id='name' label='Assignemnt Name' onChange={handleChange}/>
        <DatePicker selected={startDate} onChange={handleStartDateChange} />
        <DatePicker selected={dueDate}  onChange={handleDueDateChange} />
        <DatePicker selected={endDate}  onChange={handleEndDateChange}/>
        <TextField id='categoryName' label='Category Name' onChange={handleChange}/>
        <TextField id='description' label='Description of the Assignment' onChange={handleChange}/>
        <TextField id='maxFileSize' label='Maximum allowable file Size' onChange={handleChange}/>
        <TextField id='maxSubmission' label='Maximum Submissions' onChange={handleChange}/>
        <TextField id='disableHandins' label='Disable Handins' onChange={handleChange}/>

        <Button onClick={handleAssignmentUpdate} loading={loading}>Submit Updates</Button>
    </PageWrapper>
    )
}

export default AssignmentUpdatePage
