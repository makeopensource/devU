import React, { useState } from 'react'

import FaIconButton from 'components/shared/inputs/faIconButton'

import { isDarkMode, setDarkMode, setLightMode } from 'utils/theme.utils'

const DarkModeToggle = () => {
  // Must use state to manage this toggle
  // Without a state change nothing rerenders (and therefor no colors change)
  const [darkMode, setDarkModeState] = useState(isDarkMode())

  const handleChange = () => {
    // Logic seems backwards here - it's not
    // If we're currently in darkmode, change to light mode & visa versa
    if (darkMode) setLightMode()
    else setDarkMode()

    setDarkModeState(!darkMode)
  }

  return <FaIconButton onClick={handleChange} icon={darkMode ? 'sun' : 'moon'} />
}

export default DarkModeToggle
