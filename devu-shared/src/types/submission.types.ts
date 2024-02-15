export type Submission = {
  id?: number
  userId: number
  assignmentId: number
  courseId: number
  type: SubmissionType
  filename?: string
  content: string
  submitterIp?: string

  submittedBy?: number
  createdAt?: string
  updatedAt?: string
  deletedAt?: string
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
