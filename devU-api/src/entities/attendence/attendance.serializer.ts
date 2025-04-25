import { AttendanceResponse } from 'devu-shared-modules'
import AttendanceSessionModel from './attendance.model'

export function serialize(session: AttendanceSessionModel): AttendanceResponse {
  return {
    id: session.id,
    createdAt: session.createdAt.toISOString(),
    expiresAt: session.updatedAt.toISOString(),
    attendanceCode: session.attendanceCode,
    maxTries: session.maxTries,
    timeLimitSeconds: session.timeLimitSeconds,
    courseId: session.courseId,
  }
}
