import React, { useState, useEffect } from 'react'

import SpinningSquares from './spinningSquares'

import styles from './loadingOverlay.scss'

type Props = {
  delay?: number // milliseconds
  className?: string
}

const STUPID_PHRASES = [
  'Failing Students',
  'Organizing Classes',
  'Feeding Professors',
  'Shredding Papers',
  'Sharpening Pencils',
]

const LoadingOverlay = ({ delay = 0, className = '' }: Props) => {
  const [showOverlay, setShowOverlay] = useState(false)

  // The isUnmounted prevents attempting to set the state if the component unmounts before the delay is over
  // This just prevents annoying console errors
  useEffect(() => {
    let isUnmounted = false

    setTimeout(() => {
      if (isUnmounted) return

      setShowOverlay(true)
    }, delay)

    return () => {
      isUnmounted = true
    }
  }, [])

  if (!showOverlay) return null

  return (
    <div className={`${styles.container} ${className}`}>
      <SpinningSquares label={STUPID_PHRASES[Math.floor(Math.random() * STUPID_PHRASES.length)]} />
    </div>
  )
}

export default LoadingOverlay
