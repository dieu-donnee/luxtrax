import React from 'react';
import styles from './Skeleton.module.css';

interface SkeletonProps {
  width?: string;
  height?: string;
  borderRadius?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ 
  width = '100%', 
  height = '1rem', 
  borderRadius 
}) => (
  <div 
    className={styles.skeleton} 
    style={{ width, height, borderRadius }} 
  />
);

export const BookingCardSkeleton: React.FC = () => (
  <div className={styles.skeletonCard}>
    <div className={styles.skeletonRow}>
      <div>
        <Skeleton width="8rem" height="1rem" />
        <Skeleton width="5rem" height="0.75rem" />
      </div>
      <Skeleton width="5rem" height="1.5rem" borderRadius="999px" />
    </div>
    <div className={styles.skeletonRow}>
      <Skeleton width="3rem" height="1rem" />
      <Skeleton width="6rem" height="1.75rem" borderRadius="0.5rem" />
    </div>
  </div>
);

export default Skeleton;
