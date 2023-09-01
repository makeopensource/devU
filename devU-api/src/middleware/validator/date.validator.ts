import { CustomValidator } from 'express-validator'

/**
 * Intended to be used as custom express-validator
 *
 * Checks if the given param is before the value of the field being checked (eg: if start date is before end date)
 */
export function isBeforeParam(dateParam: string): CustomValidator {
  return (value: any, { req }) => {
    const futureParameter = req.body[dateParam]

    const date = new Date(value)
    const futureDate = new Date(futureParameter)

    if (futureDate <= date) throw new Error(`Date must be before ${dateParam}`)

    return true
  }
}

/**
 * Intended to be used as custom express-validator
 *
 * Checks if the given param is after the value of the field being checked (eg: if end date is after start date)
 */
export function isAfterParam(dateParam: string): CustomValidator {
  return (value: any, { req }) => {
    const pastParameter = req.body[dateParam]

    const date = new Date(value)
    const pastDate = new Date(pastParameter)

    if (date <= pastDate) throw new Error(`Date must be after ${dateParam}`)

    return true
  }
}
