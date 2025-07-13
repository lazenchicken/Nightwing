import React from 'react';
import styles from './Table.module.css';

export interface Column<T> {
  header: string;
  key: keyof T;
  render?: (val: any, row: T) => React.ReactNode;
}

export default function Table<T>({ columns, data, rowKey }: {
  columns: Column<T>[];
  data: T[];
  rowKey?: (row: T) => string | number;
}) {
  return (
    <table className={styles.table}>
      <thead>
        <tr>{columns.map(c => <th key={c.header}>{c.header}</th>)}</tr>
      </thead>
      <tbody>
        {data.map((row, i) => (
          <tr key={rowKey ? rowKey(row) : i}>
            {columns.map(c => (
              <td key={c.header}>
                {c.render ? c.render((row as any)[c.key], row) : (row as any)[c.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
