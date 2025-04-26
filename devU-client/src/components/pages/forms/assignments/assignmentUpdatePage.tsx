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
import { Button as MuiButton, StyledEngineProvider } from '@mui/material'
import TextDropdown from 'components/shared/inputs/textDropDown'
import { Option } from 'components/shared/inputs/dropdown'
import ContainerAutoGraderModal from '../containers/containerAutoGraderModal';
import TextProblemModal from './textProblemModal'
import CodeProblemModal from './codeProblemModal'
import MultipleChoiceModal from './multipleChoiceModal'
import AssignmentProblemListItem from 'components/listItems/assignmentProblemListItem'



type UrlParams = { assignmentId: string }

const AssignmentUpdatePage = () => {
  const { assignmentId } = useParams() as UrlParams
  const { courseId } = useParams<{ courseId: string }>()
  const [setAlert] = useActionless(SET_ALERT)
  const currentAssignmentId = parseInt(assignmentId)
  const [assignmentProblems, setAssignmentProblems] = useState<AssignmentProblem[]>([])
  const [nonContainerAutograders, setNonContainerAutograders] = useState<NonContainerAutoGrader[]>([])
  const [containerAutograders, setContainerAutograders] = useState<ContainerAutoGrader[]>([])

  const [mcqProblemId, setMcqProblemId] = useState<number>()
  const [textProblemId, setTextProblemId] = useState<number>()

  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [categoryOptions, setAllCategoryOptions] = useState<Option<String>[]>([])


  const [invalidFields, setInvalidFields] = useState(new Map<string, string>())
  const [files, setFiles] = useState<File[]>([])
  const history = useHistory()

  // Needs a custom observer to force an update when the css variables change
  // Custom observer will update the theme variables when the bodies classes change
  

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



  // taken out of the design for the moment, should get incorporated later
  /*const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {setFormData(prevState => ({ ...prevState, disableHandins: e.target.checked }))}*/ 
  const handleStartDateChange = (e : React.ChangeEvent<HTMLInputElement>) => {
    const newDate = new Date(e.target.value)
    setFormData(prevState => ({ ...prevState, startDate: isNaN(newDate.getTime()) ? "" : newDate.toISOString() }))
  }
  const handleEndDateChange = (e : React.ChangeEvent<HTMLInputElement>) => {
    const newDate = new Date(e.target.value)
    setFormData(prevState => ({ ...prevState, endDate: isNaN(newDate.getTime()) ? "" : newDate.toISOString() } )) }

  const handleDueDateChange = (e : React.ChangeEvent<HTMLInputElement>) => {
    const newDate = new Date(e.target.value)
    setFormData(prevState => ({ ...prevState, dueDate: isNaN(newDate.getTime()) ? "" : newDate.toISOString() } ))}

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0]
      if (files.length < 5) {
        setFiles([...files, file])
      }
      console.log(files)
    }
  }

  const fetchAssignmentProblems = async () => {
    await RequestService.get(`/api/course/${courseId}/assignment/${currentAssignmentId}/assignment-problems`)
      .then((res) => { setAssignmentProblems(res)})
  }
  const fetchNcags = async () => {
    await RequestService.get(`/api/course/${courseId}/assignment/${assignmentId}/non-container-auto-graders`)
      .then((res) => { setNonContainerAutograders(res) })
  }
  const fetchCags = async () => {
    await RequestService.get(`/api/course/${courseId}/assignment/${assignmentId}/container-auto-graders`)
    .then((res) => { setContainerAutograders(res) })
  }
  



  useEffect(() => { RequestService.get(`/api/course/${courseId}/assignments/${assignmentId}`).then((res) => { setFormData(res) }) }, [])
  useEffect(() => { RequestService.get(`/api/course/${courseId}/assignment/${assignmentId}/assignment-problems`).then((res) => { setAssignmentProblems(res) }) }, [])
  useEffect(() => { RequestService.get(`/api/course/${courseId}/assignment/${assignmentId}/non-container-auto-graders`).then((res) => { setNonContainerAutograders(res) }) }, [])
  useEffect(() => { RequestService.get(`/api/course/${courseId}/assignment/${assignmentId}/container-auto-graders`).then((res) => { setContainerAutograders(res) }) }, [])
  useEffect(() => { RequestService.get(`/api/course/${courseId}/assignments`).then((res) => { setAssignments(res) }) }, [formData])
  useEffect(() => {
    const categories = [...new Set(assignments.map(a => a.categoryName))];
    const options = categories.map((category) => ({
        value: category,
        label: category
      }));
    
    setAllCategoryOptions(options);
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
    if (finalFormData.description !== null) {
      multipart.append('description', finalFormData.description)
    }
    multipart.append('maxFileSize', finalFormData.maxFileSize.toString())
    if (finalFormData.maxSubmissions !== null) {
      multipart.append('maxSubmissions', finalFormData.maxSubmissions.toString())
    }
    multipart.append('disableHandins', finalFormData.disableHandins.toString())

    for (let i = 0; i < files.length; i++) {
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

  }


  

  const [textModal, setTextModal] = useState(false);
  const handleCloseTextModal = () => {
    setTextModal(false)
    fetchAssignmentProblems()
    fetchNcags()
  }

  const [codeModal, setCodeModal] = useState(false);
  const handleCloseCodeModal = async () => {
    setCodeModal(false)
    fetchAssignmentProblems()
  }
  const [mcqModal, setMcqModal] = useState(false);
  const handleCloseMcqModal = async () => {
    setMcqModal(false)
    fetchAssignmentProblems()
    fetchNcags()
  }
 
  const [mcqEditModal, setMcqEditModal] = useState(false);
  const handleCloseEditMcqModal = async () => {
    setMcqEditModal(false)
     fetchAssignmentProblems()
  }  
  const [textEditModal, setTextEditModal] = useState(false);
  const handleCloseTextEditModal = async () => {
    setTextEditModal(false)
   fetchAssignmentProblems()
  }  

  const [containerAutoGraderModal, setContainerAutoGraderModal] = useState(false);
  const handleCloseContainerAutoGraderModal = () => {
    setContainerAutoGraderModal(false);
    fetchCags();
  }






  const handleDeleteProblem = async (problem: AssignmentProblem) => {
  //  const idsToDelete = nonContainerAutograders.filter(ncag => ncag.)
  const ncag = nonContainerAutograders.find((n) => (n.question === problem.problemName && n.createdAt === problem.createdAt))
  ncag && RequestService.delete(`/api/course/${courseId}/assignment/${currentAssignmentId}/non-container-auto-graders/${problem.id}`)
  .then(() => {
    setAlert({ autoDelete: true, type: 'success', message: 'Problem Deleted' })
  })
  RequestService.delete(`/api/course/${courseId}/assignment/${currentAssignmentId}/assignment-problems/${problem.id}`)
    .then(() => {
      setAlert({ autoDelete: true, type: 'success', message: 'Problem Deleted' })
      window.location.reload()
    })
  }

  const handleChange = (value: String, e: React.ChangeEvent<HTMLInputElement>) => {
    const key = e.target.id
    const newInvalidFields = removeClassFromField(invalidFields, key)
    setInvalidFields(newInvalidFields)

    setFormData(prevState => ({ ...prevState, [key]: value }))
  }


  const handleCategoryChange = (value: Option<String>)  => {
    setFormData(prevState => ({ ...prevState, categoryName: value.label }))
  };

  const handleCategoryCreate = (value: string)  => {
    const newOption : Option = {value: value, label: value}
    setAllCategoryOptions(prevState => {
      const newArr: Option<String>[] = (prevState);
      newArr.push(newOption);
      return newArr;
    })
    setFormData(prevState => ({ ...prevState, categoryName: value }))
    };

  const openEditModal = (problem: AssignmentProblem) => {
    console.log("metadata:", problem.metadata);
    const type = problem.metadata.type ?? ""
    if (type === "MCQ-mult" || type === "MCQ-single"){
      setMcqProblemId(problem.id)
      setMcqEditModal(true)
    } else if (type === "Match"){
      console.log("Implement Match MCQ")
    }
    else {
      setTextProblemId(problem.id)
      setTextEditModal(true)
    }
  }

  const utcToLocal = (currDate: Date) => {
    const diff = currDate.getTimezoneOffset() * 60000
    const newDate = new Date(currDate.getTime() - diff)
    return isNaN(newDate.getTime()) ? "" : newDate.toISOString().split("Z")[0]
  }

  
  return (
    <PageWrapper>
        <ContainerAutoGraderModal open={containerAutoGraderModal} onClose={handleCloseContainerAutoGraderModal} />
        <TextProblemModal open={textModal} onClose={handleCloseTextModal} />
        <TextProblemModal open={textEditModal} onClose={handleCloseTextEditModal} edit problemId={textProblemId}/>
        <CodeProblemModal open={codeModal} onClose={handleCloseCodeModal}/>
        <MultipleChoiceModal open={mcqModal} onClose={handleCloseMcqModal} />
        <MultipleChoiceModal open={mcqEditModal} onClose={handleCloseEditMcqModal} edit problemId={mcqProblemId}/>


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
                      value={{value: formData.categoryName, label: formData.categoryName}}
                      />
            </div>
            <div>
              <div className={styles.textFieldHeader}>Assignment Name: </div>

                <TextField id="name" onChange={handleChange}
                  invalidated={!!invalidFields.get('name')} helpText={invalidFields.get('name')}
                  className={styles.textField}
                  value={formData.name}
                  sx={{
                    width: '100%',
                    "& .MuiInputBase-input.MuiOutlinedInput-input.MuiInputBase-inputMultiline.css-1sqnrkk-MuiInputBase-input-MuiOutlinedInput-input": { padding: "15px" }
                  }} />
              </div>
              <div>
                <div className={styles.textFieldHeader}>Description: <span style={{ fontStyle: 'italic', color: 'var(--grey)' }}>(optional)</span> </div>
                <TextField id="description" onChange={handleChange} multiline={true} rows={3}
                  invalidated={!!invalidFields.get('description')}
                  className={styles.textField}
                  placeholder='Provide an optional description...'
                  helpText={invalidFields.get('description')}
                  value={formData.description ? formData.description : ''}
                  sx={{
                    width: '100%',
                    "& .MuiInputBase-input.MuiOutlinedInput-input.MuiInputBase-inputMultiline.css-1sqnrkk-MuiInputBase-input-MuiOutlinedInput-input": { padding: "15px" },
                    "& .MuiInputBase-root.MuiOutlinedInput-root.MuiInputBase-colorPrimary.MuiInputBase-formControl.MuiInputBase-multiline.css-dpjnhs-MuiInputBase-root-MuiOutlinedInput-root": { padding: "0px" },
                  }} />
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
              <label htmlFor="start_date">Start Date (EDT)*</label>
              <label htmlFor="due_date">Due Date (EDT)*</label>
              <label htmlFor="end_date">End Date (EDT)*</label>

              <input type='datetime-local' id="start_date" value={utcToLocal(new Date(formData.startDate))} onChange={handleStartDateChange}/>
              <input type='datetime-local' id="due_date" value={utcToLocal(new Date(formData.dueDate))} onChange={handleDueDateChange}/>
              <input type='datetime-local' id="end_date" value={utcToLocal(new Date(formData.endDate))} onChange={handleEndDateChange}/>
          </div>
          <h2 className={styles.header}>Attachments</h2>
            {(files.length != 0) ? (
              <div className={styles.filesList}>
                <span>Files:</span> 
                {files.slice(0,-1).map((file, index) => ( // For some reason the most recent file appears twice, so I did this as a quick fix, should be fixed in future
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
          <Button onClick={() => setCodeModal(true)} className='btnSecondary'>Code/File Input</Button>
            <Button onClick={() => setTextModal(true)} className='btnSecondary'>Text Input</Button>
            <Button onClick={() => setMcqModal(true)} className='btnSecondary'>Multiple Choice</Button>
          </div>
          <h2 className={styles.header}>Add Graders</h2>
          <div className={styles.buttonContainer}>
          <Button onClick={() => setContainerAutoGraderModal(true)} className='btnSecondary'>
            Code Grader
          </Button>
            <Button onClick={() => {
                        history.push(`createNCAG`)
                    }} className='btnSecondary'>Non-code Grader</Button>
          </div>  
          <h2 className={styles.header}>Graders</h2>
            {nonContainerAutograders.length != 0 && nonContainerAutograders.map((nonContainerAutograder) => (<div>
              <span style={{fontStyle:'italic'}}>{nonContainerAutograder.question}</span> - 
              <span style={{color: 'var(--grey)'}}> Non-Code Grader</span></div>))}

            {containerAutograders.length != 0 && containerAutograders.map((containerAutograder) => (<div>
            <span style={{fontStyle:'italic'}}>Code Grader {containerAutograder.id}</span> -
            <span style={{color: 'var(--grey)'}}> Code Grader</span></div>))}
            {nonContainerAutograders.length == 0 && containerAutograders.length == 0 && <div style={{fontStyle:'italic'}}>No graders yet</div>}
          <h2 className={styles.header}>Problems</h2>
          <div>
            {assignmentProblems.length != 0 ? (assignmentProblems.map((problem) => (
              <div>
              <AssignmentProblemListItem problem={problem} disabled={true}/>
                <div style={{margin: '5px 0 10px 0'}}>
                  <Button className={styles.editProblem} onClick={() => {openEditModal(problem)}}>Edit</Button>|
                  <Button className={styles.deleteButton} onClick={() => { if (problem !== undefined && problem.id !== undefined) { handleDeleteProblem(problem) } }}>Delete</Button>
                </div>
                <hr/>
              </div>
            ))) : <div style={{fontStyle:'italic'}}>No problems yet</div>}
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', margin: '20px'}}>
      <Button onClick={handleAssignmentUpdate} className='btnPrimary'>Save & Exit</Button>
      </div>
    </PageWrapper>
  )
}

export default AssignmentUpdatePage
