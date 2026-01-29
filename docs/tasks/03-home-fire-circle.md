# Task: Home Screen "The Fire Circle"

**Priority**: High
**Effort**: Large
**Dependencies**: 02-database-layer, 01-project-setup

## Objectives
Build the core "Campfire" navigation interface where users select friends.

## Sub-Tasks
- [ ] **Fire Animation**: Create a subtle, looping Lottie or Reanimated fire effect in the center of the screen.
- [ ] **Rotary Layout**: Implement a circular layout engine (using `Math.sin`/`cos`) to position Avatar nodes around the fire.
- [ ] **Gesture Control**: Add `react-native-gesture-handler` logic to allow dragging/spinning the circle.
- [ ] **Selection Logic**: Snapping the closest avatar to the "6 o'clock" position (Active State).
- [ ] **Visual States**:
    - **Active**: Large, illuminated, name visible.
    - **Inactive**: Smaller, dimmed, pushed back in Z-index.
    - **Notification**: "Ember" glow if they have stories for you.

## Acceptance Criteria
- Users can rotate the circle smoothly.
- The active user snaps to the front.
- Tapping the active user navigates to `/friend/[id]`.
