import React from 'react'
import withBreadcrumbs from 'react-router-breadcrumbs-hoc'
import { Link } from 'react-router-dom'
import styles from './navbar.scss'

const Navbar = ({breadcrumbs}: any) => {

    return (
        <div>
            {breadcrumbs.map(({breadcrumb, match}: any, index: number) => (
                <span>
                    <Link to={match.url} className={styles.link}> {breadcrumb} </Link>
                    {index < (breadcrumbs.length - 1) ? ' > ' : ''}
                </span>
            ))}
        </div>
    )
        
}

export default withBreadcrumbs()(Navbar)