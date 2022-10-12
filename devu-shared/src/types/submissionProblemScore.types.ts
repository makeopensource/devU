export type SubmissionProblemScore = {
  id?: number
  submissionId: number
  assignmentProblemId: number
  score: number
  feedback: string
  release?: string
  createdAt?: string
  updatedAt?: string
}