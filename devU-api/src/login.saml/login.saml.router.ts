// Libraries
import express from 'express'

import controller from '../controller/login.saml.controller'

import { saml } from '../middleware/auth.middleware'

import { authCallbackValidator } from '../middleware/validator/login.validator'

const Router = express.Router()

/**
 * @swagger
 * /login/saml:
 *   get:
 *     summary: Redirects to external SAML auth server
 */
Router.get('/', saml)

/**
 * @swagger
 * /login/saml/callback:
 *   post:
 *     summary: Handles successful SAML authentication and is called from SAML auth server
 */
Router.post('/callback', saml, authCallbackValidator, controller.callback)

/**
 * @swagger
 * /login/saml/metadata:
 *   post:
 *     summary: Gets meta SAML information (usually accessed by SAML server)
 */
Router.get('/metadata', controller.generateMetadata)

export default Router
