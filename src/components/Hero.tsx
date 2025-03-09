import React from 'react';
import styles from './Hero.module.css';

const Hero = () => {
  return (
    <div className={styles.heroContainer}>
      <div className={styles.heroContent}>
        <div className={styles.heroText}>
          <h1>Digital Brain Agency</h1>
          <p>Transforming Visions into Digital Reality</p>
        </div>
        <div className={styles.heroCta}>
          <button>Get Started</button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
