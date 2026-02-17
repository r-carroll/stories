import { Database } from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';

import schema from './schema';
import { User, Friendship, Story } from './models';

// Create the adapter to the underlying database
const adapter = new SQLiteAdapter({
  schema,
  jsi: true, // Use JSI for better performance (React Native)
  onSetUpError: (error) => {
    console.error('Database setup error:', error);
  },
});

// Create the Watermelon database instance
export const database = new Database({
  adapter,
  modelClasses: [User, Friendship, Story],
});

// Export models for convenience
export { User, Friendship, Story };
export type { FriendshipStatus } from './models';
