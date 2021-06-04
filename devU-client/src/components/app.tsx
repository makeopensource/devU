import React from 'react'
import { Switch, Route, Router } from 'react-router-dom'

import history from 'services/history.service'

import HomePage from 'components/pages/homePage'
import NotFoundPage from 'components/pages/notFoundPage'

const App = () => (
  <Router history={history}>
    <Switch>
      <Route exact path='/' component={HomePage} />
      <Route component={NotFoundPage} />
    </Switch>
  </Router>
)

export default App
