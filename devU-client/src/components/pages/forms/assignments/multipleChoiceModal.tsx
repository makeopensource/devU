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

const MultipleChoiceModal = ({ open, onClose }: Props) => {
    const [setAlert] = useActionless(SET_ALERT)
    const { assignmentId } = useParams<{ assignmentId: string }>()
    const { courseId } = useParams<{ courseId: string }>()
    const [options, setOptions] = useState({})
    const [formData, setFormData] = useState({
        type: 'MCQ-mult',
        title: '',
        maxScore: '',
        correctAnswer: '', 
        regex: false
    });
    const [boxType, setBoxType] = useState("checkbox")

    const submittable = () => {
        if (!formData.title || !formData.maxScore || formData.correctAnswer.length <= 0) { return false }
        else { return true }
    }

    const handleSubmit = () => {
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
            metadata: {type: formData.type, options: options}
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
        closeModal()
    }

    const resetData = () => { // reset data whenever question submitted/hits error, so data is not carried over, shows erroneous messages
        setFormData({
            type: 'MCQ-mult',
            title: '',
            maxScore: '',
            correctAnswer: '', 
            regex: false})
        setBoxType('checkbox') 
    }

    const closeModal = () => {
        resetData()
        onClose()
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

    const handleCorrectAnswerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.id
        if (formData.type === "MCQ-mult"){
            const checkState = e.target.checked
            setFormData(prevState => {
                const currentValue = prevState.correctAnswer || ""; 
                let res = '';
                if (checkState === true) { // if the box is checked, we want that as a new answer
                    res = currentValue + value
                } else { // otherwise remove it from the string to make it incorrect
                    res = currentValue.replace(value, "")
                }
                res = res.split('').sort().join('') // makes selecting answers in any order correct
                return {
                    ...prevState,
                    correctAnswer: res
                };
            });
        } else if (formData.type === "MCQ-single") {
            setFormData(prevState => ({...prevState, correctAnswer: value})) // only one answer is accepted
        } else {
            setAlert({ autoDelete: false, type: 'error', message: "Unknown Type" })
        }
        
    }

    const switchBoxType = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newState = e.target.checked
        if (newState === true) { // if box checked, then we're only accepting one answer, switch inputs to radio.
            setBoxType('radio')
            setFormData(prevState => ({...prevState, type: "MCQ-single"})) 
        } else {
            setBoxType('checkbox')
            setFormData(prevState => ({...prevState, type: "MCQ-mult"})) 
        }

        var inputs = document.getElementsByTagName('input') // reset correctAnswer when you do this

        for (var i = 0; i < inputs.length; i++) {
            if (inputs[i].name == 'correct') {
                inputs[i].checked = false;
            }
        }
        setFormData(prevState => ({...prevState, correctAnswer: ''})) 
    }

    return (
        <Modal title="Add Multiple Choice Problem" isSubmittable={submittable} buttonAction={handleSubmit} open={open} onClose={closeModal}>
            <div className="input-group">
                <label htmlFor="title" className="input-label">Problem Title:</label>
                <input type="text" id="title" onChange={handleChange} 
                    placeholder='e.g. What is the best programming language?' />
            </div>
            <div className="input-group" style={{gap: '5px'}} >
                <label>Answer Choices:</label>
                <div className="input-group" style={{flexDirection:"row", alignItems:"center", width: '100%'}}>
                    <label>a.</label>
                    <input type='text' id="a" onChange={handleQuestionTextChange} style={{width:'100%'}}
                    placeholder='e.g. Java' />
                    <input type={`${boxType}`} id="a" onChange={handleCorrectAnswerChange} name="correct"/>
                </div>
                <div className="input-group" style={{flexDirection:"row", alignItems:"center"}}>
                    <label>b.</label>
                    <input type="text" id="b" onChange={handleQuestionTextChange} style={{width:'100%'}}
                    placeholder='e.g. Python' />
                    <input type={`${boxType}`} id="b" onChange={handleCorrectAnswerChange} name="correct"/>
                </div>
                <div className="input-group" style={{flexDirection:"row", alignItems:"center"}}>
                    <label>c.</label>
                    <input type="text" id="c" onChange={handleQuestionTextChange} style={{width:'100%'}}
                    placeholder='e.g. C' />
                    <input type={`${boxType}`} id="c" onChange={handleCorrectAnswerChange} name="correct"/>
                </div>
                <div className="input-group" style={{flexDirection:"row", alignItems:"center"}}>
                    <label>d.</label>
                    <input type="text" id="d" onChange={handleQuestionTextChange} style={{width:'100%'}}
                    placeholder='e.g. JavaScript' />
                    <input type={`${boxType}`} id="d" onChange={handleCorrectAnswerChange} name="correct"/>
                </div>
                <div className="input-group" style={{flexDirection:"row", alignItems:"center"}}>
                    <label>e.</label>
                    <input type="text" id="e" onChange={handleQuestionTextChange} style={{width:'100%'}}
                    placeholder='e.g. ...MATLAB?' />
                    <input type={`${boxType}`} id="e" onChange={handleCorrectAnswerChange} name="correct"/>
                </div>
            </div>
            <div style={{display:'flex', alignItems: 'center'}}>
                <input type='checkbox' onChange={switchBoxType}/><label>Allow only one answer</label>
            </div>
            <div className="input-group">
                <label htmlFor="maxScore" className="input-label">Maximum Score:</label>
                <input type="number" id="maxScore" onChange={handleChange}
                    placeholder='e.g. 10' min="0" />
            </div>
        </Modal>
    )
}

export default MultipleChoiceModal;