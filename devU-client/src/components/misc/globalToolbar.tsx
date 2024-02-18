import React from 'react'
import { Link } from 'react-router-dom'

import DarkModeToggle from 'components/utils/darkModeToggle'
import FaIcon from 'components/shared/icons/faIcon'
import UserOptionsDropdown from 'components/utils/userOptionsDropdown'

import { useAppSelector } from 'redux/hooks'

import styles from './globalToolbar.scss'

const GlobalToolbar = () => {
  const userId = useAppSelector((store) => store.user.id)

  return (
    <div className={styles.bar}>
      <Link to='/' className={styles.header}>
        Auto Four
      </Link>
      <div className={styles.controls}>
        <div className={styles.sidebar}>
          {/* Not visable on smaller screens. Cannot use <FaIconButton /> because it requires a onClick. */}
          <button className={styles.hamburger} aria-label='menu'>
            <FaIcon icon='bars' />
          </button>
          {/* Turns into a sidebar via css on mobile */}
          <div className={styles.menu}>
            <DarkModeToggle />
            <Link to={`/users/${userId}/courses/`} className={styles.link}>
              Courses
            </Link>
            <Link to={`/users/${userId}/assignments/`} className={styles.link}>
              Assignments
            </Link>
            <Link to={`/users/${userId}/submissions/`} className={styles.link}>
              Submissions
            </Link>
          </div>
        </div>
        <UserOptionsDropdown />
      </div>
    </div>
  )
}

export default GlobalToolbar
