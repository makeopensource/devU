import { CategoryScore } from 'devu-shared-modules'

import CategoryScoreModel from './categoryScore.model'

export function serialize(categoryScore: CategoryScoreModel): CategoryScore {
    return {
        id: categoryScore.id,
        courseId: categoryScore.courseId,
        category: categoryScore.category,
        score: categoryScore.score,
        letterGrade: categoryScore.letterGrade,
    }
}