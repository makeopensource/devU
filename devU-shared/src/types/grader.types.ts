import { SubmissionProblemScore } from './submissionProblemScore.types'
import { SubmissionScore } from './submissionScore.types'


export type GraderInfo = {
  submissionScore: SubmissionScore
  submissionProblemScores: SubmissionProblemScore[]
}
