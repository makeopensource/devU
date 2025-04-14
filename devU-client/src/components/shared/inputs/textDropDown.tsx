import React, { useState, useEffect } from 'react'
import CreatableSelect from 'react-select/creatable'
import { Styles, GroupTypeBase } from 'react-select'
import { getCssVariables } from 'utils/theme.utils'


import styles from './dropdown.scss'

import { Option } from './dropdown'

// This type needed since normal react-select does not allow for creating new options

type Props = {
  options: Option<any>[]
  onChange: (value: any) => void
  onCreate: (value: string) => void
  defaultOption?: Option<any>
  value?: Option<any>
  placeholder?: string
  disabled?: boolean
  className?: string
  label?: string
  custom?: Partial<Styles<any, false, GroupTypeBase<any>>>
}

const TextDropdown = ({
  options,
  onChange,
  onCreate,
  placeholder,
  disabled,
  defaultOption,
  className = '',
  label,
  value,
  custom,
}: Props) => {

  const handleChange = (option: Option<String>) => onChange(option)
  const handleCreate = (input: string) => onCreate(input)

  const [theme, setTheme] = useState(getCssVariables())
  useEffect(() => {
    const observer = new MutationObserver(() => setTheme(getCssVariables()))

    observer.observe(document.body, { attributes: true })

    return () => observer.disconnect()
  })


  const { textColor, background } = theme

  const mergeStyles = (
    base: Partial<Styles<any, false, GroupTypeBase<any>>>,
    override: Partial<Styles<any, false, GroupTypeBase<any>>>
  ) => {
    const merged: Partial<Styles<any, false, GroupTypeBase<any>>> = {}

    Object.keys(base).forEach((key) => {
      const styleKey = key as keyof Styles<any, false, GroupTypeBase<any>>
      merged[styleKey] = (provided: any, state: any) => ({
        ...base[styleKey]?.(provided, state), // Original styles
        ...override[styleKey]?.(provided, state), // Override styles
      })
    })

    return merged
  }



  const baseStyles: Partial<Styles<any, false, GroupTypeBase<any>>> = {
    ...custom,
    menu: (provided) => ({ ...provided, 
      backgroundColor: background, 
      boxShadow: 'none',
      border: '2px solid #ccc',
      borderRadius: '10px',
    }),

    container: (provided) => ({ ...provided, 
      width: '100%'
    }),

    input: (provided) => ({ ...provided, 
        backgroundColor: background,
        color: textColor, 
        fontWeight: '500',
        "input":{
          fontFamily: 'inherit'
        }
        }),

    placeholder: (provided) => ({
        ...provided,
        color: '#ffffff',
        
    }),

    control: (provided) => ({ ...provided, 
        backgroundColor: background, 
        cursor: 'pointer',
        borderRadius: '10px', 
        padding: '8px 2px',
        border: '2px solid #ccc'}),

    singleValue: (provided) => ({ ...provided, 
        color: textColor, 
    }),

    option: (provided, state) => ({
      ...provided,
      cursor: 'pointer',
      color: textColor, 
      borderBottom: '1px solid #ccc',
      width: 'inherit',
      backgroundColor: state.isFocused ? 'var(--list-item-background-hover)' : background,
      "&:last-of-type":{
        borderBottom: 'none',
        
      }
    }),
  
    
  }

  return (
    <div className={`${styles.dropdown} ${className}`}>
      {!!label && <label>{label}</label>}
      <CreatableSelect 
        aria-label={label}
        styles={custom ? mergeStyles(baseStyles, custom) : baseStyles}
        options={options}
        onChange={handleChange}
        onCreateOption={handleCreate}
        placeholder={placeholder}
        isDisabled={disabled}
        value={value}
        defaultValue={defaultOption}
        components={{
            IndicatorSeparator: () => null
          }}
      />
    </div>
   
  )
}

export default TextDropdown
