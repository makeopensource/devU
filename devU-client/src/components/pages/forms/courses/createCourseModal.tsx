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
    semester: string;
    year: string;
}

const CreateCourseModal = ({ open, onClose }: Props) => {
    const [setAlert] = useActionless(SET_ALERT)
    // const [startDate, setStartDate] = useState(new Date().toISOString())
    const [startDate, setStartDate] = useState("")
    // const [endDate, setEndDate] = useState(new Date().toISOString())
    const [endDate, setEndDate] = useState("")
    const [semester, setSemester] = useState("")
    // const privateDate = new Date().toISOString()

    const [formData, setFormData] = useState({
        name: '',
        number: '',
        session: '',
        isPublic: false
    });

    const handleSubmit = () => {
        // early return if form not fully filled out
        if (!startDate || !formData.name || !formData.number) {return}

        const formatDateForSubmission = (date: string) => {
            return new Date(date).toISOString();
        };

        const finalFormData = {
            name: formData.name,
            number: formData.number,
            semester: semester,
            startDate: formatDateForSubmission(startDate),
            endDate: formatDateForSubmission(endDate),
            isPublic: formData.isPublic,
            privateDate: formatDateForSubmission(endDate)
        };

        console.log("HANDLE SUBMIT TRIGGERED")
        console.log("FORM DATA:", finalFormData)

        RequestService.post('/api/courses/instructor', finalFormData)
            .then(() => {
                setAlert({ autoDelete: true, type: 'success', message: 'Course Added' });
                onClose();
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

    const handleDatesChange = ({ startDate, endDate, semester, year }: Dates) => {
        setStartDate(startDate);
        setEndDate(endDate);

        // format and set semester to expected format by backend (u2024, f2024, s2024, w2024)
        let formattedSemester = semester.toLowerCase().charAt(0) + year;
        if (semester === "Summer") {
            formattedSemester = "u" + formattedSemester.slice(1);
        }
        setSemester(formattedSemester);
    };

    return (
        <Modal title="Create Course" buttonAction={handleSubmit} open={open} onClose={onClose}>
            <div className="input-group">
                <label htmlFor="name" className="input-label">Course Title:</label>
                <input type="text" id="name" onChange={handleChange}
                    placeholder='e.g. Web Applications' />
            </div>
            <div className="input-group">
                <label htmlFor="number" className="input-label">Course Code:</label>
                <input type="text" id="number" onChange={handleChange}
                    placeholder='e.g. CSE 312' />
            </div>
            <AutomateDates onDatesChange={handleDatesChange} />
            <label htmlFor="isPublic">Make course public?<input type="checkbox" id="isPublic" /></label>
        </Modal>
    )
}

export default CreateCourseModal;