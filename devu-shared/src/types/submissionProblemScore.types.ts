export type SubmissionProblemScore = {
  id?: number
  submissionId: number
  assignmentProblemId: number
  score: number
  feedback: string
  releasedAt?: string
  createdAt?: string
  updatedAt?: string
}