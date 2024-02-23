import { FileUpload } from '../../devu-shared-modules'
import { generateFilename } from '../utils/fileUpload.utils'

import { minioClient } from '../fileStorage'

export async function create(files: Express.Multer.File[], bucketName: string) {
    let fileName: string[] = []
    let originalName: string[] = []
    let fieldName: string = files[0].fieldname
    let etags: string[] = []
    
    const uploadPromises = files.map((file) => {
        return new Promise((resolve, reject) => {
            const filename = generateFilename(file.originalname)
            fileName.push(filename)
            originalName.push(file.originalname)
            
            minioClient.putObject(bucketName, filename, file.buffer, (err, etag) => {
                if (err) {
                    reject(new Error('File failed to upload'))
                } else {
                    resolve(etag.etag)
                }
            })
            
        })
        
    })
    
    try {
        //@ts-ignore
        etags = await Promise.all(uploadPromises)
        
        let fileUpload: FileUpload = {
            fieldName: fieldName,
            originalName: originalName,
            fileName: fileName,
            etags: etags,
        }
        return fileUpload
    } catch (error: any) {
        throw new Error('Error uploading files: ' + error.message)
    }
}


export async function retrieve(bucketName: string, fileName: string): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        minioClient.getObject(bucketName, fileName, function(err, dataStream) {
            if (err) {
                reject(err)
            }
            
            let file: Buffer[] = []
            dataStream.on('data', function(chunk: Buffer) {
                file.push(chunk)
            })
            
            dataStream.on('end', function() {
                resolve(Buffer.concat(file))
            })
            
            dataStream.on('error', function(err: Error) {
                reject(err)
            })
        })
    })
}

export async function list(bucketName: string) {
    return new Promise((resolve, reject) => {
        const stream = minioClient.listObjects(bucketName)
        let files: object[] = []
        
        stream.on('data', function(obj) {
            files.push(obj)
        })
        
        stream.on('error', function(err) {
            reject(err)
        })
        
        stream.on('end', function() {
            resolve(files)
        })
    })
}


export default {
    create,
    retrieve,
    list,
}