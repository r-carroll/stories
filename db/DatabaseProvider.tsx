import React, { createContext, useContext, ReactNode } from 'react';
import { Database } from '@nozbe/watermelondb';
import { DatabaseProvider } from '@nozbe/watermelondb/react';
import { database } from './index';

// Create a context for accessing the database directly
const DatabaseContext = createContext<Database | null>(null);

interface StoriesDatabaseProviderProps {
  children: ReactNode;
}

/**
 * Database Provider component that wraps the app and provides
 * access to the WatermelonDB database instance.
 */
export function StoriesDatabaseProvider({ children }: StoriesDatabaseProviderProps) {
  return (
    <DatabaseProvider database={database}>
      <DatabaseContext.Provider value={database}>
        {children}
      </DatabaseContext.Provider>
    </DatabaseProvider>
  );
}

/**
 * Hook to access the WatermelonDB database instance directly.
 * Useful for performing database operations outside of withObservables.
 */
export function useDatabase(): Database {
  const db = useContext(DatabaseContext);
  if (!db) {
    throw new Error('useDatabase must be used within a StoriesDatabaseProvider');
  }
  return db;
}

export default StoriesDatabaseProvider;
