import React, { useState, useRef, useEffect } from 'react'
import { connect, ConnectedProps } from 'react-redux'

import FaIcon from 'components/shared/icons/faIcon'

import { RootState } from 'redux/reducers'

import styles from './userOptionsDropdown.scss'

const mapState = (state: RootState) => ({ name: state.user.preferredName || state.user.email })
const connected = connect(mapState)

type Props = ConnectedProps<typeof connected>

const UserOptionsDropdown = ({ name }: Props) => {
  const [open, setOpen] = useState(false)
  const dropdown = useRef<HTMLDivElement>(null)

  const handleClickOutside = (e: MouseEvent) => {
    if (dropdown.current === null) return
    if (dropdown.current.contains(e.target as Node)) return

    setOpen(false)
  }

  const handleViewAccount = () => {
    // TODO - implmenet account page
    console.log('TODO - implement account page')
  }

  const handleLogout = () => {
    // TODO - call api/logout
    console.log('TODO - call logout api endpoint and reload to origin')
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside, { capture: true })
    return () => document.removeEventListener('mousedown', handleClickOutside, { capture: true })
  }, [])

  return (
    <div className={styles.dropdown} ref={dropdown}>
      <button className={styles.trigger} onClick={() => setOpen(!open)}>
        {/* Name vs icon dislpay controlled via CSS */}
        <label className={styles.name}>{name}</label>
        <FaIcon icon='user-circle' className={styles.userIcon} />
        <FaIcon icon='caret-down' className={styles.caret} />
      </button>

      {/* Menu open closed controlled via CSS */}
      <div className={`${styles.menu} ${open ? styles.open : ''}`}>
        <button onClick={handleViewAccount} className={styles.option}>
          Account
        </button>
        <hr />
        <button onClick={handleLogout} className={styles.option}>
          Logout
        </button>
      </div>
    </div>
  )
}

export default connected(UserOptionsDropdown)
