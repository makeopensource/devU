import submissionService from '../submission/submission.service'
import submissionScoreService from '../submissionScore/submissionScore.service'
import submissionProblemScoreService from '../submissionProblemScore/submissionProblemScore.service'
import nonContainerAutograderService from '../nonContainerAutoGrader/nonContainerAutoGrader.service'
import containerAutograderService from '../containerAutoGrader/containerAutoGrader.service'
import assignmentProblemService from '../assignmentProblem/assignmentProblem.service'
import assignmentScoreService from '../assignmentScore/assignmentScore.service'
import courseService from '../course/course.service'

import {
  AssignmentProblem,
  AssignmentScore,
  NonContainerAutoGrader,
  Submission,
  SubmissionProblemScore,
  SubmissionScore,
} from 'devu-shared-modules'
import { checkAnswer } from '../nonContainerAutoGrader/nonContainerAutoGrader.grader'
import { serialize as serializeNonContainer } from '../nonContainerAutoGrader/nonContainerAutoGrader.serializer'
import { serialize as serializeAssignmentScore } from '../assignmentScore/assignmentScore.serializer'
import { serialize as serializeSubmissionScore } from '../submissionScore/submissionScore.serializer'
import { serialize as serializeSubmission } from '../submission/submission.serializer'
import { serialize as serializeAssignmentProblem } from '../assignmentProblem/assignmentProblem.serializer'
import { downloadFile, initializeMinio } from '../../fileStorage'
import { createNewLab, sendSubmission, waitForJob } from '../../autograders/leviathan/leviathan.service'
import { DockerFile, LabData, LabFile, SubmissionFile } from 'leviathan-node-sdk'
import path from 'path'

async function grade(submissionId: number) {
  const submissionModel = await submissionService.retrieve(submissionId)
  if (!submissionModel) throw new Error('Submission not found.')
  const submission = serializeSubmission(submissionModel)

  const assignmentId = submission.assignmentId

  const content = JSON.parse(submission.content)
  const form = content.form
  const filepaths: string[] = content.filepaths

  const nonContainerAutograders = (await nonContainerAutograderService.listByAssignmentId(assignmentId)).map(model =>
    serializeNonContainer(model),
  )
  const assignmentProblems = (await assignmentProblemService.list(assignmentId)).map(model =>
    serializeAssignmentProblem(model),
  )

  let score = 0
  let feedback = ''

  //Run Non-Container Autograders
  const ncagResults = await runNonContainerAutograders(form, nonContainerAutograders, assignmentProblems, submissionId)
  score += ncagResults.score
  feedback += ncagResults.feedback

  //Run Container Autograders
  const jobId = await runCagLeviathan(filepaths, submission, assignmentId)

  //Grading is finished. Create SubmissionScore and AssignmentScore and save to db.
  const scoreObj: SubmissionScore = {
    submissionId: submissionId,
    score: score, //Sum of all SubmissionProblemScore scores
    feedback: feedback, //Concatination of SubmissionProblemScore feedbacks
  }
  await submissionScoreService.create(scoreObj)

  // todo dumb hack
  //  for now empty job id implies it is not a containerautograde,
  //  it also means something went wrong on auto grading which is why it is a dumb hack
  if (jobId === '') {
    await updateAssignmentScore(submission, score)
    return { message: `Noncontainer autograding completed successfully`, submissionScore: scoreObj }
  }
  return {
    message: `Autograder successfully added job ${jobId} to the queue`,
  }
}

async function runNonContainerAutograders(
  form: any,
  nonContainerAutograders: NonContainerAutoGrader[],
  assignmentProblems: AssignmentProblem[],
  submissionId: number,
) {
  let score = 0
  let feedback = ''

  for (const question in form) {
    const nonContainerGrader = nonContainerAutograders.find(grader => grader.question === question)
    const assignmentProblem = assignmentProblems.find(problem => problem.problemName === question)

    if (nonContainerGrader && assignmentProblem) {
      const [problemScore, problemFeedback] = checkAnswer(form[question], nonContainerGrader)
      score += problemScore
      feedback += `${problemFeedback}\n`

      const problemScoreObj: SubmissionProblemScore = {
        submissionId: submissionId,
        assignmentProblemId: assignmentProblem.id ?? 0, //This should never be undefined, not sure why our types have id set as optional
        score: problemScore,
        feedback: problemFeedback,
      }
      await submissionProblemScoreService.create(problemScoreObj)
    }
  }
  return { score, feedback }
}

export async function runCagLeviathan(filepaths: string[], submission: Submission, assignmentId: number) {
  try {
    const { dockerfile, jobFiles, containerAutoGrader: graderinfo } =
      await containerAutograderService.loadGrader(assignmentId)

    const bucketName = await courseService.retrieve(submission.courseId).then(course => {
      return course ? (course.number + course.semester + course.id).toLowerCase() : 'submission'
    })
    await initializeMinio(bucketName)

    const labName = `${bucketName}-${submission.assignmentId}`

    const labinfo = <LabData>{
      entryCmd: graderinfo.entryCmd ?? '',
      limits: {
        PidLimit: graderinfo.pidLimit,
        CPUCores: graderinfo.cpuCores,
        memoryInMb: graderinfo.memoryLimitMB,
      },
      labname: labName,
      autolabCompatibilityMode: graderinfo.autolabCompatible,
      jobTimeoutInSeconds: BigInt(graderinfo.timeoutInSeconds),
    }

    const labId = await createNewLab(labinfo,
      <DockerFile>{
        fieldName: 'dockerfile',
        filedata: dockerfile.blob,
        filename: dockerfile.filename,
      },
      jobFiles.map(value => <LabFile>{
        fieldName: 'labFiles',
        filename: value.filename,
        filedata: value.blob,
      }),
    )

    const submissionFiles = new Array<SubmissionFile>

    for (const filepath of filepaths) {
      const filename = path.basename(filepath)
      const buffer = await downloadFile(bucketName, filename)
      const blob = new Blob([buffer], { type: 'text/plain' })
      submissionFiles.push(<SubmissionFile>{
        fieldName: 'submissionFiles',
        filename: filename,
        filedata: blob,
      })
    }

    const jobid = await sendSubmission(labId, submissionFiles)

    // process asynchronously
    leviathanCallback(jobid, assignmentId, submission.id!).then(value => {
      console.log('callback complete')
      console.log(value)
    }).catch(err => console.error(err))

    return jobid
  } catch (e) {
    console.error(e)
    return ''
  }
}

export async function leviathanCallback(jobId: string, assignmentId: number, submissionId: number) {
  let submissionScore

  try {
    const { jobInfo, logs } = await waitForJob(jobId)
    console.log(jobInfo)

    if (!(jobInfo.status === 'complete')) {
      throw Error(`Job ${jobId} failed to complete: reason: ${jobInfo.statusMessage}`)
    }

    const scores = JSON.parse(jobInfo.statusMessage)

    let score = 0
    const assignmentProblems = await assignmentProblemService.list(assignmentId)
    const submissionScoreModel = await submissionScoreService.retrieve(submissionId)
    const submissionModel = await submissionService.retrieve(submissionId)
    if (!submissionModel) throw 'Submission not found.'
    const submission = serializeSubmission(submissionModel)

    for (const question in scores) {
      const assignmentProblem = assignmentProblems.find(problem => problem.problemName === question)
      if (assignmentProblem) {
        const problemScoreObj: SubmissionProblemScore = {
          submissionId: submissionId,
          assignmentProblemId: assignmentProblem.id,
          score: Number(scores[question]),
          feedback: `Autograder graded ${assignmentProblem.problemName} for ${Number(scores[question])} points`,
        }
        await submissionProblemScoreService.create(problemScoreObj)
        score += Number(scores[question])
      }
    }
    if (submissionScoreModel) {
      //If noncontainer grading has occured
      submissionScore = serializeSubmissionScore(submissionScoreModel)
      submissionScore.score = (submissionScore.score ?? 0) + score
      score = submissionScore.score
      submissionScore.feedback += `\n${logs}`

      await submissionScoreService.update(submissionScore)
    } else {
      //If submission is exclusively container graded
      submissionScore = {
        submissionId: submissionId,
        score: score, //Sum of all SubmissionProblemScore scores
        feedback: logs,
      }
      await submissionScoreService.create(submissionScore)
    }
    await updateAssignmentScore(submission, score)

    return { submissionScore: submissionScore, outputFile: logs }
  } catch (e: any) {
    await callbackFailure(assignmentId, submissionId, e)
    throw new Error(e)
  }
}

export async function callbackFailure(assignmentId: number, submissionId: number, file: string) {
  let submissionScore
  const assignmentProblems = await assignmentProblemService.list(assignmentId)
  const submissionScoreModel = await submissionScoreService.retrieve(submissionId)
  const submissionProblemScoreModels = await submissionProblemScoreService.list(submissionId)

  for (const assignmentProblem of assignmentProblems) {
    const submissionProblemScore = submissionProblemScoreModels.find(
      sps => sps.assignmentProblemId === assignmentProblem.id,
    )
    if (!submissionProblemScore) {
      //If assignmentProblem hasn't already been graded by noncontainer autograder
      const problemScoreObj: SubmissionProblemScore = {
        submissionId: submissionId,
        assignmentProblemId: assignmentProblem.id,
        score: 0,
        feedback: 'Autograding failed to complete.',
      }
      await submissionProblemScoreService.create(problemScoreObj)
    }
  }
  if (submissionScoreModel) {
    //If noncontainer grading has occured
    submissionScore = serializeSubmissionScore(submissionScoreModel)
    submissionScore.score = submissionScore.score ?? 0
    submissionScore.feedback += `\n${file}`

    submissionScoreService.update(submissionScore)
  } else {
    //If submission is exclusively container graded
    submissionScore = {
      submissionId: submissionId,
      score: 0,
      feedback: file,
    }
    submissionScoreService.create(submissionScore)
  }
}

//Currently just sets assignmentscore to the latest submission. Pulled this function out for easy future modification.
async function updateAssignmentScore(submission: Submission, score: number) {
  const assignmentScoreModel = await assignmentScoreService.retrieveByUser(submission.assignmentId, submission.userId)
  if (assignmentScoreModel) {
    //If assignmentScore already exists, update existing entity
    const assignmentScore = serializeAssignmentScore(assignmentScoreModel)
    assignmentScore.score = score
    assignmentScoreService.update(assignmentScore)
  } else {
    //Otherwise create a new one
    const assignmentScore: AssignmentScore = {
      assignmentId: submission.assignmentId,
      userId: submission.userId,
      score: score,
    }
    assignmentScoreService.create(assignmentScore)
  }
}

// async function runContainerAutograders(filepaths: string[], submission: Submission, assignmentId: number) {
//   let containerGrading = true
//   let jobResponse = null
//
//   const { graderData, makefileData, autogradingImage, timeout } =
//     await containerAutograderService.loadGrader(assignmentId)
//   if (!graderData || !makefileData || !autogradingImage || !timeout) {
//     containerGrading = false
//   } else {
//     try {
//       const bucketName = await courseService.retrieve(submission.courseId).then(course => {
//         return course ? (course.number + course.semester + course.id).toLowerCase() : 'submission'
//       })
//       await initializeMinio(bucketName)
//
//       const labName = `${bucketName}-${submission.assignmentId}`
//       const optionFiles = []
//       const openResponse = await createCourse(labName)
//       if (openResponse) {
//         await uploadFile(labName, graderData, 'Graderfile')
//         await uploadFile(labName, makefileData, 'Makefile')
//
//         for (const filepath of filepaths) {
//           const buffer = await downloadFile(bucketName, filepath)
//           if (await uploadFile(labName, buffer, filepath)) {
//             optionFiles.push({ localFile: filepath, destFile: filepath })
//           }
//         }
//         const jobOptions = {
//           image: autogradingImage,
//           files: [
//             { localFile: 'Graderfile', destFile: 'autograde.tar' },
//             { localFile: 'Makefile', destFile: 'Makefile' },
//           ].concat(optionFiles),
//           jobName: `${labName}-${submission.id}`,
//           output_file: `${labName}-${submission.id}-output.txt`,
//           timeout: timeout,
//           callback_url: `http://api:3001/course/${submission.courseId}/grade/callback/${labName}-${submission.id}-output.txt`,
//         }
//         jobResponse = await addJob(labName, jobOptions)
//       }
//     } catch (e: any) {
//       throw new Error(e)
//     }
//   }
//   return { containerGrading, jobResponse }
// }

export default { grade }
