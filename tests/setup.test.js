import { describe, it, expect } from 'vitest';
import { createPortfolioDOM, cleanupDOM } from './setup.js';

describe('Test infrastructure', () => {
  it('should run a trivial test', () => {
    expect(1 + 1).toBe(2);
  });

  it('should set up the portfolio DOM', () => {
    createPortfolioDOM();
    const landing = document.querySelector('#landing');
    expect(landing).not.toBeNull();
    expect(landing.getAttribute('aria-label')).toBe('Introduction animation');
    cleanupDOM();
  });

  it('should clean up the DOM', () => {
    createPortfolioDOM();
    cleanupDOM();
    expect(document.body.innerHTML).toBe('');
  });
});
