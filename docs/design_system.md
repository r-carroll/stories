# Stories App: Design System & UX Spec

**Theme**: The Digital Campfire
**Core Vibe**: Warm, Intimate, Outdoorsy, "Hygge".

## 1. Color Palette

### The Night Sky (Backgrounds)
*   **Deep Forest**: `#0F172A` (Main Background) - A very dark blue-grey, softer than pure black.
*   **Charcoal**: `#1E293B` (Surface/Cards) - For lists and story cards.

### The Fire (Primary/Accents)
*   **Ember Orange**: `#F97316` (Primary Action / Glow) - Used for the "active" fire and "unsent" stories.
*   **Gold Spark**: `#FBBF24` (Highlights) - Subtle glimmers or selection states.

### The Scroll (Typography/Content)
*   **Parchment**: `#E2E8F0` (Primary Text) - Off-white, readable.
*   **Ash**: `#94A3B8` (Secondary Text) - For dates and metadata.

## 2. Typography
We use a classic pairing to evoke storytelling.
*   **Headings**: *Young Serif* (or similar). Elegant, nostalgic.
*   **Body**: *Inter* or *Outfit*. Clean, modern, legible.

## 3. UI Components & Behaviors

### A. The Fire Circle (Home Screen)
*   **Concept**: Variation 1 "The Gathering" (First Person).
*   **Behavior**:
    *   **Idle**: The fire flickers gently in the center.
    *   **Scroll**: Dragging left/right rotates the friends around the fire.
    *   **Selection**: The friend closest to you (bottom center) becomes fully illuminated.
    *   **Status**: Friends with "Stories for you" have a small ember glow near them.

### B. Story Cards
*   **Locked State**: Minimal "Frosted Glass" card with a simple lock icon.
*   **Unlocked State**: Clean, warm off-white card (`#F8FAFC`) with dark text. No burnt edges.

### C. Transitions
*   **Fire to Detail**: Smooth ease-in zoom.
*   **Unlock**: A subtle "glow" animation that reveals text.

## 4. Pending Visuals (To Be Designed)
*   [ ] **The Editor**: A clean, distraction-free writing space. Modern and airy.
*   [ ] **The History**: A clean minimal timeline of shared moments.
