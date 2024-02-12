import NonContainerAutoGraderModel from './nonContainerAutoGrader.model'

import { NonContainerAutoGrader } from '../../../devu-shared/src'

export function serialize(nonContainerAutoGrader: NonContainerAutoGraderModel): NonContainerAutoGrader {
  return {
    id: nonContainerAutoGrader.id,
    assignmentId: nonContainerAutoGrader.assignmentId,
    question: nonContainerAutoGrader.question,
    score: nonContainerAutoGrader.score,
    correctString: nonContainerAutoGrader.correctString,
    createdAt: nonContainerAutoGrader.createdAt.toISOString(),
    updatedAt: nonContainerAutoGrader.updatedAt.toISOString(),
  }
}
