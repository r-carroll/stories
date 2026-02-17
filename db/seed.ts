import { database, User, Friendship, Story } from './index';

/**
 * Sample data for seeding the database with dummy friends and stories.
 * This is useful for testing the UI during development.
 */

const SAMPLE_USERS = [
  {
    username: 'Sarah Chen',
    avatarUrl: 'https://i.pravatar.cc/150?u=sarah',
  },
  {
    username: 'Marcus Rivera',
    avatarUrl: 'https://i.pravatar.cc/150?u=marcus',
  },
  {
    username: 'Emma Thompson',
    avatarUrl: 'https://i.pravatar.cc/150?u=emma',
  },
  {
    username: 'James Okonkwo',
    avatarUrl: 'https://i.pravatar.cc/150?u=james',
  },
  {
    username: 'Priya Patel',
    avatarUrl: 'https://i.pravatar.cc/150?u=priya',
  },
  {
    username: 'Alex Kim',
    avatarUrl: 'https://i.pravatar.cc/150?u=alex',
  },
];

const SAMPLE_STORIES = [
  {
    title: 'Coffee Shop Discovery',
    body: 'Remember that tiny coffee shop we stumbled upon in the rain? The one with the mismatched chairs and the owner who knew everyone by name. I think about that afternoon often.',
    sentiment: 'nostalgic',
  },
  {
    title: 'Late Night Conversations',
    body: "Those 2 AM talks we used to have, solving the world's problems while eating cold pizza. Nothing was off-limits. I miss that kind of honesty.",
    sentiment: 'warm',
  },
  {
    title: 'The Camping Trip',
    body: 'When the tent collapsed and we ended up sleeping in the car, laughing so hard we could barely breathe. Best worst trip ever.',
    sentiment: 'joyful',
  },
  {
    title: 'Graduation Day',
    body: "Standing there in those ridiculous robes, feeling like we'd conquered the world. You were the first person I wanted to hug.",
    sentiment: 'proud',
  },
  {
    title: 'Moving Day',
    body: 'You showed up with boxes and pizza without me even asking. Some people just know when you need them.',
    sentiment: 'grateful',
  },
  {
    title: 'The Concert',
    body: 'We sang every word, completely off-key, completely happy. The people around us probably hated us. Worth it.',
    sentiment: 'joyful',
  },
  {
    title: 'Kitchen Disaster',
    body: 'Your attempt at making paella turned into scrambled rice with seafood. We ordered takeout and called it fusion cuisine.',
    sentiment: 'funny',
  },
  {
    title: 'First Day Nerves',
    body: 'You texted me every hour during my first day at the new job. Each message made me feel like I could do anything.',
    sentiment: 'supportive',
  },
];

/**
 * Seeds the database with sample users, friendships, and stories.
 * Clears existing data first to ensure a clean slate.
 */
export async function seedDatabase(): Promise<void> {
  console.log('🌱 Starting database seed...');

  await database.write(async () => {
    // Clear existing data
    const existingStories = await database.get<Story>('stories').query().fetch();
    const existingFriendships = await database.get<Friendship>('friendships').query().fetch();
    const existingUsers = await database.get<User>('users').query().fetch();

    await Promise.all([
      ...existingStories.map((s) => s.destroyPermanently()),
      ...existingFriendships.map((f) => f.destroyPermanently()),
      ...existingUsers.map((u) => u.destroyPermanently()),
    ]);

    console.log('📝 Cleared existing data');

    // Create the current user first
    const currentUser = await database.get<User>('users').create((user) => {
      user.username = 'Me';
      user.avatarUrl = null;
    });

    console.log('👤 Created current user');

    // Create sample friend users
    const friendUsers: User[] = [];
    for (const userData of SAMPLE_USERS) {
      const user = await database.get<User>('users').create((u) => {
        u.username = userData.username;
        u.avatarUrl = userData.avatarUrl;
      });
      friendUsers.push(user);
    }

    console.log(`👥 Created ${friendUsers.length} friend users`);

    // Create friendships for each user
    const friendships: Friendship[] = [];
    for (let i = 0; i < friendUsers.length; i++) {
      const untoldCount = Math.floor(Math.random() * 4); // 0-3 untold stories
      const status = i === 5 ? 'pending' : 'active'; // Make the last one pending

      const friendship = await database.get<Friendship>('friendships').create((f) => {
        f.userId = friendUsers[i].id;
        f.status = status;
        f.untoldCount = untoldCount;
      });
      friendships.push(friendship);
    }

    console.log(`🤝 Created ${friendships.length} friendships`);

    // Create sample stories - distribute among friends
    let storyCount = 0;
    for (let i = 0; i < SAMPLE_STORIES.length; i++) {
      const storyData = SAMPLE_STORIES[i];
      const friendIndex = i % (friendUsers.length - 1); // Exclude the pending friend
      const friend = friendUsers[friendIndex];
      const isShared = Math.random() > 0.3; // 70% chance of being shared
      const isLocked = !isShared && Math.random() > 0.5; // Some unshared stories are locked
      const createdAt = Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000); // Random date in last 30 days

      await database.get<Story>('stories').create((story) => {
        story.authorId = currentUser.id;
        story.recipientId = friend.id;
        story.title = storyData.title;
        story.body = storyData.body;
        story.isLocked = isLocked;
        story.isShared = isShared;
        story.createdAt = createdAt;
        story.unlockedAt = isShared ? createdAt + 86400000 : null; // Unlocked a day after creation if shared
        story.sentiment = storyData.sentiment;
      });
      storyCount++;
    }

    console.log(`📖 Created ${storyCount} stories`);
  });

  console.log('✅ Database seeding complete!');
}

/**
 * Clears all data from the database.
 */
export async function clearDatabase(): Promise<void> {
  console.log('🗑️ Clearing database...');

  await database.write(async () => {
    const existingStories = await database.get<Story>('stories').query().fetch();
    const existingFriendships = await database.get<Friendship>('friendships').query().fetch();
    const existingUsers = await database.get<User>('users').query().fetch();

    await Promise.all([
      ...existingStories.map((s) => s.destroyPermanently()),
      ...existingFriendships.map((f) => f.destroyPermanently()),
      ...existingUsers.map((u) => u.destroyPermanently()),
    ]);
  });

  console.log('✅ Database cleared!');
}

/**
 * Logs the current state of the database for debugging.
 */
export async function debugDatabase(): Promise<void> {
  const users = await database.get<User>('users').query().fetch();
  const friendships = await database.get<Friendship>('friendships').query().fetch();
  const stories = await database.get<Story>('stories').query().fetch();

  console.log('\n📊 Database State:');
  console.log(`  Users: ${users.length}`);
  console.log(`  Friendships: ${friendships.length}`);
  console.log(`  Stories: ${stories.length}`);

  console.log('\n👥 Users:');
  users.forEach((u) => console.log(`  - ${u.username} (${u.id})`));

  console.log('\n🤝 Friendships:');
  friendships.forEach((f) => console.log(`  - User ${f.userId}: ${f.status}, ${f.untoldCount} untold`));

  console.log('\n📖 Stories:');
  stories.forEach((s) => console.log(`  - "${s.title}" (shared: ${s.isShared}, locked: ${s.isLocked})`));
}

export default {
  seedDatabase,
  clearDatabase,
  debugDatabase,
};
