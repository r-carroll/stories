import { appSchema, tableSchema } from '@nozbe/watermelondb'

export default appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: 'users',
      columns: [
        { name: 'username', type: 'string' },
        { name: 'avatar_url', type: 'string', isOptional: true },
        { name: 'public_key', type: 'string', isOptional: true },
      ],
    }),
    tableSchema({
      name: 'friendships',
      columns: [
        { name: 'user_id', type: 'string', isIndexed: true },
        { name: 'status', type: 'string' }, // 'active', 'pending', 'blocked'
        { name: 'untold_count', type: 'number' },
      ],
    }),
    tableSchema({
      name: 'stories',
      columns: [
        { name: 'author_id', type: 'string', isIndexed: true },
        { name: 'recipient_id', type: 'string', isIndexed: true },
        { name: 'title', type: 'string' },
        { name: 'body', type: 'string' },
        { name: 'is_locked', type: 'boolean' },
        { name: 'is_shared', type: 'boolean' },
        { name: 'created_at', type: 'number' },
        { name: 'unlocked_at', type: 'number', isOptional: true },
        { name: 'sentimient', type: 'string', isOptional: true },
      ],
    }),
  ],
})
