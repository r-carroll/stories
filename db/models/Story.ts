import { Model, Relation } from '@nozbe/watermelondb';
import { field, text, date, readonly, relation } from '@nozbe/watermelondb/decorators';
import User from './User';
import Friendship from './Friendship';

export default class Story extends Model {
  static table = 'stories';

  static associations = {
    users: { type: 'belongs_to' as const, key: 'author_id' },
    friendships: { type: 'belongs_to' as const, key: 'recipient_id' },
  };

  @text('author_id') authorId!: string;
  @text('recipient_id') recipientId!: string;
  @text('title') title!: string;
  @text('body') body!: string;
  @field('is_locked') isLocked!: boolean;
  @field('is_shared') isShared!: boolean;
  @field('created_at') createdAt!: number;
  @field('unlocked_at') unlockedAt!: number | null;
  @text('sentiment') sentiment!: string | null;

  @relation('users', 'author_id') author!: Relation<User>;
}
