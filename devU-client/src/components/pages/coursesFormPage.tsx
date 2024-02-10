import React,{useState} from 'react'

import { ExpressValidationError } from 'devu-shared-modules'

import PageWrapper from 'components/shared/layouts/pageWrapper'

import RequestService from 'services/request.service'

//import styles from 'components/pages/coursesFormPage.scss'
import { useActionless } from 'redux/hooks'
import TextField from 'components/shared/inputs/textField'
import Button from 'components/shared/inputs/button'
import { SET_ALERT } from 'redux/types/active.types'


const EditCourseFormPage = () => {
    const [setAlert] = useActionless(SET_ALERT)

    const [formData,setFormData] = useState({
        name: '',
        number: '',
        semester: '',
        startDate: '',
        endDate: '',
    })
    const [loading, setLoading] = useState(false)

    const handleChange = (value: String, e : React.ChangeEvent<HTMLInputElement>) => {
        const key = e.target.id
        console.log(formData)
        setFormData(prevState => ({...prevState,[key] : value}))
    }

    const handleSubmit = () => {
        setLoading(true)

        RequestService.post('/api/courses/', formData)
            .then(() => {
                setAlert({ autoDelete: true, type: 'success', message: 'Course Added' })
            })
            .catch((err: ExpressValidationError[] | Error) => {
                const message = Array.isArray(err) ? err.map((e) => `${e.param} ${e.msg}`).join(', ') : err.message

                setAlert({ autoDelete: false, type: 'error', message })
            })
            .finally(() => setLoading(false))
    }

    return (
        <PageWrapper>
            <h1>Course Form</h1>
            <TextField id='name' label='Course Name' onChange={handleChange}/>
            <TextField id='number' label='Course Number' onChange={handleChange}/>
            <TextField id='semester' label='Semester' onChange={handleChange}  placeholder='Ex. f2022, w2023, s2024'/>
            <TextField id='startDate' label='Start Date' onChange={handleChange}/>
            <TextField id='endDate' label='End Date' onChange={handleChange}/>
    
            <Button onClick={handleSubmit} loading={loading}>Submit</Button>
        </PageWrapper>
    )

}


export default EditCourseFormPage