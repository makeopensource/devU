import React,{useState} from 'react'
import PageWrapper from 'components/shared/layouts/pageWrapper'
import styles from './nonContainerAutoGraderForm.scss'
import TextField from 'components/shared/inputs/textField'
import Button from 'components/shared/inputs/button'
import { useActionless } from 'redux/hooks'
import { SET_ALERT } from 'redux/types/active.types'
import RequestService from 'services/request.service'

const NonContainerAutoGraderForm = () => {
    const [setAlert] = useActionless(SET_ALERT)

    const [formData,setFormData] = useState({
        assignmentId: '',
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
            .catch((err: Error) => {
                console.log(err.message)
                setAlert({ autoDelete: false, type: 'error', message: err.message })
            })


        setFormData({
            assignmentId: '',
            question: '',
            correctString: '',
            score: '',
            isRegex: false,
        })
    }

    return(
        <PageWrapper>
            <h1>Non Container Auto Grader Form</h1>
            <div className = {styles.leftColumn}>
                <h1>Add a Non-Container Auto Grader</h1>
                <TextField id= 'assignmentId' label='Assignment ID' onChange={handleChange} value={formData.assignmentId}></TextField>
                <TextField id= 'question' label='Question' onChange={handleChange} value={formData.question}></TextField>
                <TextField id= 'correctString' label='Answer' onChange={handleChange} value={formData.correctString}></TextField>
                <TextField id= 'score' label='Score' onChange={handleChange} value={formData.score}></TextField>
                <label htmlFor='regex'>Regex</label>
                <input  id= 'regex' type='checkbox' checked={formData.isRegex} onChange={toggleRegex}></input>
                <br></br><br></br>
                <Button onClick= { handleSubmit } >Add Problem</Button>
            </div>
            <div className = {styles.rightColumn}>
                <h1>Existing Problems</h1>
            </div>
        </PageWrapper>
    )
}

export default NonContainerAutoGraderForm