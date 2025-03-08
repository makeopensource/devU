import React from 'react'

import GlobalToolbar from 'components/misc/globalToolbar'
import Navbar from 'components/misc/navbar'
import Footer from 'components/misc/footer';

import styles from './pageWrapper.scss'

type Props = {
  children: React.ReactNode
  className?: string
}

const PageWrapper = ({ children, className = '' }: Props) => (
  <div className={styles.page}>
    <GlobalToolbar />
    <Navbar />
    <div className={`${styles.content} ${className}`}>{children}</div>
    <Footer /> {/* Footer will now be displayed on all pages */}
  </div>
)

export default PageWrapper
