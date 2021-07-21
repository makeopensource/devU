export type Submission = {
  id?: number
  userId: number
  assignmentId: number
  courseId: number
  type: SubmissionType
  content: string
  submitterIp?: string

  // submitterId can be different from userId if a submission was created on behalf of the student (regrade)
  // originalSubmissionId is only used on regrades
  submittedBy?: number
  originalSubmissionId: number | null

  createdAt?: string
  updatedAt?: string
}

export type SubmissionTypeDetails = {
  label: string
  value: string
}

export const submissionTypeDetails: SubmissionTypeDetails[] = [
  { label: 'Filepath', value: 'filepath' },
  { label: 'JSON', value: 'json' },
  { label: 'text', value: 'text' },
]

export const submissionTypes = ['filepath', 'json', 'text'] as const
export type SubmissionType = typeof submissionTypes[number]
