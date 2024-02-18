import React, { useState, useEffect } from 'react'
import { Switch, Route, Router } from 'react-router'

import { AuthProvider, ExpressValidationError } from 'devu-shared-modules'

import config from 'config'

import RequestService from 'services/request.service'
import history from 'services/history.service'

import LoadingOverlay from 'components/shared/loaders/loadingOverlay'
import TextField from 'components/shared/inputs/textField'
import ValidationErrorViewer from 'components/shared/errors/validationErrorViewer'

import styles from './authProvider.scss'

type ProviderSelectorProps = { providers: AuthProvider[]; onSelect: (provider: AuthProvider) => void }
type ProivderFormProps = { provider?: AuthProvider }

const ProviderSelector = ({ providers, onSelect }: ProviderSelectorProps) => (
  <>
    <h1 className={styles.header}>Select a Login Provider</h1>
    <div className={styles.providerList}>
      {providers.map((provider, index) => (
        <button onClick={() => onSelect(provider)} key={index} className={styles.providerButton}>
          Login with {provider.name}
        </button>
      ))}
    </div>
  </>
)

const ProviderForm = ({ provider }: ProivderFormProps) => {
  if (!provider) {
    history.push('/')
    return null
  }

  const [formData, setFormData] = useState<Record<string, string>>({})
  const [errors, setErrors] = useState<ExpressValidationError[] | Error>(new Array<ExpressValidationError>())

  const { body: fields = [] } = provider

  const handleUpdateForm = (key: string, value: string) => setFormData({ ...formData, [key]: value })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const { route } = provider

    RequestService.post(`/api${route}`, formData, { credentials: 'include' })
      .then(() => {
        // Forcebaly reload the page at the root of the application
        // Can't use react router here because it'll flash back to auth select before it can reload
        window.location.href = window.location.origin
      })
      .catch(setErrors)
  }

  const hasErrors = (Array.isArray(errors) && errors.length > 0) || (!Array.isArray(errors) && errors.message)

  return (
    <>
      <h1 className={styles.header}>{provider.name}</h1>
      <p className={styles.description}>{provider.description}</p>
      <form onSubmit={handleSubmit} className={styles.submitForm}>
        <div className={styles.fields}>
          {fields.map((fieldName, index) => (
            <TextField
              id={`input-${index}`}
              // @ts-expect-error - fields come from configuration yml in api, no way to type check that
              type={fieldName}
              label={fieldName}
              onChange={(value: string) => handleUpdateForm(fieldName, value)}
              key={index}
            />
          ))}
        </div>
        {hasErrors && <ValidationErrorViewer errors={errors} />}
        <button onSubmit={handleSubmit} className={styles.submit}>
          Submit
        </button>
      </form>
    </>
  )
}

const AuthProvider = ({}) => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [providers, setProviders] = useState(new Array<AuthProvider>())
  const [provider, setProvider] = useState<AuthProvider>()

  const fetchProviders = () => {
    RequestService.get<AuthProvider[]>('/api/login/providers')
      .then(setProviders)
      .catch(setError)
      .finally(() => setLoading(false))
  }

  const handleProviderSelect = (provider: AuthProvider) => {
    if (provider.method === 'post') {
      history.push('/login')
      return setProvider(provider)
    }

    // Needs to allow the browser to actually redirect to via a 302
    window.location.href = config.apiUrl + provider.route
  }

  useEffect(fetchProviders, [])

  if (loading) return <LoadingOverlay />
  if (error) return <div>error</div>

  // This is built out as it's own router (aka an unauthenticated router)
  // We may want to one day pull the provider stuff out from an unauthenticated router
  // if we ever wanted to support non authenticated pages beyond logging in
  return (
    <Router history={history}>
      <div className={styles.page}>
        <div className={styles.card}>
          <Switch>
            <Route exact path='/login'>
              <ProviderForm provider={provider} />
            </Route>
            <Route>
              <ProviderSelector providers={providers} onSelect={handleProviderSelect} />
            </Route>
          </Switch>
        </div>
      </div>
    </Router>
  )
}

export default AuthProvider
