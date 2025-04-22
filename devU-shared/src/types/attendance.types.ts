export type AttendanceSession = {
  id: number,
  courseId: number,
  attendanceCode?: string,
  createdAt: string,
  expiresAt: string,
  timeLimitSeconds: number,
  maxTries: number,
}

export type AttendanceSubmission = {
  id: number,
  sessionId: number
  success: boolean
  submittedAt: string
  submission: string
}

/**
 * Data required for creating attendance session
 * */
export type AttendanceRequest = Omit<AttendanceSession, 'id' | 'createdAt' | 'expiresAt' | 'attendanceCode'>;

/**
 * Data sent when after creating an attendance session
 * */
export type AttendanceResponse = AttendanceSession;
