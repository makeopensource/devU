import React from 'react'

import {TextField as MuiTextField} from '@mui/material'
import { SxProps, Theme } from '@mui/material'

import styles from './textField.scss'
import { getCssVariables } from 'utils/theme.utils'

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
  sx?: SxProps<Theme>;
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
  variant = 'outlined',
  sx
}: Props) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) onChange(e.target.value, e)
  }

  const colors = getCssVariables();

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
                    onChange={handleChange}
                    sx={{
                      ...sx,
                      "& .MuiOutlinedInput-input" : {
                        color: colors.textColor
                      },
                      "& .MuiInputLabel-outlined" : {
                        color: colors.textColor
                      },
                      "& .MuiOutlinedInput-notchedOutline" : {
                        color: colors.textColor
                      },
                    }}
                    />
    </div>
  )
}

export default TextField
