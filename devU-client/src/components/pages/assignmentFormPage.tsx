import React, {useState} from 'react'
import DatePicker from 'react-datepicker'
import {ExpressValidationError} from 'devu-shared-modules'
import 'react-datepicker/dist/react-datepicker.css'
import PageWrapper from 'components/shared/layouts/pageWrapper'

import RequestService from 'services/request.service'
import {useActionless} from 'redux/hooks'
import TextField from 'components/shared/inputs/textField'
// import Button from 'components/shared/inputs/button'
import Button from '@mui/material/Button'

import {SET_ALERT} from 'redux/types/active.types'

import styles from '../shared/inputs/textField.scss'
import {applyStylesToErrorFields, removeClassFromField} from "../../utils/textField.utils";
import {useHistory, useParams} from 'react-router-dom'

import formStyles from './assignmentFormPage.scss'

const AssignmentCreatePage = () => {
    const [setAlert] = useActionless(SET_ALERT)
    const {courseId} = useParams<{ courseId: string }>()
    const history = useHistory()

    const [formData, setFormData] = useState({
        courseId: courseId,
        name: '',
        categoryName: null,
        description: null,
        maxFileSize: 0,
        maxSubmissions: null,
        disableHandins: false,
    })
    const [endDate, setEndDate] = useState(new Date())
    const [dueDate, setDueDate] = useState(new Date())
    const [startDate, setStartDate] = useState(new Date())
    const [invalidFields, setInvalidFields] = useState(new Map<string, string>())


    const handleChange = (value: String, e : React.ChangeEvent<HTMLInputElement>) => {
        const key = e.target.id

        const newInvalidFields = removeClassFromField(invalidFields, key)
        setInvalidFields(newInvalidFields)

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
            courseId: courseId,
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

        RequestService.post('/api/assignments/', finalFormData)
            .then(() => {
                setAlert({ autoDelete: true, type: 'success', message: 'Assignment Added' })
            })
            .catch((err: ExpressValidationError[] | Error) => {
                const message = Array.isArray(err) ? err.map((e) => `${e.param} ${e.msg}`).join(', ') : err.message
                const newFields = applyStylesToErrorFields(err, formData, styles.errorField)

                setInvalidFields(newFields)
                setAlert({ autoDelete: false, type: 'error', message })
            })
        .finally(() => {
            history.goBack()
        })

    }

    return(
        <PageWrapper>
            <h1>Assignment Form</h1>
            <div className={formStyles.form}>
                <p>Required Field *</p>

                <label htmlFor='name'>Assignment Name *</label>
                <TextField id='name' onChange={handleChange}/>

                <div className={formStyles.datepickerContainer}>
                    <div>
                        <label htmlFor='start_date'>Start Date *</label>
                        <DatePicker id='start_date' selected={startDate} onChange={handleStartDateChange}/>
                    </div>
                    <div>
                        <label htmlFor='due_date'>Due Date *</label>
                        <DatePicker id='due_date' selected={dueDate} onChange={handleDueDateChange}/>
                    </div>
                    <div>
                        <label htmlFor='end_date'>End Date *</label>
                        <DatePicker id='end_date' selected={endDate} onChange={handleEndDateChange}/>
                    </div>
                </div>
                <br/>

                <label htmlFor='categoryName'>Category *</label>
                <TextField id='categoryName' onChange={handleChange}
                        className={invalidFields.get('categoryName')}/>

                <label htmlFor='description'>Description *</label>
                <TextField id='description' onChange={handleChange}
                        className={invalidFields.get('description')}/>
                <label htmlFor='maxFileSize'>Max File Size *</label>
                <TextField id='maxFileSize' onChange={handleChange}
                        className={invalidFields.get('maxFileSize')}/>
                <label htmlFor='maxSubmission'>Max Submission *</label>
                <TextField id='maxSubmission' onChange={handleChange}
                        className={invalidFields.get('maxSubmission')}/>

                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <label htmlFor='disableHandins'>Disable Handins</label>
                    <input type='checkbox' id='disableHandins' checked={formData.disableHandins} onChange={handleCheckbox} className={formStyles.submitBtn}/>
                </div>

                <br/>

                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <Button variant='contained' onClick={handleSubmit} className={formStyles.submitBtn} >Create assignment</Button>
                </div>
            </div>

        </PageWrapper>
    )
}

export default AssignmentCreatePage