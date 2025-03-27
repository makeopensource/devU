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
    const [options, setOptions] = useState({
        a: '',
        b: '',
        c: ''
    })
    const [formData, setFormData] = useState({
        title: '',
        maxScore: '',
        correctAnswer: '',
        regex: false
    });
    const submittable = () => {
        if (!formData.title || !formData.maxScore || !formData.correctAnswer) { return false }
        else { return true }
    }

    const handleSubmit = () => {
        // early return if form not fully filled out
        if (!submittable) { return }

        const meta = new Map()
        meta.set("type", "MCQ")
        meta.set("options", options)

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
            metadata: meta
        }

        RequestService.post(`/api/course/${courseId}/assignment/${assignmentId}/assignment-problems`, problemFormData)
            .then(() => {
                console.log("PROBLEM CREATED")
                setAlert({ autoDelete: true, type: 'success', message: 'Problem Added' });
            })
            .catch((err: ExpressValidationError[] | Error) => {
                const message = Array.isArray(err) ? err.map((e) => `${e.param} ${e.msg}`).join(', ') : err.message
                setAlert({ autoDelete: false, type: 'error', message })
            })

        RequestService.post(`/api/course/${courseId}/assignment/${assignmentId}/non-container-auto-graders/`, graderFormData)
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

    const handleQuestionTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const key = e.target.id
        const value = e.target.value

        setOptions(prevState => ({ ...prevState, [key]: value }))
    }

    const handleCorrectAnswerChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const value = e.target.id
        setFormData(prevState => ({ ...prevState, correctAnswer: value }))
    }

    return (
        <Modal title="Add Multiple Choice Problem" isSubmittable={submittable} buttonAction={handleSubmit} open={open} onClose={onClose}>
            <div className="input-group">
                <label htmlFor="title" className="input-label">Problem Title:</label>
                <input type="text" id="title" onChange={handleChange}
                    placeholder='e.g. What is the best programming language?' />
            </div>
            <div className="input-group" style={{gap: '5px'}} >
                <label>Answer Choices:</label>
                <div className="input-group" style={{flexDirection:"row", alignItems:"center", width: '100%'}}>
                    <label>a.</label>
                    <input type="text" id="a" onChange={handleQuestionTextChange} style={{width:'100%'}}
                    placeholder='e.g. Java' />
                    <input type="radio" id="a" onChange={handleCorrectAnswerChange} name="correct"/>
                </div>
                <div className="input-group" style={{flexDirection:"row", alignItems:"center"}}>
                    <label>b.</label>
                    <input type="text" id="b" onChange={handleQuestionTextChange} style={{width:'100%'}}
                    placeholder='e.g. Python' />
                    <input type="radio" id="b" onChange={handleCorrectAnswerChange} name="correct"/>
                </div>
                <div className="input-group" style={{flexDirection:"row", alignItems:"center"}}>
                    <label>c.</label>
                    <input type="text" id="c" onChange={handleQuestionTextChange} style={{width:'100%'}}
                    placeholder='e.g. C' />
                    <input type="radio" id="c" onChange={handleCorrectAnswerChange} name="correct"/>
                </div>
                <div className="input-group" style={{flexDirection:"row", alignItems:"center"}}>
                    <label>d.</label>
                    <input type="text" id="d" onChange={handleQuestionTextChange} style={{width:'100%'}}
                    placeholder='e.g. JavaScript' />
                    <input type="radio" id="d" onChange={handleCorrectAnswerChange} name="correct"/>
                </div>
                <div className="input-group" style={{flexDirection:"row", alignItems:"center"}}>
                    <label>e.</label>
                    <input type="text" id="e" onChange={handleQuestionTextChange} style={{width:'100%'}}
                    placeholder='e.g. ...MATLAB?' />
                    <input type="radio" id="e" onChange={handleCorrectAnswerChange} name="correct"/>
                </div>
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