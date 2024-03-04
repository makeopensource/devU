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
  }else{
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


export async function uploadFile(bucketName: string, file: Express.Multer.File): Promise<string> {
  return new Promise((resolve, reject) => {
    minioClient.putObject(bucketName, file.originalname, file.buffer, (err, etag) => {
      if (err) {
        reject(new Error('File failed to upload'))
      } else {
        resolve(etag.etag)
      }
    })
  })
}