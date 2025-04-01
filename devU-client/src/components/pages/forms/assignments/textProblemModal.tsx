import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { ExpressValidationError } from 'devu-shared-modules'
import { SET_ALERT } from 'redux/types/active.types'
import { useActionless } from 'redux/hooks'
import RequestService from 'services/request.service'
import Modal from 'components/shared/layouts/modal'

interface Props {
    open: boolean;
    onClose: () => void;
}

const TextProblemModal = ({ open, onClose }: Props) => {
    const [setAlert] = useActionless(SET_ALERT)
    const { assignmentId } = useParams<{ assignmentId: string }>()
    const { courseId } = useParams<{ courseId: string }>()
    const [formData, setFormData] = useState({
        title: '',
        maxScore: '',
        correctAnswer: '',
        regex: false
    });

    const submittable = () => {
        if (!formData.title || !formData.maxScore || !formData.correctAnswer) { return false }
        else {return true}
    }

    const handleSubmit = async () => {
        // early return if form not fully filled out
        if (!submittable) { return }

        const problemFormData = {
            assignmentId: parseInt(assignmentId),
            problemName: formData.title,
            maxScore: parseInt(formData.maxScore),
        };

        const graderFormData = {
            assignmentId: parseInt(assignmentId),
            question: formData.title,
            correctString: formData.correctAnswer,
            score: Number(formData.maxScore),
            isRegex: formData.regex,
            metadata: {
                type: 'Text'
            } 
            
        }

        await RequestService.post(`/api/course/${courseId}/assignment/${assignmentId}/assignment-problems`, problemFormData)
            .then(() => {
                console.log("PROBLEM CREATED");
                setAlert({ autoDelete: true, type: 'success', message: 'Problem Added' });

            })
            .catch((err: ExpressValidationError[] | Error) => {
                const message = Array.isArray(err) ? err.map((e) => `${e.param} ${e.msg}`).join(', ') : err.message
                setAlert({ autoDelete: false, type: 'error', message })
            })

        await RequestService.post(`/api/course/${courseId}/assignment/${assignmentId}/non-container-auto-graders/`, graderFormData)
            .then(() => {
                console.log("GRADER CREATED")
            })
            .catch((err: ExpressValidationError[] | Error) => {
                const message = Array.isArray(err) ? err.map((e) => `${e.param} ${e.msg}`).join(', ') : err.message
                setAlert({ autoDelete: false, type: 'error', message })
            })

        // close modal
        onClose();
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const key = e.target.id
        const value = e.target.value

        setFormData(prevState => ({ ...prevState, [key]: value }))
    }

    return (
        <Modal title="Add Text Problem" buttonAction={handleSubmit} open={open} onClose={onClose} isSubmittable={submittable}>
            <div className="input-group">
                <label htmlFor="title" className="input-label">Problem Title:</label>
                <input type="text" id="title" onChange={handleChange}
                    placeholder='e.g. What is the time complexity of MergeSort?' />
            </div>
            <div className="input-group">
                <label htmlFor="correctAnswer" className="input-label">Correct Answer:</label>
                <input type="text" id="correctAnswer" onChange={handleChange}
                    placeholder='e.g. O(nlogn)' />
            </div>
            <div className="input-group">
                <label htmlFor="maxScore" className="input-label">Maximum Score:</label>
                <input type="number" id="maxScore" onChange={handleChange}
                    placeholder='e.g. 10' min="0" />
            </div>
            <label htmlFor="regex">Correct Answer is Regex <input type="checkbox" id="regex" /></label>
        </Modal>
    )
}

export default TextProblemModal;