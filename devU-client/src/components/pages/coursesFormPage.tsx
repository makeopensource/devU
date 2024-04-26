import React, {useState} from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import {useHistory} from 'react-router-dom'
import {ExpressValidationError} from 'devu-shared-modules'

import PageWrapper from 'components/shared/layouts/pageWrapper'

import RequestService from 'services/request.service'

import {useActionless} from 'redux/hooks'
import TextField from 'components/shared/inputs/textField'
// import Button from 'components/shared/inputs/button'
import {SET_ALERT} from 'redux/types/active.types'
import styles from '../shared/inputs/textField.scss'
import formStyles from './coursesFormPage.scss'
import {applyStylesToErrorFields, removeClassFromField} from "../../utils/textField.utils";

import Button from '@mui/material/Button'


const EditCourseFormPage = () => {
    const [setAlert] = useActionless(SET_ALERT)
    const history = useHistory();

    const [formData,setFormData] = useState({
        name: '',
        number: '',
        semester: '',
    })
    const [startDate, setStartDate] = useState(new Date())
    const [endDate, setEndDate] = useState(new Date())
    const [invalidFields, setInvalidFields] = useState(new Map<string, string>())

    const handleChange = (value: String, e : React.ChangeEvent<HTMLInputElement>) => {
        const key = e.target.id
        setFormData(prevState => ({...prevState,[key] : value}))

        const newInvalidFields = removeClassFromField(invalidFields, key)
        setInvalidFields(newInvalidFields)
    }
    const handleStartDateChange = (date : Date) => {setStartDate(date)}
    const handleEndDateChange = (date : Date) => {setEndDate(date)}


    const handleSubmit = () => {
        const finalFormData = {
            name : formData.name,
            number : formData.number,
            semester : formData.semester,
            startDate : startDate.toISOString(),
            endDate : endDate.toISOString(),
        }

        RequestService.post('/api/courses/', finalFormData)
            .then(() => {
                setAlert({ autoDelete: true, type: 'success', message: 'Course Added' })

            })
            .catch((err: ExpressValidationError[] | Error) => {
                const message = Array.isArray(err) ? err.map((e) => `${e.param} ${e.msg}`).join(', ') : err.message

                const newFields = applyStylesToErrorFields(err, formData, styles.errorField)
                setInvalidFields(newFields);

                setAlert({ autoDelete: false, type: 'error', message })
            })
        .finally(() => {
            history.goBack()
        })
    }

    return (
        <PageWrapper>
            <h1>Course Form</h1>
            <div className={formStyles.form}>
                <p>Required Fields *</p>

                <label htmlFor='name'>Course Name *</label>
                <TextField id='name' onChange={handleChange} value={formData.name}
                        className={invalidFields.get('name')}/>
                <label htmlFor='number'>Course Number *</label>
                <TextField id='number' onChange={handleChange} value={formData.number}
                        className={invalidFields.get('number')}/>
                <label htmlFor='semester'>Semester *</label>
                <TextField id='semester' onChange={handleChange} value={formData.semester}
                        placeholder='Ex. f2022, w2023, s2024' className={invalidFields.get('semester')}/>
                
                <div className = {formStyles.datepickerContainer}>
                    <div>
                        <label htmlFor='start_date'>Start Date *</label>
                        <br/>
                        <DatePicker id='start_date' selected = {startDate} onChange={handleStartDateChange}/>  
                    </div>
                    <div>
                    <label htmlFor='end_date'>End Date *</label>
                    <br/>
                    <DatePicker id='end_date' selected = {endDate} onChange={handleEndDateChange}/>
                    </div>
                </div>
                <br/>
                
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <Button variant='contained' onClick={handleSubmit} className={formStyles.submitBtn}>Submit</Button>
                </div>            

            </div>
        </PageWrapper>
    )

}


export default EditCourseFormPage