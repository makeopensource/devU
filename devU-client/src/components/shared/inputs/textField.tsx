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
  disabled?: true
  defaultValue?: string
  value?: string
  invalidated?: boolean
  helpText?: string
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

}: Props) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) onChange(e.target.value, e)
  }
  return (
    <div className={`${styles.textField} ${className}`}>
      <MuiTextField {...invalidated && {error: true}}
                    id={id}
                    className={styles.input}
                    placeholder={placeholder}
                    variant='outlined'
                    label={label}
                    defaultValue={defaultValue}
                    value={value}
                    onChange={handleChange}>
        disabled={disabled}
        helperText={helpText}
      </MuiTextField>
    </div>
  )
}

export default TextField
