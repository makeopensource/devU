import React, { useState } from 'react'
import shortid from 'shortid'

import styles from './checkbox.scss'

type Props = {
  label: string
  onChange: (checked: boolean, e: React.ChangeEvent<HTMLInputElement>) => void
  defaultValue?: boolean
  disabled?: boolean
  className?: string
}

const CheckboxRadioList = ({ label, onChange, className = '', disabled = false, defaultValue = false }: Props) => {
  const [id] = useState(shortid.generate())

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.checked, e)

  return (
    <div className={`${styles.checkbox} ${className}`}>
      <input
        id={id}
        name={label}
        type='checkbox'
        onChange={handleChange}
        disabled={disabled}
        defaultChecked={defaultValue}
      />
      <label htmlFor={id}>{label}</label>
    </div>
  )
}

export default CheckboxRadioList
