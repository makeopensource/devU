import { createBrowserHistory } from 'history'
import queryString from 'query-string'

import config from '../config'

const history = createBrowserHistory({ basename: config.rootPath })

export function updateUrlParams(newParams: Record<string, string> = {}) {
  // Converts object to URL param format
  // Notably, we're not encoding them here
  // Maybe we should ¯\_(ツ)_/¯
  const search = Object.keys(newParams)
    .map((key) => `${key}=${newParams[key]}`)
    .join('&')

  history.push({ search: `?${search}` })
}

export function removeUrlParam(paramName: string) {
  const queryParams: any = queryString.parse(window.location.search)

  delete queryParams[paramName]

  updateUrlParams(queryParams)
}

/**
 * Strange use-case function for changing the route without changing the params
 *
 * @param {string} pathname - route to change to
 */
export function updatePathname(pathname: string) {
  const search = window.location.search
  history.push({ pathname, search })
}

export default history
