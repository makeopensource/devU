import {FileUpload} from "../../devu-shared-modules"


export function serialize(file: FileUpload): FileUpload {
    return {
        fieldName: file.fieldName,
        originalName: file.originalName,
        fileName: file.fileName,
        etags: file.etags
    }
}
