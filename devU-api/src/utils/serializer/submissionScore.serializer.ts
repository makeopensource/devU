import { SubmissionScore } from 'devu-shared-modules'

import SubmissionScoreModel from '../../model/submissionScore.model'

export function serialize(submissionScore: SubmissionScoreModel): SubmissionScore {
  return {
    id: submissionScore.id,
    submissionId: submissionScore.submissionId,
    score: submissionScore.score,
    feedback: submissionScore.feedback,
    releasedAt: submissionScore.releasedAt?.toISOString(),
    createdAt: submissionScore.createdAt.toISOString(),
    updatedAt: submissionScore.updatedAt.toISOString(),
  }
}
