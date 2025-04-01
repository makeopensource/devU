import { ContainerAutoGrader } from 'devu-shared-modules'

import ContainerAutoGraderModel from './containerAutoGrader.model'

export function serialize(containerAutoGrader: ContainerAutoGraderModel): ContainerAutoGrader {
  return {
    id: containerAutoGrader.id,
    assignmentId: containerAutoGrader.assignmentId,
    createdAt: containerAutoGrader.createdAt.toISOString(),
    updatedAt: containerAutoGrader.updatedAt.toISOString(),
    cpuCores: containerAutoGrader.cpuCores,
    memoryLimitMB: containerAutoGrader.memoryLimitMB,
    pidLimit: containerAutoGrader.pidLimit,
    timeout: containerAutoGrader.timeoutInSeconds,
    dockerfileId: containerAutoGrader.dockerfileId,
    graderFileIds: containerAutoGrader.jobFileIds,
    entryCommand: containerAutoGrader.entryCmd ?? '',
    autolabCompatible: containerAutoGrader.autolabCompatible,
  }
}
