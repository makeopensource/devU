import React, { useState } from 'react'
import { useActionless } from 'redux/hooks'
import { SET_ALERT } from 'redux/types/active.types'

import RequestService from 'services/request.service'
import Modal from 'components/shared/layouts/modal'
import AutomateDates from './automateDates'

interface Props {
    open: boolean;
    onClose: () => void;
}

interface Dates {
    startDate: string;
    endDate: string;
}

const CreateCourseModal = ({ open, onClose }: Props) => {
    const [setAlert] = useActionless(SET_ALERT)
    const [startDate, setStartDate] = useState(new Date().toISOString())
    const [endDate, setEndDate] = useState(new Date().toISOString())
    // const privateDate = new Date().toISOString()
    
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

    const handleDatesChange = ({ startDate, endDate }: Dates) => {
        setStartDate(startDate);
        setEndDate(endDate);
    };

    return (
        <Modal title="Create Course" buttonAction={handleSubmit} open={open} onClose={onClose}>
            <div className="input-group">
                <label htmlFor="categoryName" className="input-label">Course Title:</label>
                <input type="text" id="categoryName" onChange={handleChange}
                    placeholder='e.g. Web Applications' />
            </div>
            <div className="input-group">
                <label htmlFor="name" className="input-label">Course Code:</label>
                <input type="text" id="name" onChange={handleChange}
                    placeholder='e.g. CSE 312' />
            </div>
            <AutomateDates onDatesChange={handleDatesChange} />
        </Modal>
    )
}

export default CreateCourseModal;