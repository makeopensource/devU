import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ExpressValidationError, AssignmentProblem } from 'devu-shared-modules';
import { SET_ALERT } from 'redux/types/active.types';
import { useActionless } from 'redux/hooks';
import RequestService from 'services/request.service';
import Modal from 'components/shared/layouts/modal';

interface Props {
    open: boolean;
    onClose: () => void;
    edit?: boolean;
    problemId?: number;
}

const CodeProblemModal = ({ open, onClose, edit, problemId }: Props) => {
    const [setAlert] = useActionless(SET_ALERT);
    const { assignmentId } = useParams<{ assignmentId: string }>();
    const { courseId } = useParams<{ courseId: string }>();


    const [formData, setFormData] = useState({
        title: '',
        maxScore: '',
    });

    const setInitalFormData = async () => {
        if (!problemId) {
            return
        }

        const assignmentProblemData = await RequestService.get<AssignmentProblem>(`/api/course/${courseId}/assignment/${assignmentId}/assignment-problems/${problemId}`);
        setFormData(({
            title: assignmentProblemData.problemName,
            maxScore: '' + assignmentProblemData.maxScore,
        }))
    }

    useEffect(() => { setInitalFormData() }, [problemId])

    const submittable = () => {
        if (!formData.title || !formData.maxScore) { return false }
        else { return true }
    }

    const handleSubmit = () => {
        if (!submittable) return;

        const problemFormData = {
            assignmentId: parseInt(assignmentId),
            problemName: formData.title,
            maxScore: parseInt(formData.maxScore),
            metadata: {
                type: 'File'
            }
        };

        if (edit) {
            RequestService.put(`/api/course/${courseId}/assignment/${assignmentId}/assignment-problems/${problemId}`, problemFormData)
                .then(() => {
                    setAlert({ autoDelete: true, type: 'success', message: 'Problem Added' });
                })
                .catch((err: ExpressValidationError[] | Error) => {
                    const message = Array.isArray(err) ? err.map((e) => `${e.param} ${e.msg}`).join(', ') : err.message;
                    setAlert({ autoDelete: false, type: 'error', message });
                });
        } else {
            RequestService.post(`/api/course/${courseId}/assignment/${assignmentId}/assignment-problems`, problemFormData)
                .then(() => {
                    setAlert({ autoDelete: true, type: 'success', message: 'Problem Added' });
                })
                .catch((err: ExpressValidationError[] | Error) => {
                    const message = Array.isArray(err) ? err.map((e) => `${e.param} ${e.msg}`).join(', ') : err.message;
                    setAlert({ autoDelete: false, type: 'error', message });
                });
        }

        closeModal();
    };

    const closeModal = () => {
        setFormData({
            title: '',
            maxScore: ''
        })
        onClose()
    }


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const key = e.target.id;
        const value = e.target.value;
        setFormData(prevState => ({ ...prevState, [key]: value }));
    };

    return (
        <Modal title={edit ? "Edit File Upload Problem" : "Add File Upload Problem"} buttonAction={handleSubmit} open={open} onClose={closeModal} isSubmittable={submittable}>
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