'use client';

import { useState, useEffect } from 'react';
import styles from './page.module.css';

// Modular component for the animal data table
const AnimalDataTable = ({ data, isLoading, error }) => {
  if (isLoading) return <div className={styles.loadingSpinner}>Loading animal data...</div>;
  if (error) return <div className={styles.errorMessage}>Error loading data: {error.message}</div>;
  if (!data || !data.data || data.data.length === 0) return <p>No animal data available</p>;

  // Format timestamp helper function
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <div className={styles.tableContainer}>
      <div className={styles.tableHeader}>
        <div className={styles.totalReadings}>
          Total entries: <span className={styles.count}>{data.count}</span>
        </div>
      </div>
      <table className={styles.dataTable}>
        <thead>
          <tr>
            <th>Cow ID</th>
            <th>Response Type</th>
            <th>Time</th>
            <th>Entry ID</th>
          </tr>
        </thead>
        <tbody>
          {data.data.map((entry, index) => (
            <tr key={index}>
              <td>{entry.cow_id}</td>
              <td>
                <span className={`${styles.badge} ${entry.response_type === 'optimistic' ? styles.badgeSuccess : styles.badgeWarning}`}>
                  {entry.response_type}
                </span>
              </td>
              <td>{formatTimestamp(entry.time)}</td>
              <td className={styles.entryId}>{entry.entry_id}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// API service
const fetchAnimalData = async () => {
  try {
    const apiURL = process.env.NEXT_PUBLIC_API_URL + '/animal/data';
    const response = await fetch(apiURL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': process.env.NEXT_PUBLIC_API_KEY
      }
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching animal data:', error);
    throw error;
  }
};

export default function AnimalDataPage() {
  const [animalData, setAnimalData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadAnimalData = async () => {
    try {
      setIsLoading(true);
      const result = await fetchAnimalData();
      setAnimalData(result);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAnimalData();
  }, []);

  const handleRefresh = () => {
    loadAnimalData();
  };

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Animal Happiness Dashboard</h1>
      <button className={styles.refreshButton} onClick={handleRefresh}>
        Refresh Data
      </button>
      <AnimalDataTable data={animalData} isLoading={isLoading} error={error} />
    </main>
  );
}