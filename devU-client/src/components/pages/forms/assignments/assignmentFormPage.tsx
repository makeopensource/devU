import React, {useState, useEffect} from 'react'
import {ExpressValidationError} from 'devu-shared-modules'
import 'react-datepicker/dist/react-datepicker.css'
import PageWrapper from 'components/shared/layouts/pageWrapper'
import { getCssVariables } from 'utils/theme.utils'

import RequestService from 'services/request.service'
import {useActionless} from 'redux/hooks'
import TextField from 'components/shared/inputs/textField'
import Button from '@mui/material/Button'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import DragDropFile from 'components/utils/dragDropFile'

import {SET_ALERT} from 'redux/types/active.types'

import {applyMessageToErrorFields, removeClassFromField} from "../../../../utils/textField.utils";
import {useHistory, useParams} from 'react-router-dom'

import formStyles from './assignmentFormPage.scss'
import { Dayjs } from 'dayjs'

const AssignmentCreatePage = () => {
    const [theme, setTheme] = useState(getCssVariables())
    const { textColor } = theme
    const [setAlert] = useActionless(SET_ALERT)
    const {courseId} = useParams<{ courseId: string }>()
    const history = useHistory()

    const [formData, setFormData] = useState({
        courseId: courseId,
        name: '',
        categoryName: '',
        description: '',
        maxFileSize: 0,
        maxSubmissions: 0,
        disableHandins: false,
    })
    const [endDate, setEndDate] = useState(new Date())
    const [dueDate, setDueDate] = useState(new Date())
    const [startDate, setStartDate] = useState(new Date())
    const [invalidFields, setInvalidFields] = useState(new Map<string, string>())
    const [files, setFiles] = useState<Map<string,File>>(new Map())

    useEffect(() => {
        const observer = new MutationObserver(() => setTheme(getCssVariables()))
    
        observer.observe(document.body, { attributes: true })
    
        return () => observer.disconnect()
      })


    const handleChange = (value: String, e : React.ChangeEvent<HTMLInputElement>) => {
        const key = e.target.id

        const newInvalidFields = removeClassFromField(invalidFields, key)
        setInvalidFields(newInvalidFields)

        setFormData(prevState => ({...prevState,[key] : value}))
    }

    const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prevState => ({...prevState,disableHandins : e.target.checked}))
    }

    const handleStartDateChange = (date : Dayjs | null) => {
        if(date){
            const newDate = date.toDate()
            setStartDate(newDate)
        }
    }
    const handleEndDateChange = (date : Dayjs | null) => {
        if(date){
            const newDate = date.toDate()
            setEndDate(newDate)
        }
    }
    const handleDueDateChange = (date: Dayjs | null) => {
        if(date){
            const newDate = date.toDate()
            setDueDate(newDate)
        }
    }

    const handleSubmit = () => {
        const finalFormData = {
            courseId: courseId,
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

        const multipart = new FormData
        multipart.append('courseId', finalFormData.courseId)
        multipart.append('name', finalFormData.name)
        multipart.append('startDate', finalFormData.startDate)
        multipart.append('dueDate', finalFormData.dueDate)
        multipart.append('endDate', finalFormData.endDate)
        multipart.append('categoryName', finalFormData.categoryName)
        if(finalFormData.description !== null) { multipart.append('description', finalFormData.description)  }
        multipart.append('maxFileSize', finalFormData.maxFileSize.toString())
        if(finalFormData.maxSubmissions !== null) { multipart.append('maxSubmissions', finalFormData.maxSubmissions.toString())  }
        multipart.append('disableHandins', finalFormData.disableHandins.toString())
        for(const file of files.values()){
            multipart.append('files', file)
        }


        RequestService.postMultipart(`/api/course/${courseId}/assignments/`, multipart)
            .then(() => {
                setAlert({ autoDelete: true, type: 'success', message: 'Assignment Added' })
                history.goBack()
            })
            .catch((err: ExpressValidationError[] | Error) => {
                const message = Array.isArray(err) ? err.map((e) => `${e.param} ${e.msg}`).join(', ') : err.message
                const newFields = new Map<string, string>()
                Array.isArray(err) ? err.map((e) => applyMessageToErrorFields(newFields, e.param, e.msg)) : newFields
                setInvalidFields(newFields);

                setAlert({ autoDelete: false, type: 'error', message })
            })
        .finally(() => {

        })

    }

    const handleFile = (file: File) => {
        if (files.size < 5) {
            setFiles(prevState => new Map(prevState).set(file.name, file));
        } else {
            // TODO: Add alert
            console.log('Max files reached');
        }
    };

    const handleFileRemoval = (e: React.MouseEvent<HTMLButtonElement>) => {
        const key = e.currentTarget.id;
        setFiles(prevState => {
            const newFiles = new Map(prevState);
            newFiles.delete(key);
            return newFiles;
        });
    };

    return(
        <PageWrapper>
            <h2>Create Assignment</h2>
            <div className={formStyles.grid}>
                <div className={formStyles.form}>
                    <h2>Assignment Information</h2>
                    <div className={formStyles.textFieldContainer}>
                        <TextField id='name' className={formStyles.textField1} onChange={handleChange} label={"Assignment Name*"}
                                invalidated={!!invalidFields.get("name")} 
                                helpText={invalidFields.get("name")} 
                                sx={{width:9/10}}
                                />

                        <TextField id='categoryName' className={formStyles.textField2} onChange={handleChange} label={"Category Name*"}
                                invalidated={!!invalidFields.get("categoryName")} 
                                helpText={invalidFields.get("categoryName")} 
                                sx={{width:9/10}}
                                />
                    </div>

                    <TextField id='description' className={formStyles.textArea} onChange={handleChange} label={"Description*"} multiline={true} rows={5}
                            invalidated={!!invalidFields.get("description")}
                            helpText={invalidFields.get("description")}
                            sx={{width:1}}/>

                    <div className={formStyles.textFieldContainer}>
                        <TextField id='maxFileSize' className={formStyles.textField1} onChange={handleChange} label={"Max File Size*"}
                                invalidated={!!invalidFields.get("maxFileSize")}
                                helpText={invalidFields.get("maxFileSize")}
                                sx={{width:9/10}}/>

                        <TextField id='maxSubmission' className={formStyles.textField2} onChange={handleChange} label={"Max Submissions*"}
                                invalidated={!!invalidFields.get("maxSubmission")}
                                helpText={invalidFields.get("maxSubmission")}
                                sx={{width:9/10}}/>
                    </div>

                    <div className={formStyles.datepickerContainer}>
                        <div>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker label="Start Date*" onChange={handleStartDateChange} className={formStyles.datepicker_start}
                                sx={{
                                    width: 1,
                                    "& .MuiOutlinedInput-input" : {
                                        color: textColor
                                      },
                                      "& .MuiInputLabel-outlined" : {
                                        color: textColor
                                      },
                                      "& .MuiOutlinedInput-notchedOutline" : {
                                        borderColor: textColor
                                      }
                                    }}/>
                            </LocalizationProvider>
                        </div>
                        <div>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker label="Due Date*" onChange={handleDueDateChange} className={formStyles.datepicker_due}
                                sx={{
                                    width: 1,
                                    "& .MuiOutlinedInput-input" : {
                                        color: textColor
                                      },
                                      "& .MuiInputLabel-outlined" : {
                                        color: textColor
                                      },
                                      "& .MuiOutlinedInput-notchedOutline" : {
                                        borderColor: textColor
                                      }
                                    }}/>
                            </LocalizationProvider>
                        </div>
                        <div>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker label="End Date*" onChange={handleEndDateChange} className={formStyles.datepicker_end}
                                sx={{
                                    width: 1,
                                    "& .MuiOutlinedInput-input" : {
                                        color: textColor
                                      },
                                      "& .MuiInputLabel-outlined" : {
                                        color: textColor
                                      },
                                      "& .MuiOutlinedInput-notchedOutline" : {
                                        borderColor: textColor
                                      }
                                    }}/>
                            </LocalizationProvider>
                        </div>
                    </div>
                    <br/>
                    <div style={{display: 'flex', justifyContent: 'center'}}>
                        <label htmlFor='disableHandins'>Disable Handins</label>
                        <input type='checkbox' id='disableHandins' checked={formData.disableHandins}
                            onChange={handleCheckbox} className={formStyles.submitBtn}/>
                    </div>
                    <br/>
                    <div style={{display: 'flex', justifyContent: 'center'}}>
                        <Button variant='contained' onClick={handleSubmit} className={formStyles.submitBtn}>Create
                            assignment</Button>
                    </div>
                </div>
                <div className={formStyles.dragDropFile}>
                    {/*TODO: Whenever file uploads is available on backend, store the files + create Object URLs*/}
                    <h2>Attachments</h2>
                    <p>Add up to 5 attachments with this assignment:</p>
                    <p>Files Uploaded (click to delete) :</p>
                    <div className={formStyles.fileNameContainer}>
                        {Array.from(files.keys()).map((fileName) => {
                            return (
                                <div key={fileName} className={formStyles.fileName}>
                                    <button
                                        id={fileName}
                                        className={formStyles.fileRemovalButton}
                                        onClick={handleFileRemoval}
                                    >
                                        {fileName}
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                    <div className={formStyles.dragDropFileComponent}>
                        <DragDropFile handleFile={handleFile}/>
                    </div>
                </div>
            </div>

        </PageWrapper>
    )
}

export default AssignmentCreatePage