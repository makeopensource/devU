import React, { useEffect, useState } from 'react'
import ReactToggle from 'react-toggle'

import styles from './toggle.scss'

type Props = {
  value?: boolean
  icons?: boolean | { checked: React.ReactNode; unchecked: React.ReactNode }
  children?: React.ReactNode
  labelLeft?: boolean
  onChange: (checked: boolean) => void
}

const Toggle = ({ onChange, value, children, labelLeft = false, icons = false }: Props) => {
  const [checked, setChecked] = useState(!!value)

  const handleChange = () => {
    // aka we aren't controlling the value from the parent
    if (value === undefined) setChecked(!checked)

    onChange(!checked)
  }

  useEffect(() => setChecked(!!value), [value])

  return (
    <label className={styles.toggle}>
      {children && labelLeft && <span className={styles.labelLeft}>{children}</span>}
      <ReactToggle checked={checked} onChange={handleChange} icons={icons} />
      {children && !labelLeft && <span className={styles.label}>{children}</span>}
    </label>
  )
}

export default Toggle
