import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { AssignmentProblem, ExpressValidationError, NonContainerAutoGrader } from 'devu-shared-modules'
import { SET_ALERT } from 'redux/types/active.types'
import { useActionless } from 'redux/hooks'
import RequestService from 'services/request.service'
import Modal from 'components/shared/layouts/modal'
import styles from './multipleChoiceModal.scss'

interface Props {
    open: boolean;
    onClose: () => void;
    edit?: boolean;
    problemId?: number
}

const MultipleChoiceModal = ({ open, onClose, edit, problemId}: Props) => {
    const [setAlert] = useActionless(SET_ALERT)
    const { assignmentId } = useParams<{ assignmentId: string }>()
    const { courseId } = useParams<{ courseId: string }>()
    const [options, setOptions] = useState<Map<string,string>>(new Map<string,string>([['a',''],['b',''],['c','']]))
    const [formData, setFormData] = useState({
        type: 'MCQ-mult',
        title: '',
        maxScore: '',
        correctAnswer: '', 
        regex: false
    });
    const [boxType, setBoxType] = useState("checkbox")


    const setInitalFormData = async () => {
        if (!problemId){
            return
        }
        const assignmentProblemData = await RequestService.get<AssignmentProblem>(`/api/course/${courseId}/assignment/${assignmentId}/assignment-problems/${problemId}`);
        const ncagData = await RequestService.get<NonContainerAutoGrader[]>(`/api/course/${courseId}/assignment/${assignmentId}/non-container-auto-graders`);
        const ncag = ncagData.find((as) => (as.id === problemId))
        if (assignmentProblemData.metadata){
            const meta = assignmentProblemData.metadata
            const type = meta.type
            if (type === "MCQ-mult"){
                setBoxType("checkbox")
            } else {
                setBoxType("radio")
            }
            setFormData(({type: type, 
                title: assignmentProblemData.problemName,
                maxScore: '' + assignmentProblemData.maxScore,
                correctAnswer: ncag?.correctString ?? "",
                regex: ncag?.isRegex ?? false
                }))
            const options = meta.options
            setOptions(new Map(Object.entries(options)))
        } else {
            setAlert({ autoDelete: false, type: 'error', message: "No metadata" })
        }
        
    }

    useEffect(() => {setInitalFormData()}, [problemId])


    const submittable = () => {
        if (!formData.title || !formData.maxScore || formData.correctAnswer.length <= 0) { return false }
        else { return true }
    }

    const handleSubmit = async () => {
        // early return if form not fully filled out
        if (!submittable()) { return }

        const time = new Date() // stopgap since the NCAG method right now means questions with the same name can get confused, can be removed once meta added to assignmentProblem
        const createdAt = time;

        const problemFormData = {
            assignmentId: parseInt(assignmentId),
            problemName: formData.title,
            maxScore: parseInt(formData.maxScore),
            metadata: {type: formData.type, options: Object.fromEntries(options)},
            createdAt: createdAt
        };

        const graderFormData = {
            id: problemId,
            assignmentId: parseInt(assignmentId),
            question: formData.title,
            correctString: formData.correctAnswer,
            score: Number(formData.maxScore),
            isRegex: formData.regex,
            createdAt: createdAt
        }


        if (edit){
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
        
        else {
            await RequestService.post(`/api/course/${courseId}/assignment/${assignmentId}/assignment-problems`, problemFormData)
                .then(() => {
                    console.log("PROBLEM CREATED")
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
        
        // close modal
        closeModal()
    }

    const resetData = () => { // reset data whenever question submitted/hits error, so data is not carried over next time modal opened and potentially result in text not inputted being assigned
        setFormData({
            type: 'MCQ-mult',
            title: '',
            maxScore: '',
            correctAnswer: '', 
            regex: false})
        setOptions(new Map<string,string>([['a',''],['b',''],['c','']]))
        setBoxType('checkbox') 
    }

    const closeModal = () => {
        if (!edit){
            resetData()
        }
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

        setOptions(prevState => {
            const newMap = new Map(prevState)
            newMap.set(key, value)
            return newMap})
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

    const getPlaceholder = (key: string) => {
        const choices = new Map([['a', 'e.g. Java'], 
            ['b', 'e.g. Python'],
            ['c', 'e.g. C'],
            ['d', 'e.g. JavaScript'],
            ['e', 'e.g. C++'],
            ['f', 'e.g. Rust'],
            ['g', 'e.g. OCaml'],
            ['h', 'e.g. FORTRAN'],
            ['i', 'e.g. COBOL'],
            ['j', 'e.g. ...MATLAB?'],])
        return choices.get(key)
    }

    const increaseOptions = () => {
        const insert = options.size
        const index = String.fromCharCode("a".charCodeAt(0) + insert)
        setOptions(prevState => {
            const newMap = new Map(prevState)
            newMap.set(index, '')
            return newMap})
    }

    const decreaseOptions = () => { 
        const remove = options.size - 1 // gets index of last element, which we want to remove
        const index = String.fromCharCode("a".charCodeAt(0) + remove) // translates that into a char to actually remove this element
        setOptions(prevState => {
            const newMap = new Map(prevState)
            newMap.delete(index)
            return newMap})
        setFormData(prevState => { // make sure element getting removed is no longer in correctAnswer
            const currentValue = prevState.correctAnswer || ""; 
            let res = currentValue.replace(index, "")
            res = res.split('').sort().join('') // makes selecting answers in any order correct
            return {
                ...prevState,
                correctAnswer: res
            };
        });
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
        <Modal title={edit ? "Edit Multiple Choice Problem" : "Add Multiple Choice Problem"} isSubmittable={submittable} buttonAction={handleSubmit} open={open} onClose={closeModal}>
            <div className="input-group">
                <label htmlFor="title" className="input-label">Problem Title:</label>
                <input type="text" id="title" onChange={handleChange} value={formData.title}
                    placeholder='e.g. What is the best programming language?' />
            </div>
            <div className="input-group" style={{gap: '5px'}} >
                <div style={{display:'flex', justifyContent:'space-between'}}>
                    <label>Answer Choices:</label> 
                    <div>
                        <button 
                        className={`${styles.btn} ${styles.addButton}`} 
                        onClick={increaseOptions}
                        disabled={options.size >= 10 || edit}>+</button>

                        <button className={`${styles.btn} ${styles.subtractButton}`}
                        onClick={decreaseOptions}
                        disabled={options.size <= 2 || edit}>-</button>
                    </div>
                </div>
                
                {[...options].map(([key, text]) => 
                <div className="input-group" style={{flexDirection:"row", alignItems:"center", width: '100%'}}>
                    <label style={{width: '15px'}}>{key}.</label>
                    <input type='text' id={key} 
                    value={text} 
                    onChange={handleQuestionTextChange} 
                    style={{width:'100%'}}
                    disabled={edit} // disabled={edit} enabled right now since NCAGS can't update meta string
                    placeholder={getPlaceholder(key)} />
                    <input type={`${boxType}`} 
                    id={key} 
                    onChange={handleCorrectAnswerChange} 
                    checked={formData.correctAnswer.includes(key)} 
                    name="correct"/>
                </div>)}
            </div>
            <div style={{display:'flex', alignItems: 'center'}}>
                <input type='checkbox' 
                disabled={edit} // Here
                checked={formData.type === "MCQ-single"}
                onChange={switchBoxType}/><label>Allow only one answer</label>
            </div>
            <div className="input-group">
                <label htmlFor="maxScore" className="input-label" >Maximum Score:</label>
                <input type="number" id="maxScore" onChange={handleChange} value={formData.maxScore}
                    placeholder='e.g. 10' min="0" />
            </div>
        </Modal>
    )
}

export default MultipleChoiceModal;