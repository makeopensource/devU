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

export type GradingTypeDetail = {
  label: string
  value: string
}

export const gradingTypeDetails: GradingTypeDetail[] = [
  { label: 'Autograded - Code', value: 'code' },
  { label: 'Autograded - Not Code', value: 'non-code' },
  { label: 'Manually Graded', value: 'manual' },
]

export const gradingTypes = ['code', 'non-code', 'manual'] as const
export type GradingType = typeof gradingTypes[number]
