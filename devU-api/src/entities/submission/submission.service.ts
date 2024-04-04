import { FindManyOptions, getRepository, IsNull } from 'typeorm'

import SubmissionModel from '../submission/submission.model'
import FileModel from '../../fileUpload/fileUpload.model'
import CourseModel from '../course/course.model'

import { Submission, FileUpload } from 'devu-shared-modules'
import { uploadFile } from '../../fileStorage'
import { groupBy } from '../../database'

const submissionConn = () => getRepository(SubmissionModel)
const fileConn = () => getRepository(FileModel)

export async function create(submission: Submission, file?: Express.Multer.File|undefined) {
  if (file) {
    const bucket : string = await getRepository(CourseModel).findOne({id: submission.courseId}).then((course) => {
      if (course) {
        return ((course.name).toLowerCase().replace(/ /g, '-') + course.number + course.semester + course.id).toLowerCase()
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
    const content = JSON.parse(submission.content)
    content.filepaths.push(filename)
    submission.content = JSON.stringify(content)

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



export async function list(query: any, id: number) {
  const OrderByMappings = ['id', 'createdAt', 'updatedAt', 'courseId', 'assignmentId', 'submittedBy']

  return await groupBy<SubmissionModel>(submissionConn(), OrderByMappings, query, { index: 'submittedBy', value: id })
}

export default {
  create,
  retrieve,
  _delete,
  list,
}
