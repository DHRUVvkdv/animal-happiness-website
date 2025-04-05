'use client';
import { useState, useEffect } from 'react';
import styles from './page.module.css';

// Modular component for the animal data table
const AnimalDataTable = ({ data, isLoading, error, onLoadMore, hasMore, totalItems }) => {
  const [sortedData, setSortedData] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: 'time', direction: 'desc' });

  useEffect(() => {
    if (data && data.data && data.data.length > 0) {
      const dataToSort = [...data.data];
      sortData(dataToSort, sortConfig.key, sortConfig.direction);
    }
  }, [data, sortConfig.key, sortConfig.direction]);

  if (isLoading && !sortedData.length) return <div className={styles.loadingSpinner}>Loading animal data...</div>;
  if (error) return <div className={styles.errorMessage}>Error loading data: {error.message}</div>;
  if (!data || !data.data || data.data.length === 0) return <p>No animal data available</p>;

  // Format timestamp helper function
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  // Sort data helper function
  const sortData = (dataArray, key, direction) => {
    const sortedArray = dataArray.sort((a, b) => {
      if (key === 'time') {
        // For time field, compare as dates
        const dateA = new Date(a[key]).getTime();
        const dateB = new Date(b[key]).getTime();
        return direction === 'asc' ? dateA - dateB : dateB - dateA;
      } else {
        // For other fields, compare as strings
        if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
        if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
        return 0;
      }
    });
    setSortedData(sortedArray);
  };

  // Handle sort request
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
    sortData([...data.data], key, direction);
  };

  // Get sort direction icon
  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return '↕️';
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  return (
    <div className={styles.tableContainer}>
      <div className={styles.tableHeader}>
        <div className={styles.totalReadings}>
          {data.data && data.data.length > 0 ?
            `Showing ${data.data.length} of ${data.total_count || '?'} entries` :
            'No entries found'}
        </div>
      </div>
      <table className={styles.dataTable}>
        <thead>
          <tr>
            <th onClick={() => handleSort('cow_id')} className={styles.sortableHeader}>
              Cow ID {getSortIcon('cow_id')}
            </th>
            <th onClick={() => handleSort('response_type')} className={styles.sortableHeader}>
              Response Type {getSortIcon('response_type')}
            </th>
            <th onClick={() => handleSort('time')} className={styles.sortableHeader}>
              Time {getSortIcon('time')}
            </th>
            <th onClick={() => handleSort('entry_id')} className={styles.sortableHeader}>
              Entry ID {getSortIcon('entry_id')}
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedData.map((entry, index) => (
            <tr key={entry.entry_id || index}>
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

      {hasMore && (
        <div className={styles.loadMoreContainer}>
          <button
            className={styles.loadMoreButton}
            onClick={onLoadMore}
            disabled={isLoading}
          >
            {isLoading ? 'Loading more entries...' : 'Load More'}
          </button>
        </div>
      )}
    </div>
  );
};

// API service
const fetchAnimalData = async (nextToken = null) => {
  try {
    let apiURL = process.env.NEXT_PUBLIC_API_URL + '/animal/data';

    // Add next_token as a query parameter if available
    if (nextToken) {
      apiURL += `?next_token=${encodeURIComponent(nextToken)}`;
    }

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
  const [nextToken, setNextToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalItems, setTotalItems] = useState(0);

  const loadAnimalData = async (token = null, reset = false) => {
    try {
      setIsLoading(true);
      const result = await fetchAnimalData(token);

      console.log("API Response:", result); // Add this to debug

      if (reset) {
        setAnimalData(result);
        // Use total_count if available, otherwise just use count
        setTotalItems(result.total_count !== undefined ? result.total_count : result.count);
      } else {
        // Append to existing data
        setAnimalData(prev => {
          if (prev && prev.data) {
            return {
              ...result,
              data: [...prev.data, ...result.data],
              count: prev.data.length + result.data.length,
              // Keep the total_count consistent
              total_count: result.total_count !== undefined ? result.total_count : prev.total_count
            };
          }
          return result;
        });
      }

      setNextToken(result.next_token);

    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Initial data load
    loadAnimalData(null, true);

    // Set up auto-refresh every 30 seconds
    const refreshInterval = setInterval(() => {
      loadAnimalData(null, true);
    }, 30000);

    return () => clearInterval(refreshInterval);
  }, []);

  const handleRefresh = () => {
    // Reset and reload
    loadAnimalData(null, true);
  };

  const handleLoadMore = () => {
    if (nextToken) {
      loadAnimalData(nextToken, false);
    }
  };

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Animal Happiness Dashboard</h1>
      <button className={styles.refreshButton} onClick={handleRefresh}>
        Refresh Data
      </button>
      <AnimalDataTable
        data={animalData}
        isLoading={isLoading}
        error={error}
        onLoadMore={handleLoadMore}
        hasMore={!!nextToken}
        totalItems={totalItems}
      />
    </main>
  );
}