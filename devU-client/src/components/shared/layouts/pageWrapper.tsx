import React from 'react'

import GlobalToolbar from 'components/misc/globalToolbar'
import BreadcrumbsToolbar from 'components/misc/breadcrumbsToolbar'

import styles from './pageWrapper.scss'

type Props = {
  children: React.ReactNode
  className?: string
}

const PageWrapper = ({ children, className = '' }: Props) => (
  <div className={styles.page}>
    <GlobalToolbar />
    <BreadcrumbsToolbar />
    <div className={`${styles.content} ${className}`}>{children}</div>
  </div>
)

export default PageWrapper
