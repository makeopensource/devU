import React from 'react'

import FaIcon, { Props as FaIconProps } from 'components/shared/icons/faIcon'

import styles from './faIconButton.scss'

type Props = {
  onClick: () => void
  buttonClass?: string
} & FaIconProps

const FaIconButton = ({ buttonClass = '', ...props }: Props) => (
  <button
    onClick={props.onClick}
    className={`${buttonClass} ${styles.button}`}
    aria-label={props.icon || props.regularIcon}>
    <FaIcon {...props} />
  </button>
)

export default FaIconButton
