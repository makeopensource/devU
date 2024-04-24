import { FileUpload } from '../../devu-shared-modules'

export function serialize(file: FileUpload): FileUpload {
  return {
    fieldName: file.fieldName,
    originalName: file.originalName,
    filename: file.filename,
    etags: file.etags,
  }
}
