import React,{useState} from 'react'
import PageWrapper from 'components/shared/layouts/pageWrapper'
import styles from './nonContainerAutoGraderForm.scss'
import TextField from 'components/shared/inputs/textField'
import Button from 'components/shared/inputs/button'
import { useActionless } from 'redux/hooks'
import { SET_ALERT } from 'redux/types/active.types'
import RequestService from 'services/request.service'
import { useParams } from 'react-router-dom'

const ContainerAutoGraderForm = () => {
    const [setAlert] = useActionless(SET_ALERT)
    const { assignmentId } = useParams<{ assignmentId: string }>()

    const [graderFile, setGraderFile] = useState<File | null>()
    const [makefile, setMakefile] = useState<File | null>()
    const [formData,setFormData] = useState({
        assignmentId: assignmentId,
        autogradingImage: '',
        timeout: '',
    })

    const handleChange = (value: String, e : React.ChangeEvent<HTMLInputElement>) => {
        const key = e.target.id
        setFormData(prevState => ({...prevState,[key] : value}))
    }
    //This is janky but it works and I'm too tired to come up with a better solution
    //this is done because the files need to be uniquely identified for multer to parse them from the multipart
    const handleGraderfileChange = (e : React.ChangeEvent<HTMLInputElement>) => {
        setGraderFile(e.target.files?.item(0))
    }
    const handleMakefileChange = (e : React.ChangeEvent<HTMLInputElement>) => {
        setMakefile(e.target.files?.item(0))
    }

    const handleSubmit = () => {

        const multipart = new FormData
        multipart.append('assignmentId', formData.assignmentId)
        multipart.append('autogradingImage', formData.autogradingImage)
        multipart.append('timeout', String(formData.timeout))
        if (graderFile) multipart.append('graderFile', graderFile)
        if (makefile) multipart.append('makefileFile', makefile)

        RequestService.postMultipart('/api/container-auto-graders/', multipart)
            .then(() => {
                setAlert({ autoDelete: true, type: 'success', message: 'Container Auto-Grader Added' })
            })
            .catch((err: Error) => {
                setAlert({ autoDelete: false, type: 'error', message: err.message })
            })


        setFormData({
            assignmentId: assignmentId,
            autogradingImage: '',
            timeout: '',
        })
    }

    return(
        <PageWrapper>
            <h1>Non Container Auto Grader Form</h1>
            <div className = {styles.leftColumn}>
                <h1>Add a Non-Container Auto Grader</h1>
                <TextField id= 'autogradingImage' label='Autograding Image' onChange={handleChange} value={formData.autogradingImage}></TextField>
                <TextField id= 'timeout' label='Timeout' onChange={handleChange} value={formData.timeout}></TextField>
                <label htmlFor="graderFile">Graderfile</label>
                <input type="file" id='graderFile'  onChange={handleGraderfileChange} /> <br/>
                <label htmlFor="makefileFile">Makefile</label>
                <input type="file" id='makefileFile' onChange={handleMakefileChange} /> <br/>
                <br></br><br></br>
                <Button onClick= { handleSubmit } >Add Problem</Button>
            </div>
            <div className = {styles.rightColumn}>
                <h1>Existing Problems</h1>
            </div>
        </PageWrapper>
    )
}

export default ContainerAutoGraderForm