import { Model, Relation } from '@nozbe/watermelondb';
import { field, text, relation, children } from '@nozbe/watermelondb/decorators';
import User from './User';
import Story from './Story';

export type FriendshipStatus = 'active' | 'pending' | 'blocked';

export default class Friendship extends Model {
  static table = 'friendships';

  static associations = {
    users: { type: 'belongs_to' as const, key: 'user_id' },
    stories: { type: 'has_many' as const, foreignKey: 'recipient_id' },
  };

  @text('user_id') userId!: string;
  @text('status') status!: FriendshipStatus;
  @field('untold_count') untoldCount!: number;

  @relation('users', 'user_id') user!: Relation<User>;
}
