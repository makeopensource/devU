import { CodeAssignment } from 'devu-shared-modules'

import CodeAssignmentModel from '../../model/codeAssignment.model'

export function serialize(codeAssignment: CodeAssignmentModel): CodeAssignment {
  return {
    id: codeAssignment.id,
    assignmentId: codeAssignment.assignmentId,
    grader: codeAssignment.grader,
    gradingImage: codeAssignment.gradingImage,
    createdAt: codeAssignment.createdAt.toISOString(),
    updatedAt: codeAssignment.updatedAt.toISOString(),
  }
}
