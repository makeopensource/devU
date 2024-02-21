import { NonContainerAutoGrader } from 'devu-shared-modules'

export async function checkAnswer(studentAnswer: string, nonContainerAutoGrader: NonContainerAutoGrader) {

  if (nonContainerAutoGrader.isRegex) {
    // Create a regex pattern
    const pattern: RegExp = new RegExp(nonContainerAutoGrader.correctString)
    // Use the test method
    const isMatch: boolean = pattern.test(studentAnswer)
    if (isMatch) {
      return nonContainerAutoGrader.score
    }
  } else {
    // if no regex is set use normal string matching
    if (studentAnswer === nonContainerAutoGrader.correctString) {
      return nonContainerAutoGrader.score
    }
  }

  // default value to return if all conditions fail to execute
  // i.e. student has the incorrect answer or improperly formatted
  return 0
}