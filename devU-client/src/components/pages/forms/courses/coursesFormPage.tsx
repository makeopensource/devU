import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import RequestService from 'services/request.service';
import { useActionless } from 'redux/hooks';
import TextField from 'components/shared/inputs/textField';
import { SET_ALERT } from 'redux/types/active.types';
import formStyles from './coursesFormPage.scss';
import PageWrapper from 'components/shared/layouts/pageWrapper';

const EditCourseFormPage = () => {
    const [setAlert] = useActionless(SET_ALERT);
    const history = useHistory();

    const [formData, setFormData] = useState({
        name: '',
        number: '',
        semester: '',
        isPublic: false 
    });

    const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]);
    const [endDate, setEndDate] = useState(new Date().toISOString().split("T")[0]);

    const handleChange = (value: string, e: React.ChangeEvent<HTMLInputElement>) => {
        const key = e.target.id;
        setFormData(prevState => ({ ...prevState, [key]: value }));
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prevState => ({ ...prevState, isPublic: e.target.checked })); // Change to isPublic
    };

    const handleStartDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setStartDate(event.target.value);
    };

    const handleEndDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEndDate(event.target.value);
    };

    const formatDateForSubmission = (date: string) => {
        return new Date(date).toISOString();
    };

    const isFormValid = () => {
        return formData.name && formData.number && formData.semester && startDate && endDate;
    };

    const handleSubmit = () => {
        const finalFormData = {
            name: formData.name,
            number: formData.number,
            semester: formData.semester,
            startDate: formatDateForSubmission(startDate),
            endDate: formatDateForSubmission(endDate),
            isPublic: formData.isPublic 
        };

        RequestService.post('/api/courses/instructor', finalFormData)
            .then(() => {
                setAlert({ autoDelete: true, type: 'success', message: 'Course Added' });
                history.goBack();
            })
            .catch((err) => {
                setAlert({ autoDelete: false, type: 'error', message: err.message });
            });
    };

    return (
        <PageWrapper>
            <h1>Create Course</h1>
            <div className={formStyles.courseFormWrapper}>
                <div className={formStyles.createDetailsForm}>
                    <TextField
                        id='name'
                        label={"Course Name*"}
                        onChange={handleChange}
                        value={formData.name}
                    />
                    <TextField
                        id='number'
                        label={"Course Number*"}
                        onChange={handleChange}
                        value={formData.number}
                    />
                    <TextField
                        id='semester'
                        label={"Semester*"}
                        onChange={handleChange}
                        value={formData.semester}
                    />
                    <div className={formStyles.datepickerContainer}>
                        <div>
                            <label htmlFor='start-date'>Start Date *</label>
                            <input type="date" id="start-date" value={startDate} onChange={handleStartDateChange} />
                        </div>
                        <div>
                            <label htmlFor='end-date'>End Date *</label>
                            <input type="date" id="end-date" value={endDate} onChange={handleEndDateChange} />
                        </div>
                    </div>
                    <div>
                        <label>
                            <input
                                type="checkbox"
                                checked={formData.isPublic} // Reflect isPublic
                                onChange={handleCheckboxChange}
                            />
                            Make this course public
                        </label>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <button className='btnPrimary' onClick={handleSubmit} disabled={!isFormValid()}>Create Course</button>
                    </div>
                </div>
            </div>
        </PageWrapper>
    );
};

export default EditCourseFormPage;