import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'

import PageWrapper from 'components/shared/layouts/pageWrapper'

import RequestService from 'services/request.service'
import 'react-datepicker/dist/react-datepicker.css'

import { ExpressValidationError } from 'devu-shared-modules'

import { useActionless } from 'redux/hooks'
import TextField from 'components/shared/inputs/textField'
import { SET_ALERT } from 'redux/types/active.types'
import {
    applyMessageToErrorFields,
    removeClassFromField
} from "../../../../utils/textField.utils";

import formStyles from './coursesFormPage.scss'


type UrlParams = {
    courseId: string
}

type User = {
    id?: number
    externalId: string // School's unique identifier (the thing that links to the schools auth)
    email: string
    createdAt?: string
    updatedAt?: string
    preferredName?: string
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
    const [studentEmail, setStudentEmail] = useState("")
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
    
    const handleChange = (value: string, e: React.ChangeEvent<HTMLInputElement>) => {
        const key = e.target.id
        const newInvalidFields = removeClassFromField(invalidFields, key)
        setInvalidFields(newInvalidFields)
        // setFormData(prevState => ({ ...prevState, [key]: value }))
        
        // Update form data based on input field
        if (key === 'studentEmail') {
            setStudentEmail(value)
        } else {
            setFormData(prevState => ({ ...prevState, [key]: value }))
        }
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

    // const handleFileUpload = () => {
    // if file uploaded parse file to grab all student emails
    // note: accepted filetype (enforced by frontend) is csv
    // for each email parsed from file, call handle add or drop student as needed
    // }

    const getUserId = (email: string): number | null => {
        RequestService.get("/api/users/")
            .then((res) => {
                const user: User = res.data.find((user: User) => user.email === email);
                if (user) {
                    return user.id
                }
            })
            .catch((error) => {
                console.error("Error fetching users:", error);
            });
        return null
    }

    const addSingleStudent = (email: string) => {
        const userID = getUserId(email)
        if (!userID) { return }

        const userCourseData = {
            userId: userID,
            courseId: courseId,
            role: 'student',
            dropped: false
        }

        RequestService.post(`/api/courses/${courseId}/users-courses`, userCourseData)
            .catch((error: Error) => {
                const message = error.message
                setAlert({ autoDelete: false, type: 'error', message })
            }).catch((error: Error) => {
                const message = error.message
                setAlert({ autoDelete: false, type: 'error', message })
            }).finally(() => {
                setAlert({ autoDelete: true, type: 'success', message: `${email} added to course` })
            })

    }

    const handleAddStudent = () => {
        // TODO: if file inputted then parse csv file to get emails and for each email addSingleStudent
        // TODO: if no file inputted then addSingleStudent with email
        addSingleStudent(studentEmail)
    }

    const handleDropStudent = () => {
        // TODO: if file inputted then parse csv file to get emails and for each email dropSingleStudent
        // TODO: if no file inputted then dropSingleStudent with email
        dropSingleStudent(studentEmail)
    }

    const dropSingleStudent = (email: string) => {
        const userID = getUserId(email)
        if (!userID) { return }
        RequestService.delete(`/api/courses/${courseId}/users-courses/${userID}`)
            .catch((error: Error) => {
                const message = error.message
                setAlert({ autoDelete: false, type: 'error', message })
            }).catch((error: Error) => {
                const message = error.message
                setAlert({ autoDelete: false, type: 'error', message })
            }).finally(() => {
                setAlert({ autoDelete: true, type: 'success', message: `${email} dropped from course` })
            })
    }


    return (
        <PageWrapper>
            <h1>Update Course Form</h1>
            <div className={formStyles.courseFormWrapper}>
                <div className={formStyles.detailsForm}>
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
                            <input type="date" id="start-date" value={startDate} onChange={handleStartDateChange} />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: '5px' }}>
                            <label htmlFor='end-date'>End Date *</label>
                            <input type="date" id="end-date" value={endDate} onChange={handleEndDateChange} />
                        </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <button className='btnPrimary' onClick={handleCourseUpdate}>Update Course</button>
                    </div>
                </div>
                <div className={formStyles.addDropForm}>
                    <h2>Add/Drop Students</h2>
                    <TextField id='studentEmail' label={"Email"} onChange={handleChange}
                        placeholder='e.g. hartloff@buffalo.edu' invalidated={!!invalidFields.get("studentEmail")} helpText={invalidFields.get("studentEmail")} />
                    <label htmlFor="addDropFile">Add multiple students by uploading a CSV file below</label>
                    {/* csv should be a good standard filetype */}
                    <input type="file" accept='.csv' id="addDropFile" />
                    <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', marginTop: 'auto', gap: '1rem' }}>
                        <button className='btnPrimary' onClick={handleAddStudent}>Add Student</button>
                        <button className='btnDelete' onClick={handleDropStudent}>Drop Student</button>
                    </div>
                </div>
            </div>
        </PageWrapper>
    )
}


export default CourseUpdatePage
