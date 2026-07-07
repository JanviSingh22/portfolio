/**
 * Test setup — DOM mocking utilities for vitest + jsdom.
 */

/**
 * Creates a minimal DOM structure matching the portfolio's HTML shell.
 * Call this in tests that need the full page structure.
 */
export function createPortfolioDOM() {
  document.body.innerHTML = `
    <a href="#main-content" class="skip-link">Skip to content</a>
    <section id="landing" class="landing" aria-label="Introduction animation">
      <div class="landing__cursor" aria-hidden="true"></div>
      <div class="landing__text" aria-live="polite"></div>
    </section>
    <div id="main-content" class="main-wrapper" aria-hidden="true">
      <header class="nav" role="banner">
        <a href="#" class="nav__logo">JS</a>
        <nav class="nav__links" role="navigation" aria-label="Main navigation">
          <a href="#about" class="nav__link" aria-current="false">About</a>
          <a href="#interests" class="nav__link" aria-current="false">Interests</a>
          <a href="#coder" class="nav__link" aria-current="false">Coder</a>
        </nav>
        <button class="nav__theme-toggle" aria-label="Toggle night mode">🌙</button>
        <button class="nav__mobile-toggle" aria-label="Open menu" aria-expanded="false">☰</button>
      </header>
      <section id="about" class="section section--about" aria-label="About me">
        <div class="section__container"></div>
      </section>
      <section id="interests" class="section section--interests" aria-label="My interests">
        <div class="section__container">
          <div class="interests-grid" role="list"></div>
        </div>
      </section>
      <section id="coder" class="section section--coder" aria-label="Developer profile">
        <div class="section__container"></div>
      </section>
      <footer class="footer" role="contentinfo">
        <div class="social-links"></div>
      </footer>
    </div>
    <div id="terminal-overlay" class="terminal" aria-hidden="true" role="dialog" aria-label="Secret terminal">
      <div class="terminal__header">terminal</div>
      <div class="terminal__output"></div>
      <input class="terminal__input" type="text" aria-label="Terminal input">
    </div>
  `;
}

/**
 * Resets the DOM to a clean state.
 */
export function cleanupDOM() {
  document.body.innerHTML = '';
  document.documentElement.removeAttribute('data-theme');
}
