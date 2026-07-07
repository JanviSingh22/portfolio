/**
 * main.js — Application entry point
 * Initializes all modules with graceful degradation.
 * Each module is wrapped in try/catch so a single failure
 * doesn't break the rest of the experience.
 */

/**
 * LandingController — Manages typewriter animation and landing-to-main transition.
 * Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6
 */
class LandingController {
  constructor(containerEl, options = {}) {
    this._container = containerEl;
    this._cursorEl = containerEl.querySelector('.landing__cursor');
    this._textEl = containerEl.querySelector('.landing__text');
    this._mainWrapper = document.querySelector('#main-content');

    this._options = {
      typingSpeed: { min: 50, max: 120 },
      cursorBlinkDuration: 500,
      pauseAfterTyping: 800,
      transitionDuration: 1000,
      text: 'codegeek version 2004',
      ...options
    };

    this._timers = [];
    this._animationRunning = false;
    this._completed = false;
    this._charIndex = 0;

    // Bind skip handler
    this._skipHandler = this.skip.bind(this);
  }

  /**
   * Start the landing animation sequence:
   * 1. Show blinking cursor for cursorBlinkDuration ms
   * 2. Type text character by character at random speed [50ms-120ms]
   * 3. Pause for pauseAfterTyping ms
   * 4. Trigger CSS fade transition (transitionDuration ms)
   */
  start() {
    this._animationRunning = true;
    this._addSkipListeners();

    // Step 1: Blink cursor for cursorBlinkDuration before typing
    const blinkTimer = setTimeout(() => {
      this._typeNextChar();
    }, this._options.cursorBlinkDuration);
    this._timers.push(blinkTimer);
  }

  /**
   * Skip animation immediately — hides landing, shows main-wrapper, cancels timers.
   */
  skip() {
    if (this._completed) return;

    // Cancel all running timers
    this._timers.forEach(timer => clearTimeout(timer));
    this._timers = [];
    this._animationRunning = false;

    // Immediately hide landing and show main-wrapper
    this._container.classList.add('landing--hidden');
    this._mainWrapper.classList.add('main-wrapper--visible');

    this._onComplete();
  }

  /**
   * Type the next character, then schedule the following one.
   */
  _typeNextChar() {
    if (!this._animationRunning) return;

    const { text, typingSpeed } = this._options;

    if (this._charIndex < text.length) {
      this._textEl.textContent = text.slice(0, this._charIndex + 1);
      this._charIndex++;

      const delay = Math.floor(
        Math.random() * (typingSpeed.max - typingSpeed.min + 1)
      ) + typingSpeed.min;

      const timer = setTimeout(() => this._typeNextChar(), delay);
      this._timers.push(timer);
    } else {
      // Typing complete — pause then transition
      const pauseTimer = setTimeout(() => {
        this._triggerTransition();
      }, this._options.pauseAfterTyping);
      this._timers.push(pauseTimer);
    }
  }

  /**
   * Trigger the CSS fade-out transition on the landing section.
   */
  _triggerTransition() {
    if (!this._animationRunning) return;

    this._container.classList.add('landing--hidden');
    this._mainWrapper.classList.add('main-wrapper--visible');

    // Wait for transition to finish, then complete
    const transitionTimer = setTimeout(() => {
      this._onComplete();
    }, this._options.transitionDuration);
    this._timers.push(transitionTimer);
  }

  /**
   * Called when animation finishes (or is skipped).
   * Sets ARIA attributes and cleans up event listeners.
   */
  _onComplete() {
    this._completed = true;
    this._animationRunning = false;

    // Set aria-hidden appropriately
    this._container.setAttribute('aria-hidden', 'true');
    this._mainWrapper.setAttribute('aria-hidden', 'false');

    // Remove skip event listeners
    this._removeSkipListeners();
  }

  /**
   * Add event listeners that let the user skip the animation.
   */
  _addSkipListeners() {
    document.addEventListener('click', this._skipHandler);
    document.addEventListener('scroll', this._skipHandler);
    document.addEventListener('keydown', this._skipHandler);
  }

  /**
   * Remove skip event listeners after animation completes or is skipped.
   */
  _removeSkipListeners() {
    document.removeEventListener('click', this._skipHandler);
    document.removeEventListener('scroll', this._skipHandler);
    document.removeEventListener('keydown', this._skipHandler);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // --- AnimationSystem ---
  try {
    // TODO: Implement AnimationSystem class (Task 4)
    // const animSystem = new AnimationSystem({ threshold: 0.15, rootMargin: '0px 0px -50px 0px', once: true });
    // animSystem.observe(document.querySelectorAll('.will-animate'), 'is-visible');
  } catch (e) {
    // Fallback: remove .will-animate so content is visible without animation
    document.querySelectorAll('.will-animate').forEach(el => {
      el.classList.remove('will-animate');
    });
    console.warn('AnimationSystem failed to initialize:', e);
  }

  // --- ThemeSystem ---
  try {
    // TODO: Implement ThemeSystem class (Task 10)
    // const themeSystem = new ThemeSystem(document.querySelector('.nav__theme-toggle'));
  } catch (e) {
    console.warn('ThemeSystem failed to initialize:', e);
  }

  // --- NavigationController ---
  try {
    // TODO: Implement NavigationController class (Task 3)
    // const navController = new NavigationController(
    //   document.querySelector('.nav'),
    //   document.querySelectorAll('.section')
    // );
  } catch (e) {
    console.warn('NavigationController failed to initialize:', e);
  }

  // --- ContentRenderer ---
  try {
    // TODO: Implement ContentRenderer class (Tasks 6, 7, 8)
    // const renderer = new ContentRenderer({ profileData, interestsData, coderData });
    // renderer.renderAbout(document.querySelector('#about .section__container'));
    // renderer.renderInterestCards(document.querySelector('.interests-grid'));
    // renderer.renderSkills(document.querySelector('#coder .section__container'));
    // renderer.renderProjectCards(document.querySelector('#coder .section__container'));
    // renderer.renderTimeline(document.querySelector('#coder .section__container'));
  } catch (e) {
    console.warn('ContentRenderer failed to initialize:', e);
  }

  // --- LandingController ---
  try {
    const landing = new LandingController(document.querySelector('#landing'), {
      typingSpeed: { min: 50, max: 120 },
      cursorBlinkDuration: 500,
      pauseAfterTyping: 800,
      transitionDuration: 1000,
      text: profileData.tagline
    });
    landing.start();
  } catch (e) {
    // Fallback: skip landing, show main content immediately
    const landing = document.querySelector('#landing');
    const mainWrapper = document.querySelector('#main-content');
    if (landing) {
      landing.classList.add('landing--hidden');
      landing.setAttribute('aria-hidden', 'true');
    }
    if (mainWrapper) {
      mainWrapper.classList.add('main-wrapper--visible');
      mainWrapper.setAttribute('aria-hidden', 'false');
    }
    console.warn('LandingController failed to initialize:', e);
  }

  // --- EasterEggSystem ---
  try {
    // TODO: Implement EasterEggSystem class (Task 11)
    // const easterEggs = new EasterEggSystem();
    // easterEggs.activate();
  } catch (e) {
    console.warn('EasterEggSystem failed to initialize:', e);
  }
});
