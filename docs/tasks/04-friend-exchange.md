# Task: Friend Detail "The Exchange"

**Priority**: Medium
**Effort**: Medium
**Dependencies**: 02-database-layer

## Objectives
The split view showing the bidirectional relationship: "My Satchel" (Drafts) vs. "Their Offerings" (Locked/Unlocked Stories).

## Sub-Tasks
- [ ] **Layout**: Create a vertical scroll view with two distinct sections.
- [ ] **"Their Offerings" Section**:
    - Query stories where `author = Friend` AND `recipient = Me`.
    - **Locked Card**: Title + Date + Lock Icon + "Frosted" background.
    - **Unlocked Card**: Title + Date + "Read" indicator.
- [ ] **"My Satchel" Section**:
    - Query stories where `author = Me` AND `recipient = Friend`.
    - **Draft Card**: "Edit" button.
    - **Unsent Card**: "Toss in Fire" button.
- [ ] **Transitions**: Shared Element Transition from the Home Screen avatar to this screen's header.

## Acceptance Criteria
- Correctly separates incoming vs outgoing stories.
- Locked stories obscure the body text.
