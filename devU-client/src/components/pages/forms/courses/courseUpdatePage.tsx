import React, {useEffect, useState} from 'react'
import {useHistory, useParams} from 'react-router-dom'

import PageWrapper from 'components/shared/layouts/pageWrapper'

import RequestService from 'services/request.service'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

import {ExpressValidationError} from 'devu-shared-modules'

import {useActionless} from 'redux/hooks'
import TextField from 'components/shared/inputs/textField'
import Button from '@mui/material/Button'
import {SET_ALERT} from 'redux/types/active.types'
import {
    applyMessageToErrorFields,
    removeClassFromField
} from "../../../../utils/textField.utils";

import formStyles from './coursesFormPage.scss'

type UrlParams = {
    courseId: string
}

const CourseUpdatePage = ({}) => {
    const [setAlert] = useActionless(SET_ALERT)
    const history = useHistory()
    const [formData,setFormData] = useState({
        name: '',
        number: '',
        semester: '',
    })
    const [startDate, setStartDate] = useState(new Date())
    const [endDate, setEndDate] = useState(new Date())
    const [invalidFields, setInvalidFields] = useState(new Map<string, string>())

    const { courseId } = useParams() as UrlParams
    useEffect(() => {
        let isMounted = false;
        if (!isMounted){
            RequestService.get(`/api/courses/${courseId}`).then((res) => {
                setFormData({
                    name: res.name,
                    number: res.number,
                    semester: res.semester,
                });
                setStartDate(new Date(res.startDate));
                setEndDate(new Date(res.endDate));
                isMounted = true;
            });
        }
    }, []);
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

        RequestService.put(`/api/courses/${courseId}`, finalFormData)
            .then(() => {
                setAlert({ autoDelete: true, type: 'success', message: 'Course Updated' })
                history.goBack()
            })
            .catch((err: ExpressValidationError[] | Error) => {
                const message = Array.isArray(err) ? err.map((e) => `${e.param} ${e.msg}`).join(', ') : err.message
                const newFields = new Map<string, string>()
                Array.isArray(err) ? err.map((e) => applyMessageToErrorFields(newFields, e.param, e.msg)) : newFields
                setInvalidFields(newFields);
                setAlert({ autoDelete: false, type: 'error', message })
            })
        .finally(() => {
        })
    }


    return (
    <PageWrapper>
        <h1>Course Detail Update</h1>
        <div className={formStyles.form}>

            <TextField id='name' label={"Course Name*"} onChange={handleChange} value={formData.name}
                        invalidated={!!invalidFields.get("name")} helpText={invalidFields.get("name")}
                        defaultValue={formData.name}/>
            <TextField id='number' label={"Course Number*"} onChange={handleChange} value={formData.number}
                        invalidated={!!invalidFields.get("number")} helpText={invalidFields.get("number")}/>
            <TextField id='semester' label={"Semester*"} onChange={handleChange} value={formData.semester}
                        placeholder='Ex. f2022, w2023, s2024' invalidated={!!invalidFields.get("semester")}
                        helpText={invalidFields.get("semester")}/>

                <div className = {formStyles.datepickerContainer}>
                    <div>
                        <label htmlFor='start_date'>Start Date *</label>
                        <br/>
                        <DatePicker id='start_date' selected={startDate} onChange={handleStartDateChange}
                                    className={formStyles.datepicker}
                                    startDate={new Date()}/>
                    </div>
                    <div>
                    <label htmlFor='end_date'>End Date *</label>
                    <br/>
                        <DatePicker id='end_date' selected={endDate} onChange={handleEndDateChange}
                                    className={formStyles.datepicker}/>
                    </div>
                </div>
                <br/>

                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <Button variant='contained' onClick={handleCourseUpdate} className={formStyles.submitBtn}>Update Course</Button>
                </div>

            </div>
    </PageWrapper>
    )
}


export default CourseUpdatePage
