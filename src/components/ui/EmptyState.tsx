import React from 'react';
import { Droplets } from 'lucide-react';
import styles from './EmptyState.module.css';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

const EmptyState: React.FC<EmptyStateProps> = ({ 
  icon = <Droplets size={48} />, 
  title, 
  description, 
  action 
}) => (
  <div className={styles.emptyState}>
    <div className={styles.icon}>{icon}</div>
    <p className={styles.title}>{title}</p>
    {description && <p className={styles.description}>{description}</p>}
    {action}
  </div>
);

export default EmptyState;
