export type ContainerAutoGrader = {
  id?: number
  assignmentId: number
  graderFilename?: string // filename
  makefileFilename?: string // filename
  autogradingImage?: string 
  timeout?: number
  createdAt?: string
  updatedAt?: string
  }