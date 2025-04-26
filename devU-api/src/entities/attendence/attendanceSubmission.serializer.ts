import AttendanceSubmissionModel from './attendanceSubmission.model'
import { AttendanceSubmission } from 'devu-shared-modules'

export function serialize(session: AttendanceSubmissionModel): AttendanceSubmission {
  return {
    id: session.id,
    sessionId: session.attendanceSessionId,
    success: session.isSuccessful,
    submittedAt: session.submittedAt.toISOString(),
    submission: session.submission,
  }
}
