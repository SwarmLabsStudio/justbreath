# Implementation Plan - JustBreath
Browser-based real-time breath-responsive sound and visual relaxation app.

## 1. Project Setup
- [x] Initialize Next.js App (No Tailwind, TypeScript, App Router)
- [x] Install `lucide-react`
- [ ] Clean up `globals.css` and `page.module.css`
- [ ] Create folder structure: `components`, `hooks`, `lib`, `assets`

## 2. Audio Engine (Input & Output)
- [ ] **Microphone Input (`useMicrophone.ts`)**:
    - Request permissions.
    - Create `AudioContext` and `MediaStreamSource`.
    - Implement `AnalyserNode` to extract volume/RMS.
    - Return a reactive `breathValue` (0.0 to 1.0).
- [ ] **Audio Output (`SoundEngine.ts` / `useSoundScapes.ts`)**:
    - Manage "Flow" and "Relaxation" presets.
    - Since we don't have external assets, implement a **Web Audio API Oscillators** fallback to generate:
        - Binaural beats (Sine waves with slight offset).
        - Brown/Pink noise for texture.
    - Handle smooth fade-ins and fade-outs.

## 3. Visual Engine (Canvas)
- [ ] **Canvas Component (`BreathVisualizer.tsx`)**:
    - Fullscreen 2D Canvas.
    - `requestAnimationFrame` loop.
- [ ] **Visual Logic**:
    - **Entity**: A central "Being" (circle/blob) that breathes.
    - **Mapping**: 
        - High volume (Inhale) -> Expansion, Color Shift (Warmer/Brighter).
        - Low volume (Exhale) -> Contraction, Color Shift (Cooler/Dimmer).
    - **Physics**: Smooth lerping to avoid jitter.

## 4. UI Implementation
- [ ] **Global Styles**: Dark theme, custom CSS variables for colors.
- [ ] **Home/Setup Screen**:
    - Title "JustBreath".
    - Select Session: "Flow" (Focus) vs "Relaxation" (Calm).
    - Select Duration: 5, 10, 20, 30 min.
    - "Start Experience" button.
- [ ] **Active Session Screen**:
    - Minimal UI (fades out after a few seconds).
    - "Breathing Instructions" (Inhale... Exhale...).
    - Timer (optional/hidden).
    - End Session button.

## 5. Integration
- [ ] **State Management**: Simple React State in `page.tsx` or a wrapper context to switch views.
- [ ] **Transition Logic**: Handling the "Session Complete" state.

## 6. Refinement
- [ ] Performance optimization (Git rid of React renders in the loops).
- [ ] Responsive check (Mobile vs Desktop).
