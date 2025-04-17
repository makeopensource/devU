import React, { useState } from 'react'
// import PageWrapper from 'components/shared/layouts/pageWrapper'
// import styles from './containerAutoGraderForm.scss'
// import TextField from 'components/shared/inputs/textField'
import { useActionless } from 'redux/hooks'
import { SET_ALERT } from 'redux/types/active.types'
import RequestService from 'services/request.service'
import { ExpressValidationError } from "devu-shared-modules";
// import {applyStylesToErrorFields, removeClassFromField} from "../../../../utils/textField.utils";
// import textStyles from "../../../shared/inputs/textField.scss";
import { useParams } from 'react-router-dom'
import Modal from 'components/shared/layouts/modal'

// import Button from '@mui/material/Button'
interface Props {
    open: boolean;
    onClose: () => void;
}

const ContainerAutoGraderForm = ({ open, onClose }: Props) => {
    const [setAlert] = useActionless(SET_ALERT)
    const { assignmentId, courseId } = useParams<{ assignmentId: string; courseId: string }>();
    // const history = useHistory()
    const [dockerfile, setDockerfile] = useState<File | null>()
    const [jobFiles, setJobFiles] = useState<File[]>()

    const [formData, setFormData] = useState({
        assignmentId: assignmentId,
        timeout: '',
    })
    formData
    // const [invalidFields, setInvalidFields] = useState(new Map<string, string>())

    // const handleChange = (value: String, e : React.ChangeEvent<HTMLInputElement>) => {
    //     const key = e.target.id
    //     const newInvalidFields = removeClassFromField(invalidFields, key)
    //     setInvalidFields(newInvalidFields)
    //     setFormData(prevState => ({...prevState,[key] : value}))
    // }

    //This is janky but it works and I'm too tired to come up with a better solution
    //this is done because the files need to be uniquely identified for multer to parse them from the multipart
    const handleDockerfile = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDockerfile(e.target.files?.item(0))
    }
    const handleJobFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) {return}
        console.log(e.target.files)
        console.log(Array.from(e.target.files))

        setJobFiles(Array.from(e.target.files))
    }
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const key = e.target.id;
        const value = e.target.value;
        setFormData(prevState => ({ ...prevState, [key]: value }));
    };



    const handleSubmit = () => {
        if (!dockerfile || !jobFiles) return;

        const body = new FormData
        body.append('assignmentId', formData.assignmentId)
        body.append('timeoutInSeconds', formData.timeout)
        body.append('dockerfile', dockerfile)

        for (let i = 0; i < jobFiles.length; i ++){
            const f = jobFiles.at(i)
            if (f){
                body.append('jobFiles', f)
            }
        }
        


        RequestService.postMultipart(`/api/course/${courseId}/assignment/${assignmentId}/container-auto-graders/`, body)
            .then(() => {
                setAlert({ autoDelete: true, type: 'success', message: 'Container Auto-Grader Added' })
            })
            .catch((err: ExpressValidationError[] | Error) => {
                const message = Array.isArray(err) ? err.map((e) => `${e.param} ${e.msg}`).join(', ') : err.message
                // const newFields = applyStylesToErrorFields(err, formData, textStyles.errorField)
                // setInvalidFields(newFields)

                setAlert({ autoDelete: false, type: 'error', message: message })
            }).finally(() => {
            })


        setFormData({
            assignmentId: assignmentId,
            timeout: '',
        })

        onClose();
    }

    return (
        <Modal title="Add Container Auto Grader" buttonAction={handleSubmit} open={open} onClose={onClose}>
            <div className="input-group">
                <label htmlFor="dockerfile">Dockerfile*:</label>
                <input type="file" id="graderFile" onChange={handleDockerfile} />
            </div>
            <div className="input-group">
                <label htmlFor="dockerfile">Job Files*:</label>
                <input type="file" id="graderFile" multiple onChange={handleJobFiles} />
            </div>
            <div className="input-group">
                <label htmlFor="timeout">Timeout (s):</label>
                {/* <input type="number" id="timeout" placeholder="e.g. 3000" onChange={(e) => setFormData({ ...formData, timeout: e.target.value })} /> */}
                <input type="number" id="timeout" placeholder="e.g. 1" onChange={handleChange} />
            </div>
            
        </Modal>
    );
};


export default ContainerAutoGraderForm