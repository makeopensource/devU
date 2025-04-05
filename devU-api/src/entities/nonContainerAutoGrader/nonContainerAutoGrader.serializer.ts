import NonContainerAutoGraderModel from './nonContainerAutoGrader.model'

import { NonContainerAutoGrader } from 'devu-shared-modules'

export function serialize(nonContainerAutoGrader: NonContainerAutoGraderModel): NonContainerAutoGrader {
  return {
    id: nonContainerAutoGrader.id,
    assignmentId: nonContainerAutoGrader.assignmentId,
    question: nonContainerAutoGrader.question,
    score: nonContainerAutoGrader.score,
    metadata: JSON.stringify(nonContainerAutoGrader.metadata ?? ''),
    correctString: nonContainerAutoGrader.correctString,
    isRegex: nonContainerAutoGrader.isRegex,
    createdAt: nonContainerAutoGrader.createdAt.toISOString(),
    updatedAt: nonContainerAutoGrader.updatedAt.toISOString(),
  }
}
