# Task: History Logbook

**Priority**: Low (MVP)
**Effort**: Small
**Dependencies**: 02-database-layer

## Objectives
A global timeline of all shared memories.

## Sub-Tasks
- [ ] **Query**: Fetch all stories where `is_shared = true` (both sent and received), sorted by Date (DESC).
- [ ] **UI Card**: Reuse the "Exchange" card implementation but add context (e.g., "From Alex").
- [ ] **Search**: Simple local text search filter.

## Acceptance Criteria
- Shows a timeline of stories.
- Can tap a story to read it.
