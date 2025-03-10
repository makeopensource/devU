import React from 'react'
import CreatableSelect, { Styles, GroupTypeBase } from 'react-select'

//import { getCssVariables } from 'utils/theme.utils'

import styles from './dropdown.scss'

import { Option } from './dropdown'

type Props = {
  options: Option<any>[]
  onChange: (value: any) => void
  onCreate: (value: string) => void
  defaultOption?: Option<any>
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
  search = false,
  defaultOption,
  className = '',
  label,
  custom,
}: Props) => {

  const handleChange = (option: Option) => onChange(option)
  const handleCreate = (input: string) => onCreate(input)


  // Styling into this component isn't really possible with raw css alone due to its implementation
  // Because of this we're going to use their style apis
  const customStyles: Partial<Styles<any, false, GroupTypeBase<any>>> = {
    menu: (provided) => ({ ...provided, 
      backgroundColor: 'var(--background)', 
      borderRadius: '10px'
    }),
    input: (provided) => ({ ...provided, 
        backgroundColor: 'var(--background)',
        borderRadius: '10px',
        color: 'var(--text-color)', 
        }),

    placeholder: (provided) => ({ ...provided,
        fontStyle:'italic',
        color: '#9c9c9c',
        margin: '0'
    }),
    control: (provided) => ({ ...provided, 
        backgroundColor: 'var(--background)', cursor: 'pointer',
        borderRadius: '10px', padding: '10px',
        border: '2px solid #ccc'}),

    singleValue: (provided) => ({ ...provided, 
        color: 'var(--text-color)', 
    }),
    
    option: (provided, state) => ({
      ...provided,
      cursor: 'pointer',
      color: 'var(--color)', 
      borderBottom: '1px solid #ccc',
      backgroundColor: state.isFocused ? 'var(--list-item-background-hover)' : 'var(--background)',
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
        styles={custom ?? customStyles}
        options={options}
        onChange={handleChange}
        onCreateOption={handleCreate}
        placeholder={placeholder}
        isDisabled={disabled}
        isSearchable={search}
        defaultValue={defaultOption}
        components={{
            IndicatorSeparator: () => null
          }}
      />
    </div>
  )
}

export default TextDropdown
