
# Task: Database Layer (WatermelonDB)

**Priority**: High
**Effort**: Medium
**Dependencies**: 01-project-setup

## Objectives
Implement the local-first database schema to persist users, friends, and stories.

## Sub-Tasks
- [x] **Schema Definition**: Finalize `db/schema.ts` with `users`, `friendships`, and `stories` tables.
- [x] **Models**: Create Class Models for each table:
    - `User.ts`: `username`, `avatar`.
    - `Friendship.ts`: `status`, `untold_stories_count`.
    - `Story.ts`: `title`, `body`, `is_locked`, `is_shared`, `unlocked_at`.
- [x] **Database Provider**: Wrap the root app component with the Database Provider to ensure connectivity.
- [x] **Seed Script**: Create a utility to seed 5-6 dummy friends and stories for testing the UI.

## Acceptance Criteria
- Database initializes successfully on launch.
- Can query/create/update records in all three tables.
