import './tango.types'

const tangoHost = `http://${(process.env.TANGO_KEY ?? 'localhost:3000')}`
const tangoKey = process.env.TANGO_KEY ?? 'test'

/**
 * Opens a directory for a given course and lab.
 * @param courselab - The combination of the course name and the lab name.
 * @returns The response from the server.
 */
export async function openDirectory(courselab: string): Promise<OpenResponse> {
  const url = `${tangoHost}/open/${tangoKey}/${courselab}/`
  const response = await fetch(url, { method: 'GET' })
  return await response.json()
}

/**
 * Uploads a file to the server for a given course and lab.
 * @param courselab - The combination of the course name and the lab name.
 * @param file - The file to be uploaded.
 * @returns The response from the server.
 */
export async function uploadFile(courselab: string, file: File): Promise<UploadResponse> {
  const url = `${tangoHost}/upload/${tangoKey}/${courselab}/`
  const formData = new FormData()
  formData.append('file', file)
  const response = await fetch(url, { method: 'POST', body: formData })
  return await response.json()
}

/**
 * Adds a job to the server for a given course and lab.
 * @param courselab - The combination of the course name and the lab name.
 * @param job - The job request object.
 * @returns The response from the server.
 */
export async function addJob(courselab: string, job: AddJobRequest): Promise<AddJobResponse> {
  const url = `${tangoHost}/addJob/${tangoKey}/${courselab}/`
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(job),
  })
  return await response.json()
}

/**
 * Polls the server for the status of a job.
 * @param courselab - The combination of the course name and the lab name.
 * @param outputFile - The name of the output file.
 * @returns The response from the server.
 */
export async function pollJob(courselab: string, outputFile: string): Promise<PollSuccessResponse | PollFailureResponse> {
  const url = `${tangoHost}/poll/${tangoKey}/${courselab}/${outputFile}/`
  const response = await fetch(url, { method: 'GET' })
  const data = await response.json()
  if (response.ok) {
    return data as PollSuccessResponse
  } else {
    return data as PollFailureResponse
  }
}

/**
 * Retrieves information about the Tango service.
 * @returns [InfoResponse] from the server.
 */
export async function getInfo(): Promise<InfoResponse> {
  const url = `${tangoHost}/info/${tangoKey}/`
  const response = await fetch(url, { method: 'GET' })
  return await response.json()
}

/**
 * Retrieves information about the pool of instances for a given image.
 * @param image - The name of the image.
 * @returns The response from the server.
 */
export async function getPoolInfo(image: string): Promise<PoolResponse> {
  const url = `${tangoHost}/pool/${tangoKey}/${image}/`
  const response = await fetch(url, { method: 'GET' })
  return await response.json()
}

/**
 * Pre-allocates a pool of instances for a given image.
 * @param image - The name of the image.
 * @param num - The number of instances to pre-allocate.
 * @param request - The request object.
 * @returns The response from the server.
 */
export async function preallocateInstances(image: string, num: number, request: PreallocRequest): Promise<PreallocResponse> {
  const url = `${tangoHost}/prealloc/${tangoKey}/${image}/${num}/`
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  })
  return await response.json()
}

/**
 * Retrieves information about jobs.
 * @param deadjobs - A flag to indicate whether to retrieve dead jobs (1) or running jobs (0).
 * @returns The response from the server.
 */
export async function getJobs(deadjobs: number): Promise<JobsResponse> {
  const url = `${tangoHost}/jobs/${tangoKey}/${deadjobs}/`
  const response = await fetch(url, { method: 'POST' })
  return await response.json()
}