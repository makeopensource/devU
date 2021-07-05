import React from 'react'
import { connect, ConnectedProps } from 'react-redux'

import FaIcon from 'components/shared/icons/faIcon'

import { RootState } from 'redux/reducers'

import RequestService from 'services/request.service'

import styles from './userOptionsDropdown.scss'

const mapState = (state: RootState) => ({ name: state.user.preferredName || state.user.email })
const connected = connect(mapState)

type Props = ConnectedProps<typeof connected>

const UserOptionsDropdown = ({ name }: Props) => {
  const handleViewAccount = () => {
    // TODO - implmenet account page
    console.log('TODO - implement account page')
  }

  const handleLogout = async () => {
    // Clears refreshToken httpOnly cookie - requires cookie credentials to be included for them to be reset
    // window.location.reload is not a normal function an cannot be invoked within a function chain
    RequestService.get(`/api/logout`, { credentials: 'include' }, true).finally(() => window.location.reload())
  }

  return (
    <div className={styles.dropdown}>
      {/* Opening and closing dropdown handled via CSS -  unfocusing dropdown will force close*/}
      <button className={styles.trigger}>
        {/* Name vs icon dislpay controlled via CSS */}
        <label className={styles.name}>{name}</label>
        <FaIcon icon='user-circle' className={styles.userIcon} />
        <FaIcon icon='caret-down' className={styles.caret} />
      </button>

      {/* Menu open closed controlled via CSS */}
      <div className={styles.menu}>
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
