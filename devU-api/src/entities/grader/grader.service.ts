import submissionService from '../submission/submission.service'
import submissionScoreService from '../submissionScore/submissionScore.service'
import submissionProblemScoreService from '../submissionProblemScore/submissionProblemScore.service'
import nonContainerAutograderService from '../nonContainerAutoGrader/nonContainerAutoGrader.service'
import containerAutograderService from '../containerAutoGrader/containerAutoGrader.service'
import assignmentProblemService from '../assignmentProblem/assignmentProblem.service'
import assignmentScoreService from '../assignmentScore/assignmentScore.service'
import courseService from '../course/course.service'
import { addJob, openDirectory, uploadFile } from '../../tango/tango.service'

import { SubmissionScore, SubmissionProblemScore, ContainerAutoGrader, AssignmentScore } from 'devu-shared-modules'
import { checkAnswer } from '../nonContainerAutoGrader/nonContainerAutoGrader.grader'
import { serialize as serializeNonContainer } from '../nonContainerAutoGrader/nonContainerAutoGrader.serializer'
import { serialize as serializeAssignmentScore } from '../assignmentScore/assignmentScore.serializer'
import { downloadFile } from '../../fileStorage'

import crypto from 'crypto'

export async function grade(submissionId: number) {
    const submission = await submissionService.retrieve(submissionId)
    if (!submission) return null

    const assignmentId = submission.assignmentId

    const content = JSON.parse(submission.content)
    const form = content.form
    const filepaths: string[] = content.filepaths //Using the field name that was written on the whiteboard for now

    const nonContainerAutograders = await nonContainerAutograderService.listByAssignmentId(assignmentId)
    //const containerAutograders = await containerAutograderService.listByAssignmentId(assignmentId)
    const assignmentProblems = await assignmentProblemService.list(assignmentId)

    
    var score = 0
    var feedback = ''
    var allScores = [] //This is the return value, the serializer parses it into a GraderInfo object for the controller to return

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
    try {
        const {graderData, makefileData, autogradingImage, timeout} = await containerAutograderService.getGraderByAssignmentId(assignmentId)
        const bucketName = await courseService.retrieve(submission.courseId).then((course) => {
            return course ? ((course.name).toLowerCase().replace(/ /g, '-') + course.number + course.semester + course.id).toLowerCase() : 'submission'
        })

        const labName = bucketName + '-' + submission.assignmentId
        const optionFiles = []
        const openResponse = await openDirectory(labName)
        var response = null
        if (openResponse) {
            if (!(openResponse.files["Graderfile"]) || openResponse.files["Graderfile"] !== crypto.createHash('md5').update(graderData).digest('hex')) {
                const graderFile = new File([new Blob([graderData])], "Graderfile")
                await uploadFile(labName, graderFile, "Graderfile")
            }
            if (!(openResponse.files["Makefile"]) || openResponse.files["Makefile"] !== crypto.createHash('md5').update(makefileData).digest('hex')) {
                const makefile = new File([new Blob([makefileData])], "Makefile")
                await uploadFile(labName, makefile, "Makefile")
            }
            for (const filepath of filepaths){
                const buffer = await downloadFile(bucketName, filepath)
                const file = new File([new Blob([buffer])], filepath)
                if (await uploadFile(labName, file, filepath)) {
                    optionFiles.push({localFile: filepath, destFile: filepath})
                }
            }

            const jobOptions = {
                image: autogradingImage,
                files: [{localFile: "Graderfile", destFile: "Graderfile"}, 
                        {localFile: "Makefile", destFile: "Makefile"},]
                        .concat(optionFiles),
                jobName: labName,
                output_file: labName,
                timeout: timeout,
                callback_url: ""
            }
            response = await addJob(labName, jobOptions)
        }
    } catch (e) {
        console.log(e)
    }
    //remember, immediate callback is made when job has been added to queue, not sure how we're handling the rest of it yet though lmao

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
        assignmentScoreService.update(assignmentScore)

    } else { //Otherwise make a new one
        const assignmentScore: AssignmentScore = {
            assignmentId: submission.assignmentId,
            userId: submission.userId,
            score: score,
        }
        assignmentScoreService.create(assignmentScore)
    }

    return response
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