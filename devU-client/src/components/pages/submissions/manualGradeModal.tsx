import React, { useState } from 'react'
import {useParams} from 'react-router-dom'
import { useActionless } from 'redux/hooks'
import { SET_ALERT } from 'redux/types/active.types'

import {SubmissionScore} from 'devu-shared-modules'
import RequestService from 'services/request.service'
import Modal from 'components/shared/layouts/modal'

interface Props {
    open: boolean;
    onClose: () => void;
    submissionScore: SubmissionScore | null;

}

const ManualGradeModal = ({ open, onClose, submissionScore }: Props) => {
    const [setAlert] = useActionless(SET_ALERT)
    const { submissionId, assignmentId, courseId } = useParams<{submissionId: string, assignmentId: string, courseId: string}>()

    const [formData, setFormData] = useState({
        name: '',
        number: '',
        session: '',
        isPublic: false
    });

    const handleManualGrade = async () => {
        if (submissionScore) {
            // Update the submission score
            console.log('Submission Exists')
            await RequestService.put(`/api/course/${courseId}/assignment/${assignmentId}/submission-scores/${submissionScore.id}`, formData)
                .then(() => {
                    setAlert({ autoDelete: true, type: 'success', message: 'Submission Score Updated' })
                })

        }
        else {
            // Create a new submission score
            console.log('No Submission')
            await RequestService.post(`/api/course/${courseId}/assignment/${assignmentId}/submission-scores`, formData)
                .then(() => {
                    setAlert({ autoDelete: true, type: 'success', message: 'Submission Score Created' })
                })
        }
    }

    // const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    //     const key = e.target.id
    //     const value = e.target.value

    //     setFormData(prevState => ({ ...prevState, [key]: value }))
    // }

    return (
        <Modal title="Grade Assignment" buttonAction={handleManualGrade} open={open} onClose={onClose}>
            NOT IMPLEMENTED YET
        </Modal>
    )
}

export default ManualGradeModal;