import submissionService from '../submission/submission.service'
import submissionScoreService from '../submissionScore/submissionScore.service'
import submissionProblemScoreService from '../submissionProblemScore/submissionProblemScore.service'
import nonContainerAutoGraderService from '../nonContainerAutoGrader/nonContainerAutoGrader.service'
import assignmentProblemService from '../assignmentProblem/assignmentProblem.service'

import { SubmissionScore, SubmissionProblemScore } from 'devu-shared-modules'
import { checkAnswer } from '../nonContainerAutoGrader/nonContainerAutoGrader.grader'

export async function grade(id: number) {
    const submission = await submissionService.retrieve(id)
    if (!submission) return null

    const assignmentId = submission.assignmentId

    const content = JSON.parse(submission.content)
    const form = content.form

    const nonContainerAutograders = await nonContainerAutoGraderService.listByAssignmentId(assignmentId)
    const assignmentProblems = await assignmentProblemService.list(assignmentId)

    
    var score = 0
    var allScores = new Array() //This is the return value, the serializer parses it into a GraderInfo object for the controller to return
    for (const question in form) {
        const grader = nonContainerAutograders.find(grader => grader.question === question)
        const assignmentProblem = assignmentProblems.find(problem => problem.problemName === question)
        
        if (grader && assignmentProblem) {
            const problemScore = (await checkAnswer(form[question], grader)) ?? 0
            score += problemScore

            const problemScoreObj: SubmissionProblemScore = {
                submissionId: id,
                assignmentProblemId: assignmentProblem.id,
                score: problemScore,
                feedback: '' //grader doesn't currently return feedback
            }
            allScores.push(await submissionProblemScoreService.create(problemScoreObj))
        }
    }
    const scoreObj: SubmissionScore = {
        submissionId: id,
        score: score,
        feedback: '' //graders currently don't return feedback, will be the concatination of SubmissionProblemScore feedbacks
    }
    allScores.push(await submissionScoreService.create(scoreObj))
    return allScores
}

export default { grade }