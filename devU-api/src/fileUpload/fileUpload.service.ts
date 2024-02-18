import { FileUpload } from '../../devu-shared-modules'
import { generateFilename } from '../utils/fileUpload.utils'

import { minioClient, BucketNames} from '../fileStorage'
export async function create(files: Express.Multer.File[], bucketName: BucketNames) {
  let fileName: string[] = [];
  let originalName: string[] = [];
  let fieldName: string = files[0].fieldname;
  let etags: string[] = [];

  const uploadPromises = files.map((file) => {

    return new Promise((resolve, reject) => {
      const filename = generateFilename(file.originalname);
      fileName.push(filename);
      originalName.push(file.originalname);

      minioClient.putObject(bucketName, filename, file.buffer, (err, etag) => {
        if (err) {
          reject(new Error("File failed to upload"));
        } else {
          resolve(etag.etag);
        }
      });

    });

  });

  try {
    //@ts-ignore
    etags = await Promise.all(uploadPromises);

    let fileUpload: FileUpload = { fieldName: fieldName, originalName: originalName, fileName: fileName, etags: etags };
    return fileUpload;
  } catch (error) {
    throw new Error("Error uploading files: " + error.message);
  }
}

/*
  * I am not sure if update is needed since it is the same as create.
  * and since now the filename is random, I am not sure if we need to update the file.
  * Or the update method should have the information of the file to be updated. So it can be updated.
  * Marking for review
 */
export async function update(file: Express.Multer.File[], bucketName: BucketNames){
  let fileName:string[] = [] ;
  let originalName:string[] = []
  let fieldName:string = file[0].fieldname;
  let etags:string[] = []

  for (let i = 0; i < file.length; i++) {
    const filename = generateFilename(file[i].originalname)
    fileName.push(filename);

    originalName.push(file[i].originalname);

    minioClient.putObject(bucketName, filename, file[i].buffer, (err, etag) => {
      if (err) {
        throw new Error("File failed to upload")
      }
      const info = etag.etag
      etags.push(info)
    })
  }

  let fileUpload: FileUpload = { fieldName: fieldName, originalName: originalName, fileName: fileName, etags: etags }
  return fileUpload
}

export async function retrieve(bucketName: string, fileName: string): Promise<Buffer>{
  return new Promise((resolve, reject) => {
    minioClient.getObject(bucketName, fileName, function(err, dataStream) {
      if (err) {
        reject(err);
      }

      let file: Buffer[] = [];
      dataStream.on('data', function(chunk:Buffer) {
        file.push(chunk);
      });

      dataStream.on('end', function() {
        resolve(Buffer.concat(file));
      });

      dataStream.on('error', function(err:Error) {
        reject(err);
      });
    });
  });
}

export async function list(bucketName: string) {
  return new Promise((resolve, reject) => {
    const stream = minioClient.listObjects(bucketName);
    let files: object[] = [];

    stream.on('data', function(obj) {
      files.push(obj);
    });

    stream.on('error', function(err) {
      reject(err);
    });

    stream.on('end', function() {
      resolve(files);
    });
  });
}




export default {
  create,
  retrieve,
  update,
  list,
}