import React, { useEffect, useState } from 'react'
import { ExpressValidationError, Assignment, AssignmentProblem, NonContainerAutoGrader, ContainerAutoGrader } from 'devu-shared-modules'
import 'react-datepicker/dist/react-datepicker.css'
import { useHistory, useParams } from 'react-router-dom'
import PageWrapper from 'components/shared/layouts/pageWrapper'
import RequestService from 'services/request.service'
import { useActionless } from 'redux/hooks'
import TextField from 'components/shared/inputs/textField'
import Button from '../../../shared/inputs/button'
import styles from './assignmentUpdatePage.scss'
import { SET_ALERT } from 'redux/types/active.types'
import { applyMessageToErrorFields, removeClassFromField } from 'utils/textField.utils'
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { getCssVariables } from 'utils/theme.utils'
import { Button as MuiButton, StyledEngineProvider } from '@mui/material'
import TextProblemModal from './textProblemModal'
import TextDropdown from 'components/shared/inputs/textDropDown'
import { Option } from 'components/shared/inputs/dropdown'
//import Select from 'react-select/src/Select'

type UrlParams = { assignmentId: string }

const AssignmentUpdatePage = () => {
  const { assignmentId } = useParams() as UrlParams
  const { courseId } = useParams<{ courseId: string }>()
  const [setAlert] = useActionless(SET_ALERT)
  const currentAssignmentId = parseInt(assignmentId)
  const [assignmentProblems, setAssignmentProblems] = useState<AssignmentProblem[]>([])
  const [nonContainerAutograders, setNonContainerAutograders] = useState<NonContainerAutoGrader[]>([])
  const [containerAutograders, setContainerAutograders] = useState<ContainerAutoGrader[]>([])

  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [categoryOptions, setAllCategoryOptions] = useState<Option<String>[]>([])
  const [currentCategory, setCurrentCategory] = useState<Option<String>>()


  const [invalidFields, setInvalidFields] = useState(new Map<string, string>())
  const [openEditModal, setOpenEditModal] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const history = useHistory()

  const [theme, setTheme] = useState(getCssVariables())
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


  const handleOpenEditModal = (problem : AssignmentProblem) => {
    if(problem === assignmentProblemData) {
      setOpenEditModal(true)
    } else {    
      setAssignmentProblemData(problem)
    }
  }
  const handleCloseEditModal = () => {
    setOpenEditModal(false)
  }
  useEffect(() => {
    if (assignmentProblemData.maxScore !== -1) { setOpenEditModal(true) }
  }, [assignmentProblemData])

  // taken out of the design for the moment, should get incorporated later
  /*const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {setFormData(prevState => ({ ...prevState, disableHandins: e.target.checked }))}*/ 
  const handleStartDateChange = (e : React.ChangeEvent<HTMLInputElement>) => {setFormData(prevState => ({ ...prevState, startDate: e.target.value + "Z" }))}
  const handleEndDateChange = (e : React.ChangeEvent<HTMLInputElement>) => {setFormData(prevState => ({ ...prevState, endDate: e.target.value + "Z"}))}
  const handleDueDateChange = (e : React.ChangeEvent<HTMLInputElement>) => {setFormData(prevState => ({ ...prevState, dueDate: e.target.value + "Z"}))}

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files){
      const file = e.target.files[0]
      if(files.length < 5) {
        setFiles([...files, file])
      }
    }
  }

  const fetchAssignmentProblems = async () => {
    await RequestService.get(`/api/course/${courseId}/assignment/${currentAssignmentId}/assignment-problems`)
      .then((res) => { setAssignmentProblems(res) })
  }
  
  

  useEffect(() => {RequestService.get(`/api/course/${courseId}/assignments/${assignmentId}`).then((res) => { setFormData(res) })}, [])
  useEffect(() => {RequestService.get(`/api/course/${courseId}/assignment/${assignmentId}/assignment-problems`).then((res) => { setAssignmentProblems(res) })}, [])
  useEffect(() => {RequestService.get(`/api/course/${courseId}/assignment/${assignmentId}/non-container-auto-graders`).then((res) => { setNonContainerAutograders(res) })}, [])
  useEffect(() => {RequestService.get(`/api/course/${courseId}/assignment/${assignmentId}/container-auto-graders`).then((res) => { setContainerAutograders(res) })}, [])
  useEffect(() => {RequestService.get(`/api/course/${courseId}/assignments`).then((res) => { setAssignments(res) })}, [formData])

  useEffect(() => {
    const categories = [...new Set(assignments.map(a => a.categoryName))];
    const options = categories.map((category) => ({
        value: category,
        label: category
      }));
    
    setAllCategoryOptions(options);
    setCurrentCategory(categoryOptions.find((category) => (category.value === formData.categoryName)))
}, [assignments])

  
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
        setOpenEditModal(false)
        fetchAssignmentProblems()
    })
  }

  const [textModal, setTextModal] = useState(false)

  const handleCloseTextModal = () => {
    setTextModal(false)
    fetchAssignmentProblems()
  }

  const handleDeleteProblem = (problemId: number) => {
    RequestService.delete(`/api/course/${courseId}/assignment/${currentAssignmentId}/assignment-problems/${problemId}`)
      .then(() => {
        setAlert({ autoDelete: true, type: 'success', message: 'Problem Deleted' })
        fetchAssignmentProblems()
    })
  }

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

  const handleCategoryChange = (value: Option<String>)  => {
    setFormData(prevState => ({ ...prevState, categoryName: value.label }))
    setCurrentCategory(value)
  };

  const handleCategoryCreate = (value: string)  => {
    const newOption : Option = {value: value, label: value}
    setAllCategoryOptions(prevState => {
      const newArr: Option<String>[] = (prevState);
      newArr.push(newOption);
      return newArr;
    })
    setFormData(prevState => ({ ...prevState, categoryName: value }))
    setCurrentCategory(newOption)
    };
  
  return (

    <PageWrapper>

      <Dialog open={openEditModal} onClose={handleCloseEditModal}>
        <DialogContent sx={{bgcolor:theme.listItemBackground}}>
        <h3 className={styles.header}>Edit Problem</h3>
          <TextField id="problemName" label={'Problem Name'} onChange={handleProblemChange} value={assignmentProblemData ? assignmentProblemData.problemName : ''}/>
          <TextField id="maxScore" label={'Max Score'} onChange={handleProblemChange} value={assignmentProblemData ? assignmentProblemData.maxScore.toString() : ''}/>
          <DialogActions>
            <Button onClick={handleProblemUpdate}>Save</Button>
            <Button onClick={handleCloseEditModal}>Close</Button>
          </DialogActions>
        </DialogContent>
      </Dialog>

      <TextProblemModal open={textModal} onClose={handleCloseTextModal}/>

      <div className={styles.pageHeader}>
        <h1 style={{gridColumnStart:2}}>Edit Assignment</h1>
        <Button className={`btnPrimary ${styles.backToCourse}`} onClick={() => {history.goBack()}}>Back to Course</Button>
      </div>
      <div className={styles.grid}>
        <div className={styles.form}>
          <h2 className={styles.header}>Edit Info</h2>
          <div className={styles.textFieldContainer}>
            <div>
              <div className={styles.textFieldHeader}>Assignment Category: </div>
              <TextDropdown onChange={handleCategoryChange}
                      onCreate={handleCategoryCreate}
                      options={categoryOptions}
                      value={currentCategory}
                      defaultOption={currentCategory}
                      />
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
                <TextField id="description" onChange={handleChange} multiline={true} rows={3}
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
              <div className={styles.textFieldHeader}>Max File Size (kb): </div>
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

              <input type='datetime-local' id="start_date" value={formData.startDate.slice(0,-1)} onChange={handleStartDateChange}/>
              <input type='datetime-local' id="due_date" value={formData.dueDate.slice(0,-1)} onChange={handleDueDateChange}/>
              <input type='datetime-local' id="end_date" value={formData.endDate.slice(0,-1)} onChange={handleEndDateChange}/>
          </div>
          <h2 className={styles.header}>Attachments</h2>
            {(files.length != 0) ? (
              <div className={styles.filesList}>
                <span>Files:</span> 
                {files.slice(0,-1).map((file, index) => (
                <div key={index}>
                  <span>&nbsp;{`${file.name},`}</span>
                </div>))}
                <div key={files.length-1}>
                  <span>&nbsp;{`${files[files.length-1].name}`}</span>
              </div>
                
              </div>) 
           : <div className={styles.filesList} style={{fontStyle:'italic'}}>No files attached</div>}
          <input type='file' id='fileUp' onChange={handleFile} hidden/>
          <label htmlFor="fileUp">
          <StyledEngineProvider injectFirst>
            <MuiButton disableRipple component="span" className={styles.fileUpload}>
              Choose Files
            </MuiButton>
          </StyledEngineProvider>
          </label> 
          

        </div>
        <div className={styles.problemsList}>
        <h2 className={styles.header}>Add Problems</h2>
          <div className={styles.buttonContainer}>
            <Button onClick={() => setAlert({ autoDelete: true, type: 'error', message: 'Setup Code/File Input creation modal' })} className='btnSecondary'>Code/File Input</Button>
            <Button onClick={() => {setTextModal(true)}} className='btnSecondary'>Text Input</Button>
            <Button onClick={() => setAlert({ autoDelete: true, type: 'error', message: 'Setup Multiple Choice creation modal' })} className='btnSecondary'>Multiple Choice</Button>
          </div>
          <h2 className={styles.header}>Add Graders</h2>
          <div className={styles.buttonContainer}>
            <Button onClick={() => {
                        history.push(`createCAG`)
                    }} className='btnSecondary'>Code Grader</Button>
            <Button onClick={() => {
                        history.push(`createNCAG`)
                    }} className='btnSecondary'>Non-code Grader</Button>
          </div>  
          <h2 className={styles.header}>Graders</h2>
            {nonContainerAutograders.length != 0 && nonContainerAutograders.map((nonContainerAutograder) => (<div>
              <span style={{fontStyle:'italic'}}>{nonContainerAutograder.question}</span> - 
              <span style={{color: 'var(--grey)'}}> Non-Code Grader</span></div>))}
            {containerAutograders.length != 0 && containerAutograders.map((containerAutograder) => (<div>
            <span style={{fontStyle:'italic'}}>{containerAutograder.autogradingImage}</span> - 
            <span style={{color: 'var(--grey)'}}> Code Grader</span></div>))}
            {nonContainerAutograders.length == 0 && containerAutograders.length == 0 && <div style={{fontStyle:'italic'}}>No graders yet</div>}
          <h2 className={styles.header}>Problems</h2>

          {assignmentProblems.length != 0 ? (assignmentProblems.map((problem) => (
            <div key={problem.id} className={styles.problem}>
              <h3 style={{margin: '0 0 10px 0'}}>{problem.problemName}</h3>
              <TextField className={styles.textField}
                        placeholder='Answer'
                        sx={{width: '100%', marginLeft : 1/10, pointerEvents: 'none'}}/>
              <div style={{margin: '5px 0 10px 0'}}>
                <Button className={styles.editProblem} onClick={() => { if (problem !== undefined) { handleOpenEditModal(problem) } }}>edit</Button>|
                <Button className={styles.deleteButton} onClick={() => { if (problem !== undefined && problem.id !== undefined) { handleDeleteProblem(problem.id) } }}>delete</Button>
              </div>
            </div>
          ))) : <div style={{fontStyle:'italic'}}>No problems yet</div>}

        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', margin: '20px'}}>
            <Button onClick={handleAssignmentUpdate} className='btnPrimary'>Save & Exit</Button>
      </div>
    </PageWrapper>
  )
}

export default AssignmentUpdatePage
