import React from 'react';
import './Navigation.css';
import styles from './Hero.module.css';

const Header = () => {
  return (
    <>
      <div className="nav-container">
        <div className="nav-content">
          <div className="nav-menu">
            <a className="nav-link" href="#home">
              Home
            </a>
            <a className="nav-link" href="#about">
              About
            </a>
            <a className="nav-link" href="#services">
              Services
            </a>
            <a className="nav-link" href="#contact">
              Contact
            </a>
          </div>
        </div>
      </div>
      <header className={styles.heroContainer}>
        <div className={styles.heroContent}>
          <div className={styles.heroText}>
            <h1>Digital Brain Agency</h1>
            <p>Transforming Visions into Digital Reality</p>
          </div>

          <div className={styles.heroIcons}>
            <div className={styles.iconCard}>
              <img src="/icons/strategy.svg" alt="Strategy" />
              <h3>AI Strategy</h3>
            </div>
            <div className={styles.iconCard}>
              <img src="/icons/automation.svg" alt="Automation" />
              <h3>Automation</h3>
            </div>
            <div className={styles.iconCard}>
              <img src="/icons/analytics.svg" alt="Analytics" />
              <h3>Data Analytics</h3>
            </div>
            <div className={styles.iconCard}>
              <img src="/icons/marketing.svg" alt="Marketing" />
              <h3>Growth Marketing</h3>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
