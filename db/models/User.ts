import { Model } from '@nozbe/watermelondb';
import { field, text, children } from '@nozbe/watermelondb/decorators';

export default class User extends Model {
  static table = 'users';

  static associations = {
    friendships: { type: 'has_many' as const, foreignKey: 'user_id' },
    stories: { type: 'has_many' as const, foreignKey: 'author_id' },
    received_stories: { type: 'has_many' as const, foreignKey: 'recipient_id' },
  };

  @text('username') username!: string;
  @text('avatar_url') avatarUrl!: string | null;
  @text('public_key') publicKey!: string | null;

  @children('friendships') friendships: any;
  @children('stories') authoredStories: any;
  @children('stories') receivedStories: any;
}
