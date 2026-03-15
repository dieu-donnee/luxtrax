import React from 'react';
import styles from './Button.module.css';
import { clsx } from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  size = 'md',
  children, 
  className, 
  ...props 
}) => {
  return (
    <button 
      className={clsx(styles.button, styles[variant], styles[size], className)} 
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
