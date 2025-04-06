import NonContainerAutoGraderModel from './nonContainerAutoGrader.model'

import { NonContainerAutoGrader } from 'devu-shared-modules'

export function serialize(nonContainerAutoGrader: NonContainerAutoGraderModel): NonContainerAutoGrader {
  return {
    id: nonContainerAutoGrader.id,
    assignmentId: nonContainerAutoGrader.assignmentId,
    question: nonContainerAutoGrader.question,
    score: nonContainerAutoGrader.score,
    isRegex: nonContainerAutoGrader.isRegex,
    correctString: nonContainerAutoGrader.correctString,
    createdAt: nonContainerAutoGrader.createdAt.toISOString(),
    updatedAt: nonContainerAutoGrader.updatedAt.toISOString(),
  }
}
