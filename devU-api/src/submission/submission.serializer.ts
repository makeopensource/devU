import { Submission } from 'devu-shared-modules'

import SubmissionModel from '../../model/submission.model'

export function serialize(submission: SubmissionModel): Submission {
  return {
    id: submission.id,
    courseId: submission.courseId,
    assignmentId: submission.assignmentId,
    userId: submission.userId,
    type: submission.type,
    content: submission.content,
    submitterIp: submission.submitterIp,
    submittedBy: submission.submittedBy,
    originalSubmissionId: submission.originalSubmissionId,
    createdAt: submission.createdAt.toISOString(),
    updatedAt: submission.updatedAt.toISOString(),
  }
}
