import React from 'react'

import { toCapitalizedWords } from 'devu-shared-modules'

import styles from './textField.scss'

type Props = {
  type?: 'text' | 'email' | 'password' | 'search'
  onChange?: (value: string, e: React.ChangeEvent<HTMLInputElement>) => void
  label?: string
  className?: string
  placeholder?: string
  id?: string
  disabled?: true
  defaultValue?: string
  value?: string
}

const TextField = ({
  type = 'text',
  onChange,
  className = '',
  label,
  placeholder,
  id,
  disabled,
  defaultValue,
  value,
}: Props) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) onChange(e.target.value, e)
  }

  return (
    <div className={`${styles.textField} ${className}`}>
      {label && <label htmlFor={id}>{toCapitalizedWords(label)}</label>}
      <input
        id={id}
        type={type}
        onChange={handleChange}
        className={styles.input}
        placeholder={placeholder}
        disabled={disabled}
        defaultValue={defaultValue}
        value={value}
      />
    </div>
  )
}

export default TextField
