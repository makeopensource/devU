import React from 'react'

import DarkModeToggle from 'components/utils/darkModeToggle'

import styles from './globalToolbar.scss'

const GlobalToolbar = () => (
  <div className={styles.bar}>
    <h1>Auto Four</h1>
    <div className={styles.controls}>
      <DarkModeToggle />
    </div>
  </div>
)

export default GlobalToolbar
