# Implementation Plan: Portfolio Redesign

## Overview

This plan builds the portfolio incrementally, section by section, so that each task produces something visually verifiable. The architecture uses vanilla HTML/CSS/JS with ES modules, CSS custom properties for theming, Intersection Observer for scroll animations, and structured JS data objects for content separation. Tests use vitest + fast-check for property-based testing.

## Tasks

- [x] 1. Set up project foundation and testing infrastructure
  - [x] 1.1 Create the CSS custom properties and base styles in style.css
    - Replace existing style.css with the complete design token system (colors, typography, spacing, animation variables)
    - Add base reset styles, font imports (Playfair Display, Inter, JetBrains Mono), and root-level layout rules
    - Include the `[data-theme="dark"]` override block for night mode custom properties
    - Add `.will-animate` and `.is-visible` utility classes for the animation system
    - Add `prefers-reduced-motion` media query that disables `.will-animate` hiding
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 8.5, 8.6_

  - [x] 1.2 Create the semantic HTML shell in index.html
    - Rewrite index.html with full semantic landmark structure per the design (skip-link, landing section, main-wrapper with nav header, about/interests/coder sections, footer, terminal overlay)
    - Add proper `aria-label`, `role`, and `aria-hidden` attributes
    - Include `<script src="content-data.js"></script>` and `<script src="main.js" type="module" defer></script>`
    - Add `loading="lazy"` to non-viewport images and `defer` to scripts
    - _Requirements: 12.1, 12.4, 11.2, 11.3, 13.1_

  - [x] 1.3 Create content-data.js with structured content objects
    - Define and export `profileData`, `interestsData`, `coderData`, and `easterEggCommands` objects per the data model in the design
    - Populate with real content (interests list of 18+ items, skills, projects, timeline, easter egg responses)
    - _Requirements: 13.1, 13.2_

  - [x] 1.4 Create main.js module entry point with graceful degradation skeleton
    - Set up `DOMContentLoaded` listener that initializes all modules in try/catch blocks per the error handling pattern
    - Import/instantiate stubs for: LandingController, NavigationController, AnimationSystem, ThemeSystem, EasterEggSystem, ContentRenderer
    - Implement the fallback pattern: if AnimationSystem fails, remove `.will-animate` from all elements
    - _Requirements: 11.4, 8.1_

  - [x] 1.5 Set up vitest and fast-check testing infrastructure
    - Initialize package.json with vitest and fast-check as dev dependencies
    - Create vitest.config.js with jsdom environment for DOM testing
    - Create a test helper file (tests/setup.js) with DOM mocking utilities
    - Verify test runner works with a trivial passing test
    - _Requirements: (testing infrastructure)_

- [ ] 2. Implement Landing Section with typewriter animation
  - [ ] 2.1 Implement LandingController class
    - Create LandingController with `start()`, `skip()`, `_onComplete()` methods
    - Implement blinking cursor for `cursorBlinkDuration` ms before typing begins
    - Implement character-by-character typing at random speed within [50ms, 120ms] range
    - After typing completes, pause for 800ms then trigger CSS fade transition (1000ms)
    - Add event listeners for click/scroll/keydown that call `skip()` to bypass animation
    - On completion, set `aria-hidden="true"` on landing, `aria-hidden="false"` on main-wrapper
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6_

  - [ ] 2.2 Add Landing Section CSS styles
    - Style the landing overlay (full-viewport, centered cursor and text, monospace font)
    - Add cursor blink keyframe animation
    - Add fade-out/slide-up transition for landing dismissal (1000ms, ease-out)
    - _Requirements: 1.4, 1.6_

  - [ ]* 2.3 Write property test for typewriter timing bounds (Property 1)
    - **Property 1: Typewriter timing stays within bounds**
    - Generate random delay arrays and source text strings with fast-check
    - Verify each delay is in [50, 120] ms range and accumulated characters equal first N chars of source
    - **Validates: Requirements 1.2**

- [ ] 3. Implement Navigation System
  - [ ] 3.1 Implement NavigationController class
    - Create NavigationController with `navigateTo()`, `updateActiveState()`, `toggleMobileMenu()`, `getCurrentSection()` methods
    - Use IntersectionObserver to detect which section is in view and update `aria-current` on nav links
    - Implement smooth scroll via `scrollIntoView({ behavior: 'smooth' })`
    - Implement mobile hamburger menu toggle with `aria-expanded` state management
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

  - [ ] 3.2 Add Navigation CSS styles
    - Style persistent top nav bar with logo, links, theme toggle, and mobile toggle
    - Add active link indicator styling (underline or highlight keyed to `aria-current="true"`)
    - Add mobile menu slide-in panel styles for viewports < 768px
    - Add smooth transition for nav link active states (800ms max for section transitions)
    - _Requirements: 2.3, 2.4, 2.5, 10.2_

  - [ ]* 3.3 Write property test for active navigation tracking (Property 2)
    - **Property 2: Active navigation indicator tracks scroll position**
    - Generate random scroll positions, verify the active nav link corresponds to the section whose top boundary is in viewport
    - **Validates: Requirements 2.5**

- [ ] 4. Implement Animation System
  - [ ] 4.1 Implement AnimationSystem class
    - Create AnimationSystem with `observe()`, `isReducedMotion()`, `destroy()` methods
    - Create single IntersectionObserver instance with configurable threshold (0.15) and rootMargin
    - Add `.is-visible` class to elements when intersection ratio exceeds threshold
    - Check `prefers-reduced-motion: reduce` — if active, skip `.will-animate` hiding and don't observe
    - Implement `once: true` behavior (unobserve after first reveal)
    - _Requirements: 8.1, 8.2, 8.5, 8.6_

  - [ ] 4.2 Add scroll-reveal animation CSS
    - Define `.will-animate` base state (opacity: 0, transform: translateY(20px))
    - Define `.is-visible` animated state (opacity: 1, transform: translateY(0)) with ease-out transition
    - Add section-specific entrance variants (fade-in, slide-up, scale-in)
    - Ensure all animations use only `transform` and `opacity` for GPU acceleration
    - Add `@media (prefers-reduced-motion: reduce)` override that removes transform/opacity hiding
    - _Requirements: 8.1, 8.2, 8.6, 3.5, 4.5, 8.5_

  - [ ]* 4.3 Write property test for scroll-triggered visibility (Property 9)
    - **Property 9: Scroll-triggered visibility class application**
    - Generate random DOM elements registered with AnimationSystem, simulate intersection, verify `.is-visible` class is added only after threshold exceeded
    - **Validates: Requirements 3.5, 8.1**

  - [ ]* 4.4 Write property test for reduced motion (Property 10)
    - **Property 10: Reduced motion preference disables animations**
    - Generate element sets, mock `matchMedia` for `prefers-reduced-motion: reduce`, verify no `.will-animate` hiding is applied
    - **Validates: Requirements 8.5**

  - [ ]* 4.5 Write property test for GPU-friendly properties (Property 11)
    - **Property 11: Animations use only GPU-friendly properties**
    - Parse CSS animation/transition rules from style.css, verify animated properties are limited to `transform` and `opacity` (excluding theme color transitions)
    - **Validates: Requirements 8.6**

- [ ] 5. Checkpoint - Verify foundation works
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 6. Implement About Section
  - [ ] 6.1 Implement ContentRenderer — About section rendering
    - Build the `renderAbout()` or equivalent method in ContentRenderer
    - Render profile image, bio, traits grid from `profileData`
    - Generate semantic HTML with grid layout structure and `.will-animate` classes
    - Assign ARIA attributes and proper heading hierarchy
    - _Requirements: 3.1, 3.3, 13.1, 13.3, 12.1_

  - [ ] 6.2 Add About Section CSS styles
    - Style clean grid layout with thin grid lines and notebook-inspired aesthetic
    - Add warm beige background and soft gold accent colors via section-specific custom properties
    - Add hover transitions on designated elements to reveal hidden details/flourishes
    - Add scroll-reveal animation classes for content entry (fade-in/slide-up)
    - _Requirements: 3.1, 3.2, 3.4, 3.5_

  - [ ]* 6.3 Write property test for About section rendering (Property 3)
    - **Property 3: About section renders all required profile fields**
    - Generate random valid profileData objects with `bio` and `traits` fields
    - Verify rendered output contains text nodes matching each field value
    - **Validates: Requirements 3.3**

- [ ] 7. Implement Interests Section
  - [ ] 7.1 Implement ContentRenderer — Interest cards rendering
    - Build `renderInterestCards(containerEl)` method in ContentRenderer
    - Generate card elements from `interestsData` array with title, icon, description, accent color
    - Apply `size` property for visual variety (small/medium/large card sizes)
    - Assign `.will-animate` class and `role="listitem"` to each card
    - _Requirements: 4.1, 4.2, 4.6, 13.1, 13.3_

  - [ ] 7.2 Add Interests Section CSS styles
    - Style flowing masonry/staggered grid layout with varied card sizes
    - Apply per-card accent color via inline custom property or class
    - Add organic styling: soft edges, border-radius, gentle rotation variations
    - Add hover effects (scale, shadow lift, color shift) with CSS transitions
    - Add earth tone / organic green section palette
    - Add card entrance animations triggered by `.is-visible`
    - _Requirements: 4.1, 4.3, 4.4, 4.5, 4.6_

  - [ ]* 7.3 Write property test for interest card rendering fidelity (Property 4)
    - **Property 4: Interest card rendering fidelity and visual variety**
    - Generate random interestsData arrays with unique accentColor values
    - Verify exactly N cards are rendered, each containing its title text, and distinct accents produce distinct styling
    - **Validates: Requirements 4.2, 4.6**

  - [ ]* 7.4 Write property test for content rendering structural consistency (Property 14)
    - **Property 14: Content rendering data fidelity and structural consistency**
    - Generate random content data arrays, verify DOM elements text matches data, and all sibling elements share identical DOM structure
    - **Validates: Requirements 13.1, 13.3**

- [ ] 8. Implement Coder Section
  - [ ] 8.1 Implement ContentRenderer — Coder section rendering (skills, projects, timeline)
    - Build `renderSkills(containerEl)`, `renderProjectCards(containerEl)`, and `renderTimeline(containerEl)` methods
    - Render skills as categorized tags/badges from `coderData.skills`
    - Render project cards with title, description, tech stack, and link
    - Render experience timeline as vertical chronological display
    - Apply `.will-animate` classes for scroll animation pickup
    - _Requirements: 5.2, 5.4, 5.5, 5.6, 13.1, 13.3_

  - [ ] 8.2 Add Coder Section CSS styles
    - Style dark-mode section with soft black background and muted navy accents
    - Style skill tags/badges in structured categorized layout
    - Style project cards with hover expansion/overlay animation
    - Style vertical timeline with scroll-triggered entry animations
    - Add light text colors for dark background readability
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

  - [ ]* 8.3 Write property test for Coder section rendering (Property 5)
    - **Property 5: Coder section skills and timeline rendering**
    - Generate random coderData with skills array (length S) and timeline array (length T)
    - Verify exactly S skill elements with correct names and T timeline entries in correct order
    - **Validates: Requirements 5.4, 5.5**

- [ ] 9. Checkpoint - Verify all sections render correctly
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 10. Implement Theme System (Night Mode)
  - [ ] 10.1 Implement ThemeSystem class
    - Create ThemeSystem with `toggle()`, `getMode()`, `applySectionPalette()`, `_savePreference()`, `_loadPreference()` methods
    - Toggle `data-theme` attribute on `<html>` between "light" and "dark"
    - Persist preference to localStorage, load on init
    - Respect `prefers-color-scheme: dark` as initial default when no saved preference
    - Wire toggle button in navigation header
    - _Requirements: 7.1, 7.2, 7.4_

  - [ ] 10.2 Add theme transition CSS
    - Add 400ms transition on `background-color` and `color` for smooth mode switching
    - Ensure all text/background combinations in dark mode meet WCAG AA contrast ratios
    - _Requirements: 7.2, 7.3, 9.5_

  - [ ]* 10.3 Write property test for theme toggle round-trip (Property 7)
    - **Property 7: Theme toggle is a round-trip (involution)**
    - Generate random toggle sequences (even/odd), verify state returns to original after even toggles and flips after odd toggles
    - **Validates: Requirements 7.2, 7.4**

  - [ ]* 10.4 Write property test for WCAG AA contrast (Property 8)
    - **Property 8: WCAG AA contrast for all theme color pairs**
    - Generate all defined text/background color pairs from both light and dark themes
    - Compute contrast ratio, verify ≥ 4.5:1 for body text and ≥ 3:1 for large text
    - **Validates: Requirements 7.3, 9.5**

- [ ] 11. Implement Easter Egg System
  - [ ] 11.1 Implement EasterEggSystem class
    - Create EasterEggSystem with `activate()`, `showTerminal()`, `hideTerminal()`, `processCommand()`, `revealSecret()` methods
    - Track keystrokes in a buffer, match against trigger words ("terminal", "hello")
    - Implement Ctrl+Shift+T keyboard shortcut to open terminal overlay
    - Terminal overlay: fixed-position dark panel with monospace text, input field
    - Process commands against `easterEggCommands` map, handle "exit" to close
    - Set `aria-hidden="true"` when inactive, manage focus trap when active
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

  - [ ] 11.2 Add Easter Egg CSS styles
    - Style terminal overlay (fixed position, dark background, monospace font, subtle glow)
    - Add entrance/exit animation for terminal (fade + slide)
    - Ensure overlay does not interfere with underlying page layout
    - _Requirements: 6.4, 6.5_

  - [ ]* 11.3 Write property test for easter egg command processing (Property 6)
    - **Property 6: Easter egg command processing returns correct responses**
    - Generate keys from the easterEggCommands map and random unknown strings
    - Verify known keys return their mapped value, unknown strings return default response
    - **Validates: Requirements 6.2**

- [ ] 12. Implement Responsive Design and Accessibility Polish
  - [ ] 12.1 Add responsive CSS media queries
    - Add breakpoints at 768px and 1024px for layout adjustments
    - Transform navigation to mobile hamburger menu at < 768px
    - Adjust grid layouts for cards and About section at smaller viewports
    - Reduce animation complexity at mobile breakpoints
    - Ensure touch-friendly target sizes (≥ 44px) for interactive elements
    - _Requirements: 10.1, 10.2, 10.3, 10.4_

  - [ ] 12.2 Implement skip-to-content link and keyboard navigation
    - Ensure skip-link targets `#main-content` and is visible on focus
    - Verify all interactive elements are natively focusable or have appropriate tabindex
    - Add visible focus indicators on all interactive elements
    - Ensure no focus traps except within modal (terminal overlay)
    - _Requirements: 12.2, 12.4_

  - [ ]* 12.3 Write property test for keyboard accessibility (Property 12)
    - **Property 12: Interactive elements are keyboard accessible with accessible names**
    - Generate interactive elements (buttons, links, inputs), verify each is reachable via keyboard (tabindex ≥ 0 or natively focusable) and has non-empty accessible name
    - **Validates: Requirements 12.1, 12.2**

  - [ ]* 12.4 Write property test for image alt text (Property 13)
    - **Property 13: All images have text alternatives**
    - Generate/select all `<img>` elements in the rendered page, verify each has non-empty `alt` or `role="presentation"` with `alt=""`
    - **Validates: Requirements 12.5**

- [ ] 13. Final integration and wiring
  - [ ] 13.1 Wire all modules together in main.js
    - Initialize all 6 modules in correct dependency order on DOMContentLoaded
    - Connect ContentRenderer to render all sections from content-data.js
    - Connect AnimationSystem to observe all `.will-animate` elements after content renders
    - Connect NavigationController to sections after content renders
    - Connect LandingController to start on load, skip to show main-wrapper
    - Connect ThemeSystem toggle button
    - Connect EasterEggSystem to activate after landing completes
    - _Requirements: 1.1, 2.1, 8.1, 7.1, 6.1, 13.2_

  - [ ] 13.2 Add footer with social links and final page polish
    - Render footer with GitHub and Instagram links using existing icon assets
    - Ensure footer has proper semantic markup and accessibility
    - Add any final visual polish (spacing, alignment consistency)
    - _Requirements: 5.6, 12.1_

  - [ ]* 13.3 Write integration-level unit tests for module wiring
    - Test that DOMContentLoaded initializes all modules without errors
    - Test that landing skip reveals main content correctly
    - Test that ContentRenderer populates all section containers
    - _Requirements: 1.5, 13.2_

- [ ] 14. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirement acceptance criteria for traceability
- Checkpoints at tasks 5, 9, and 14 ensure incremental validation
- Property tests validate the 14 correctness properties defined in the design document
- The implementation uses vanilla JavaScript (ES modules), CSS, and HTML — no framework or build step required
- Test runner: `npx vitest --run` with jsdom environment and fast-check for property-based tests
- All content is sourced from content-data.js, ensuring content/presentation separation
