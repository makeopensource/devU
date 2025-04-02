import { IsNull, UpdateResult } from 'typeorm'
import ContainerAutoGraderModel from './containerAutoGrader.model'
import { dataSource } from '../../database'
import { downloadFile, initializeMinio, uploadFile } from '../../fileStorage'
import { generateFilename } from '../../utils/fileUpload.utils'
import fs from 'fs'
import path from 'path'
import FileModel from '../../fileUpload/fileUpload.model'
import { Blob } from 'node:buffer'

const connect = () => dataSource.getRepository(ContainerAutoGraderModel)
const fileConn = () => dataSource.getRepository(FileModel)

// Load default Dockerfile
const defaultDockerfile = fs.readFileSync(
  path.join(__dirname, 'defaultDockerfile.txt'),
  'utf8',
)

export interface FileWithMetadata {
  originalName: string
  blob: Buffer
  contentType: string
}

export interface ContainerAutoGraderWithFiles {
  model: ContainerAutoGraderModel
  files: {
    dockerfile: FileWithMetadata
    jobFiles: FileWithMetadata[]
  }
}

async function uploadToMinIO(
  bucket: string,
  file: Express.Multer.File,
  assignmentId: number,
  userId: number,
): Promise<string> {
  await initializeMinio(bucket)

  const filename = generateFilename(file.originalname, userId)
  const etag = await uploadFile(bucket, file, filename)
  const fileModel = <FileModel>{
    etag: etag,
    fieldName: bucket,
    name: file.originalname,
    type: file.mimetype,
    filename: filename,
    assignmentId: assignmentId,
    courseId: 1, // TODO: Update this when course management is implemented
    userId: userId,
  }

  await fileConn().save(fileModel)
  return filename
}

async function uploadDefaultDockerfile(assignmentId: number, userId: number): Promise<string> {
  // Create a buffer from the default Dockerfile content
  const buffer = Buffer.from(defaultDockerfile)

  // Create a mock file object that matches Express.Multer.File interface
  const mockFile: Express.Multer.File = {
    fieldname: 'dockerfile',
    originalname: 'Dockerfile',
    mimetype: 'text/plain',
    filename: 'Dockerfile',
    buffer,
    size: buffer.length,
    stream: null as any,
    encoding: '',
    destination: '',
    path: '',
  }

  // Upload the default Dockerfile to MinIO
  return await uploadToMinIO('dockerfiles', mockFile, assignmentId, userId)
}

async function getFileWithMetadata(bucket: string, fileId: string): Promise<FileWithMetadata> {
  // Get file metadata from database
  const fileMetadata = await fileConn().findOneByOrFail({ filename: fileId })

  // Download file content
  const blob = await downloadFile(bucket, fileId)

  return {
    originalName: fileMetadata.name,
    blob,
    contentType: fileMetadata.type || 'application/octet-stream',
  }
}

export async function create(
  requestBody: Pick<ContainerAutoGraderModel, 'assignmentId' | 'timeoutInSeconds' | 'memoryLimitMB' | 'cpuCores' | 'pidLimit' | 'entryCmd' | 'autolabCompatible'>,
  dockerfileInput: Express.Multer.File | null,
  jobFileInputs: Express.Multer.File[],
  userId: number,
): Promise<ContainerAutoGraderModel> {
  // Upload Dockerfile to MinIO (use default if none provided)
  const dockerfileId = dockerfileInput
    ? await uploadToMinIO('dockerfiles', dockerfileInput, requestBody.assignmentId, userId)
    : await uploadDefaultDockerfile(requestBody.assignmentId, userId)

  // Upload all job files to MinIO
  const jobFileIds = await Promise.all(
    jobFileInputs.map(jobFile => uploadToMinIO('jobfiles', jobFile, requestBody.assignmentId, userId)),
  )

  // Create container auto grader
  const newContainerAutoGrader = {
    assignmentId: requestBody.assignmentId,
    dockerfileId: dockerfileId,
    jobFileIds: jobFileIds,
    timeoutInSeconds: requestBody.timeoutInSeconds,
    memoryLimitMB: requestBody.memoryLimitMB,
    cpuCores: requestBody.cpuCores,
    pidLimit: requestBody.pidLimit,
    entryCmd: requestBody.entryCmd,
    autolabCompatible: requestBody.autolabCompatible ?? true,
  }

  return await connect().save(newContainerAutoGrader)
}

export async function update(
  requestBody: Partial<ContainerAutoGraderModel>,
  dockerfileInput: Express.Multer.File | null,
  jobFileInputs: Express.Multer.File[] | null,
  userId: number,
): Promise<UpdateResult> {
  const containerAutoGrader = await connect().findOneBy({
    id: requestBody.id,
    deletedAt: IsNull(),
  })

  if (!containerAutoGrader) {
    throw new Error('Container Auto Grader not found')
  }

  // Update Dockerfile if provided
  if (dockerfileInput) {
    containerAutoGrader.dockerfileId = await uploadToMinIO('dockerfiles', dockerfileInput, containerAutoGrader.assignmentId!, userId)
  }

  // Update job files if provided
  if (jobFileInputs) {
    containerAutoGrader.jobFileIds = await Promise.all(
      jobFileInputs.map(jobFile => uploadToMinIO('jobfiles', jobFile, containerAutoGrader.assignmentId!, userId)),
    )
  }

  // Update other fields if provided
  if (requestBody.assignmentId) {
    containerAutoGrader.assignmentId = requestBody.assignmentId
  }
  if (requestBody.timeoutInSeconds) {
    containerAutoGrader.timeoutInSeconds = requestBody.timeoutInSeconds
  }
  if (requestBody.memoryLimitMB) {
    containerAutoGrader.memoryLimitMB = requestBody.memoryLimitMB
  }
  if (requestBody.cpuCores) {
    containerAutoGrader.cpuCores = requestBody.cpuCores
  }
  if (requestBody.pidLimit) {
    containerAutoGrader.pidLimit = requestBody.pidLimit
  }
  if (requestBody.entryCmd !== undefined) {
    containerAutoGrader.entryCmd = requestBody.entryCmd
  }
  if (requestBody.autolabCompatible !== undefined) {
    containerAutoGrader.autolabCompatible = requestBody.autolabCompatible
  }

  // Ensure there is at least one job file
  if (containerAutoGrader.jobFileIds.length === 0) {
    throw new Error('Container Auto Grader must have at least one job file')
  }

  return await connect().update(
    { id: requestBody.id },
    {
      assignmentId: containerAutoGrader.assignmentId,
      timeoutInSeconds: containerAutoGrader.timeoutInSeconds,
      dockerfileId: containerAutoGrader.dockerfileId,
      jobFileIds: containerAutoGrader.jobFileIds,
      memoryLimitMB: containerAutoGrader.memoryLimitMB,
      cpuCores: containerAutoGrader.cpuCores,
      pidLimit: containerAutoGrader.pidLimit,
      entryCmd: containerAutoGrader.entryCmd,
      autolabCompatible: containerAutoGrader.autolabCompatible,
      updatedAt: new Date(),
    },
  )
}

export async function _delete(id: number): Promise<UpdateResult> {
  return await connect().softDelete({ id, deletedAt: IsNull() })
}

export async function retrieve(id: number): Promise<ContainerAutoGraderWithFiles> {
  const containerAutoGrader = await connect().findOneBy({
    id,
    deletedAt: IsNull(),
  })

  if (!containerAutoGrader) {
    throw new Error('Container Auto Grader not found')
  }

  // Download Dockerfile and job files from MinIO with metadata
  const dockerfile = await getFileWithMetadata('dockerfiles', containerAutoGrader.dockerfileId)
  const jobFiles = await Promise.all(
    containerAutoGrader.jobFileIds.map(jobFileId => getFileWithMetadata('jobfiles', jobFileId)),
  )

  return {
    model: containerAutoGrader,
    files: {
      dockerfile,
      jobFiles,
    },
  }
}

export async function list(): Promise<ContainerAutoGraderModel[]> {
  return await connect().find({ where: { deletedAt: IsNull() } })
}

export async function getAllGradersByAssignment(assignmentId: number): Promise<ContainerAutoGraderModel[]> {
  return await connect().find({ where: { assignmentId, deletedAt: IsNull() } })
}

export async function loadGrader(assignmentId: number) {
  const containerAutoGrader = await connect().findOneBy({
    assignmentId,
    deletedAt: IsNull(),
  })
  if (!containerAutoGrader) {
    throw new Error('Container Auto Grader not found')
  }

  // Get Dockerfile and job files metadata and content from MinIO
  const dockerfileData = await getFileWithMetadata('dockerfiles', containerAutoGrader.dockerfileId)
  const jobFilesData = await Promise.all(
    containerAutoGrader.jobFileIds.map(jobFileId => getFileWithMetadata('jobfiles', jobFileId)),
  )

  return {
    dockerfile: {
      blob: new Blob([dockerfileData.blob], { type: dockerfileData.contentType }),
      filename: dockerfileData.originalName,
    },
    jobFiles: jobFilesData.map(file => ({
      blob: new Blob([file.blob], { type: file.contentType }),
      filename: file.originalName,
    })),
    containerAutoGrader,
  }
}

export default {
  create,
  retrieve,
  update,
  _delete,
  list,
  getAllGradersByAssignment,
  loadGrader,
}
