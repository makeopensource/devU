import { Request, Response, NextFunction } from 'express'
import { validationResult } from 'express-validator'

import { GenericResponse } from '../../utils/apiResponse.utils'

export function validate(req: Request, res: Response, next: NextFunction) {
  const errors = validationResult(req)

  if (!errors.isEmpty()) return res.status(400).json(errors.array())

  next()
}

/**
 * Takes the name of a parameter in a path and returns middleware that checks that the parameter exists and is an int
 *
 * Example usage in a router:
 * Router.get('/:userCourseId', asInt('userCourseId'), ...)
 * Router.get('/:id', asInt(), ...) // uses the default name of 'id'
 * Router.get('/path/:userId/morePath/:courseId', ['userId', 'courseId'].map(routeParam => asInt(routeParam)), ...)
 *
 * @param routeParameter the name of the parameter to check
 */
export function asInt(routeParameter: string = 'id') {
  return function (req: Request, res: Response, next: NextFunction) {
    if (!req.params[routeParameter])
      return res
        .status(400)
        .json(new GenericResponse(`Missing  ${routeParameter} param on ${routeParameter} required request`))

    const id = parseInt(req.params[routeParameter])

    if (isNaN(id)) return res.status(400).json(new GenericResponse(routeParameter + ' is expected to be a number'))

    next()
  }
}

export default validate
