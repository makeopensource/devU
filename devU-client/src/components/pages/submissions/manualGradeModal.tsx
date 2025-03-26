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
    const [problemScores, setProblemScores] = useState<Record<string, any>>({})

    const [formData, setFormData] = useState({
        submissionId: submissionScore?.submissionId,
        score: submissionScore?.score,
        feedback: submissionScore?.feedback,
        releasedAt: "2024-10-05T14:48:00.00Z"
    })

    const handleManualGrade = async () => {
        const updateProblemScoreURL = `/course/${courseId}/assignment/${assignmentId}/submission-problem-scores`

        // set releasedAt to now in ISO 8601 format
        setFormData(prevState => ({ ...prevState, ["releasedAt"]: new Date().toISOString() }))


        // update problem scores if changed
        for (const [id, scoreData] of Object.entries(problemScores)) {
            const problemID = Number(id.split("_")[1])

            // get corresponding score if exists
            const correspondingScore = submissionProblemScores.find(
                (scoreItem) => scoreItem.assignmentProblemId === problemID
            );

            scoreData["releasedAt"] = new Date().toISOString()

            if (correspondingScore) {
                // put request to update score
                console.log("SUBMISSION SCOREDATA", scoreData)
                await RequestService.put(`${updateProblemScoreURL}/${problemID}`, scoreData)

            } else {
                // post request to create new score
                console.log("NO SUBMISSION SCOREDATA", scoreData)
                await RequestService.post(updateProblemScoreURL, scoreData)
            }

        }

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

    const handleProblemChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;  // Get the input's id and value
        const scoreValue = Number(value); // Convert the score to a number
        
        setProblemScores(prevScores => {
            const updatedScores: any = { ...prevScores };

            // if key exists
            if (updatedScores[id]) {
                // update score for existing problem
                updatedScores[id].score = scoreValue;
            } else {
                // add a new problem score entry
                updatedScores[id] = {
                    submissionId: submissionScore?.submissionId,
                    assignmentProblemId: Number(id.split("_")[1]),
                    score: scoreValue,
                };
            }
    
            return updatedScores;  // Return the updated scores object
        });
    }

    return (
        <Modal title="Grade Assignment" buttonAction={handleManualGrade} open={open} onClose={onClose}>
            {assignmentProblems.map((problemItem) => {
                // find the corresponding submissionProblemScore for the current problem
                const correspondingScore = submissionProblemScores.find(
                    (scoreItem) => scoreItem.assignmentProblemId === problemItem.id
                );

                return (
                    <div key={problemItem.id} className="input-group">
                        <label htmlFor={"problem_" + problemItem.id?.toString()}>{problemItem.problemName}</label>
                        <input type="number"
                            id={"problem_" + problemItem.id?.toString()}
                            placeholder={String(correspondingScore ? correspondingScore.score : "unanswered")}
                            onChange={handleProblemChange}
                        />
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