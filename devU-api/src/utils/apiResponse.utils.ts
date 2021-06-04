export class GenericResponse {
  message: string

  constructor(message: string) {
    this.message = message
  }
}

export const NotFound = new GenericResponse('Not found')
export const Unknown = new GenericResponse('And unexpected error occured')
export const Unauthorized = new GenericResponse('Not allowed, unable to complete action')

export const Updated = new GenericResponse('Record Updated')
