export type ContainerAutoGrader = {
  id?: number
  assignmentId: number
  graderFilename?: string // filename
  makefileFilename: string | null // filename
  autogradingImage?: string 
  timeout: number
  createdAt?: string
  updatedAt?: string
  }