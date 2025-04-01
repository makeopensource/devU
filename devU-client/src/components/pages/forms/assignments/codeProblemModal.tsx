import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { ExpressValidationError } from 'devu-shared-modules';
import { SET_ALERT } from 'redux/types/active.types';
import { useActionless } from 'redux/hooks';
import RequestService from 'services/request.service';
import Modal from 'components/shared/layouts/modal';

interface Props {
    open: boolean;
    onClose: () => void;
}

const CodeProblemModal = ({ open, onClose }: Props) => {
    const [setAlert] = useActionless(SET_ALERT);
    const { assignmentId } = useParams<{ assignmentId: string }>();
    const { courseId } = useParams<{ courseId: string }>();

    const [formData, setFormData] = useState({
        title: '',
        maxScore: '',
    });

    const submittable = () => {
        if (!formData.title || !formData.maxScore) {return false}
        else {return true}
    }

    const handleSubmit = () => {
        if (!submittable) return;

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
        <Modal title="Add Code/File Input Problem" buttonAction={handleSubmit} open={open} onClose={onClose} isSubmittable={submittable}>
            <div className="input-group">
                <label htmlFor="title" className="input-label">Problem Title:</label>
                <input 
                    type="text" 
                    id="title" 
                    placeholder="e.g. Application Objective 3" 
                    onChange={handleChange} 
                />
            </div>
            
            <div className="input-group">
                <label htmlFor="maxScore" className="input-label">Maximum Score:</label>
                <input 
                    type="number" 
                    id="maxScore" 
                    placeholder="e.g. 10" 
                    min="0" 
                    onChange={handleChange} 
                />
            </div>
        </Modal>
    );
};

export default CodeProblemModal;
