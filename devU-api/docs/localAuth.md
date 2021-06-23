# Local Auth

## Enabling Developer Auth

By default (aka in the `default.yml.template` file) developer auth is enabled. If you don't care how that works you can just use the config as is and you should be good to go. (It'll look something like this)

```yaml
providers:
  devAuth:
    enabled: true
```

If you wish to better understand how this works, here's a bit more information.

When developer auth is enabled, users can provide the email & externalId of the user they wish to login as (or create) and recieve a valid refresh/ access token.

With this flag on, it enabled the `/login/developer` route (see `./router/login.router.ts` for more details).

## Testing SAML Authentication Locally

To test SAML authentication, you will need to configure an Identity Provider (IDP) for the API to authenticate against. As we don't expect anyone to just have a configured IDP laying around ready to go, this will walk through using [SamlTest.id](https://samltest.id/).

[SamlTest.id](https://samltest.id/) is an IDP specifically designed for testing. To use it in this project, we can configure it as follows.

1. If you haven't already, run `npm run generate-config` to generate a base config with keys.
1. Download the IDP metadata from https://samltest.id/saml/idp.
1. Open the downladed IDP metadata xml file and pull out the two `signing` keys.
1. Add these to your `default.yml` config under `providers.saml.idpCerts` between the begin and end certificate tags as stubbed out for you as follows.

```yaml
idpCerts:
  - |
    -----BEGIN CERTIFICATE-----
    ...
    -----END CERTIFICATE-----
  - |
    -----BEGIN CERTIFICATE-----
    ...
    -----END CERTIFICATE-----
```

1. Enable the SAML provider in the `default.yml` config.

```yaml
saml:
  name: MySAMLName
  enabled: true
```

1. At this point you should be all set to run the API for the first time, though SAML auth will _not_ work yet.
1. Go to `<api-url>/login/saml/metadata` and save the SP metadata file it presents you with.
1. Navigate to https://samltest.id/upload.php and upload the SP metadata from the previous step.
1. Now you should be all set for local SAML testing and can try logging in.
