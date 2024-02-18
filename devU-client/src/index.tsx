// Libraries
import React from 'react'
import ReactDOM from 'react-dom'

// Redux
import { Provider } from 'react-redux'
import store from 'redux/store'

// Root Component
import App from 'components/app'

// Global CSS
import 'assets/global.scss'

const rootElement = document.getElementById('main')

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  rootElement,
)
