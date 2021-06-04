import React from 'react'

import GlobalToolbar from 'components/misc/globalToolbar'

import styles from './pageWrapper.scss'

type Props = {
  children: React.ReactNode
}

const PageWrapper = ({ children }: Props) => (
  <div className={styles.page}>
    <GlobalToolbar />
    <div className={styles.content}>{children}</div>
  </div>
)

export default PageWrapper
