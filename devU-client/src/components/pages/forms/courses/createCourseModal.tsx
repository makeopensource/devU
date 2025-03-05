import React, { useState } from 'react'
import { useActionless } from 'redux/hooks'
import { SET_ALERT } from 'redux/types/active.types'

import RequestService from 'services/request.service'
import Modal from 'components/shared/layouts/modal'

interface Props {
    open: boolean;
    onClose: () => void;
}

const CreateCourseModal = ({ open, onClose }: Props) => {
    const [setAlert] = useActionless(SET_ALERT)
    const [startDate, setStartDate] = useState(new Date().toISOString())
    const [endDate, setEndDate] = useState(new Date().toISOString())
    const privateDate = new Date().toISOString()
    
    const [formData, setFormData] = useState({
        name: '',
        number: '',
        semester: 'f0000',
        session: '',
        isPublic: false
    });

    const handleSubmit = () => {
        const formatDateForSubmission = (date: string) => {
            return new Date(date).toISOString();
        };

        const finalFormData = {
            name: formData.name,
            number: formData.number,
            semester: formData.semester,
            startDate: formatDateForSubmission(startDate),
            endDate: formatDateForSubmission(endDate),
            isPublic: formData.isPublic,
            privateDate: formatDateForSubmission(endDate)
        };

        RequestService.post('/api/courses/instructor', finalFormData)
            .then(() => {
                setAlert({ autoDelete: true, type: 'success', message: 'Course Added' });
            })
            .catch((err) => {
                setAlert({ autoDelete: false, type: 'error', message: err.message });
            });
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const key = e.target.id
        const value = e.target.value

        setFormData(prevState => ({ ...prevState, [key]: value }))
    }

    return (
        <Modal title="Create Course" buttonAction={handleSubmit} open={open} onClose={onClose}>
            <div className="input-group">
                <label htmlFor="categoryName" className="input-label">Assignment Category:</label>
                <input type="text" id="categoryName" onChange={handleChange}
                    placeholder='Type assignment category' />
            </div>
            <div className="input-group">
                <label htmlFor="name" className="input-label">Assignment Name:</label>
                <input type="text" id="name" onChange={handleChange}
                    placeholder='e.g. PA3' />
            </div>
            <div className="input-group">
                <label htmlFor="description" className="input-label">Description: <span>(optional)</span></label>
                <textarea rows={4} id="description" onChange={handleChange}
                    placeholder='Provide an optional assignment description' />
            </div>
            <div className='input-subgroup-2col'>
                <div className="input-group">
                    <label htmlFor="maxSubmissions" className="input-label">Maximum Submissions:</label>
                    <input type="number" id="maxSubmissions" onChange={handleChange}
                        placeholder='e.g. 1' value={formData.semester} min="0" />
                </div>
                <div className="input-group">
                    <label htmlFor="maxFileSize" className="input-label">Maximum File Size (KB):</label>
                    <input type="number" id="maxFileSize" onChange={handleChange}
                        placeholder='e.g. 100' value={formData.session} min="0" />
                </div>
            </div>
        </Modal>
    )
}

export default CreateCourseModal;