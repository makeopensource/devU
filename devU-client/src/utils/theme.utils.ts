import LocalStorageService from 'services/localStorage.service'

export const LOCALSTORAGE_THEME_KEY = 'Theme' // the key used in local storage

const themes = {
  light: { name: 'light', class: '' },
  dark: { name: 'dark', class: 'dark-mode' },
}

export const isDarkMode = () => themes.dark.name === LocalStorageService.get(LOCALSTORAGE_THEME_KEY)

export const setDarkMode = () => {
  setDarkModeFlag()
  setDarkModeCss()
}

export const setLightMode = () => {
  setLightModeFlag()
  setLightModeCss()
}

export const setLightModeFlag = () => LocalStorageService.set(LOCALSTORAGE_THEME_KEY, themes.light.name)
export const setDarkModeFlag = () => LocalStorageService.set(LOCALSTORAGE_THEME_KEY, themes.dark.name)

export const setLightModeCss = () => document.body.classList.remove(themes.dark.class)
export const setDarkModeCss = () => document.body.classList.add(themes.dark.class)

export function initializeTheme() {
  const isDark = isDarkMode()

  if (isDark) setDarkModeCss()
  else setLightModeCss()
}
