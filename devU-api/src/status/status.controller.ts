import { Request, Response, NextFunction } from 'express'

export async function get(req: Request, res: Response, next: NextFunction) {
  res.status(200).send()
}
