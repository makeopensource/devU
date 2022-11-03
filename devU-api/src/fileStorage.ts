import * as Minio from 'minio'

import environment from './environment'

export enum BucketNames {
  GRADERS = 'graders',
  SUBMISSIONS = 'submissions',
}

const minioConfiguration: Minio.ClientOptions = {
  endPoint: environment.minioHost,
  port: environment.minioPort,
  useSSL: false,
  accessKey: environment.minioUsername,
  secretKey: environment.minioPassword,
}

export const minioClient = new Minio.Client(minioConfiguration)

export async function initializeMinio() {
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
