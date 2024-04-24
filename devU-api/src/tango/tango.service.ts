import './tango.types'

const tangoHost = `http://${process.env.TANGO_KEY ?? 'localhost:3000'}`
const tangoKey = process.env.TANGO_KEY ?? 'test'

// for more info https://docs.autolabproject.com/tango-rest/

/**
 * Opens a directory for a given course and lab.
 * @param courselab - The combination of the course name and the lab name.
 */
export async function openDirectory(courselab: string): Promise<OpenResponse | null> {
  const url = `${tangoHost}/open/${tangoKey}/${courselab}/`
  const response = await fetch(url, { method: 'GET' })
  return response.ok ? await response.json() : null
}

/**
 * Uploads a file to the server for a given course and lab.
 * @param courselab - The combination of the course name and the lab name.
 * @param fileName - The file name, used to identify the file when uploaded
 * @param file - The file to be uploaded.
 */
export async function uploadFile(courselab: string, file: File, fileName: string): Promise<UploadResponse | null> {
  const url = `${tangoHost}/upload/${tangoKey}/${courselab}/`
  const formData = new FormData()
  formData.append('file', file)
  const response = await fetch(url, { method: 'POST', body: formData, headers: { filename: fileName } })
  return response.ok ? await response.json() : null
}

/**
 * Adds a job to the server for a given course and lab.
 * @param courselab - The combination of the course name and the lab name.
 * @param job - The job request object.
 */
export async function addJob(courselab: string, job: AddJobRequest): Promise<AddJobResponse | null> {
  const url = `${tangoHost}/addJob/${tangoKey}/${courselab}/`
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(job),
  })
  return response.ok ? await response.json() : null
}

/**
 * Polls the server for the status of a job.
 * @param courselab - The combination of the course name and the lab name.
 * @param outputFile - The name of the output file.
 */
export async function pollJob(
  courselab: string,
  outputFile: string
): Promise<PollSuccessResponse | PollFailureResponse> {
  const url = `${tangoHost}/poll/${tangoKey}/${courselab}/${outputFile}/`
  const response = await fetch(url, { method: 'GET' })
  const data = await response.json()
  return response.ok ? (data as PollSuccessResponse) : (data as PollFailureResponse)
}

/**
 * Retrieves information about the Tango service.
 */
export async function getInfo(): Promise<InfoResponse | null> {
  const url = `${tangoHost}/info/${tangoKey}/`
  const response = await fetch(url, { method: 'GET' })
  return response.ok ? await response.json() : null
}

/**
 * Retrieves information about the pool of instances for a given image.
 * @param image - The name of the image.
 */
export async function getPoolInfo(image: string): Promise<Object | null> {
  const url = `${tangoHost}/pool/${tangoKey}/${image}/`
  const response = await fetch(url, { method: 'GET' })
  return response.ok ? await response.json() : null
}

/**
 * Pre-allocates a pool of instances for a given image.
 * @param image - The name of the image.
 * @param num - The number of instances to pre-allocate.
 * @param request - The request object.
 */
export async function preallocateInstances(
  image: string,
  num: number,
  request: PreallocRequest
): Promise<PreallocResponse | null> {
  const url = `${tangoHost}/prealloc/${tangoKey}/${image}/${num}/`
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  })
  return response.ok ? await response.json() : null
}

/**
 * Retrieves information about jobs.
 * @param deadjobs - A flag to indicate whether to retrieve dead jobs (1) or running jobs (0).
 * @returns Empty response on successful request
 */
export async function getJobs(deadjobs: number): Promise<{} | null> {
  const url = `${tangoHost}/jobs/${tangoKey}/${deadjobs}/`
  const response = await fetch(url, { method: 'POST' })
  return response.ok ? {} : null
}
