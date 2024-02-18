export type Submission = {
  id?: number
  userId: number
  assignmentId: number
  courseId: number
  filenames: string[]
  submitterIp?: string

  submittedBy?: number
  createdAt?: string
  updatedAt?: string
  deletedAt?: string
}


