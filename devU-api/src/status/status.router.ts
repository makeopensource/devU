// Libraries
import express from 'express'

// Controller
import { get } from '../status/status.controller'

const Router = express.Router()

Router.get('/', get)

export default Router
