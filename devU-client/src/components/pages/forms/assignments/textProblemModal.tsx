import React, { useState,useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { ExpressValidationError, AssignmentProblem, NonContainerAutoGrader } from 'devu-shared-modules'
import { SET_ALERT } from 'redux/types/active.types'
import { useActionless } from 'redux/hooks'
import RequestService from 'services/request.service'
import Modal from 'components/shared/layouts/modal'

interface Props {
    open: boolean;
    onClose: () => void;
    edit?: boolean;
    problemId?: number
}

const TextProblemModal = ({ open, onClose, edit, problemId }: Props) => {
    const [setAlert] = useActionless(SET_ALERT)
    const { assignmentId } = useParams<{ assignmentId: string }>()
    const { courseId } = useParams<{ courseId: string }>()
    const [formData, setFormData] = useState({
        title: '',
        maxScore: '',
        correctAnswer: '',
        regex: false
    });

    const setInitalFormData = async () => {
        if (!problemId){
            return
        }
        
        const assignmentProblemData = await RequestService.get<AssignmentProblem>(`/api/course/${courseId}/assignment/${assignmentId}/assignment-problems/${problemId}`);
        const ncagData = await RequestService.get<NonContainerAutoGrader[]>(`/api/course/${courseId}/assignment/${assignmentId}/non-container-auto-graders`);
        const ncag = ncagData.find((ncag) => (ncag.createdAt === assignmentProblemData.createdAt))
        console.log(ncag)
        setFormData(({
                title: assignmentProblemData.problemName,
                maxScore: '' + assignmentProblemData.maxScore,
                correctAnswer: ncag ? ncag.correctString : '',
                regex: ncag ? ncag.isRegex : false
        }))
        
        
    }

    useEffect(() => {setInitalFormData()}, [problemId])


    const submittable = () => {
        if (!formData.title || !formData.maxScore || !formData.correctAnswer) { return false }
        else {return true}
    }

    const handleSubmit = async () => {
        // early return if form not fully filled out
        if (!submittable) { return }

        const time = new Date() // stopgap since the NCAG method right now means questions with the same name can get confused, can be removed once meta added to assignmentProblem
        const createdAt = time;

        const problemFormData = {
            assignmentId: parseInt(assignmentId),
            problemName: formData.title,
            createdAt: createdAt,
            maxScore: parseInt(formData.maxScore),
            metadata: {
                type: 'Text'
            }
        };

        const graderFormData = {
            id: problemId,
            assignmentId: parseInt(assignmentId),
            question: formData.title,
            createdAt: createdAt,
            correctString: formData.correctAnswer,
            score: Number(formData.maxScore),
            isRegex: formData.regex,
            
        }
        
        if (edit){ // If updating, we'll make a put request
            await RequestService.put(`/api/course/${courseId}/assignment/${assignmentId}/assignment-problems/${problemId}`, problemFormData)
                .then(() => {
                    console.log("PROBLEM UPDATED")
                    setAlert({ autoDelete: true, type: 'success', message: 'Problem Updated' });
                })
                .catch((err: ExpressValidationError[] | Error) => {
                    const message = Array.isArray(err) ? err.map((e) => `${e.param} ${e.msg}`).join(', ') : err.message
                    setAlert({ autoDelete: false, type: 'error', message })
                })
            await RequestService.put(`/api/course/${courseId}/assignment/${assignmentId}/non-container-auto-graders/${problemId}`, graderFormData)
                .then(() => {
                    console.log("GRADER UPDATED")
                })
                .catch((err: ExpressValidationError[] | Error) => {
                    const message = Array.isArray(err) ? err.map((e) => `${e.param} ${e.msg}`).join(', ') : err.message
                    setAlert({ autoDelete: false, type: 'error', message })
                })
        } 
        
        else { // If creating, we'll make a post request
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
        }
        

        closeModal();
    }
    const resetData = () => {
        setFormData({
            title: '',
            maxScore: '',
            correctAnswer: '',
            regex: false
        })
    }
    const closeModal = () => {
        if (!edit){ // We have a useEffect watching when problemId changes, so closing the modal and reopening for the same ID would not re-fill info
            resetData()
        }
        onClose();
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const key = e.target.id
        const value = e.target.value

        setFormData(prevState => ({ ...prevState, [key]: value }))
    }

    return (
        <Modal title={edit ? "Edit Text Problem" : "Add Text Problem"} buttonAction={handleSubmit} open={open} onClose={closeModal} isSubmittable={submittable}>
            <div className="input-group">
                <label htmlFor="title" className="input-label">Problem Title:</label>
                <input type="text" id="title" onChange={handleChange} value={formData.title}
                    placeholder='e.g. What is the time complexity of MergeSort?' />
            </div>
            <div className="input-group">
                <label htmlFor="correctAnswer" className="input-label">Correct Answer:</label>
                <input type="text" id="correctAnswer" onChange={handleChange} value={formData.correctAnswer}
                    placeholder='e.g. O(nlogn)' />
            </div>
            <div className="input-group">
                <label htmlFor="maxScore" className="input-label">Maximum Score:</label>
                <input type="number" id="maxScore" onChange={handleChange} value={formData.maxScore}
                    placeholder='e.g. 10' min="0" />
            </div>
            <label htmlFor="regex">Correct Answer is Regex <input type="checkbox" id="regex" checked={formData.regex}/></label>
        </Modal>
    )
}

export default TextProblemModal;