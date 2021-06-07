import { Request, Response, NextFunction } from 'express'

import { GenericResponse, Unknown, Unimplemented } from '../utils/apiResponse.utils'

/**
 * Middleware function that acts as a error handler for the routers/controllers/ other middleware.
 * As a general rule of thumb for this API, we try to only send back errors of the same structure
 *
 * Also never send back an actual JS error. No one wants to see a stack trace
 *
 * TODO - might want to add some kind of network error logging.
 */
function globalErrorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  if (!(err instanceof Error)) return res.status(400).json(Unknown)

  if (!err.message) return res.status(400).json(Unknown)
  if (err.message === 'Unimplemented') return res.status(501).json(Unimplemented)

  return res.status(400).json(new GenericResponse(err.message))
}

export default globalErrorHandler
