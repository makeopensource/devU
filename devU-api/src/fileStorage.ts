import * as Minio from 'minio'

import environment from './environment'

export enum BucketNames {
  GRADERS = 'graders',
  SUBMISSIONS = 'submissions',
  MAKEFILES = 'makefiles',
}

const minioConfiguration: Minio.ClientOptions = {
  endPoint: environment.minioHost,
  port: environment.minioPort,
  useSSL: false,
  accessKey: environment.minioUsername,
  secretKey: environment.minioPassword,
}

export const minioClient = new Minio.Client(minioConfiguration)

export async function initializeMinio(inputBucketName?: string) {
  if (inputBucketName) {
    const bucketExists = await minioClient.bucketExists(inputBucketName)

    if (bucketExists) return

    minioClient.makeBucket(inputBucketName, 'us-east-1', function (err) {
      if (err) {
        throw new Error(`Error creating MinIO bucket '${inputBucketName}'`)
      }
    })
    return
  } else {
    for (const bucketName of Object.values(BucketNames)) {
      const bucketExists = await minioClient.bucketExists(bucketName)

      if (bucketExists) continue

      minioClient.makeBucket(bucketName, 'us-east-1', function (err) {
        if (err) {
          throw new Error(`Error creating MinIO bucket '${bucketName}'`)
        }
      })
    }
  }
}

export async function uploadFile(bucketName: string, file: Express.Multer.File, filename: string): Promise<string> {
  return new Promise((resolve, reject) => {
    minioClient.putObject(bucketName, filename, file.buffer, (err, etag) => {
      if (err) {
        reject(new Error('File failed to upload because' + err.message))
      } else {
        resolve(etag.etag)
      }
    })
  })
}

export async function downloadFile(bucketName: string, filename: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const fileData: Buffer[] = []

    minioClient.getObject(bucketName, filename, (err, dataStream) => {
      if (err) {
        reject(new Error('File failed to download from MinIO because '+err.message))
      }
      dataStream.on('data', (chunk:any) => {

        fileData.push(chunk)
      })

      dataStream.on('end', () => {
        resolve(Buffer.concat(fileData))
      })
    })
  })
}
