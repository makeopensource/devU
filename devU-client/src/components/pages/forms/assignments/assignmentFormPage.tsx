import React, { useState, useEffect } from 'react'
// import { useHistory } from 'react-router-dom'
import { ExpressValidationError, Assignment } from 'devu-shared-modules'
import 'react-datepicker/dist/react-datepicker.css'
// import PageWrapper from 'components/shared/layouts/pageWrapper'

import RequestService from 'services/request.service'
import { useActionless } from 'redux/hooks'
// import TextField from 'components/shared/inputs/textField'
// import Button from '../../../shared/inputs/button'
// import DragDropFile from 'components/utils/dragDropFile'
import { Option } from 'components/shared/inputs/dropdown'


import { SET_ALERT } from 'redux/types/active.types'

import { applyMessageToErrorFields } from "../../../../utils/textField.utils";
import { useParams } from 'react-router-dom'

import formStyles from './assignmentFormPage.scss'
import Modal from 'components/shared/layouts/modal'
import TextDropdown from 'components/shared/inputs/textDropDown'

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
    const [categoryOptions, setAllCategoryOptions] = useState<Option<String>[]>([])
    const [assignments, setAssignments] = useState<Assignment[]>([])

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

    const handleCategoryChange = (value: Option<String>)  => {
        setFormData(prevState => ({ ...prevState, categoryName: value.label }))
      };

    const handleCategoryCreate = (value: string)  => {
        const newOption : Option = {value: value, label: value}
        setAllCategoryOptions(prevState => {
          const newArr: Option<String>[] = (prevState);
          newArr.push(newOption);
          return newArr;
        })
        setFormData(prevState => ({ ...prevState, categoryName: value }))
     };

    const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => { setStartDate(e.target.value) }
    const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => { setEndDate(e.target.value) }
    const handleDueDateChange = (e: React.ChangeEvent<HTMLInputElement>) => { setDueDate(e.target.value) }

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
            .then(() => {
                setAlert({ autoDelete: true, type: 'success', message: 'Assignment Added' })
                // Navigate to the update page for the new assignment
                // navigate(`/course/${courseId}/assignment/${response.id}/update`);
                // history.goBack()
                onClose();
            })
            .catch((err: ExpressValidationError[] | Error) => {
                const message = Array.isArray(err) ? err.map((e) => `${e.param} ${e.msg}`).join(', ') : err.message
                const newFields = new Map<string, string>()
                Array.isArray(err) ? err.map((e) => applyMessageToErrorFields(newFields, e.param, e.msg)) : newFields

                setAlert({ autoDelete: false, type: 'error', message })
            })
            .finally(() => {

            })
    }

    useEffect(() => {RequestService.get(`/api/course/${courseId}/assignments`).then((res) => { setAssignments(res) })}, [formData])


    useEffect(() => {
        const categories = [...new Set(assignments.map(a => a.categoryName))];
        const options = categories.map((category) => ({
            value: category,
            label: category
          }));
        
        setAllCategoryOptions(options);
    }, [assignments])

    return (
        <Modal title="Add Assignment" buttonAction={handleSubmit} open={open} onClose={onClose}>
            <div className="input-group">
                <label htmlFor="categoryName" className="input-label">Assignment Category:</label>
                <TextDropdown
                onChange={handleCategoryChange}
                onCreate={handleCategoryCreate}
                options={categoryOptions}
                custom={{control: () => ({border:'none', padding:'3px 0', backgroundColor: 'var(--input-field-background)'}),
                        placeholder: () => ({color: 'var(--input-field-label)'}),
                        input: () => ({fontSize: '14px', backgroundColor: 'var(--input-field-background)'}),
                        option: (_, state) => ({ backgroundColor: state.isFocused ? 'var(--grey-darker)' : 'var(--input-field-background)',}),
                        menu: () => ({ backgroundColor: 'var(--input-field-background)', overflow:'hidden'}),
                        singleValue: () => ({fontSize: '14px'})}}
                value={formData.categoryName ? {value: formData.categoryName, label: formData.categoryName} : undefined}/>
            </div>
            <div className="input-group">
                <label htmlFor="name" className="input-label">Assignment Name:</label>
                <input type="text" id="name" onChange={handleChange} className={formStyles.input}
                placeholder='e.g. PA3'/>
            </div>
            <div className="input-group">
                <label htmlFor="description" className="input-label">Description: <span>(optional)</span></label>
                <textarea rows={4} id="description" onChange={handleChange} className={formStyles.input}
                placeholder='Provide an optional assignment description'/>
            </div>
            <div className='input-subgroup-2col'>
                <div className="input-group">
                    <label htmlFor="maxSubmissions" className="input-label">Maximum Submissions:</label>
                    <input type="number"  id="maxSubmissions" onChange={handleChange} className={formStyles.input}
                    placeholder='e.g. 1' value={formData.maxSubmissions} min="0"/>
                </div>
                <div className="input-group">
                    <label htmlFor="maxFileSize" className="input-label">Maximum File Size (KB):</label>
                    <input type="number" id="maxFileSize" onChange={handleChange} className={formStyles.input}
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
                    <label htmlFor="end_date">End Date:</label>
                    <br />
                    <input type='date' id="end_date" onChange={handleEndDateChange} />
                </div>
            </div>
            <label htmlFor="disableHandins">Disable Submissions?<input type="checkbox" id="disableHandins" /></label>
        </Modal>
    )
}

export default AddAssignmentModal