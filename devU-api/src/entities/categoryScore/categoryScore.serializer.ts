import { CategoryScore } from 'devu-shared-modules'
import CategoryScoreModel from './categoryScore.model'

export function serialize(categoryScore: CategoryScoreModel): CategoryScore {
  return {
    id: categoryScore.id,
    createdAt: categoryScore.createdAt.toISOString(),
    updatedAt: categoryScore.updatedAt.toISOString(),
    courseId: categoryScore.courseId,
    gradingType: categoryScore.categoryScoringType,
    category: categoryScore.category,
  }
}
