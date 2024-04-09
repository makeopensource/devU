import submissionService from '../submission/submission.service'
import submissionScoreService from '../submissionScore/submissionScore.service'
import submissionProblemScoreService from '../submissionProblemScore/submissionProblemScore.service'
import nonContainerAutograderService from '../nonContainerAutoGrader/nonContainerAutoGrader.service'
import containerAutograderService from '../containerAutoGrader/containerAutoGrader.service'
import assignmentProblemService from '../assignmentProblem/assignmentProblem.service'
import assignmentScoreService from '../assignmentScore/assignmentScore.service'

import { SubmissionScore, SubmissionProblemScore, ContainerAutoGrader, AssignmentScore } from 'devu-shared-modules'
import { checkAnswer } from '../nonContainerAutoGrader/nonContainerAutoGrader.grader'
import { serialize as serializeNonContainer } from '../nonContainerAutoGrader/nonContainerAutoGrader.serializer'
import { serialize as serializeContainer } from '../containerAutoGrader/containerAutoGrader.serializer'
import { serialize as serializeAssignmentScore } from '../assignmentScore/assignmentScore.serializer'

export async function grade(submissionId: number) {
    const submission = await submissionService.retrieve(submissionId)
    if (!submission) return null

    const assignmentId = submission.assignmentId

    const content = JSON.parse(submission.content)
    const form = content.form
    const filepaths = content.filepaths //Using the field name that was written on the whiteboard for now

    const nonContainerAutograders = await nonContainerAutograderService.listByAssignmentId(assignmentId)
    const containerAutograders = await containerAutograderService.listByAssignmentId(assignmentId)
    const assignmentProblems = await assignmentProblemService.list(assignmentId)

    
    let score = 0
    let feedback = ''
    let allScores = [] //This is the return value, the serializer parses it into a GraderInfo object for the controller to return

    //Run Non-Container Autograders
    for (const question in form) { 
        const nonContainerGrader = nonContainerAutograders.find(grader => grader.question === question)
        const assignmentProblem = assignmentProblems.find(problem => problem.problemName === question)

        if (nonContainerGrader && assignmentProblem) {
            const [problemScore, problemFeedback] = checkAnswer(form[question], serializeNonContainer(nonContainerGrader)) 
            score += problemScore
            feedback += problemFeedback + '\n'

            const problemScoreObj: SubmissionProblemScore = {
                submissionId: submissionId,
                assignmentProblemId: assignmentProblem.id,
                score: problemScore,
                feedback: problemFeedback 
            }
            allScores.push(await submissionProblemScoreService.create(problemScoreObj))
        }
    }

    //Run Container Autograders
    //Mock functionality, this is not finalized!!!!
    if (filepaths){
        for (const filepath of filepaths) {
            const containerGrader = containerAutograders.find(grader => grader.autogradingImage === filepath) //PLACEHOLDER, I'm just using autogradingImage temporarily to associate graders to files

            if (containerGrader) {
                const gradeResults = await mockContainerCheckAnswer(filepath, serializeContainer(containerGrader))

                for (const result of gradeResults) {
                    const problemScoreObj: SubmissionProblemScore = {
                        submissionId: submissionId,
                        assignmentProblemId: 1, //PLACEHOLDER, an assignmentProblem must exist in the db for this to work
                        score: result.score,
                        feedback: result.feedback,
                    }
                    allScores.push(await submissionProblemScoreService.create(problemScoreObj))
                    score += result.score
                    feedback += result.feedback + '\n'
                }
            }
        }
    }

    //Grading is finished. Create SubmissionScore and AssignmentScore and save to db.
    const scoreObj: SubmissionScore = {
        submissionId: submissionId,
        score: score,       //Sum of all SubmissionProblemScore scores
        feedback: feedback  //Concatination of SubmissionProblemScore feedbacks
    }
    allScores.push(await submissionScoreService.create(scoreObj))

    //PLACEHOLDER AssignmentScore logic. This should be customizable, but for now AssignmentScore will simply equal the latest SubmissionScore
    const assignmentScoreModel = await assignmentScoreService.retrieveByUser(submission.assignmentId, submission.userId)
    if (assignmentScoreModel) { //If assignmentScore already exists, update existing entity
        const assignmentScore = serializeAssignmentScore(assignmentScoreModel)
        assignmentScore.score = score
        await assignmentScoreService.update(assignmentScore)
        
    } else { //Otherwise make a new one
        const assignmentScore: AssignmentScore = {
            assignmentId: submission.assignmentId,
            userId: submission.userId,
            score: score,
        }
        await assignmentScoreService.create(assignmentScore)
    }

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