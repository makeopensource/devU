import React, {useState} from 'react'
import {useParams} from 'react-router-dom'

import PageWrapper from 'components/shared/layouts/pageWrapper'

import RequestService from 'services/request.service'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

import {ExpressValidationError} from 'devu-shared-modules'

import {useActionless} from 'redux/hooks'
import TextField from 'components/shared/inputs/textField'
import Button from 'components/shared/inputs/button'
import {SET_ALERT} from 'redux/types/active.types'
import styles from '../shared/inputs/textField.scss'
import {applyStylesToErrorFields, removeClassFromField} from "../../utils/textField.utils";

type UrlParams = {
    courseId: string
}

const CourseUpdatePage = ({}) => {

    const [setAlert] = useActionless(SET_ALERT)

    const [formData,setFormData] = useState({
        name: '',
        number: '',
        semester: '',
    })
    const [startDate, setStartDate] = useState(new Date())
    const [endDate, setEndDate] = useState(new Date())
    const [loading, setLoading] = useState(false)
    const [invalidFields, setInvalidFields] = useState(new Map<string, string>())

    const { courseId } = useParams() as UrlParams

    const handleChange = (value: String, e : React.ChangeEvent<HTMLInputElement>) => {
        const key = e.target.id
        const newInvalidFields = removeClassFromField(invalidFields, key)
        setInvalidFields(newInvalidFields)
        setFormData(prevState => ({...prevState,[key] : value}))
    }
    const handleStartDateChange = (date : Date) => {setStartDate(date)}
    const handleEndDateChange = (date : Date) => {setEndDate(date)}

    const handleCourseUpdate = () => {
        const finalFormData = {
            name : formData.name,
            number : formData.number,
            semester : formData.semester,
            startDate : startDate.toISOString(),
            endDate : endDate.toISOString(),
        }
        
        setLoading(true)

        RequestService.put(`/api/courses/${courseId}`, finalFormData)
            .then(() => {
                setAlert({ autoDelete: true, type: 'success', message: 'Course Updated' })
            })
            .catch((err: ExpressValidationError[] | Error) => {
                const message = Array.isArray(err) ? err.map((e) => `${e.param} ${e.msg}`).join(', ') : err.message
                const newInvalidFields = applyStylesToErrorFields(err, formData, styles.errorField)
                setInvalidFields(newInvalidFields)

                setAlert({ autoDelete: false, type: 'error', message })
            })
            .finally(() => setLoading(false))
    }


    return (
    <PageWrapper>
        <h1>Course Detail Update</h1>
        <TextField id='name' label='Course Name' onChange={handleChange} className={invalidFields.get('name')}/>
        <TextField id='number' label='Course Number' onChange={handleChange} className={invalidFields.get('number')}/>
        <TextField id='semester' label='Semester' onChange={handleChange} placeholder='Ex. f2022, w2023, s2024, u2025'
                   className={invalidFields.get('semester')}/>
        <DatePicker selected = {startDate} onChange={handleStartDateChange}/>
        <DatePicker selected = {endDate} onChange={handleEndDateChange}/>
    
        <Button onClick={handleCourseUpdate} loading={loading}>Update Course</Button>
    </PageWrapper>
    )
}


export default CourseUpdatePage
