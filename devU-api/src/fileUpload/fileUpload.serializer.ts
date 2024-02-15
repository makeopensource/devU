import { FileUpload } from "../../../devu-shared/src"



export function serialize(fileName: string, originalName: string, fieldName: string ): FileUpload {
  return {
    fieldName: fieldName,
    originalName: originalName,
    fileName: fileName
  }
}
