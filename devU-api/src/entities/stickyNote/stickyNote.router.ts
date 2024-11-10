import express from 'express'

// Middleware
import validator from './stickyNote.validator'
// import { isAuthorized } from '../../authorization/authorization.middleware'
import { asInt } from '../../middleware/validator/generic.validator'

// Controller
import StickyNoteController from './stickyNote.controller'

const Router = express.Router({ mergeParams: true })

Router.get('/:id' , asInt(), validator , StickyNoteController.retrieve)

Router.post('/', validator, StickyNoteController.post)

Router.put('/', validator, StickyNoteController.put)

Router.delete('/:id', asInt(), validator, StickyNoteController.remove)

Router.get('/all',validator , StickyNoteController.listBySubmission)


export default Router


