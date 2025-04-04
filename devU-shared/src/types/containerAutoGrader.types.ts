export type ContainerAutoGrader = {
  id?: number
  assignmentId: number
  timeout: number
  cpuCores: number
  pidLimit: number
  memoryLimitMB: number
  entryCommand: string
  dockerfileId: string
  graderFileIds: string[]
  createdAt?: string
  updatedAt?: string
  autolabCompatible: boolean
}