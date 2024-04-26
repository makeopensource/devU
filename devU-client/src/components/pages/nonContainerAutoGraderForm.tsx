import React, {useState} from 'react'
import PageWrapper from 'components/shared/layouts/pageWrapper'
import styles from './nonContainerAutoGraderForm.scss'
import TextField from 'components/shared/inputs/textField'
// import Button from 'components/shared/inputs/button'
import {useActionless} from 'redux/hooks'
import {SET_ALERT} from 'redux/types/active.types'
import RequestService from 'services/request.service'
import textStyles from '../shared/inputs/textField.scss'
import {applyStylesToErrorFields, removeClassFromField} from "../../utils/textField.utils";
import {ExpressValidationError} from "../../../devu-shared-modules";
import {useHistory, useParams} from 'react-router-dom'

import Button from '@mui/material/Button'

const NonContainerAutoGraderForm = () => {
    const [setAlert] = useActionless(SET_ALERT)
    const [invalidFields, setInvalidFields] = useState(new Map<string, string>())
    const {assignmentId} = useParams<{ assignmentId: string }>()
    const history = useHistory()

    const [formData,setFormData] = useState({
        assignmentId: assignmentId,
        question: '',
        correctString: '',
        score: '',
        isRegex: false,
    })

    const validateNumber = (value: string) => {
        const regex = /^[0-9]*$/
        console.log(regex.test(value))
        return regex.test(value)
    }

    const handleChange = (value: String, e : React.ChangeEvent<HTMLInputElement>) => {
        const key = e.target.id

        const newInvalidFields = removeClassFromField(invalidFields, key)
        setInvalidFields(newInvalidFields)
        setFormData(prevState => ({...prevState,[key] : value}))
    }

    const toggleRegex = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prevState => ({...prevState,isRegex : e.target.checked}))
    }

    const handleSubmit = () => {
        if(!validateNumber(formData.assignmentId) || !validateNumber(formData.score)){
            setAlert({autoDelete: true, type: 'error', message: 'Assignment ID and Score must be a number'})
            return
        }

        const finalFormData = {
            assignmentId: parseInt(formData.assignmentId),
            question: formData.question,
            score: parseInt(formData.score),
            isRegex: formData.isRegex,
            correctString: formData.correctString,
        }

        RequestService.post('/api/nonContainerAutoGrader/', finalFormData)
            .then(() => {
                setAlert({ autoDelete: true, type: 'success', message: 'Non-Container Auto-Grader Added' })
            })
        .catch((err: ExpressValidationError[] | Error) => {
            const message = Array.isArray(err) ? err.map((e) => `${e.param} ${e.msg}`).join(', ') : err.message
            const newFields = applyStylesToErrorFields(err, formData, textStyles.errorField)
            setInvalidFields(newFields)

            setAlert({autoDelete: false, type: 'error', message: message})
        }).finally(() => {
            history.goBack()

        })


        setFormData({
            assignmentId: assignmentId,
            question: '',
            correctString: '',
            score: '',
            isRegex: false,
        })
    }

    return(
        <PageWrapper>
            <h1>Non Container Auto Grader Form</h1>
            <div className = {styles.form}>
                <p>Required Fields *</p>

                <label htmlFor='question'>Question *</label>
                <TextField id='question' onChange={handleChange} value={formData.question}
                           className={invalidFields.get('question')}></TextField>
                <label htmlFor='correctString'>Answer *</label>
                <TextField id='correctString' onChange={handleChange} value={formData.correctString}
                           className={invalidFields.get('correctString')}></TextField>
                <label htmlFor='score'>Score *</label>
                <TextField id='score' onChange={handleChange} value={formData.score}
                           className={invalidFields.get('score')}></TextField>
                
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <label htmlFor='regex'>Regex</label>
                    <input  id= 'regex' type='checkbox' checked={formData.isRegex} onChange={toggleRegex}></input>
                </div>
                <br/>
                
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <Button variant='contained' onClick= { handleSubmit }>Add Problem</Button>
                </div>
            </div>
            <div className = {styles.rightColumn}>
                <h1>Existing Problems</h1>
            </div>
        </PageWrapper>
    )
}

export default NonContainerAutoGraderForm