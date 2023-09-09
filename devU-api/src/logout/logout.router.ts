import express from 'express'

import Logout from '../controller/logout.controller'

const Router = express.Router()

Router.get('/', Logout)

export default Router
