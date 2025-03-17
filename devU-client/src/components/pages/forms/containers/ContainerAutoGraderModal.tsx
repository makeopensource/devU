import React, {useState} from 'react'
// import PageWrapper from 'components/shared/layouts/pageWrapper'
// import styles from './containerAutoGraderForm.scss'
// import TextField from 'components/shared/inputs/textField'
import {useActionless} from 'redux/hooks'
import {SET_ALERT} from 'redux/types/active.types'
import RequestService from 'services/request.service'
import {ExpressValidationError} from "devu-shared-modules";
// import {applyStylesToErrorFields, removeClassFromField} from "../../../../utils/textField.utils";
// import textStyles from "../../../shared/inputs/textField.scss";
import {useParams} from 'react-router-dom'
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
    const [graderFile, setGraderFile] = useState<File | null>()
    const [makefile, setMakefile] = useState<File | null>()
    const [formData,setFormData] = useState({
        assignmentId: assignmentId,
        autogradingImage: '',
        timeout: '',
    })
    // const [invalidFields, setInvalidFields] = useState(new Map<string, string>())

    // const handleChange = (value: String, e : React.ChangeEvent<HTMLInputElement>) => {
    //     const key = e.target.id
    //     const newInvalidFields = removeClassFromField(invalidFields, key)
    //     setInvalidFields(newInvalidFields)
    //     setFormData(prevState => ({...prevState,[key] : value}))
    // }

    //This is janky but it works and I'm too tired to come up with a better solution
    //this is done because the files need to be uniquely identified for multer to parse them from the multipart
    const handleGraderfileChange = (e : React.ChangeEvent<HTMLInputElement>) => {
        setGraderFile(e.target.files?.item(0))
    }
    const handleMakefileChange = (e : React.ChangeEvent<HTMLInputElement>) => {
        setMakefile(e.target.files?.item(0))
    }



    const handleSubmit = () => {
        if (!graderFile || !makefile) return;

        const multipart = new FormData
        multipart.append('assignmentId', formData.assignmentId)
        multipart.append('autogradingImage', formData.autogradingImage)
        multipart.append('timeout', String(formData.timeout))
        if (graderFile) multipart.append('graderFile', graderFile)
        if (makefile) multipart.append('makefileFile', makefile)

        RequestService.postMultipart(`/api/course/${courseId}/assignment/${assignmentId}/container-auto-graders/`, multipart)
            .then(() => {
                setAlert({ autoDelete: true, type: 'success', message: 'Container Auto-Grader Added' })
            })
            .catch((err: ExpressValidationError[] | Error) => {
                const message = Array.isArray(err) ? err.map((e) => `${e.param} ${e.msg}`).join(', ') : err.message
                // const newFields = applyStylesToErrorFields(err, formData, textStyles.errorField)
                // setInvalidFields(newFields)

            setAlert({autoDelete: false, type: 'error', message: message})
        }).finally(() => {
        })


        setFormData({
            assignmentId: assignmentId,
            autogradingImage: '',
            timeout: '',
        })

        onClose();
    }

    return (
        <Modal title="Add Container Auto Grader" buttonAction={handleSubmit} open={open} onClose={onClose}>
            <div className="input-group">
                <label htmlFor="autogradingImage">Autograding Image*:</label>
                <input type="text" id="autogradingImage" onChange={(e) => setFormData({ ...formData, autogradingImage: e.target.value })} placeholder="e.g. Assignment 1 Image" />
            </div>
            <div className="input-group">
                <label htmlFor="timeout">Timeout (ms):</label>
                <input type="number" id="timeout" value={formData.timeout} placeholder="e.g. 3000"  />
            </div>
            <div className="input-group">
                <label htmlFor="graderFile">Graderfile*:</label>
                <input type="file" id="graderFile" onChange={handleGraderfileChange} />
            </div>
            <div className="input-group">
                <label htmlFor="makefile">Makefile*:</label>
                <input type="file" id="makefile" onChange={handleMakefileChange} />
            </div>
        </Modal>
    );
};


export default ContainerAutoGraderForm