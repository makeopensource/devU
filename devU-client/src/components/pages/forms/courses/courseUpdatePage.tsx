import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'

import PageWrapper from 'components/shared/layouts/pageWrapper'

import RequestService from 'services/request.service'
// import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

import { ExpressValidationError } from 'devu-shared-modules'

import { useActionless } from 'redux/hooks'
import TextField from 'components/shared/inputs/textField'
// import Button from '@mui/material/Button'
import { SET_ALERT } from 'redux/types/active.types'
import {
    applyMessageToErrorFields,
    removeClassFromField
} from "../../../../utils/textField.utils";

import formStyles from './coursesFormPage.scss'

type UrlParams = {
    courseId: string
}

const CourseUpdatePage = ({ }) => {
    const [setAlert] = useActionless(SET_ALERT)
    const history = useHistory()
    const [formData, setFormData] = useState({
        name: '',
        number: '',
        semester: '',
    })
    const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0])
    const [endDate, setEndDate] = useState(new Date().toISOString().split("T")[0])
    const [invalidFields, setInvalidFields] = useState(new Map<string, string>())

    const { courseId } = useParams() as UrlParams
    useEffect(() => {
        let isMounted = false;
        if (!isMounted) {
            RequestService.get(`/api/courses/${courseId}`).then((res) => {
                setFormData({
                    name: res.name,
                    number: res.number,
                    semester: res.semester,
                });
                setStartDate(new Date(res.startDate).toISOString().split("T")[0]);
                setEndDate(new Date(res.endDate).toISOString().split("T")[0]);
                isMounted = true;
            });
        }
    }, []);
    const handleChange = (value: String, e: React.ChangeEvent<HTMLInputElement>) => {
        const key = e.target.id
        const newInvalidFields = removeClassFromField(invalidFields, key)
        setInvalidFields(newInvalidFields)
        setFormData(prevState => ({ ...prevState, [key]: value }))
    }
    const handleStartDateChange = (event: React.ChangeEvent<HTMLInputElement>) => { setStartDate(event.target.value) }
    const handleEndDateChange = (event: React.ChangeEvent<HTMLInputElement>) => { setEndDate(event.target.value) }

    const handleCourseUpdate = () => {
        const finalFormData = {
            name: formData.name,
            number: formData.number,
            semester: formData.semester,
            startDate: startDate,
            endDate: endDate,
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

    const handleAddStudent = () => {
        // TODO: get user id by getting email and calling /users --> search through /users --> 
        // RequestService.post(`/api/courses/${courseId}/users-courses/${id}:`,
    }

    const handleDropStudent = () => {
        // get user id by getting email and calling /users --> search through /users --> 
        // RequestService.delete(`/api/courses/${courseId}/users-courses/${id}:`,  
    }


    return (
        <PageWrapper>
            <h1>Update Course Form</h1>
            <div className={formStyles.courseFormWrapper}>
                <div className={formStyles.updateDetailsForm}>
                    <h2>Course Details</h2>
                    <div className={formStyles.inputContainer}>
                        <TextField id='name' label={"Course Name*"} onChange={handleChange} value={formData.name}
                            invalidated={!!invalidFields.get("name")} helpText={invalidFields.get("name")}
                            defaultValue={formData.name} />
                        <TextField id='number' label={"Course Number*"} onChange={handleChange} value={formData.number}
                            invalidated={!!invalidFields.get("number")} helpText={invalidFields.get("number")} />
                        <TextField id='semester' label={"Semester*"} onChange={handleChange} value={formData.semester}
                            placeholder='e.g. f2022, w2023, s2024' invalidated={!!invalidFields.get("semester")}
                            helpText={invalidFields.get("semester")} />
                    </div>
                    <div className={formStyles.datepickerContainer}>
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: '5px' }}>
                            <label htmlFor='start-date'>Start Date *</label>
                            <input type="date" id="start-date" value={startDate} onChange={handleStartDateChange}/>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: '5px' }}>
                            <label htmlFor='end-date'>End Date *</label>
                            <input type="date" id="end-date" value={endDate} onChange={handleEndDateChange}/>
                        </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <button className='btnPrimary' onClick={handleCourseUpdate}>Update Course</button>
                    </div>
                </div>
                <div className={formStyles.addDropForm}>
                    <h2>Add/Drop Students</h2>
                    <TextField id='ubit' label={"UBIT*"} onChange={handleChange}
                        placeholder='e.g. hartloff' invalidated={!!invalidFields.get("ubit")} helpText={invalidFields.get("ubit")} />
                    <input type="file" id="addDropFile" />
                    <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', marginTop: 'auto', gap: '1rem'}}>
                        <button className='btnPrimary' onClick={handleAddStudent}>Add Student</button>
                        <button className='btnDelete' onClick={handleDropStudent}>Drop Student</button>
                    </div>
                </div>
            </div>
        </PageWrapper>
    )
}


export default CourseUpdatePage
