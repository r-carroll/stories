import { useEffect, useState } from 'react';
import { Q } from '@nozbe/watermelondb';
import { database, User, Friendship, Story } from '../db';

/**
 * Hook to fetch all active friendships with their associated users.
 */
export function useFriendships() {
  const [friendships, setFriendships] = useState<Friendship[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const subscription = database
      .get<Friendship>('friendships')
      .query(Q.where('status', 'active'))
      .observe()
      .subscribe({
        next: (results) => {
          setFriendships(results);
          setLoading(false);
        },
        error: (err) => {
          setError(err);
          setLoading(false);
        },
      });

    return () => subscription.unsubscribe();
  }, []);

  return { friendships, loading, error };
}

/**
 * Hook to fetch a single user by ID.
 */
export function useUser(userId: string | null) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const subscription = database
      .get<User>('users')
      .findAndObserve(userId)
      .subscribe({
        next: (result) => {
          setUser(result);
          setLoading(false);
        },
        error: () => {
          setUser(null);
          setLoading(false);
        },
      });

    return () => subscription.unsubscribe();
  }, [userId]);

  return { user, loading };
}

/**
 * Hook to fetch all stories for a specific recipient.
 */
export function useStoriesForRecipient(recipientId: string | null) {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!recipientId) {
      setLoading(false);
      return;
    }

    const subscription = database
      .get<Story>('stories')
      .query(Q.where('recipient_id', recipientId), Q.sortBy('created_at', Q.desc))
      .observe()
      .subscribe({
        next: (results) => {
          setStories(results);
          setLoading(false);
        },
        error: () => {
          setStories([]);
          setLoading(false);
        },
      });

    return () => subscription.unsubscribe();
  }, [recipientId]);

  return { stories, loading };
}

/**
 * Hook to fetch all stories (for history/logbook view).
 */
export function useAllStories() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const subscription = database
      .get<Story>('stories')
      .query(Q.sortBy('created_at', Q.desc))
      .observe()
      .subscribe({
        next: (results) => {
          setStories(results);
          setLoading(false);
        },
        error: () => {
          setStories([]);
          setLoading(false);
        },
      });

    return () => subscription.unsubscribe();
  }, []);

  return { stories, loading };
}

/**
 * Hook to get shared stories count for display purposes.
 */
export function useSharedStoriesCount() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const subscription = database
      .get<Story>('stories')
      .query(Q.where('is_shared', true))
      .observeCount()
      .subscribe({
        next: setCount,
        error: () => setCount(0),
      });

    return () => subscription.unsubscribe();
  }, []);

  return count;
}
