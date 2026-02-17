import React, { ReactNode } from 'react';
import { DatabaseProvider } from '@nozbe/watermelondb/react';
import { database } from './index';

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
      {children}
    </DatabaseProvider>
  );
}

export default StoriesDatabaseProvider;
