import React, {useState} from 'react'
import {ExpressValidationError} from 'devu-shared-modules'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import {useHistory, useParams} from 'react-router-dom'

import PageWrapper from 'components/shared/layouts/pageWrapper'

import RequestService from 'services/request.service'

import {useActionless} from 'redux/hooks'
import TextField from 'components/shared/inputs/textField'
// import Button from 'components/shared/inputs/button'
import Button from '@mui/material/Button'
import formStyles from './assignmentFormPage.scss'

import {SET_ALERT} from 'redux/types/active.types'
import styles from 'components/shared/inputs/textField.scss'
import {applyStylesToErrorFields, removeClassFromField} from 'utils/textField.utils'

type UrlParams = {
    assignmentId: string
}
  
const AssignmentUpdatePage = () => {
    const { assignmentId } = useParams() as UrlParams
    const { courseId } = useParams<{courseId : string}>()


    const [toggleForm,setToggleForm] = useState(false)
    const [problemFormData,setProblemFormData] = useState({
        assignmentId: assignmentId,
        problemName: '',
        maxScore: '',
    })
    const [problemInvalidFields, setProblemInvalidFields] = useState(new Map<string, string>())
    
    const toggleProblemForm = () => { setToggleForm(!toggleForm) }

    const handleSubmit = () => {
        const finalProblemFormData = {
            assignmentId: parseInt(problemFormData.assignmentId),
            problemName: problemFormData.problemName,
            maxScore: parseInt(problemFormData.maxScore),
        }         
        
        RequestService.post('/api/assignment-problems/', finalProblemFormData)
        .then(() => {
            setAlert({ autoDelete: true, type: 'success', message: 'Assignment Problem Added' })
        })
        .catch((err: ExpressValidationError[] | Error) => {
            const message = Array.isArray(err) ? err.map((e) => `${e.param} ${e.msg}`).join(', ') : err.message
            const newFields = applyStylesToErrorFields(err, problemFormData, styles.errorField)

            setProblemInvalidFields(newFields)
            setAlert({ autoDelete: false, type: 'error', message })
        })
        .finally(() => {
            setProblemFormData({
                assignmentId: assignmentId,
                problemName: '',
                maxScore: '',
            })
        })
    }
    
    const handleProblemChange = (value : String, e : React.ChangeEvent<HTMLInputElement>) => {
        const key = e.target.id
        const newInvalidFields = removeClassFromField(problemInvalidFields, key)
        setProblemInvalidFields(newInvalidFields)
        setProblemFormData(prevState => ({...prevState,[key] : value}))
    }


    const [setAlert] = useActionless(SET_ALERT)

    const [formData, setFormData] = useState({
        courseId: courseId,
        name: '',
        categoryName: null,
        description: null,
        maxFileSize: 0,
        maxSubmissions: null,
        disableHandins: false,
    })  
    const [startDate, setStartDate] = useState(new Date())
    const [endDate, setEndDate] = useState(new Date())
    const [dueDate, setDueDate] = useState(new Date())
    const [invalidFields, setInvalidFields] = useState(new Map<string, string>())
    const history = useHistory()

    const handleChange = (value: String, e : React.ChangeEvent<HTMLInputElement>) => {
        const key = e.target.id
        const newInvalidFields = removeClassFromField(invalidFields, key)
        setInvalidFields(newInvalidFields)

        setFormData(prevState => ({...prevState,[key] : value}))
    }
    const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prevState => ({...prevState,disableHandins : e.target.checked}))
    }
    const handleStartDateChange = (date : Date) => {setStartDate(date)}
    const handleEndDateChange = (date : Date) => {setEndDate(date)}
    const handleDueDateChange = (date: Date) => {setDueDate(date)}

    const handleAssignmentUpdate = () => {
        const finalFormData = {
            courseId: formData.courseId,
            name: formData.name,
            startDate : startDate.toISOString(),
            dueDate: dueDate.toISOString(),
            endDate : endDate.toISOString(),
            categoryName: formData.categoryName,
            description: formData.description,
            maxFileSize: formData.maxFileSize,
            maxSubmissions: formData.maxSubmissions,
            disableHandins: formData.disableHandins,

        }
        
        RequestService.put(`/api/assignments/${assignmentId}`, finalFormData)
            .then(() => {
                
                setAlert({ autoDelete: true, type: 'success', message: 'Assignment Updated' })
                history.goBack()
            })
            .catch((err: ExpressValidationError[] | Error) => {
                const message = Array.isArray(err) ? err.map((e) => `${e.param} ${e.msg}`).join(', ') : err.message
                const newFields = applyStylesToErrorFields(err, formData, styles.errorField)

                setInvalidFields(newFields)
                setAlert({ autoDelete: false, type: 'error', message })
            })
        .finally(() => {
        })
    }

    return (
        <PageWrapper>
            <div className={formStyles.header}>
                <div className={formStyles.smallLine}></div>
                <h1>Assignment Detail Update</h1>
                <div className={formStyles.largeLine}></div>

                <Button variant="contained" onClick={toggleProblemForm}>Add Problem</Button>
            </div>

            {toggleForm && (
                <div className={formStyles.form}>
                    <p>Required Field *</p>

                    <label htmlFor='problemName'>Problem Question *</label>
                    <TextField id='problemName' onChange={handleProblemChange}
                               value={problemFormData.problemName}
                               className={problemInvalidFields.get('problemName')}/>

                    <label htmlFor='maxScore'>Max Score *</label>
                    <TextField id='maxScore' onChange={handleProblemChange}
                               value={problemFormData.maxScore}
                               className={problemInvalidFields.get('maxScore')}/>
                    
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <Button variant='contained' onClick={handleSubmit} className={formStyles.submitBtn}>Create Problem</Button>
                    </div>
                </div>
            )}

            <br></br><br></br>
            <div className={formStyles.form}>
                <p>Required Field *</p>

                <label htmlFor='name'>Assignment Name *</label>
                <TextField id='name' onChange={handleChange}/>

                <div className={formStyles.datepickerContainer}>
                    <div>
                        <label htmlFor='start_date'>Start Date *</label>
                        <DatePicker id='start_date' selected={startDate} onChange={handleStartDateChange}/>
                    </div>
                    <div>
                        <label htmlFor='due_date'>Due Date *</label>
                        <DatePicker id='due_date' selected={dueDate} onChange={handleDueDateChange}/>
                    </div>
                    <div>
                        <label htmlFor='end_date'>End Date *</label>
                        <DatePicker id='end_date' selected={endDate} onChange={handleEndDateChange}/>
                    </div>
                </div>
                <br/>

                <label htmlFor='categoryName'>Category *</label>
                <TextField id='categoryName' onChange={handleChange}
                        className={invalidFields.get('categoryName')}/>

                <label htmlFor='description'>Description *</label>
                <TextField id='description' onChange={handleChange}
                        className={invalidFields.get('description')}/>
                <label htmlFor='maxFileSize'>Max File Size *</label>
                <TextField id='maxFileSize' onChange={handleChange}
                        className={invalidFields.get('maxFileSize')}/>
                <label htmlFor='maxSubmission'>Max Submission *</label>
                <TextField id='maxSubmission' onChange={handleChange}
                        className={invalidFields.get('maxSubmission')}/>

                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <label htmlFor='disableHandins'>Disable Handins</label>
                    <input type='checkbox' id='disableHandins' checked={formData.disableHandins} onChange={handleCheckbox} className={formStyles.submitBtn}/>
                </div>

                <br/>

                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <Button variant='contained' onClick={handleAssignmentUpdate} className={formStyles.submitBtn}>Submit Updates</Button>
                </div>
            </div>
        </PageWrapper>
    )
}

export default AssignmentUpdatePage
