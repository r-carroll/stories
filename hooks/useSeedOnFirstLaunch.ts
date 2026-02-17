import { useEffect, useState } from 'react';
import { database, User } from '../db';
import { seedDatabase } from '../db/seed';

/**
 * Hook that seeds the database with sample data if it's empty.
 * Useful for development and testing.
 */
export function useSeedOnFirstLaunch() {
  const [isReady, setIsReady] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);

  useEffect(() => {
    async function checkAndSeed() {
      try {
        // Check if we have any users
        const users = await database.get<User>('users').query().fetch();
        
        if (users.length === 0) {
          console.log('📦 Database is empty, seeding with sample data...');
          setIsSeeding(true);
          await seedDatabase();
          setIsSeeding(false);
        } else {
          console.log(`📦 Database already has ${users.length} users`);
        }
        
        setIsReady(true);
      } catch (error) {
        console.error('Error checking/seeding database:', error);
        setIsReady(true); // Continue anyway
      }
    }

    checkAndSeed();
  }, []);

  return { isReady, isSeeding };
}
