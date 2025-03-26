import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useActionless } from 'redux/hooks'
import { SET_ALERT } from 'redux/types/active.types'

import { AssignmentProblem, SubmissionScore, SubmissionProblemScore } from 'devu-shared-modules'
import RequestService from 'services/request.service'
import Modal from 'components/shared/layouts/modal'

interface Props {
    open: boolean;
    onClose: () => void;
    submissionScore: SubmissionScore | null;
    assignmentProblems: Array<AssignmentProblem>;
    submissionProblemScores: Array<SubmissionProblemScore>;
}

const ManualGradeModal = ({ open, onClose, submissionScore, assignmentProblems, submissionProblemScores }: Props) => {
    const [setAlert] = useActionless(SET_ALERT)
    const { assignmentId, courseId } = useParams<{ assignmentId: string, courseId: string }>()

    const updateProblemScoreURL = `/course/${courseId}/assignment/${assignmentId}/submission-problem-scores`
    console.log(updateProblemScoreURL)
    console.log("PROBLEMS:", assignmentProblems)
    console.log("SCORES:", submissionProblemScores)

    const [formData, setFormData] = useState({
        submissionId: submissionScore?.submissionId,
        score: submissionScore?.score,
        feedback: submissionScore?.feedback,
        releasedAt: "2024-10-05T14:48:00.00Z"
    })

    const handleManualGrade = async () => {
        // set releasedAt to now in ISO 8601 format
        setFormData(prevState => ({ ...prevState, ["releasedAt"]: new Date().toISOString() }))



        if (submissionScore) {
            // Update the submission score
            await RequestService.put(`/api/course/${courseId}/assignment/${assignmentId}/submission-scores/${submissionScore.id}`, formData)
                .then(() => {
                    setAlert({ autoDelete: true, type: 'success', message: 'Submission Score Updated' })
                    window.location.reload()
                })
        }
        else {
            // Create a new submission score
            await RequestService.post(`/api/course/${courseId}/assignment/${assignmentId}/submission-scores`, formData)
                .then(() => {
                    setAlert({ autoDelete: true, type: 'success', message: 'Submission Score Created' })
                    window.location.reload()
                })
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const key = e.target.id
        const value = e.target.value

        setFormData(prevState => ({ ...prevState, [key]: value }))
    }

    return (
        <Modal title="Grade Assignment" buttonAction={handleManualGrade} open={open} onClose={onClose}>
            {/* for each problem, show a problem input */}
            {assignmentProblems.map((problemItem) => {
                // Find the corresponding submissionProblemScore for the current problem
                const correspondingScore = submissionProblemScores.find(
                    (scoreItem) => scoreItem.assignmentProblemId === problemItem.id
                );

                return (
                    <div key={problemItem.id}>
                        <span>{problemItem.problemName}</span>
                        <span>{correspondingScore ? correspondingScore.score : '--'}</span>
                    </div>
                );
            })}

            <div className="input-group">
                <label htmlFor="score" className="input-label">Assignment Score:</label>
                <input type="number" id="score" value={Number(formData.score)} onChange={handleChange} />
            </div>
            <div className="input-group">
                <label htmlFor="feedback" className="input-label">Overall Feedback:</label>
                <textarea rows={4} id="feedback" onChange={handleChange} value={String(formData.feedback)}
                    placeholder='Provide assignment feedback...' />
            </div>
        </Modal>
    )
}

export default ManualGradeModal;