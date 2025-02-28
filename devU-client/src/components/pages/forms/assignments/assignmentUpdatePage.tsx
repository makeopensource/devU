import React, { useEffect, useState } from 'react'
import { ExpressValidationError, Assignment, AssignmentProblem } from 'devu-shared-modules'
import 'react-datepicker/dist/react-datepicker.css'
import { useHistory, useParams } from 'react-router-dom'
import PageWrapper from 'components/shared/layouts/pageWrapper'
import RequestService from 'services/request.service'
import { useActionless } from 'redux/hooks'
import TextField from 'components/shared/inputs/textField'
import Button from '../../../shared/inputs/button'
import styles from './assignmentUpdatePage.scss'
//import DragDropFile from 'components/utils/dragDropFile'
import { SET_ALERT } from 'redux/types/active.types'
import { applyMessageToErrorFields, removeClassFromField } from 'utils/textField.utils'
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { getCssVariables } from 'utils/theme.utils'
//import Dropdown, { Option } from 'components/shared/inputs/dropdown';
//import Select from 'react-select/src/Select'

type UrlParams = { assignmentId: string }

const AssignmentUpdatePage = () => {
  const { assignmentId } = useParams() as UrlParams
  const { courseId } = useParams<{ courseId: string }>()
  const [setAlert] = useActionless(SET_ALERT)
  const currentAssignmentId = parseInt(assignmentId)
  const [assignmentsList, setAssignmentsList] = useState<Assignment[]>([])
  const [assignmentProblems, setAssignmentProblems] = useState<AssignmentProblem[]>([])
  const [allAssignmentProblems, setAllAssignmentProblems] = useState<Map<number, AssignmentProblem[]>>(new Map<number, AssignmentProblem[]>())
  //const [allCategories, setAllCategories] = useState<Category[]>([])

  const [invalidFields, setInvalidFields] = useState(new Map<string, string>())
  const [openModal, setOpenModal] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const history = useHistory()

  const [theme, setTheme] = useState(getCssVariables())
allAssignmentProblems; // Very Bad JS Work, yell at me if i leave these till the Pull Request
setFiles;
  // Needs a custom observer to force an update when the css variables change
  // Custom observer will update the theme variables when the bodies classes change
  useEffect(() => {
    const observer = new MutationObserver(() => setTheme(getCssVariables()))

    observer.observe(document.body, { attributes: true })

    return () => observer.disconnect()
  })

  const [formData, setFormData] = useState<Assignment>({
    courseId: parseInt(courseId),
    name: '',
    categoryName: '',
    description: '',
    maxFileSize: 0,
    maxSubmissions: 0,
    disableHandins: false,
    dueDate: '',
    endDate: '',
    startDate: '',
  })

  const [assignmentProblemData, setAssignmentProblemData] = useState<AssignmentProblem>({
    assignmentId: currentAssignmentId,
    problemName: '',
    maxScore: -1,
  })

  const handleOpenModal = (problem : AssignmentProblem) => {
    if(problem === assignmentProblemData) {
      setOpenModal(true)
    } else {    
      setAssignmentProblemData(problem)
    }
  }
  const handleCloseModal = () => {setOpenModal(false)}
  useEffect(() => {
    if (assignmentProblemData.maxScore !== -1) { setOpenModal(true) }
  }, [assignmentProblemData])

  const handleChange = (value: String, e: React.ChangeEvent<HTMLInputElement>) => {
    const key = e.target.id
    const newInvalidFields = removeClassFromField(invalidFields, key)
    setInvalidFields(newInvalidFields)

    setFormData(prevState => ({ ...prevState, [key]: value }))
  }
  const handleProblemChange = (value: String, e: React.ChangeEvent<HTMLInputElement>) => {
    const key = e.target.id
    setAssignmentProblemData(prevState => ({ ...prevState, [key]: value }))
  }

  // taken out of the design for the moment, should get incorporated later
  /*const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {setFormData(prevState => ({ ...prevState, disableHandins: e.target.checked }))}*/ 
  const handleStartDateChange = (e : React.ChangeEvent<HTMLInputElement>) => {setFormData(prevState => ({ ...prevState, startDate: e.target.value }))}
  const handleEndDateChange = (e : React.ChangeEvent<HTMLInputElement>) => {setFormData(prevState => ({ ...prevState, endDate: e.target.value }))}
  const handleDueDateChange = (e : React.ChangeEvent<HTMLInputElement>) => {setFormData(prevState => ({ ...prevState, dueDate: e.target.value }))}

  /*const handleFile = (file: File) => {
    if(files.length < 5) {
      setFiles([...files, file])
    }
  }*/

  const fetchAssignmentProblems = () => {
    RequestService.get(`/api/course/${courseId}/assignment/${currentAssignmentId}/assignment-problems`)
      .then((res) => { setAssignmentProblems(res) })
  }

  /*const fetchCategories = () => {
    RequestService.get(`/api/course/${courseId}/assignment/${currentAssignmentId}/assignment-problems`)
      .then((res) => { setAllCategories(res) })
  }*/

  useEffect(() => {RequestService.get(`/api/course/${courseId}/assignments/${assignmentId}`).then((res) => { setFormData(res) })}, [])
  useEffect(() => {RequestService.get(`/api/course/${courseId}/assignment/${assignmentId}/assignment-problems`).then((res) => { setAssignmentProblems(res) })}, [])
  //useEffect(() => {RequestService.get(`/api/course/${courseId}/categories/`).then((res) => { setAllCategories(res) })}, [])
  useEffect(() => {RequestService.get(`/api/course/${courseId}/assignments`).then((res) => { setAssignmentsList(res) })}, [])
  useEffect(() => {
    for(let i : number = 0; i < assignmentsList.length; i++) {
      RequestService.get(`/api/course/${courseId}/assignment/${assignmentsList[i].id}/assignment-problems`)
      .then((res) => {
        setAllAssignmentProblems(prevState => {
          const newMap = new Map(prevState);
          newMap.set(Number(assignmentsList[i].id), res);
          return newMap;
        });
      })
    }
  },[assignmentsList])

  const handleAssignmentUpdate = () => {
    const finalFormData = {
      courseId: formData.courseId,
      name: formData.name,
      startDate: formData.startDate,
      dueDate: formData.dueDate,
      endDate: formData.endDate,
      categoryName: formData.categoryName,
      description: formData.description,
      maxFileSize: formData.maxFileSize,
      maxSubmissions: formData.maxSubmissions,
      disableHandins: formData.disableHandins,
    }

    const multipart = new FormData()
    multipart.append('courseId', finalFormData.courseId.toString())
    multipart.append('name', finalFormData.name)
    multipart.append('startDate', finalFormData.startDate)
    multipart.append('dueDate', finalFormData.dueDate)
    multipart.append('endDate', finalFormData.endDate)
    multipart.append('categoryName', finalFormData.categoryName)
    if(finalFormData.description !== null) {
      multipart.append('description', finalFormData.description)
    }
    multipart.append('maxFileSize', finalFormData.maxFileSize.toString())
    if(finalFormData.maxSubmissions !== null) {
      multipart.append('maxSubmissions', finalFormData.maxSubmissions.toString())
    }
    multipart.append('disableHandins', finalFormData.disableHandins.toString())
    
    for(let i = 0; i < files.length; i++) {
      multipart.append('files', files[i])
    }

    RequestService.putMultipart(`/api/course/${courseId}/assignments/${currentAssignmentId}`, multipart)
      .then(() => {
        setAlert({ autoDelete: true, type: 'success', message: 'Assignment Updated' })
        history.goBack()
      })
      .catch((err: ExpressValidationError[] | Error) => {
        const message = Array.isArray(err) ? err.map((e) => `${e.param} ${e.msg}`).join(', ') : err.message
        const newFields = new Map<string, string>()
        Array.isArray(err) ? err.map((e) => applyMessageToErrorFields(newFields, e.param, e.msg)) : newFields
        setInvalidFields(newFields)
        setAlert({ autoDelete: false, type: 'error', message })
      })
      .finally(() => {
      })
  }

  const handleProblemUpdate = () => {
    const finalFormData = {
      assignmentId: assignmentProblemData.assignmentId,
      problemName: assignmentProblemData.problemName,
      maxScore: assignmentProblemData.maxScore,
    }

    RequestService.put(`/api/course/${courseId}/assignment/${currentAssignmentId}/assignment-problems/${assignmentProblemData.id}`, finalFormData)
      .then(() => {
        setAlert({ autoDelete: true, type: 'success', message: 'Problem Updated' })
        setOpenModal(false)
        fetchAssignmentProblems()
    })
  }

  /*const handleAssignmentChange = (e: React.MouseEvent<HTMLHeadingElement>) => {
    const assignmentDetails = assignmentsList.find((assignment) => assignment.id === parseInt(e.currentTarget.id))
    if (assignmentDetails !== undefined && assignmentDetails.id !== undefined) {
      setAssignmentProblems(allAssignmentProblems.get(assignmentDetails.id) || [])
      setCurrentAssignmentId(assignmentDetails.id)
    } 
    if (assignmentDetails !== undefined) {
      setFormData(assignmentDetails)
    }
  }*/

  const [addProblemModal, setAddProblemModal] = useState(false)
  const [addProblemForm, setAddProblemForm] = useState({
    assignmentId: currentAssignmentId,
    problemName: '',
    maxScore: 0,
  })
  const openAddProblemModal = () => {setAddProblemModal(true)}
  const handleCloseAddProblemModal = () => {setAddProblemModal(false)}

  const handleAddProblemChange = (value: String, e: React.ChangeEvent<HTMLInputElement>) => {
    const key = e.target.id
    setAddProblemForm(prevState => ({ ...prevState, [key]: value }))
  }
  const handleAddProblem = () => {
    RequestService.post(`/api/course/${courseId}/assignment/${currentAssignmentId}/assignment-problems`, addProblemForm)
      .then(() => {
        setAlert({ autoDelete: true, type: 'success', message: 'Problem Added' })
        setAddProblemModal(false)
        setAddProblemForm({
          assignmentId: currentAssignmentId,
          problemName: '',
          maxScore: 0,
        })
        fetchAssignmentProblems()
    })
  }

  const handleDeleteProblem = (problemId: number) => {
    RequestService.delete(`/api/course/${courseId}/assignment/${currentAssignmentId}/assignment-problems/${problemId}`)
      .then(() => {
        setAlert({ autoDelete: true, type: 'success', message: 'Problem Deleted' })
        fetchAssignmentProblems()
    })
  }
  
  return (

    <PageWrapper>

      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogContent sx={{bgcolor:theme.listItemBackground}}>
        <h3 className={styles.header}>Edit Problem</h3>
          <TextField id="problemName" label={'Problem Name'} onChange={handleProblemChange} value={assignmentProblemData ? assignmentProblemData.problemName : ''}/>
          <TextField id="maxScore" label={'Max Score'} onChange={handleProblemChange} value={assignmentProblemData ? assignmentProblemData.maxScore.toString() : ''}/>
          <DialogActions>
            <Button onClick={handleProblemUpdate}>Save</Button>
            <Button onClick={handleCloseModal}>Close</Button>
          </DialogActions>
        </DialogContent>
      </Dialog>

      <Dialog open={addProblemModal} onClose={handleCloseAddProblemModal}>
        <DialogContent sx={{bgcolor:theme.listItemBackground}}>
          <h3 className={styles.header}>Add Problem</h3>
          <TextField id="problemName" label={'Problem Name'} onChange={handleAddProblemChange}/>
          <TextField id="maxScore" label={'Max Score'} onChange={handleAddProblemChange}/>
          <DialogActions>
            <Button onClick={handleAddProblem}>Add</Button>
            <Button onClick={handleCloseAddProblemModal}>Close</Button>
        </DialogActions>
        </DialogContent>
      </Dialog>

      <h1>Edit Assignment</h1>
      <div className={styles.grid}>
        <div className={styles.form}>
          <h2 className={styles.header}>Edit Info</h2>
          <div className={styles.textFieldContainer}>
            <div>
              <div className={styles.textFieldHeader}>AssignmentCategory: </div>
              <TextField id="categoryName" onChange={handleChange}
                      invalidated={!!invalidFields.get('categoryName')}
                      className={styles.textField}
                      helpText={invalidFields.get('categoryName')}
                      value={formData.categoryName} 
                      sx={{width: '100%'}}/>
            </div>
            <div>
              <div className={styles.textFieldHeader}>Assignment Name: </div>

                <TextField id="name" onChange={handleChange}
                          invalidated={!!invalidFields.get('name')} helpText={invalidFields.get('name')}
                          className={styles.textField}
                          value={formData.name} 
                          sx={{ width: '100%',
                            "& .MuiInputBase-input.MuiOutlinedInput-input.MuiInputBase-inputMultiline.css-1sqnrkk-MuiInputBase-input-MuiOutlinedInput-input": {padding : "15px"}
                              }}/>
            </div>
            <div>
              <div className={styles.textFieldHeader}>Description: <span style={{fontStyle:'italic', color: 'var(--grey)'}}>(optional)</span> </div>
                <TextField id="description" onChange={handleChange} multiline={true} rows={5}
                        invalidated={!!invalidFields.get('description')}
                        className={styles.textField}
                        placeholder='Provide an optional description...'
                        helpText={invalidFields.get('description')}
                        value={formData.description ? formData.description : ''} 
                        sx={{width: '100%',
                          "& .MuiInputBase-input.MuiOutlinedInput-input.MuiInputBase-inputMultiline.css-1sqnrkk-MuiInputBase-input-MuiOutlinedInput-input": {padding : "15px"},
                          "& .MuiInputBase-root.MuiOutlinedInput-root.MuiInputBase-colorPrimary.MuiInputBase-formControl.MuiInputBase-multiline.css-dpjnhs-MuiInputBase-root-MuiOutlinedInput-root" : {padding : "0px"},
                        }}/>
              </div>
          </div>

          <div className={styles.submissionsContainer}>
            <div>
              <div className={styles.textFieldHeader}>Max Submissions: </div>
              <TextField id="maxSubmissions" onChange={handleChange} 
                        invalidated={!!invalidFields.get('maxSubmission')}
                        className={styles.textField}
                        helpText={invalidFields.get('maxSubmission')}
                        value={formData.maxSubmissions ? (formData.maxSubmissions).toString() : ''} 
                        sx={{width: '100%', marginLeft : 1/10}}/>
            </div>
            <div>
              <div className={styles.textFieldHeader}>Max File Size: </div>
              <TextField id="maxFileSize" onChange={handleChange}
                        invalidated={!!invalidFields.get('maxFileSize')}
                        className={styles.textField}
                        helpText={invalidFields.get('maxFileSize')}
                        value={formData.maxFileSize ? formData.maxFileSize.toString() : ''} 
                        sx={{width: '100%', marginLeft : 1/10}}/>
            </div>
          </div>
    
          <div className={styles.datepickerContainer}>
              <label htmlFor="start_date">Start Date *</label>
              <label htmlFor="due_date">Due Date *</label>
              <label htmlFor="end_date">End Date *</label>

              <input type='datetime-local' id="start_date" style={{textWrap:'wrap'}} value={formData.startDate.slice(0,-1)} onChange={handleStartDateChange}/>
              <input  type='datetime-local' id="due_date" value={formData.dueDate.slice(0,-1)} onChange={handleDueDateChange}/>
              <input type='datetime-local' id="end_date" value={formData.startDate.slice(0,-1)} onChange={handleEndDateChange}/>
          </div>
        </div>
        <div className={styles.problemsList}>
        <h2 className={styles.header}>Add Problems</h2>
          {assignmentProblems.map((problem, index) => (
            <div key={problem.id} className={styles.problem}>
              <h3 style={{marginRight : '20px'}}>{`Problem ${index + 1}`}</h3>
              <Button className={styles.editProblem} onClick={() => { if (problem !== undefined) { handleOpenModal(problem) } }}>Edit</Button>
              <Button className={styles.deleteButton} onClick={() => { if (problem !== undefined && problem.id !== undefined) { handleDeleteProblem(problem.id) } }}>Delete</Button>
            </div>
          ))}
          <Button onClick={openAddProblemModal} className='btnSecondary'>Add Problem</Button>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px'}}>
            <Button onClick={handleAssignmentUpdate} className='btnPrimary'>save and exit</Button>
          </div>
    </PageWrapper>
  )
}

/* yell at me if i forget to delete this
<div className={styles.attachments}>
          <h2 className={styles.header}>Attachments</h2>
          <DragDropFile handleFile={handleFile} className='formFileUploadWide'/>
          <br/>
          <div className={styles.fileList}>
            <p>Files: </p>
            {files.map((file, index) => (
              <div key={index}>
                <p>{`${file.name}, `}</p>
              </div>
            ))}
          </div>
        </div>*/ 
export default AssignmentUpdatePage
