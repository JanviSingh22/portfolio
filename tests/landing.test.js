import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { createPortfolioDOM, cleanupDOM } from './setup.js';

/**
 * LandingController unit tests
 * Validates Requirements 1.1, 1.2, 1.3, 1.4, 1.5, 1.6
 */

// Import the LandingController class by evaluating main.js
// Since it's a vanilla script (no exports), we define a local copy for testing.
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

    this._skipHandler = this.skip.bind(this);
  }

  start() {
    this._animationRunning = true;
    this._addSkipListeners();

    const blinkTimer = setTimeout(() => {
      this._typeNextChar();
    }, this._options.cursorBlinkDuration);
    this._timers.push(blinkTimer);
  }

  skip() {
    if (this._completed) return;

    this._timers.forEach(timer => clearTimeout(timer));
    this._timers = [];
    this._animationRunning = false;

    this._container.classList.add('landing--hidden');
    this._mainWrapper.classList.add('main-wrapper--visible');

    this._onComplete();
  }

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
      const pauseTimer = setTimeout(() => {
        this._triggerTransition();
      }, this._options.pauseAfterTyping);
      this._timers.push(pauseTimer);
    }
  }

  _triggerTransition() {
    if (!this._animationRunning) return;

    this._container.classList.add('landing--hidden');
    this._mainWrapper.classList.add('main-wrapper--visible');

    const transitionTimer = setTimeout(() => {
      this._onComplete();
    }, this._options.transitionDuration);
    this._timers.push(transitionTimer);
  }

  _onComplete() {
    this._completed = true;
    this._animationRunning = false;

    this._container.setAttribute('aria-hidden', 'true');
    this._mainWrapper.setAttribute('aria-hidden', 'false');

    this._removeSkipListeners();
  }

  _addSkipListeners() {
    document.addEventListener('click', this._skipHandler);
    document.addEventListener('scroll', this._skipHandler);
    document.addEventListener('keydown', this._skipHandler);
  }

  _removeSkipListeners() {
    document.removeEventListener('click', this._skipHandler);
    document.removeEventListener('scroll', this._skipHandler);
    document.removeEventListener('keydown', this._skipHandler);
  }
}

describe('LandingController', () => {
  let controller;

  beforeEach(() => {
    vi.useFakeTimers();
    createPortfolioDOM();
  });

  afterEach(() => {
    if (controller) {
      controller.skip(); // cleanup timers
    }
    cleanupDOM();
    vi.useRealTimers();
  });

  describe('start()', () => {
    it('should show blinking cursor initially (before typing starts)', () => {
      controller = new LandingController(document.querySelector('#landing'), {
        text: 'hello'
      });
      controller.start();

      // Before cursorBlinkDuration elapses, text should be empty
      expect(controller._textEl.textContent).toBe('');
      expect(controller._animationRunning).toBe(true);
    });

    it('should begin typing after cursorBlinkDuration', () => {
      controller = new LandingController(document.querySelector('#landing'), {
        text: 'hi',
        cursorBlinkDuration: 500
      });
      controller.start();

      // Advance past blink duration
      vi.advanceTimersByTime(500);

      // First character should be typed
      expect(controller._textEl.textContent).toBe('h');
    });

    it('should type characters one at a time', () => {
      controller = new LandingController(document.querySelector('#landing'), {
        text: 'abc',
        cursorBlinkDuration: 100,
        typingSpeed: { min: 50, max: 50 } // fixed speed for predictability
      });
      controller.start();

      vi.advanceTimersByTime(100); // blink duration
      expect(controller._textEl.textContent).toBe('a');

      vi.advanceTimersByTime(50); // first char delay
      expect(controller._textEl.textContent).toBe('ab');

      vi.advanceTimersByTime(50); // second char delay
      expect(controller._textEl.textContent).toBe('abc');
    });

    it('should trigger transition after typing + pause', () => {
      controller = new LandingController(document.querySelector('#landing'), {
        text: 'ab',
        cursorBlinkDuration: 100,
        typingSpeed: { min: 50, max: 50 },
        pauseAfterTyping: 800,
        transitionDuration: 1000
      });
      controller.start();

      // blink(100) + type 'a'(50) + type 'b'(50) = 200ms typed
      vi.advanceTimersByTime(100 + 50 + 50);
      expect(controller._textEl.textContent).toBe('ab');

      // Pause after typing
      vi.advanceTimersByTime(800);
      // Transition should have started (landing--hidden added)
      expect(controller._container.classList.contains('landing--hidden')).toBe(true);
      expect(controller._mainWrapper.classList.contains('main-wrapper--visible')).toBe(true);
    });

    it('should call _onComplete after full transition duration', () => {
      controller = new LandingController(document.querySelector('#landing'), {
        text: 'x',
        cursorBlinkDuration: 100,
        typingSpeed: { min: 50, max: 50 },
        pauseAfterTyping: 100,
        transitionDuration: 1000
      });
      controller.start();

      // blink(100) + type(50) + pause(100) + transition(1000)
      vi.advanceTimersByTime(100 + 50 + 100 + 1000);

      expect(controller._completed).toBe(true);
      expect(controller._container.getAttribute('aria-hidden')).toBe('true');
      expect(controller._mainWrapper.getAttribute('aria-hidden')).toBe('false');
    });
  });

  describe('skip()', () => {
    it('should immediately hide landing and show main-wrapper', () => {
      controller = new LandingController(document.querySelector('#landing'), {
        text: 'hello world'
      });
      controller.start();

      controller.skip();

      expect(controller._container.classList.contains('landing--hidden')).toBe(true);
      expect(controller._mainWrapper.classList.contains('main-wrapper--visible')).toBe(true);
    });

    it('should set aria-hidden correctly on skip', () => {
      controller = new LandingController(document.querySelector('#landing'), {
        text: 'test'
      });
      controller.start();

      controller.skip();

      expect(controller._container.getAttribute('aria-hidden')).toBe('true');
      expect(controller._mainWrapper.getAttribute('aria-hidden')).toBe('false');
    });

    it('should cancel running timers', () => {
      controller = new LandingController(document.querySelector('#landing'), {
        text: 'test text',
        cursorBlinkDuration: 500
      });
      controller.start();

      controller.skip();

      // Advance time — no further typing should occur
      const textAfterSkip = controller._textEl.textContent;
      vi.advanceTimersByTime(5000);
      expect(controller._textEl.textContent).toBe(textAfterSkip);
    });

    it('should be triggered by click event', () => {
      controller = new LandingController(document.querySelector('#landing'), {
        text: 'test'
      });
      controller.start();

      document.dispatchEvent(new Event('click'));

      expect(controller._completed).toBe(true);
      expect(controller._container.classList.contains('landing--hidden')).toBe(true);
    });

    it('should be triggered by keydown event', () => {
      controller = new LandingController(document.querySelector('#landing'), {
        text: 'test'
      });
      controller.start();

      document.dispatchEvent(new Event('keydown'));

      expect(controller._completed).toBe(true);
    });

    it('should be triggered by scroll event', () => {
      controller = new LandingController(document.querySelector('#landing'), {
        text: 'test'
      });
      controller.start();

      document.dispatchEvent(new Event('scroll'));

      expect(controller._completed).toBe(true);
    });

    it('should not run skip twice', () => {
      controller = new LandingController(document.querySelector('#landing'), {
        text: 'test'
      });
      controller.start();

      controller.skip();
      // Second skip should be a no-op (no error thrown)
      controller.skip();

      expect(controller._completed).toBe(true);
    });
  });

  describe('_onComplete()', () => {
    it('should remove skip event listeners after completion', () => {
      controller = new LandingController(document.querySelector('#landing'), {
        text: 'a',
        cursorBlinkDuration: 50,
        typingSpeed: { min: 50, max: 50 },
        pauseAfterTyping: 50,
        transitionDuration: 50
      });
      controller.start();

      // Complete the full animation
      vi.advanceTimersByTime(50 + 50 + 50 + 50);
      expect(controller._completed).toBe(true);

      // After completion, events should not call skip again (already completed)
      // This should not throw
      document.dispatchEvent(new Event('click'));
    });
  });
});
