import React from 'react'
import { Link } from 'react-router-dom'

import styles from './listItemWrapper.scss'

import ColorHash from 'color-hash'

type Props = {
  to: string
  children: React.ReactNode
  tag?: string
  className?: string
  
}

const colorHash = (input: string) => {
  const hash = new ColorHash({ hue: { min: 90, max: 270 } })

  return hash.hex(input)
}

const ListItemWrapper = ({ to, children, tag, className = '' }: Props) => (
  <Link to={to} className={styles.container} >
    {tag && <div className={styles.tag} style={{ backgroundColor: colorHash(tag) }}></div>}
    <div className={className}>{children}</div>
  </Link>
)

export default ListItemWrapper
