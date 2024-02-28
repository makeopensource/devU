import { AssignmentProblem } from 'devu-shared-modules'

import AssignmentProblemModel from './assignmentProblem.model'

export function serialize(assignmentProblem: AssignmentProblemModel): AssignmentProblem {
  return {
    id: assignmentProblem.id,
    assignmentId: assignmentProblem.assignmentId,
    problemName: assignmentProblem.problemName,
    maxScore: assignmentProblem.maxScore,
    createdAt: assignmentProblem.createdAt.toISOString(),
    updatedAt: assignmentProblem.updatedAt.toISOString(),
  }
}
