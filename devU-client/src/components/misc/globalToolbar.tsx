import React from 'react'

import DarkModeToggle from 'components/utils/darkModeToggle'
import UserOptionsDropdown from 'components/utils/userOptionsDropdown'

import styles from './globalToolbar.scss'

const GlobalToolbar = () => (
  <div className={styles.bar}>
    <h1>Auto Four</h1>
    <div className={styles.controls}>
      <UserOptionsDropdown />
      <DarkModeToggle />
    </div>
  </div>
)

export default GlobalToolbar
