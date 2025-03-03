'use client';

import { useState, useEffect } from 'react';
import styles from './page.module.css';

// Modular component for the sensor readings table
const SensorReadingsTable = ({ data, isLoading, error }) => {
  if (isLoading) return <div className={styles.loadingSpinner}>Loading sensor readings...</div>;
  if (error) return <div className={styles.errorMessage}>Error loading data: {error.message}</div>;
  if (!data || !data.readings || data.readings.length === 0) return <p>No sensor readings available</p>;

  // Format timestamp helper function
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <div className={styles.tableContainer}>
      <div className={styles.tableHeader}>
        <div className={styles.totalReadings}>
          Total readings: <span className={styles.count}>{data.count}</span>
        </div>
      </div>
      <table className={styles.dataTable}>
        <thead>
          <tr>
            <th>Parameter</th>
            <th>Value</th>
            <th>Unit</th>
            <th>Location</th>
            <th>Sensor ID</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {data.readings.map((reading, index) => (
            <tr key={index}>
              <td>{reading.parameter_type}</td>
              <td>{reading.value}</td>
              <td>{reading.unit}</td>
              <td>{reading.location}</td>
              <td>{reading.sensor_id}</td>
              <td>{formatTimestamp(reading.timestamp)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// API service
const fetchSensorReadings = async () => {
  try {
    const apiURL = process.env.NEXT_PUBLIC_API_URL + '/sensors/readings?limit=100';
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
    console.error('Error fetching sensor readings:', error);
    throw error;
  }
};

export default function Home() {
  const [sensorData, setSensorData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadSensorData = async () => {
    try {
      setIsLoading(true);
      const result = await fetchSensorReadings();
      setSensorData(result);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSensorData();
  }, []);

  const handleRefresh = () => {
    loadSensorData();
  };

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Sensor Readings Dashboard</h1>
      <button className={styles.refreshButton} onClick={handleRefresh}>
        Refresh Data
      </button>
      <SensorReadingsTable data={sensorData} isLoading={isLoading} error={error} />
    </main>
  );
}