import { getRepository, IsNull } from 'typeorm'

import SubmissionModel from '../submission/submission.model'
import FileModel from '../../fileUpload/fileUpload.model'
import CourseModel from '../course/course.model'

import { Submission, FileUpload } from 'devu-shared-modules'
import { uploadFile } from '../../fileStorage'

const submissionConn = () => getRepository(SubmissionModel)
const fileConn = () => getRepository(FileModel)

export async function create(submission: Submission, file?: Express.Multer.File|undefined) {
  if (file) {
    const bucket : string = await getRepository(CourseModel).findOne({id: submission.courseId}).then((course) => {
      if (course) {
        return (course.name).toLowerCase() + course.number + course.semester + course.id
      }
      return 'submission'
    })

    const Etag : string = await uploadFile(bucket, file)
    const fileModel : FileUpload = {
      userId : submission.userId,
      assignmentId : submission.assignmentId,
      courseId : submission.courseId,
      etags : Etag,
      fieldName : file.fieldname,
      originalName : file.originalname,
      filename : bucket,

    }
    await fileConn().save(fileModel)
  }
  return await submissionConn().save(submission)
}

export async function _delete(id: number) {
  return await submissionConn().softDelete({ id, deletedAt: IsNull() })
}

export async function retrieve(id: number) {
  return await submissionConn().findOne({ id, deletedAt: IsNull() })
}

export async function list() {
  return await submissionConn().find({ deletedAt: IsNull() })
}

export default {
  create,
  retrieve,
  _delete,
  list,
}
