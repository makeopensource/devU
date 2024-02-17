import { CourseScore } from 'devu-shared-modules'

import CourseScoreModel from './courseScore.model'

export function serialize(courseScore: CourseScoreModel): CourseScore {
    return {
        id: courseScore.id,
        courseId: courseScore.courseId,
        score: courseScore.score,
        letterGrade: courseScore.letterGrade,
    }
}
