import { NonContainerAutoGrader } from 'devu-shared-modules'
import NonContainerAutoGraderModel from './nonContainerAutoGrader.model'

export async function checkAnswer(studentAnswer: string, nonContainerAutoGrader: NonContainerAutoGrader | NonContainerAutoGraderModel) {
  if (studentAnswer === nonContainerAutoGrader.correctString) {
    return nonContainerAutoGrader.score
  }
  return null
}