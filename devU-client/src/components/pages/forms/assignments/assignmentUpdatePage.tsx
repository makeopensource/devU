import React, {useEffect, useState} from 'react'
import {ExpressValidationError, Assignment} from 'devu-shared-modules'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import {useHistory, useParams} from 'react-router-dom'

import PageWrapper from 'components/shared/layouts/pageWrapper'

import RequestService from 'services/request.service'

import {useActionless} from 'redux/hooks'
import TextField from 'components/shared/inputs/textField'
import Button from '@mui/material/Button'
import formStyles from './assignmentFormPage.scss'

import {SET_ALERT} from 'redux/types/active.types'
import {applyMessageToErrorFields, removeClassFromField} from 'utils/textField.utils'

type UrlParams = {
    assignmentId: string
}
  
const AssignmentUpdatePage = () => {
    const { assignmentId } = useParams() as UrlParams
    const { courseId } = useParams<{courseId : string}>()
    const [setAlert] = useActionless(SET_ALERT)
    const [startDate, setStartDate] = useState(new Date())
    const [endDate, setEndDate] = useState(new Date())
    const [dueDate, setDueDate] = useState(new Date())
    const [invalidFields, setInvalidFields] = useState(new Map<string, string>())
    const history = useHistory()

    const [formData, setFormData] = useState<Assignment>({
        courseId: parseInt(courseId),
        name: '',
        categoryName: '',
        description: '',
        maxFileSize: 0,
        maxSubmissions: null,
        disableHandins: false,
        dueDate: "",
        endDate: "",
        startDate: "",
    })  

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

    useEffect(() => {
        RequestService.get(`/api/course/${courseId}/assignments/${assignmentId}`).then((res) => {
            const assignment:Assignment =res
            setFormData({
                name: assignment.name,
                categoryName: assignment.categoryName,
                description:  assignment.description,
                maxFileSize: assignment.maxFileSize,
                maxSubmissions: assignment.maxSubmissions,
                disableHandins: assignment.disableHandins,
                startDate: assignment.startDate,
                endDate: assignment.endDate,
                dueDate: assignment.dueDate,
                courseId: assignment.courseId
            });
            setStartDate(new Date(res.startDate));
            setDueDate(new Date(res.dueDate));
            setEndDate(new Date(res.endDate));
        });
    }, []);

    const handleAssignmentUpdate = () => {
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
        
        RequestService.put(`/api/course/${courseId}/assignments/${assignmentId}`, finalFormData)
            .then(() => {
                
                setAlert({ autoDelete: true, type: 'success', message: 'Assignment Updated' })
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
            <div className={formStyles.header}>
                <div className={formStyles.smallLine}></div>
                <h1>Assignment Detail Update</h1>
                <div className={formStyles.largeLine}></div>
            </div>
            <div className={formStyles.form}>
                <TextField id='name' onChange={handleChange} label={"Assignment Name"}
                            invalidated={!!invalidFields.get("name")} helpText={invalidFields.get("name")}
                            defaultValue={formData.name}/>

                <TextField id='categoryName' onChange={handleChange} label={"Category Name*"}
                            invalidated={!!invalidFields.get("categoryName")}
                            helpText={invalidFields.get("categoryName")}
                            defaultValue={formData.categoryName}/>

                <TextField id='description' onChange={handleChange} label={"Description*"}
                            invalidated={!!invalidFields.get("description")}
                            helpText={invalidFields.get("description")}
                            defaultValue={formData.description?formData.description:undefined}/>

                <TextField id='maxFileSize' onChange={handleChange} label={"Max File Size"}
                            invalidated={!!invalidFields.get("maxFileSize")}
                            helpText={invalidFields.get("maxFileSize")}
                            defaultValue={formData.maxFileSize?formData.maxFileSize.toString():""}/>

                <TextField id='maxSubmission' onChange={handleChange} label={"Max Submission"}
                            invalidated={!!invalidFields.get("maxSubmission")}
                            helpText={invalidFields.get("maxSubmission")}
                            defaultValue={formData.maxSubmissions?(formData.maxSubmissions).toString():undefined}/>
                <br/>

                <div className={formStyles.datepickerContainer}>
                    <div>
                        <label htmlFor='start_date'>Start Date *</label>
                        <DatePicker id='start_date' selected={startDate} onChange={handleStartDateChange}
                                    className={formStyles.datepicker}/>
                    </div>
                    <div>
                        <label htmlFor='due_date'>Due Date *</label>
                        <DatePicker id='due_date' selected={dueDate} onChange={handleDueDateChange}
                                    className={formStyles.datepicker}/>
                    </div>
                    <div>
                        <label htmlFor='end_date'>End Date *</label>
                        <DatePicker id='end_date' selected={endDate} onChange={handleEndDateChange}
                                    className={formStyles.datepicker}/>
                    </div>
                </div>
                <br/>
                <div style={{display: 'flex', justifyContent: 'center'}}>
                    <label htmlFor='disableHandins'>Disable Handins</label>
                    <input type='checkbox' id='disableHandins' checked={formData.disableHandins}
                            onChange={handleCheckbox} className={formStyles.submitBtn}/>
                </div>

                <br/>

                <div style={{display: 'flex', justifyContent: 'center'}}>
                    <Button variant='contained' onClick={handleAssignmentUpdate} className={formStyles.submitBtn}>Update
                        assignment</Button>
                </div>
            </div>
        </PageWrapper>
    )
}

export default AssignmentUpdatePage
