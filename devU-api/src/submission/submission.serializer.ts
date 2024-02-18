import { Submission } from 'devu-shared-modules'

import SubmissionModel from './submission.model'

export function serialize(submission: SubmissionModel): Submission {
  return {
    id: submission.id,
    courseId: submission.courseId,
    assignmentId: submission.assignmentId,
    userId: submission.userId,
    filename: submission.filenames,
    submitterIp: submission.submitterIp,
    submittedBy: submission.submittedBy,
    createdAt: submission.createdAt.toISOString(),
    updatedAt: submission.updatedAt.toISOString(),
  }
}
