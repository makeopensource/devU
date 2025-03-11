import React, { useState, useEffect } from 'react'
import CreatableSelect from 'react-select/creatable'
import { Styles, GroupTypeBase } from 'react-select'
import { getCssVariables } from 'utils/theme.utils'


import styles from './dropdown.scss'

import { Option } from './dropdown'

type Props = {
  options: Option<any>[]
  onChange: (value: any) => void
  onCreate: (value: string) => void
  defaultOption?: Option<any>
  value?: Option<any>
  placeholder?: string
  disabled?: boolean
  search?: boolean
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
  search = true,
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


  const customStyles: Partial<Styles<any, false, GroupTypeBase<any>>> = {
    ...custom,
    menu: (provided) => ({ ...provided, 
      backgroundColor: 'var(--background)', 
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

    placeholder: (provided) => ({ ...provided,
        fontStyle:'italic',
        color: '#9c9c9c',
        margin: '0'
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
      color: 'var(--color)', 
      borderBottom: '1px solid #ccc',
      backgroundColor: state.isFocused ? 'var(--list-item-background-hover)' : background,
      "&:last-of-type":{
        borderBottom: 'none'
      }
    }),
  
    
  }

  return (
    <div className={`${styles.dropdown} ${className}`}>
      {!!label && <label>{label}</label>}
      <CreatableSelect
        aria-label={label}
        styles={customStyles}
        options={options}
        onChange={handleChange}
        onCreateOption={handleCreate}
        placeholder={placeholder}
        isDisabled={disabled}
        isSearchable={search}
        value={value}
        defaultValue={defaultOption}
        components={{
            IndicatorSeparator: () => null
          }}
      />
      {console.log(value)}
    </div>
   
  )
}

export default TextDropdown
