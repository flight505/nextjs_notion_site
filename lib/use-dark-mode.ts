import React from "react";
import { useEffect, useState } from 'react';
import { useLocalStorage } from "react-use";


export function useDarkMode() {
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const savedMode = localStorage.getItem('darkMode')

    if (savedMode !== null) {
      setIsDarkMode(savedMode === 'true')
    } else {
      setIsDarkMode(darkModeMediaQuery.matches)
    }

    const listener = (e: MediaQueryListEvent) => {
      setIsDarkMode(e.matches)
    }

    darkModeMediaQuery.addListener(listener)
    return () => darkModeMediaQuery.removeListener(listener)
  }, [])

  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => {
      const newMode = !prevMode
      localStorage.setItem('darkMode', String(newMode))
      return newMode
    })
  }

  return { isDarkMode, toggleDarkMode }
}

export const DarkModeContext = React.createContext<ReturnType<typeof useDarkMode> | null>(null);
