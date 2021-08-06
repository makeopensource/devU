import React, { useEffect } from 'react'

import { useAppDispatch, useAppSelector } from 'redux/hooks'
import { SET_ALERT } from 'redux/types/active.types'

import { getCssVariables } from 'utils/theme.utils'

import FaIcon from 'components/shared/icons/faIcon'

import styles from './alert.scss'

const ALERT_DISMISSAL_DELAY = 3500 // ms

const Alert = () => {
  const alert = useAppSelector((state) => state.active.alert)
  const setAlert = useAppDispatch(SET_ALERT)

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
