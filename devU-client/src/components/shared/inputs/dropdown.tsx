import React, { useState, useEffect } from 'react'
import Select, { Styles, GroupTypeBase } from 'react-select'

import { getCssVariables } from 'utils/theme.utils'

export type Option = {
  value: any
  label: string
}

type Props = {
  options: Option[]
  onChange: (value: any) => void
  defaultValue?: any
  placeholder?: string
  disabled?: boolean
  search?: boolean
}

const Dropdown = ({ options, onChange, placeholder, disabled, search = false, defaultValue }: Props) => {
  const [theme, setTheme] = useState(getCssVariables())

  // Needs a custom observer to force an update when the css variables change
  // Custom observer will update the theme variables when the bodies classes change
  useEffect(() => {
    const observer = new MutationObserver(() => setTheme(getCssVariables()))

    observer.observe(document.body, { attributes: true })

    return () => observer.disconnect()
  })

  const handleChange = (option: Option) => onChange(option.value)

  const { textColor, background, primary } = theme

  // Styling into this component isn't really possible with raw css alone due to its implementation
  // Because of this we're going to use their style apis
  const styles: Partial<Styles<any, false, GroupTypeBase<any>>> = {
    menu: (provided) => ({ ...provided, background }),
    input: (provided) => ({ ...provided, background }),
    control: (provided) => ({ ...provided, background, cursor: 'pointer' }),
    singleValue: (provided) => ({ ...provided, color: textColor }),
    option: (provided, state) => ({
      ...provided,
      cursor: 'pointer',
      background: state.isSelected || state.isFocused ? primary : background,
    }),
  }

  return (
    <Select
      styles={styles}
      options={options}
      onChange={handleChange}
      placeholder={placeholder}
      isDisabled={disabled}
      isSearchable={search}
      defaultValue={defaultValue}
    />
  )
}

export default Dropdown
