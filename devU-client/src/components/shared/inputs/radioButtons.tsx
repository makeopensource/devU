import React, { useState } from 'react'
import shortid from 'shortid'

import styles from './radioButtons.scss'

export type Option = {
  label: string
  value: any
  disabled?: boolean
}

type Props = {
  options: Option[]
  onChange: (value: any, e: React.ChangeEvent<HTMLInputElement>) => void
  defaultValue?: any
  header?: string
  className?: string
}

const CheckboxRadioList = ({ options, header, onChange, className = '', defaultValue }: Props) => {
  const [name] = useState(shortid.generate())

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value, e)

  return (
    <div className={`${styles.container} ${className}`}>
      {header && <p className={styles.header}>{header}</p>}
      <div className={styles.list}>
        {options.map(({ label, value, disabled = false }) => (
          <span className={styles.item} key={value}>
            <input
              type='radio'
              name={header || name}
              id={value}
              value={value}
              onChange={handleChange}
              disabled={disabled}
              defaultChecked={defaultValue === value}
            />
            <label htmlFor={value}>{label}</label>
          </span>
        ))}
      </div>
    </div>
  )
}

export default CheckboxRadioList
