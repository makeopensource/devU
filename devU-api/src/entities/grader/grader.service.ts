import submissionService from '../submission/submission.service'
import submissionScoreService from '../submissionScore/submissionScore.service'
import submissionProblemScoreService from '../submissionProblemScore/submissionProblemScore.service'
import nonContainerAutograderService from '../nonContainerAutoGrader/nonContainerAutoGrader.service'
import containerAutograderService from '../containerAutoGrader/containerAutoGrader.service'
import assignmentProblemService from '../assignmentProblem/assignmentProblem.service'

import { SubmissionScore, SubmissionProblemScore, ContainerAutoGrader } from 'devu-shared-modules'
import { checkAnswer } from '../nonContainerAutoGrader/nonContainerAutoGrader.grader'
import { serialize as serializeNonContainer } from '../nonContainerAutoGrader/nonContainerAutoGrader.serializer'
import { serialize as serializeContainer } from '../containerAutoGrader/containerAutoGrader.serializer'

export async function grade(id: number) {
    const submission = await submissionService.retrieve(id)
    if (!submission) return null

    const assignmentId = submission.assignmentId

    const content = JSON.parse(submission.content)
    const form = content.form
    const filepaths = content.filepaths //Using the field name that was written on the whiteboard for now

    const nonContainerAutograders = await nonContainerAutograderService.listByAssignmentId(assignmentId)
    const containerAutograders = await containerAutograderService.listByAssignmentId(assignmentId)
    const assignmentProblems = await assignmentProblemService.list(assignmentId)

    
    var score = 0
    var allScores = [] //This is the return value, the serializer parses it into a GraderInfo object for the controller to return

    //Run Non-Container Autograders
    for (const question in form) { 
        const nonContainerGrader = nonContainerAutograders.find(grader => grader.question === question)
        const assignmentProblem = assignmentProblems.find(problem => problem.problemName === question)
        
        if (nonContainerGrader && assignmentProblem) {
            const problemScore = await checkAnswer(form[question], serializeNonContainer(nonContainerGrader)) //Should also return feedback in the future
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

    //Run Container Autograders
    //Mock functionality, this is not finalized!!!!
    for (const filepath of filepaths) {
        const containerGrader = containerAutograders.find(grader => grader.autogradingImage === filepath) //PLACEHOLDER, I'm just using autogradingImage temporarily to associate graders to files

        if (containerGrader) {
            const gradeResults = await mockContainerCheckAnswer(filepath, serializeContainer(containerGrader))

            for (const result of gradeResults) {
                const problemScoreObj: SubmissionProblemScore = {
                    submissionId: id,
                    assignmentProblemId: 1, //PLACEHOLDER, an assignmentProblem must exist in the db for this to work
                    score: result.score,
                    feedback: result.feedback,
                }
                allScores.push(await submissionProblemScoreService.create(problemScoreObj))
                score += result.score
            }
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

//Temporary mock function, delete when the container autograder grading function is written
export async function mockContainerCheckAnswer(file: string, containerAutoGrader: ContainerAutoGrader) {
    let gradeResults = []

    //SubmissionProblemScore 1
    gradeResults.push({score: 5, feedback: "Grader #" + containerAutoGrader.id + " graded " + file + " problem 1 for 5/5 points"})

    //SubmissionProblemScore 2
    gradeResults.push({score: 5, feedback: "Grader #" + containerAutoGrader.id + " graded " + file + " problem 2 for 5/5 points"})

    //SubmissionProblemScore 3
    gradeResults.push({score: 10, feedback: "Grader #" + containerAutoGrader.id + " graded " + file + " problem 3 for 10/10 points"})
    
    return gradeResults
}

export default { grade }