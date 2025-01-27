import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Hero.module.css';
import { Modal } from './ui/modal';
import { LoginForm } from './auth/LoginForm';

const Hero = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleLoginSuccess = () => {
    setIsModalOpen(false);
    navigate('/dashboard');
  };

  return (
    <div className={styles.heroContainer}>
      <div className={styles.heroContent}>
        <div className={styles.heroText}>
          <h1>Welcome to Our Platform</h1>
          <p>Your one-stop solution for all your needs</p>
        </div>
        <div className={styles.heroCta}>
          <button onClick={() => setIsModalOpen(true)}>Get Started</button>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <LoginForm onSuccess={handleLoginSuccess} />
      </Modal>
    </div>
  );
};

export default Hero;
