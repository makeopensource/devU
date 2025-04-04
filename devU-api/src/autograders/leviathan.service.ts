import {
  CancelJobRequest,
  createClient,
  createConnectTransport,
  DockerFile,
  JobLogRequest,
  JobService,
  LabData,
  LabFile,
  LabService,
  NewJobRequest,
  NewLabRequest,
  SubmissionFile,
  UploadLabFiles,
  UploadSubmissionFiles,
} from 'leviathan-node-sdk'


const leviUrl = process.env.LEVIATHAN_URL || 'http://localhost:9221'
console.log(`Leviathan url set to ${leviUrl}`)

const transport = createConnectTransport({
  baseUrl: leviUrl,
  httpVersion: '2',
})

const jobService = createClient(JobService, transport)
const labService = createClient(LabService, transport)

export function bufferToBlob(multerFile: Express.Multer.File): Blob {
  return new Blob([multerFile.buffer], { type: multerFile.mimetype })
}

export async function sendSubmission(labId: bigint, submission: Array<SubmissionFile>) {
  const fileId = await UploadSubmissionFiles(leviUrl, submission)
  const resp = await jobService.newJob(<NewJobRequest>{
    tmpSubmissionFolderId: fileId,
    labID: labId,
  })

  return resp.jobId
}


export async function createNewLab(lab: LabData, dockerfile: DockerFile, labFiles: Array<LabFile>) {
  const fileId = await UploadLabFiles(leviUrl, dockerfile, labFiles)
  const resp = await labService.newLab(<NewLabRequest>{
    labData: lab,
    tmpFolderId: fileId,
  })

  return resp.labId
}

/**
 * streams job status,
 * the stream will exit on its own once the job is done, can be cancelled by calling controller.abort()
 * @returns a stream and a controller can be used to cancel the stream
 * @see waitForJob - for usage example
 */
export function streamJob(jobId: string) {
  const controller = new AbortController()
  const dataStream = jobService.streamStatus(
    <JobLogRequest>{ jobId },
    { signal: controller.signal },
  )

  return { dataStream, controller }
}


/**
 * gets current job status with logs
 */
export async function getStatus(jobId: string) {
  const resp = await jobService.getStatus(<JobLogRequest>{ jobId })
  // strip out grpc metadata
  const { $unknown, $typeName, ...info } = resp.jobInfo!
  const logs = resp.logs
  return { info, logs }
}

/**
 * Blocks until job is complete
 * @see streamJob - is used under the hood
 */
export async function waitForJob(jobId: string) {
  const { dataStream } = streamJob(jobId)

  let jobInfo: { jobId: string; status: string; statusMessage: string } = {
    jobId: '',
    status: '',
    statusMessage: '',
  }
  let logs: string = ''

  for await (const chunk of dataStream) {
    if (!chunk.jobInfo) {
      console.warn('Empty job state')
      continue
    }

    const { $unknown, $typeName, ...rest } = chunk.jobInfo!
    console.debug('Job', rest)

    jobInfo = rest
    logs = chunk.logs
  }

  return { jobInfo, logs }
}

export async function cancelJob(jobId: string) {
  await jobService.cancelJob(<CancelJobRequest>{ jobId })
}
