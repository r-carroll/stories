import { Q } from '@nozbe/watermelondb';
import { database, User, Friendship, Story, FriendshipStatus } from './index';

// ============================================================================
// USER OPERATIONS
// ============================================================================

/**
 * Creates a new user in the database.
 */
export async function createUser(
  username: string,
  avatarUrl?: string,
  publicKey?: string
): Promise<User> {
  return await database.write(async () => {
    return await database.get<User>('users').create((user) => {
      user.username = username;
      user.avatarUrl = avatarUrl ?? null;
      user.publicKey = publicKey ?? null;
    });
  });
}

/**
 * Updates an existing user.
 */
export async function updateUser(
  userId: string,
  updates: { username?: string; avatarUrl?: string; publicKey?: string }
): Promise<User> {
  return await database.write(async () => {
    const user = await database.get<User>('users').find(userId);
    return await user.update((u) => {
      if (updates.username !== undefined) u.username = updates.username;
      if (updates.avatarUrl !== undefined) u.avatarUrl = updates.avatarUrl;
      if (updates.publicKey !== undefined) u.publicKey = updates.publicKey;
    });
  });
}

/**
 * Gets a user by ID.
 */
export async function getUserById(userId: string): Promise<User | null> {
  try {
    return await database.get<User>('users').find(userId);
  } catch {
    return null;
  }
}

/**
 * Gets all users.
 */
export async function getAllUsers(): Promise<User[]> {
  return await database.get<User>('users').query().fetch();
}

// ============================================================================
// FRIENDSHIP OPERATIONS
// ============================================================================

/**
 * Creates a new friendship.
 */
export async function createFriendship(
  userId: string,
  status: FriendshipStatus = 'active'
): Promise<Friendship> {
  return await database.write(async () => {
    return await database.get<Friendship>('friendships').create((friendship) => {
      friendship.userId = userId;
      friendship.status = status;
      friendship.untoldCount = 0;
    });
  });
}

/**
 * Updates friendship status.
 */
export async function updateFriendshipStatus(
  friendshipId: string,
  status: FriendshipStatus
): Promise<Friendship> {
  return await database.write(async () => {
    const friendship = await database.get<Friendship>('friendships').find(friendshipId);
    return await friendship.update((f) => {
      f.status = status;
    });
  });
}

/**
 * Increments the untold stories count for a friendship.
 */
export async function incrementUntoldCount(friendshipId: string): Promise<Friendship> {
  return await database.write(async () => {
    const friendship = await database.get<Friendship>('friendships').find(friendshipId);
    return await friendship.update((f) => {
      f.untoldCount = f.untoldCount + 1;
    });
  });
}

/**
 * Decrements the untold stories count for a friendship.
 */
export async function decrementUntoldCount(friendshipId: string): Promise<Friendship> {
  return await database.write(async () => {
    const friendship = await database.get<Friendship>('friendships').find(friendshipId);
    return await friendship.update((f) => {
      f.untoldCount = Math.max(0, f.untoldCount - 1);
    });
  });
}

/**
 * Gets all active friendships.
 */
export async function getActiveFriendships(): Promise<Friendship[]> {
  return await database
    .get<Friendship>('friendships')
    .query(Q.where('status', 'active'))
    .fetch();
}

/**
 * Gets a friendship by user ID.
 */
export async function getFriendshipByUserId(userId: string): Promise<Friendship | null> {
  const results = await database
    .get<Friendship>('friendships')
    .query(Q.where('user_id', userId))
    .fetch();
  return results[0] ?? null;
}

// ============================================================================
// STORY OPERATIONS
// ============================================================================

/**
 * Creates a new story.
 */
export async function createStory(params: {
  authorId: string;
  recipientId: string;
  title: string;
  body: string;
  isLocked?: boolean;
  sentiment?: string;
}): Promise<Story> {
  return await database.write(async () => {
    return await database.get<Story>('stories').create((story) => {
      story.authorId = params.authorId;
      story.recipientId = params.recipientId;
      story.title = params.title;
      story.body = params.body;
      story.isLocked = params.isLocked ?? false;
      story.isShared = false;
      story.createdAt = Date.now();
      story.unlockedAt = null;
      story.sentiment = params.sentiment ?? null;
    });
  });
}

/**
 * Updates a story's content.
 */
export async function updateStory(
  storyId: string,
  updates: { title?: string; body?: string; sentiment?: string }
): Promise<Story> {
  return await database.write(async () => {
    const story = await database.get<Story>('stories').find(storyId);
    return await story.update((s) => {
      if (updates.title !== undefined) s.title = updates.title;
      if (updates.body !== undefined) s.body = updates.body;
      if (updates.sentiment !== undefined) s.sentiment = updates.sentiment;
    });
  });
}

/**
 * Shares a story (marks it as shared and sets unlocked time).
 */
export async function shareStory(storyId: string): Promise<Story> {
  return await database.write(async () => {
    const story = await database.get<Story>('stories').find(storyId);
    return await story.update((s) => {
      s.isShared = true;
      s.isLocked = false;
      s.unlockedAt = Date.now();
    });
  });
}

/**
 * Locks a story.
 */
export async function lockStory(storyId: string): Promise<Story> {
  return await database.write(async () => {
    const story = await database.get<Story>('stories').find(storyId);
    return await story.update((s) => {
      s.isLocked = true;
    });
  });
}

/**
 * Unlocks a story.
 */
export async function unlockStory(storyId: string): Promise<Story> {
  return await database.write(async () => {
    const story = await database.get<Story>('stories').find(storyId);
    return await story.update((s) => {
      s.isLocked = false;
      s.unlockedAt = Date.now();
    });
  });
}

/**
 * Deletes a story permanently.
 */
export async function deleteStory(storyId: string): Promise<void> {
  await database.write(async () => {
    const story = await database.get<Story>('stories').find(storyId);
    await story.destroyPermanently();
  });
}

/**
 * Gets a story by ID.
 */
export async function getStoryById(storyId: string): Promise<Story | null> {
  try {
    return await database.get<Story>('stories').find(storyId);
  } catch {
    return null;
  }
}

/**
 * Gets all stories for a specific recipient.
 */
export async function getStoriesForRecipient(recipientId: string): Promise<Story[]> {
  return await database
    .get<Story>('stories')
    .query(Q.where('recipient_id', recipientId), Q.sortBy('created_at', Q.desc))
    .fetch();
}

/**
 * Gets all shared stories.
 */
export async function getSharedStories(): Promise<Story[]> {
  return await database
    .get<Story>('stories')
    .query(Q.where('is_shared', true), Q.sortBy('created_at', Q.desc))
    .fetch();
}

/**
 * Gets all unshared stories.
 */
export async function getUnsharedStories(): Promise<Story[]> {
  return await database
    .get<Story>('stories')
    .query(Q.where('is_shared', false), Q.sortBy('created_at', Q.desc))
    .fetch();
}

/**
 * Gets the count of unshared stories for a recipient.
 */
export async function getUnsharedStoriesCount(recipientId: string): Promise<number> {
  return await database
    .get<Story>('stories')
    .query(Q.where('recipient_id', recipientId), Q.where('is_shared', false))
    .fetchCount();
}
