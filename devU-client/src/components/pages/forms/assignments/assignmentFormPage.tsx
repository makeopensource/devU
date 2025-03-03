import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { ExpressValidationError } from 'devu-shared-modules'
import 'react-datepicker/dist/react-datepicker.css'
// import PageWrapper from 'components/shared/layouts/pageWrapper'

import RequestService from 'services/request.service'
import { useActionless } from 'redux/hooks'
// import TextField from 'components/shared/inputs/textField'
// import Button from '../../../shared/inputs/button'
// import DragDropFile from 'components/utils/dragDropFile'

import { SET_ALERT } from 'redux/types/active.types'

import { applyMessageToErrorFields } from "../../../../utils/textField.utils";
import { useParams } from 'react-router-dom'

import formStyles from './assignmentFormPage.scss'
import Modal from 'components/shared/layouts/modal'

// const AssignmentCreatePage = () => {
//     const [setAlert] = useActionless(SET_ALERT)
//     const { courseId } = useParams<{ courseId: string }>()
//     const history = useHistory()

//     const [formData, setFormData] = useState({
//         courseId: courseId,
//         name: '',
//         categoryName: '',
//         description: '',
//         maxFileSize: 0,
//         maxSubmissions: 0,
//         disableHandins: false,
//     })
//     const [endDate, setEndDate] = useState('')
//     const [dueDate, setDueDate] = useState('')
//     const [startDate, setStartDate] = useState('')
//     const [invalidFields, setInvalidFields] = useState(new Map<string, string>())
//     const [files, setFiles] = useState<Map<string, File>>(new Map())

//     const handleChange = (value: String, e: React.ChangeEvent<HTMLInputElement>) => {
//         const key = e.target.id

//         const newInvalidFields = removeClassFromField(invalidFields, key)
//         setInvalidFields(newInvalidFields)

//         setFormData(prevState => ({ ...prevState, [key]: value }))
//     }

//     const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
//         setFormData(prevState => ({ ...prevState, disableHandins: e.target.checked }))
//     }

//     const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => { setStartDate(e.target.value) }
//     const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => { setEndDate(e.target.value) }
//     const handleDueDateChange = (e: React.ChangeEvent<HTMLInputElement>) => { setDueDate(e.target.value) }

//     const handleSubmit = () => {
//         const finalFormData = {
//             courseId: courseId,
//             name: formData.name,
//             startDate: startDate,
//             dueDate: dueDate,
//             endDate: endDate,
//             categoryName: formData.categoryName,
//             description: formData.description,
//             maxFileSize: formData.maxFileSize,
//             maxSubmissions: formData.maxSubmissions,
//             disableHandins: formData.disableHandins,
//         }

//         const multipart = new FormData
//         multipart.append('courseId', finalFormData.courseId)
//         multipart.append('name', finalFormData.name)
//         multipart.append('startDate', finalFormData.startDate)
//         multipart.append('dueDate', finalFormData.dueDate)
//         multipart.append('endDate', finalFormData.endDate)
//         multipart.append('categoryName', finalFormData.categoryName)
//         if (finalFormData.description !== null) { multipart.append('description', finalFormData.description) }
//         multipart.append('maxFileSize', finalFormData.maxFileSize.toString())
//         if (finalFormData.maxSubmissions !== null) { multipart.append('maxSubmissions', finalFormData.maxSubmissions.toString()) }
//         multipart.append('disableHandins', finalFormData.disableHandins.toString())
//         for (const file of files.values()) {
//             multipart.append('files', file)
//         }


//         RequestService.postMultipart(`/api/course/${courseId}/assignments/`, multipart)
//             .then(() => {
//                 setAlert({ autoDelete: true, type: 'success', message: 'Assignment Added' })
//                 history.goBack()
//             })
//             .catch((err: ExpressValidationError[] | Error) => {
//                 const message = Array.isArray(err) ? err.map((e) => `${e.param} ${e.msg}`).join(', ') : err.message
//                 const newFields = new Map<string, string>()
//                 Array.isArray(err) ? err.map((e) => applyMessageToErrorFields(newFields, e.param, e.msg)) : newFields
//                 setInvalidFields(newFields);

//                 setAlert({ autoDelete: false, type: 'error', message })
//             })
//             .finally(() => {

//             })

//     }

//     const handleFile = (file: File) => {
//         if (files.size < 5) {
//             setFiles(prevState => new Map(prevState).set(file.name, file));
//         } else {
//             // TODO: Add alert
//             console.log('Max files reached');
//         }
//     };

//     const handleFileRemoval = (e: React.MouseEvent<HTMLButtonElement>) => {
//         const key = e.currentTarget.id;
//         setFiles(prevState => {
//             const newFiles = new Map(prevState);
//             newFiles.delete(key);
//             return newFiles;
//         });
//     };

//     return (
//         <PageWrapper className={formStyles.pageWrapper}>
//             <h1>Create Assignment</h1>
//             <div className={formStyles.flex}>
//                 <div className={formStyles.form}>
//                     <h2>Assignment Information</h2>
//                     <div className={formStyles.textFieldContainer}>
//                         <TextField id='name' className={formStyles.textField1} onChange={handleChange} label={"Assignment Name*"}
//                             invalidated={!!invalidFields.get("name")}
//                             helpText={invalidFields.get("name")}
//                         />

//                         <TextField id='categoryName' className={formStyles.textField2} onChange={handleChange} label={"Category Name*"}
//                             invalidated={!!invalidFields.get("categoryName")}
//                             helpText={invalidFields.get("categoryName")}
//                         />
//                     </div>

//                     <TextField id='description' className={formStyles.textArea} onChange={handleChange} label={"Description*"} multiline={true} rows={4}
//                         invalidated={!!invalidFields.get("description")}
//                         helpText={invalidFields.get("description")}
//                         sx={{
//                             "& .MuiInputBase-input.MuiOutlinedInput-input.MuiInputBase-inputMultiline.css-1sqnrkk-MuiInputBase-input-MuiOutlinedInput-input": { padding: "15px" },
//                             "& .MuiInputBase-root.MuiOutlinedInput-root.MuiInputBase-colorPrimary.MuiInputBase-formControl.MuiInputBase-multiline.css-dpjnhs-MuiInputBase-root-MuiOutlinedInput-root": { padding: "0px" },
//                         }} />

//                     <div className={formStyles.textFieldContainer}>
//                         <TextField id='maxFileSize' className={formStyles.textField1} onChange={handleChange} label={"Max File Size*"}
//                             invalidated={!!invalidFields.get("maxFileSize")}
//                             helpText={invalidFields.get("maxFileSize")}
//                         />

//                         <TextField id='maxSubmission' className={formStyles.textField2} onChange={handleChange} label={"Max Submissions*"}
//                             invalidated={!!invalidFields.get("maxSubmission")}
//                             helpText={invalidFields.get("maxSubmission")}
//                         />
//                     </div>

//                     <div className={formStyles.datepickerContainer}>
//                         <div>
//                             <label htmlFor="start_date">Start Date *</label>
//                             <br />
//                             <input type='date' id="start_date" onChange={handleStartDateChange} />
//                         </div>
//                         <div>
//                             <label htmlFor="due_date">Due Date *</label>
//                             <br />
//                             <input type='date' id="due_date" onChange={handleDueDateChange} />
//                         </div>
//                         <div>
//                             <label htmlFor="end_date">End Date *</label>
//                             <br />
//                             <input type='date' id="end_date" onChange={handleEndDateChange} />
//                         </div>
//                     </div>
//                     <br />
//                     <div style={{ display: 'flex', justifyContent: 'center' }}>
//                         <label htmlFor='disableHandins'>Allow Container Autograde</label>
//                         <input type='checkbox' id='disableHandins' checked={formData.disableHandins}
//                             onChange={handleCheckbox} className={formStyles.submitBtn} />
//                     </div>
//                     <br />
//                     <div style={{ display: 'flex', justifyContent: 'center' }}>
//                         <button onClick={handleSubmit} className='btnPrimary'>Create
//                             assignment</button>
//                     </div>
//                 </div>
//                 <div className={formStyles.form}>
//                     {/*TODO: Whenever file uploads is available on backend, store the files + create Object URLs*/}
//                     <h2>Attachments</h2>
//                     <p style={{ textAlign: 'center' }}>Add up to 5 attachments with this assignment:</p>
//                     <p>Files Uploaded (click to delete) :</p>
//                     <div className={formStyles.fileNameContainer}>
//                         {Array.from(files.keys()).map((fileName) => {
//                             return (
//                                 <div key={fileName} className={formStyles.fileName}>
//                                     <button
//                                         id={fileName}
//                                         className={formStyles.fileRemovalButton}
//                                         onClick={handleFileRemoval}
//                                     >
//                                         {fileName}
//                                     </button>
//                                 </div>
//                             );
//                         })}
//                     </div>
//                     {/* <div className={formStyles.dragDropFileComponent}> */}
//                     <div className={formStyles.dragDropFileInput}>
//                         <DragDropFile handleFile={handleFile} className='formFileUploadWide' />
//                     </div>
//                     {/* </div> */}
//                 </div>
//             </div>
//         </PageWrapper>
//     )
// }

interface Props {
    open: boolean;
    onClose: () => void;
}

const AddAssignmentModal = ({ open, onClose }: Props) => {
    const { courseId } = useParams<{ courseId: string }>()
    const [setAlert] = useActionless(SET_ALERT)
    // const navigate = useNavigate()
    const history = useHistory()
    const [endDate, setEndDate] = useState('')
    const [dueDate, setDueDate] = useState('')
    const [startDate, setStartDate] = useState('')

    const [formData, setFormData] = useState({
        courseId: courseId,
        name: '',
        categoryName: '',
        description: '',
        maxFileSize: 0,
        maxSubmissions: 0,
        disableHandins: false,
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const key = e.target.id
        const value = e.target.value

        setFormData(prevState => ({ ...prevState, [key]: value }))
    }

    const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => { setStartDate(e.target.value) }
    const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => { setEndDate(e.target.value) }
    const handleDueDateChange = (e: React.ChangeEvent<HTMLInputElement>) => { setDueDate(e.target.value) }

    const handleSubmit = () => {
        const finalFormData = {
            courseId: courseId,
            name: formData.name,
            startDate: startDate,
            dueDate: dueDate,
            endDate: endDate,
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
        if (finalFormData.description !== null) { multipart.append('description', finalFormData.description) }
        multipart.append('maxFileSize', finalFormData.maxFileSize.toString())
        if (finalFormData.maxSubmissions !== null) { multipart.append('maxSubmissions', finalFormData.maxSubmissions.toString()) }
        multipart.append('disableHandins', finalFormData.disableHandins.toString())
        // for (const file of files.values()) {
        //     multipart.append('files', file)
        // }


        RequestService.postMultipart(`/api/course/${courseId}/assignments/`, multipart)
            .then(() => {
                setAlert({ autoDelete: true, type: 'success', message: 'Assignment Added' })
                // Navigate to the update page for the new assignment
                // navigate(`/course/${courseId}/assignment/${response.id}/update`);
                // history.goBack()
            })
            .catch((err: ExpressValidationError[] | Error) => {
                const message = Array.isArray(err) ? err.map((e) => `${e.param} ${e.msg}`).join(', ') : err.message
                const newFields = new Map<string, string>()
                Array.isArray(err) ? err.map((e) => applyMessageToErrorFields(newFields, e.param, e.msg)) : newFields

                setAlert({ autoDelete: false, type: 'error', message })
            })
            .finally(() => {

            })

    }


    return (
        <Modal title="Add Assignment" buttonAction={handleSubmit} open={open} onClose={onClose}>
            <div className="input-group">
                <label htmlFor="categoryName" className="input-label">Assignment Category:</label>
                <input type="text" name="" id="categoryName" onChange={handleChange} />
            </div>
            <div className="input-group">
                <label htmlFor="name" className="input-label">Assignment Name:</label>
                <input type="text" name="" id="name" onChange={handleChange} />
            </div>
            <div className="input-group">
                <label htmlFor="description" className="input-label">Description</label>
                <textarea rows={4} name="" id="description" onChange={handleChange} />
            </div>
            <div className='input-subgroup-2col'>
                <div className="input-group">
                    <label htmlFor="maxSubmissions" className="input-label">Maximum Submissions:</label>
                    <input type="number" name="" id="maxSubmissions" onChange={handleChange} />
                </div>
                <div className="input-group">
                    <label htmlFor="maxFileSize" className="input-label">Maximum File Size (KB):</label>
                    <input type="number" name="" id="maxFileSize" onChange={handleChange} />
                </div>
            </div>
            <div className={formStyles.datepickerContainer}>
                <div>
                    <label htmlFor="start_date">Start Date:</label>
                    <br />
                    <input type='date' id="start_date" onChange={handleStartDateChange} />
                </div>
                <div>
                    <label htmlFor="due_date">Due Date:</label>
                    <br />
                    <input type='date' id="due_date" onChange={handleDueDateChange} />
                </div>
                <div>
                    <label htmlFor="end_date">End Date:<span>(optional)</span></label>
                    <br />
                    <input type='date' id="end_date" onChange={handleEndDateChange} />
                </div>
            </div>
        </Modal>
    )
}

export default AddAssignmentModal