import React from 'react'

import {TextField as MuiTextField} from '@mui/material'
import styles from './textField.scss'

type Props = {
  type?: 'text' | 'email' | 'password' | 'search'
  onChange?: (value: string, e: React.ChangeEvent<HTMLInputElement>) => void
  label?: string
  className?: string
  placeholder?: string
  id?: string
  disabled?: boolean
  defaultValue?: string
  value?: string
  invalidated?: boolean
  helpText?: string
  variant?: 'outlined' | 'standard' | 'filled'
}

const TextField = ({
  onChange,
  className = '',
  label,
  placeholder,
  id,
  disabled,
  defaultValue,
  value,
  invalidated,
  helpText,
  variant = 'outlined'
}: Props) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) onChange(e.target.value, e)
  }
  return (
    <div className={`${styles.textField} ${className}`}>
      <MuiTextField {...invalidated && {error: true}}
                    disabled={disabled}
                    helperText={helpText}
                    id={id}
                    className={styles.input}
                    placeholder={placeholder}
                    variant={variant}
                    label={label}
                    defaultValue={defaultValue}
                    value={value}
                    onChange={handleChange}/>
    </div>
  )
}

export default TextField
