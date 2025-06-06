export enum ScoringType {
  HIGHEST_SCORE = 'highest-score',
  LATEST_SUBMISSION = 'latest-submission',
  NO_SCORE = 'no-score'
}

export type Assignment = {
  id?: number
  courseId: number
  name: string
  startDate: string
  dueDate: string
  endDate: string
  categoryName: string
  description: string | null
  maxFileSize: number
  maxSubmissions: number | null
  disableHandins: boolean
  createdAt?: string
  updatedAt?: string
  attachmentsHashes ?: string[]
  attachmentsFilenames ?: string[]
  scoringType?: ScoringType
}

