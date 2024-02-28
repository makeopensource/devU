import { SubmissionProblemScore } from 'devu-shared-modules'

import SubmissionProblemScoreModel from './submissionProblemScore.model'

export function serialize(submissionProblemScore: SubmissionProblemScoreModel): SubmissionProblemScore {
  return {
    id: submissionProblemScore.id,
    submissionId: submissionProblemScore.submissionId,
    assignmentProblemId: submissionProblemScore.assignmentProblemId,
    score: submissionProblemScore.score,
    feedback: submissionProblemScore.feedback,
    releasedAt: submissionProblemScore.releasedAt?.toISOString(),
    createdAt: submissionProblemScore.createdAt.toISOString(),
    updatedAt: submissionProblemScore.updatedAt.toISOString(),
  }
}
