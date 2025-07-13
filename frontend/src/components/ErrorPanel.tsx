import React from 'react';
import styles from './ErrorPanel.module.css';  // ← exact match to filename

interface Props {
  message?: string;
}

export default function ErrorPanel({ message }: Props) {
  if (!message) return null;
  return <div className={styles.errorBox}>⚠️ {message}</div>;
}
