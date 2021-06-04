import React, { useState, useEffect } from 'react'

import LocalStorageService from 'services/localStorage.service'

import Toggle from 'components/shared/inputs/toggle'

const LOCAL_THEME_KEY = 'Theme' // the key used in local storage
const LIGHT = 'light' // value for light in local storage
const DARK = 'dark' // value for dark in local storage

const DARK_CLASS = 'dark-mode' // .dark-mode class is used in global.scss

const DarkModeToggle = () => {
  const cachedDarkMode = DARK === localStorage.getItem(LOCAL_THEME_KEY)
  const [darkMode, setDarkMode] = useState(cachedDarkMode)

  const handleChange = () => {
    // Logic seems backwards here - it's not
    // If we're currently in darkmode, change to light mode & visa versa
    if (darkMode) {
      LocalStorageService.set(LOCAL_THEME_KEY, LIGHT)

      document.body.classList.remove(DARK_CLASS)
    } else {
      LocalStorageService.set(LOCAL_THEME_KEY, DARK)
      document.body.classList.add(DARK_CLASS)
    }

    setDarkMode(!darkMode)
  }

  useEffect(() => {
    if (!darkMode) return
    document.body.classList.add(DARK_CLASS)
  }, [])

  return (
    <Toggle onChange={handleChange} labelLeft>
      Switch to {darkMode ? 'Light' : 'Dark'}
    </Toggle>
  )
}

export default DarkModeToggle
