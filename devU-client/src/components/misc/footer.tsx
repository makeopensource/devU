import React from 'react';
import styles from './footer.scss'; // Ensure you create this SCSS file

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <nav>
        <a href="/docs">Documentation</a> | <a href="/guide">User Guide</a>
      </nav>
    </footer>
  );
};

export default Footer;
