import { Strategy as SamlStrategy } from 'passport-saml'

import { renameKeys } from 'devu-shared-modules'

import environment from '../../environment'

export let samlStrategy: SamlStrategy

function generateSamlStrategy() {
  samlStrategy = new SamlStrategy(
    {
      // URL that goes from the Identity Provider -> Service Provider
      callbackUrl: `${environment.apiUrl}/login/saml/callback`,
      // URL that goes from the Service Provider -> Identity Provider
      entryPoint: environment.providers.saml.entryPoint,
      // Usually specified as `/shibboleth` from site root
      issuer: `${environment.apiUrl}/login/saml`,
      // Service Provider Decryption key
      decryptionPvk: environment.providers.saml.encryption.privateKey,
      // Service Provider Signing Key
      privateKey: environment.providers.saml.signing.privateKey,
      // Identity Provider's public key
      cert: environment.providers.saml.idpCerts,
      identifierFormat: null,
      validateInResponseTo: true,
      disableRequestedAuthnContext: true,
      wantAssertionsSigned: true,
      acceptedClockSkewMs: environment.providers.saml.acceptedClockSkewSeconds * 1000,
      signatureAlgorithm: 'sha256',
      digestAlgorithm: 'sha256',
    },
    function (profile: any, done: any) {
      renameKeys(environment.providers.saml.attributeMap, profile)

      return done(null, profile)
    }
  )

  return samlStrategy
}

export default generateSamlStrategy
