export class GenericResponse {
  message: string

  constructor(message: string) {
    this.message = message
  }
}

// 200s
export const Updated = new GenericResponse('Record Updated')

// 400s
export const NotFound = new GenericResponse('Not found')
export const Unknown = new GenericResponse('And unexpected error occured')
export const Unauthorized = new GenericResponse('Not allowed, unable to complete action')

// 500s
export const Unimplemented = new GenericResponse('Endpoint has not been implemented')
