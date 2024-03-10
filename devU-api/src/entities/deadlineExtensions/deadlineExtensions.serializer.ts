import { DeadlineExtensions } from 'devu-shared-modules'

import deadlineExtensionModel from './deadlineExtensions.model'

export function serialize(deadlineExtension: deadlineExtensionModel): DeadlineExtensions {
  return {
    id: deadlineExtension.id,
    assignmentId: deadlineExtension.assignmentId,
    creatorId: deadlineExtension.creatorId,
    userId: deadlineExtension.userId,
    newStartDate: deadlineExtension.newStartDate?.toISOString(),
    newEndDate: deadlineExtension.newEndDate?.toISOString(),
    deadlineDate: deadlineExtension.deadlineDate.toISOString(),
    createdAt: deadlineExtension.createdAt.toISOString(),
    updatedAt: deadlineExtension.updatedAt.toISOString(),
  }
}
