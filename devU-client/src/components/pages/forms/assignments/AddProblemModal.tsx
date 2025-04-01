import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { ExpressValidationError } from 'devu-shared-modules';
import { SET_ALERT } from 'redux/types/active.types';
import { useActionless } from 'redux/hooks';
import RequestService from 'services/request.service';
import Modal from 'components/shared/layouts/modal';
import styles from './modal.module.scss';

interface Props {
    open: boolean;
    onClose: () => void;
}

const AddProblemModal = ({ open, onClose }: Props) => {
    const [setAlert] = useActionless(SET_ALERT);
    const { assignmentId } = useParams<{ assignmentId: string }>();
    const { courseId } = useParams<{ courseId: string }>();

    const [formData, setFormData] = useState({
        title: '',
        maxScore: '',
    });

    const handleSubmit = () => {
        if (!formData.title || !formData.maxScore) return;

        const problemFormData = {
            assignmentId: parseInt(assignmentId),
            problemName: formData.title,
            maxScore: parseInt(formData.maxScore),
        };

        RequestService.post(`/api/course/${courseId}/assignment/${assignmentId}/assignment-problems`, problemFormData)
            .then(() => {
                setAlert({ autoDelete: true, type: 'success', message: 'Problem Added' });
            })
            .catch((err: ExpressValidationError[] | Error) => {
                const message = Array.isArray(err) ? err.map((e) => `${e.param} ${e.msg}`).join(', ') : err.message;
                setAlert({ autoDelete: false, type: 'error', message });
            });

        onClose();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const key = e.target.id;
        const value = e.target.value;
        setFormData(prevState => ({ ...prevState, [key]: value }));
    };

    return (
        <Modal title="Add Problem" buttonAction={handleSubmit} open={open} onClose={onClose}>
            <div className={styles.modalContainer}>
                <label htmlFor="title" className={styles.inputLabel}>Problem Title:</label>
                <input 
                    type="text" 
                    id="title" 
                    className={styles.inputField} 
                    placeholder="e.g. Application Objective 3" 
                    onChange={handleChange} 
                />

                <label htmlFor="maxScore" className={styles.inputLabel}>Maximum Score:</label>
                <input 
                    type="number" 
                    id="maxScore" 
                    className={styles.inputField} 
                    placeholder="10" 
                    min="0" 
                    onChange={handleChange} 
                />

                <button className={styles.submitButton} onClick={handleSubmit}>Add Problem</button>
            </div>
        </Modal>
    );
};

export default AddProblemModal;
