import React, { useEffect } from 'react'

import { useActionless, useAppSelector } from 'redux/hooks'
import { SET_ALERT } from 'redux/types/active.types'

import { getCssVariables } from 'utils/theme.utils'

import FaIcon from 'components/shared/icons/faIcon'

import styles from './alert.scss'

const ALERT_DISMISSAL_DELAY = 3500 // ms

/**
 * Global alerting system
 *
 * Used to display one alert at a time in the lower left of the page. Currently this isn't interactive at all,
 * it's only used to show success/ error/ warning messages.
 *
 * To set your alert, set an alert in active.alert portion of the redux store
 */
const Alert = () => {
  const alert = useAppSelector((state) => state.active.alert)
  const [setAlert] = useActionless(SET_ALERT)

  useEffect(() => {
    if (alert && alert.autoDelete) setTimeout(() => setAlert(null), ALERT_DISMISSAL_DELAY)
  }, [alert])

  const handleRemoveAlert = () => setAlert(null)

  if (!alert) return null

  const colors = getCssVariables()

  let backgroundColor = colors.red

  if (alert.type === 'warning') backgroundColor = colors.yellow
  else if (alert.type === 'info') backgroundColor = colors.purple
  else if (alert.type === 'success') backgroundColor = colors.green

  return (
    <div onClick={handleRemoveAlert} className={styles.container} style={{ backgroundColor }}>
      <FaIcon icon='times' className={styles.icon} />
      <p className={styles.message}>{alert.message || 'Unknown Alert'}</p>
    </div>
  )
}

export default Alert
