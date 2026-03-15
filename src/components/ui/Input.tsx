import React from 'react';
import styles from './Input.module.css';
import { clsx } from 'clsx';
import { AlertCircle } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  rightAction?: React.ReactNode;
  error?: string;
}

const Input: React.FC<InputProps> = ({ 
  icon, 
  rightAction, 
  error, 
  className, 
  ...props 
}) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.inputContainer}>
        {icon && <span className={styles.icon}>{icon}</span>}
        <input 
          className={clsx(
            styles.input, 
            icon && styles.hasIcon, 
            rightAction && styles.hasRightAction,
            error && styles.error,
            className
          )} 
          {...props} 
        />
        {rightAction && <div className={styles.rightAction}>{rightAction}</div>}
      </div>
      {error && (
        <span className={styles.errorText}>
          <AlertCircle size={14} />
          {error}
        </span>
      )}
    </div>
  );
};

export default Input;
