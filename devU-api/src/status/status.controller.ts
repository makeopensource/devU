import { Request, Response, NextFunction } from 'express'
import { getInfo, tangoHelloWorld } from '../tango/tango.service'

export async function get(req: Request, res: Response, next: NextFunction) {
  let tango = false
  let tangoStatus;
  try {
    tango = await tangoHelloWorld()
    tangoStatus = await getInfo()
    console.log(tangoStatus)
  } catch (e) {
    console.log('failed to start tango')
    console.log(e)
  }
  res.status(200).send(`Api is online.\n Tango is ${tango ? `Online` : 'Offline'}`)
}
