import React from 'react'

import FaIcon, { Props as FaIconProps } from 'components/shared/icons/faIcon'

import styles from './faIconButton.scss'

type Props = {
  onClick: () => void
} & FaIconProps

const FaIconButton = (props: Props) => (
  <button onClick={props.onClick} className={styles.button} aria-label={props.icon || props.regularIcon}>
    <FaIcon {...props} />
  </button>
)

export default FaIconButton
