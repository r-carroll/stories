# Task: Story Editor

**Priority**: Medium
**Effort**: Medium
**Dependencies**: 04-friend-exchange

## Objectives
A minimalist, distraction-free writing environment.

## Sub-Tasks
- [ ] **UI Layout**: Dark background, light "Card" container for text input.
- [ ] **Input Handling**: Multi-line `TextInput` with auto-expanding height.
- [ ] **Metadata**: Date picker (default to Now) and "Dedicate to [FriendName]" pill.
- [ ] **Actions**:
    - "Save Draft": Autosave logic.
    - "Toss into Fire": Marks `is_shared = true` and triggers a burning/sending animation.
- [ ] **Keyboard Handling**: ensure `KeyboardAvoidingView` keeps the "Send" button visible.

## Acceptance Criteria
- Can write and save a text story.
- "Sending" a story moves it from Drafts to History effectively (db update).
