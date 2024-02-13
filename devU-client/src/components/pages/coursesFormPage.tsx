import React,{useState} from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

import { ExpressValidationError } from 'devu-shared-modules'

import PageWrapper from 'components/shared/layouts/pageWrapper'

import RequestService from 'services/request.service'

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
    })
    const [startDate, setStartDate] = useState(new Date())
    const [endDate, setEndDate] = useState(new Date())
    const [loading, setLoading] = useState(false)

    const handleChange = (value: String, e : React.ChangeEvent<HTMLInputElement>) => {
        const key = e.target.id
        console.log(formData)
        setFormData(prevState => ({...prevState,[key] : value}))
    }
    const handleStartDateChange = (date : Date) => {setStartDate(date)}
    const handleEndDateChange = (date : Date) => {setEndDate(date)}


    const handleSubmit = () => {
        const finalFormData = {
            name : formData.name,
            number : formData.number,
            semester : formData.semester,
            startDate : startDate.toISOString(),
            endDate : endDate.toISOString(),
        }

        setLoading(true)

        RequestService.post('/api/courses/', finalFormData)
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
            <DatePicker selected = {startDate} onChange={handleStartDateChange}/>
            <DatePicker selected = {endDate} onChange={handleEndDateChange}/>
    
            <Button onClick={handleSubmit} loading={loading}>Submit</Button>
        </PageWrapper>
    )

}


export default EditCourseFormPage