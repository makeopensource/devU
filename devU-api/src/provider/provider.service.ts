import { AuthProvider } from 'devu-shared-modules'

import environment from '../environment'

const DEV_AUTH_SKIP_PROVIDER: AuthProvider = {
  name: 'Developer Auth',
  route: '/login/developer',
  description: 'A user will be created for you with your provided credentials, or sign you in the user already exists.',
  method: 'post',
  body: ['email', 'externalId'],
}

const SAML_PROVIDER: AuthProvider = {
  name: environment.providers.saml.name,
  route: '/login/saml',
  description: 'SAML Login',
  method: 'get',
}

const providers = new Array<AuthProvider>()

if (environment.providers.devAuth.enabled) providers.push(DEV_AUTH_SKIP_PROVIDER)
if (environment.providers.saml.enabled) providers.push(SAML_PROVIDER)

export function get() {
  return providers
}

export function validate(providerRoute: string) {
  const providerRoutes = providers.map(p => p.route)

  return providerRoutes.includes(providerRoute)
}

export default {
  get,
  validate,
}
