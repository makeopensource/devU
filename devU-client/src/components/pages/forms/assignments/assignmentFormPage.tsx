import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { ExpressValidationError } from 'devu-shared-modules'
import 'react-datepicker/dist/react-datepicker.css'

import RequestService from 'services/request.service'
import { useActionless } from 'redux/hooks'

import { SET_ALERT } from 'redux/types/active.types'

import { applyMessageToErrorFields } from "../../../../utils/textField.utils";
import { useParams } from 'react-router-dom'

import formStyles from './assignmentFormPage.scss'
import Modal from 'components/shared/layouts/modal'

interface Props {
    open: boolean;
    onClose: () => void;
}

const AddAssignmentModal = ({ open, onClose }: Props) => {
    const { courseId } = useParams<{ courseId: string }>()
    const [setAlert] = useActionless(SET_ALERT)
    const [endDate, setEndDate] = useState('')
    const [dueDate, setDueDate] = useState('')
    const [startDate, setStartDate] = useState('')
    const history = useHistory()

    const [formData, setFormData] = useState({
        courseId: courseId,
        name: '',
        categoryName: '',
        description: '',
        maxFileSize: 100,
        maxSubmissions: 1,
        disableHandins: false,
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const key = e.target.id
        const value = e.target.value

        setFormData(prevState => ({ ...prevState, [key]: value }))
    }

    const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => { setStartDate(e.target.value) }
    const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => { setEndDate(e.target.value) }
    const handleDueDateChange = (e: React.ChangeEvent<HTMLInputElement>) => { 
        setDueDate(e.target.value) 
        
        // automatically set end date
        if (!endDate) {
            setEndDate(e.target.value)
        }
    }

    const handleSubmit = () => {
        const finalFormData = {
            courseId: courseId,
            name: formData.name,
            startDate: startDate,
            dueDate: dueDate,
            endDate: endDate,
            categoryName: formData.categoryName,
            description: formData.description,
            maxFileSize: formData.maxFileSize,
            maxSubmissions: formData.maxSubmissions,
            disableHandins: formData.disableHandins,
        }

        const multipart = new FormData
        multipart.append('courseId', finalFormData.courseId)
        multipart.append('name', finalFormData.name)
        multipart.append('startDate', finalFormData.startDate)
        multipart.append('dueDate', finalFormData.dueDate)
        multipart.append('endDate', finalFormData.endDate)
        multipart.append('categoryName', finalFormData.categoryName)
        if (finalFormData.description !== null) { multipart.append('description', finalFormData.description) }
        multipart.append('maxFileSize', finalFormData.maxFileSize.toString())
        if (finalFormData.maxSubmissions !== null) { multipart.append('maxSubmissions', finalFormData.maxSubmissions.toString()) }
        multipart.append('disableHandins', finalFormData.disableHandins.toString())
        // for (const file of files.values()) {
        //     multipart.append('files', file)
        // }


        RequestService.postMultipart(`/api/course/${courseId}/assignments/`, multipart)
            .then((response) => {
                setAlert({ autoDelete: true, type: 'success', message: 'Assignment Added' })
                onClose();
                history.push(`/course/${courseId}/assignment/${response.id}/update`);
            })
            .catch((err: ExpressValidationError[] | Error) => {
                const message = Array.isArray(err) ? err.map((e) => `${e.param} ${e.msg}`).join(', ') : err.message
                const newFields = new Map<string, string>()
                Array.isArray(err) ? err.map((e) => applyMessageToErrorFields(newFields, e.param, e.msg)) : newFields

                setAlert({ autoDelete: false, type: 'error', message })
            })
    }


    return (
        <Modal title="Add Assignment" buttonAction={handleSubmit} open={open} onClose={onClose}>
            <div className="input-group">
                <label htmlFor="categoryName" className="input-label">Assignment Category:</label>
                <input type="text" id="categoryName" onChange={handleChange}
                placeholder='Type assignment category' />
            </div>
            <div className="input-group">
                <label htmlFor="name" className="input-label">Assignment Name:</label>
                <input type="text" id="name" onChange={handleChange} 
                placeholder='e.g. PA3'/>
            </div>
            <div className="input-group">
                <label htmlFor="description" className="input-label">Description: <span>(optional)</span></label>
                <textarea rows={4} id="description" onChange={handleChange} 
                placeholder='Provide an optional assignment description'/>
            </div>
            <div className='input-subgroup-2col'>
                <div className="input-group">
                    <label htmlFor="maxSubmissions" className="input-label">Maximum Submissions:</label>
                    <input type="number"  id="maxSubmissions" onChange={handleChange} 
                    placeholder='e.g. 1' value={formData.maxSubmissions} min="0"/>
                </div>
                <div className="input-group">
                    <label htmlFor="maxFileSize" className="input-label">Maximum File Size (KB):</label>
                    <input type="number" id="maxFileSize" onChange={handleChange} 
                    placeholder='e.g. 100' value={formData.maxFileSize} min="0"/>
                </div>
            </div>
            <div className={formStyles.datepickerContainer}>
                <div>
                    <label htmlFor="start_date">Start Date:</label>
                    <br />
                    <input type='date' id="start_date" onChange={handleStartDateChange} />
                </div>
                <div>
                    <label htmlFor="due_date">Due Date:</label>
                    <br />
                    <input type='date' id="due_date" onChange={handleDueDateChange} />
                </div>
                <div>
                    <label htmlFor="end_date">End Date:{/*<span>(optional)</span>*/}</label>
                    <br />
                    <input type='date' id="end_date" value={endDate} onChange={handleEndDateChange} />
                </div>
            </div>
            <label htmlFor="disableHandins">Disable Submissions?<input type="checkbox" id="disableHandins" /></label>
        </Modal>
    )
}

export default AddAssignmentModal