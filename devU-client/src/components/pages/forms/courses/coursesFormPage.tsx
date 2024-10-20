import React, { useState } from 'react'
// import DatePicker from 'react-datepicker'
// import 'react-datepicker/dist/react-datepicker.css'
import { useHistory } from 'react-router-dom'
import { ExpressValidationError } from 'devu-shared-modules'

import PageWrapper from 'components/shared/layouts/pageWrapper'

import RequestService from 'services/request.service'

import { useActionless } from 'redux/hooks'
import TextField from 'components/shared/inputs/textField'
import { SET_ALERT } from 'redux/types/active.types'
import formStyles from './coursesFormPage.scss'
import { applyMessageToErrorFields, removeClassFromField } from "../../../../utils/textField.utils";


const EditCourseFormPage = () => {
    const [setAlert] = useActionless(SET_ALERT)
    const history = useHistory();

    const [formData, setFormData] = useState({
        name: '',
        number: '',
        semester: '',
    })
    // const [startDate, setStartDate] = useState(new Date())
    // const [endDate, setEndDate] = useState(new Date())
    const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0])
    const [endDate, setEndDate] = useState(new Date().toISOString().split("T")[0])
    const [invalidFields, setInvalidFields] = useState(new Map<string, string>())

    const handleChange = (value: String, e: React.ChangeEvent<HTMLInputElement>) => {
        const key = e.target.id
        setFormData(prevState => ({ ...prevState, [key]: value }))

        const newInvalidFields = removeClassFromField(invalidFields, key)
        setInvalidFields(newInvalidFields)
    }
    // const handleStartDateChange = (date : Date) => {setStartDate(date)}
    // const handleEndDateChange = (date : Date) => {setEndDate(date)}
    const handleStartDateChange = (event: React.ChangeEvent<HTMLInputElement>) => { setStartDate(event.target.value) }
    const handleEndDateChange = (event: React.ChangeEvent<HTMLInputElement>) => { setEndDate(event.target.value) }


    const handleSubmit = () => {
        const finalFormData = {
            name: formData.name,
            number: formData.number,
            semester: formData.semester,
            // startDate: startDate.toISOString(),
            // endDate: endDate.toISOString(),
            startDate: startDate,
            endDate: endDate,
        }

        RequestService.post('/api/courses/instructor', finalFormData)
            .then(() => {
                setAlert({ autoDelete: true, type: 'success', message: 'Course Added' })
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
            <h1>Course Form</h1>

            <div className={formStyles.courseFormWrapper}>
                <div className={formStyles.createDetailsForm}>
                    <TextField id='name' label={"Course Name*"} onChange={handleChange} value={formData.name}
                        invalidated={!!invalidFields.get("name")} helpText={invalidFields.get("name")} />
                    <TextField id='number' label={"Course Number*"} onChange={handleChange} value={formData.number}
                        invalidated={!!invalidFields.get("number")} helpText={invalidFields.get("number")} />
                    <TextField id='semester' label={"Semester*"} onChange={handleChange} value={formData.semester}
                        placeholder='Ex. f2022, w2023, s2024' invalidated={!!invalidFields.get("semester")}
                        helpText={invalidFields.get("semester")} />
                    {/* <div className = {formStyles.datepickerContainer}>
                        <div>
                            <label htmlFor='start_date'>Start Date *</label>
                            <br/>
                            <DatePicker id='start_date' selected={startDate} onChange={handleStartDateChange}
                                        className={formStyles.datepicker}/>
                        </div>
                        <div>
                        <label htmlFor='end_date'>End Date *</label>
                        <br/>
                            <DatePicker id='end_date' selected={endDate} onChange={handleEndDateChange}
                                        className={formStyles.datepicker}/>
                        </div>
                    </div> */}
                    <div className={formStyles.datepickerContainer}>
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: '5px' }}>
                            <label htmlFor='start-date'>Start Date *</label>
                            <input type="date" id="start-date" value={startDate} onChange={handleStartDateChange} />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: '5px' }}>
                            <label htmlFor='end-date'>End Date *</label>
                            <input type="date" id="end-date" value={endDate} onChange={handleEndDateChange} />
                        </div>
                    </div>
                    {/* <br /> */}
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <button className='btnPrimary' onClick={handleSubmit}>Create Course</button>
                    </div>
                </div>
            </div>
        </PageWrapper>
    )

}


export default EditCourseFormPage