import { serialize } from '../fileUpload.serializer';


import { FileUpload } from '../../../devu-shared-modules'

let fakeFileUpload :FileUpload
describe('fileUpload.serializer', () => {
  beforeEach(() => {
    let fieldName :string = "submissions"
    const originalNames :string[] = ["test1.txt", "test2.txt", "test3.txt"]
    const fileNamess :string[] = ["modified1.txt", "modified2.txt", "modified3.txt"]
    const etags :string[] = ["etag1", "etag2", "etag3"]

    fakeFileUpload = {
      fieldName: fieldName,
      originalName: originalNames,
      fileName: fileNamess,
      etags: etags
    }
  });
  describe('Serializing fileUpload', () => {
    test('fileUpload values exist in the response', () => {
      const actualResult = serialize(fakeFileUpload)
      expect(actualResult).toBeDefined()
      expect(actualResult.fieldName).toEqual(fakeFileUpload.fieldName)
      expect(actualResult.originalName).toEqual(fakeFileUpload.originalName)
      expect(actualResult.fileName).toEqual(fakeFileUpload.fileName)
      expect(actualResult.etags).toEqual(fakeFileUpload.etags)
    })

  })

});