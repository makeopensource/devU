import React from 'react'

import styles from './button.scss'

type Props = {
  children: React.ReactNode
  className?: string
  onClick?: () => void
  loading?: boolean
}

const Button = ({ className = '', children, loading = false, onClick }: Props) => {
  return (
    <button
      disabled={loading}
      className={`${styles.defaultButton} ${loading ? styles.isLoading : ''} ${className}`}
      onClick={onClick}>
      <span className={styles.loading}></span>
      <span className={styles.buttonLabel}>{children}</span>
    </button>
  )
}

export default Button
