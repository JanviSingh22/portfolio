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

/**
 * NavigationController — Handles section navigation, active state tracking, and mobile menu.
 * Requirements: 2.1, 2.2, 2.3, 2.4, 2.5
 */
class NavigationController {
  constructor(navEl, sections) {
    this._navEl = navEl;
    this._sections = Array.from(sections);
    this._navLinks = navEl.querySelectorAll('.nav__link');
    this._mobileToggle = navEl.querySelector('.nav__mobile-toggle');
    this._navLinksContainer = navEl.querySelector('.nav__links');
    this._currentSection = null;
    this._observer = null;
    this._mobileMenuOpen = false;

    this._init();
  }

  /**
   * Initialize event listeners and IntersectionObserver.
   */
  _init() {
    // Click handlers on nav links
    this._navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const sectionId = link.getAttribute('href').replace('#', '');
        this.navigateTo(sectionId);

        // Close mobile menu when a link is clicked
        if (this._mobileMenuOpen) {
          this.toggleMobileMenu();
        }
      });
    });

    // Mobile toggle button click handler
    if (this._mobileToggle) {
      this._mobileToggle.addEventListener('click', () => {
        this.toggleMobileMenu();
      });
    }

    // Set up IntersectionObserver for active state tracking
    this._setupObserver();
  }

  /**
   * Set up IntersectionObserver to detect which section is in view.
   */
  _setupObserver() {
    const options = {
      root: null,
      rootMargin: `-${parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 60}px 0px 0px 0px`,
      threshold: 0.3
    };

    this._observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this._currentSection = entry.target.id;
          this._updateNavLinks();
        }
      });
    }, options);

    // Observe all sections
    this._sections.forEach(section => {
      this._observer.observe(section);
    });
  }

  /**
   * Update aria-current attributes on nav links based on current section.
   */
  _updateNavLinks() {
    this._navLinks.forEach(link => {
      const linkTarget = link.getAttribute('href').replace('#', '');
      if (linkTarget === this._currentSection) {
        link.setAttribute('aria-current', 'true');
      } else {
        link.setAttribute('aria-current', 'false');
      }
    });
  }

  /**
   * Smooth scroll to the specified section.
   * @param {string} sectionId - The ID of the section to scroll to.
   */
  navigateTo(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
      this._currentSection = sectionId;
      this._updateNavLinks();
    }
  }

  /**
   * Update active state based on scroll position (called by observer).
   * Public method for external triggering if needed.
   */
  updateActiveState() {
    // The IntersectionObserver handles this automatically.
    // This method can be called to force a re-check.
    this._updateNavLinks();
  }

  /**
   * Toggle mobile menu open/closed with aria-expanded state management.
   */
  toggleMobileMenu() {
    this._mobileMenuOpen = !this._mobileMenuOpen;

    if (this._mobileToggle) {
      this._mobileToggle.setAttribute('aria-expanded', String(this._mobileMenuOpen));
      this._mobileToggle.setAttribute(
        'aria-label',
        this._mobileMenuOpen ? 'Close menu' : 'Open menu'
      );
    }

    if (this._navLinksContainer) {
      this._navLinksContainer.classList.toggle('nav__links--open', this._mobileMenuOpen);
    }
  }

  /**
   * Returns the ID of the currently visible section.
   * @returns {string|null}
   */
  getCurrentSection() {
    return this._currentSection;
  }
}

/**
 * AnimationSystem — Centralized scroll-reveal animation orchestration.
 * Uses IntersectionObserver to add visibility classes on scroll.
 * Respects prefers-reduced-motion by skipping observation entirely.
 * Requirements: 8.1, 8.2, 8.5, 8.6
 */
class AnimationSystem {
  constructor(options = {}) {
    this._threshold = options.threshold !== undefined ? options.threshold : 0.15;
    this._rootMargin = options.rootMargin || '0px 0px -50px 0px';
    this._once = options.once !== undefined ? options.once : true;
    this._observer = null;
  }

  /**
   * Register elements for scroll-triggered reveal.
   * If reduced motion is preferred, removes .will-animate from all elements
   * so they are immediately visible, and skips observation.
   * @param {NodeList|Element[]} elements - Elements to observe
   * @param {string} animationClass - Class to add on reveal (default 'is-visible')
   */
  observe(elements, animationClass = 'is-visible') {
    const els = elements instanceof NodeList ? Array.from(elements) : elements;

    // If reduced motion, make everything visible immediately and skip observation
    if (this.isReducedMotion()) {
      els.forEach(el => {
        el.classList.remove('will-animate');
      });
      return;
    }

    // Create a single IntersectionObserver instance
    this._observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && entry.intersectionRatio >= this._threshold) {
          entry.target.classList.add(animationClass);
          if (this._once) {
            this._observer.unobserve(entry.target);
          }
        }
      });
    }, {
      root: null,
      rootMargin: this._rootMargin,
      threshold: this._threshold
    });

    // Observe all elements
    els.forEach(el => {
      this._observer.observe(el);
    });
  }

  /**
   * Check if the user prefers reduced motion.
   * @returns {boolean}
   */
  isReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  /**
   * Disconnect the observer and clean up.
   */
  destroy() {
    if (this._observer) {
      this._observer.disconnect();
      this._observer = null;
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // --- AnimationSystem ---
  try {
    const animSystem = new AnimationSystem({ threshold: 0.15, rootMargin: '0px 0px -50px 0px', once: true });
    animSystem.observe(document.querySelectorAll('.will-animate'), 'is-visible');
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
    const navController = new NavigationController(
      document.querySelector('.nav'),
      document.querySelectorAll('.section')
    );
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
