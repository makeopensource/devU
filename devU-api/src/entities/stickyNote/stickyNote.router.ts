import express from 'express'

// Middleware
import validator from './stickyNote.validator'
// import { isAuthorized } from '../../authorization/authorization.middleware'
import { asInt } from '../../middleware/validator/generic.validator'

// Controller
import StickyNoteController from './stickyNote.controller'

const Router = express.Router({ mergeParams: true })

Router.get('/all',validator , StickyNoteController.listBySubmission)

Router.get('/:id' , asInt(), validator , StickyNoteController.retrieve)

Router.post('/', validator, StickyNoteController.post)

Router.put('/:id', validator, StickyNoteController.put)

Router.delete('/:id', asInt(), validator, StickyNoteController.remove)

export default Router


