import React, { useState, useEffect } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { Switch, Route, Router } from 'react-router-dom'

import AuthProvider from 'components/pages/authProvider'
import LoadingOverlay from 'components/shared/loaders/loadingOverlay'
import HomePage from 'components/pages/homePage'
import NotFoundPage from 'components/pages/notFoundPage'

import { setUser } from 'redux/actions/user.actions'

import history from 'services/history.service'

import fetchUser from 'utils/fetchUser.utils'
import { initializeTheme } from 'utils/theme.utils'

const mapDispatch = { setUser }
const connector = connect(null, mapDispatch)

type Props = ConnectedProps<typeof connector>

const App = ({ setUser }: Props) => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [authenticated, setAuthenticated] = useState(false)

  useEffect(() => {
    initializeTheme() // Sets the default state for darkMode

    fetchUser()
      .then(setUser)
      .then(() => setAuthenticated(true))
      .catch(setError)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <LoadingOverlay delay={100} />
  if (!authenticated) return <AuthProvider />
  if (error) return <div>Error</div> // Should probably be an actual errors page

  // TODO - As the list of Routes grows, we should move this into a router.tsx
  return (
    <Router history={history}>
      <Switch>
        <Route exact path='/' component={HomePage} />
        <Route component={NotFoundPage} />
      </Switch>
    </Router>
  )
}

export default connector(App)
