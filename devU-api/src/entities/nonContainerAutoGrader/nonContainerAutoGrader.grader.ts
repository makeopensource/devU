import { NonContainerAutoGrader } from 'devu-shared-modules'

export async function checkAnswer(studentAnswer: string, nonContainerAutoGrader: NonContainerAutoGrader) {
  if (studentAnswer === nonContainerAutoGrader.correctString) {
    return nonContainerAutoGrader.score
  }
  return 0
}