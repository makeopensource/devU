import React, { useState, useEffect } from 'react'
import Select, { Styles, GroupTypeBase } from 'react-select'

import { getCssVariables } from 'utils/theme.utils'

import styles from './dropdown.scss'

export type Option<T = any> = {
  value: T
  label: string
}

type Props = {
  options: Option<any>[]
  onChange: (value: any) => void
  defaultOption?: Option<any>
  placeholder?: string
  disabled?: boolean
  search?: boolean
  className?: string
  label?: string
  custom?: Partial<Styles<any, false, GroupTypeBase<any>>>
}

const Dropdown = ({
  options,
  onChange,
  placeholder,
  disabled,
  search = false,
  defaultOption,
  className = '',
  label,
  custom
}: Props) => {
  const [theme, setTheme] = useState(getCssVariables())

  // Needs a custom observer to force an update when the css variables change
  // Custom observer will update the theme variables when the bodies classes change
  useEffect(() => {
    const observer = new MutationObserver(() => setTheme(getCssVariables()))

    observer.observe(document.body, { attributes: true })

    return () => observer.disconnect()
  })

  const handleChange = (option: Option) => onChange(option)

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

  // Styling into this component isn't really possible with raw css alone due to its implementation
  // Because of this we're going to use their style apis
  const baseStyles: Partial<Styles<any, false, GroupTypeBase<any>>> = {
    menu: (provided) => ({ ...provided, 
        backgroundColor: background, 
        boxShadow: 'none',
        border: '2px solid #ccc',
        borderRadius: '10px',
    }),
    
    input: (provided) => ({ ...provided, 
        backgroundColor: background, 
        borderRadius: '20px',
        color: textColor, 
        }),

    placeholder: (provided) => ({ ...provided,
        fontStyle:'italic',
        color: '#9c9c9c',
        margin: '0'
    }),
    control: (provided) => ({ ...provided, 
        backgroundColor: background, 
        cursor: 'pointer',
        border: '2px solid #ccc',
        borderRadius: '20px', 
        padding: '8px 2px',
        }),

    singleValue: (provided) => ({ ...provided, 
        color: textColor,  
    }),
    
    option: (provided, state) => ({
      ...provided,
      cursor: 'pointer',
      color: textColor, 
      borderBottom: '1px solid #ddd',
      backgroundColor: state.isFocused ? 'var(--list-item-background-hover)' : background,
      "&:last-of-type":{
        borderBottom: 'none'
      }
    }),
  }

  return (
    <div className={`${styles.dropdown} ${className}`}>
      {!!label && <label>{label}</label>}
      <Select
        aria-label={label}
        styles={custom ? mergeStyles(baseStyles, custom) : baseStyles}
        options={options}
        onChange={handleChange}
        placeholder={placeholder}
        isDisabled={disabled}
        isSearchable={search}
        components={
          {IndicatorSeparator: () => null}
        }
        defaultValue={defaultOption}
        isClearable={true}
      />
    </div>
  )
}

export default Dropdown
