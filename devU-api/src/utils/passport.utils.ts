import passport from 'passport'

import environment from '../environment'

import saml from './passport/saml.passport'

if (environment.providers.saml.enabled) passport.use(saml())
