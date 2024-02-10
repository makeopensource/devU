import NonContainerAutoGraderModel from './nonContainerAutoGrader.model'
import { nonContainerAutoGrader } from '../../../devu-shared/devu-shared-modules'

export function serialize(nonContainerAutoGrader: NonContainerAutoGraderModel): nonContainerAutoGrader {
  return {
    id: nonContainerAutoGrader.id,
    assignmentId: nonContainerAutoGrader.assignmentId,
    question:nonContainerAutoGrader.question,
    score:nonContainerAutoGrader.score,
    correctString: nonContainerAutoGrader.correctString,
    createdAt: nonContainerAutoGrader.createdAt.toISOString(),
    updatedAt: nonContainerAutoGrader.updatedAt.toISOString(),
  }
}
