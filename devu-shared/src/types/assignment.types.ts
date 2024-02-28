export type Assignment = {
  id?: number
  courseId: number
  name: string
  startDate: string
  dueDate: string
  endDate: string
  gradingType?: GradingType
  categoryName: string
  description: string | null
  maxFileSize: number
  maxSubmissions: number | null
  disableHandins: boolean
  createdAt?: string
  updatedAt?: string
}

