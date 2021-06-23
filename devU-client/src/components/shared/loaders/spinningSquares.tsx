import React from 'react'

import styles from './spinningSquares.scss'

type Props = {
  className?: string
  label?: string
}

const SpinningSquares = ({ label }: Props) => (
  <div className={styles.center}>
    <div className={styles.squares}>
      <div className={styles.border1}>
        <div className={styles.core}></div>
      </div>
      <div className={styles.border2}>
        <div className={styles.core}></div>
      </div>
    </div>
    {label && <h1>{label}</h1>}
  </div>
)

export default SpinningSquares
