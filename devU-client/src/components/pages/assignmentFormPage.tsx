import React, {useState} from 'react'
import DatePicker from 'react-datepicker'
import {ExpressValidationError} from 'devu-shared-modules'
import 'react-datepicker/dist/react-datepicker.css'
import PageWrapper from 'components/shared/layouts/pageWrapper'

import RequestService from 'services/request.service'
import {useActionless} from 'redux/hooks'
import TextField from 'components/shared/inputs/textField'
import Button from 'components/shared/inputs/button'

import {SET_ALERT} from 'redux/types/active.types'

import styles from '../shared/inputs/textField.scss'
import {applyStylesToErrorFields, removeClassFromField} from "../../utils/textField.utils";
import {useParams} from 'react-router-dom'

const AssignmentCreatePage = () => {
    const [setAlert] = useActionless(SET_ALERT)
    const {courseId} = useParams<{ courseId: string }>()

    const [formData, setFormData] = useState({
        courseId: 0,
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
    const [invalidFields, setInvalidFields] = useState(new Map<string, string>())


    const handleChange = (value: String, e : React.ChangeEvent<HTMLInputElement>) => {
        const key = e.target.id

        const newInvalidFields = removeClassFromField(invalidFields, key)
        setInvalidFields(newInvalidFields)

        setFormData(prevState => ({...prevState,[key] : value}))
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

        setLoading(true)
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
            .finally(() => setLoading(false))

    }

    return(
        <PageWrapper>
            <h1>Assignment Form</h1>
            <TextField id='name' label='Assignment Name' onChange={handleChange} className={invalidFields.get('name')}/>
            <DatePicker selected={startDate} onChange={handleStartDateChange}/>
            <DatePicker selected={dueDate} onChange={handleDueDateChange}/>
            <DatePicker selected={endDate}  onChange={handleEndDateChange}/>
            <TextField id='categoryName' label='Category Name' onChange={handleChange}
                       className={invalidFields.get('categoryName')}/>
            <TextField id='description' label='Description of the Assignment' onChange={handleChange}
                       className={invalidFields.get('description')}/>
            <TextField id='maxFileSize' label='Maximum allowable file Size' onChange={handleChange}
                       className={invalidFields.get('maxFileSize')}/>
            <TextField id='maxSubmissions' label='Maximum Submissions' onChange={handleChange}
                       className={invalidFields.get('maxSubmissions')}/>
            <TextField id='disableHandins' label='Disable Handins' onChange={handleChange}
                       className={invalidFields.get('disableHandins')}/>
            
            <Button onClick={handleSubmit} loading={loading}>Create assignment</Button>

        </PageWrapper>
    )
}

export default AssignmentCreatePage