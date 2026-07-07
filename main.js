/**
 * main.js — Application entry point
 * Initializes all modules with graceful degradation.
 * Each module is wrapped in try/catch so a single failure
 * doesn't break the rest of the experience.
 */

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
    // TODO: Implement LandingController class (Task 2)
    // const landing = new LandingController(document.querySelector('#landing'), {
    //   typingSpeed: { min: 50, max: 120 },
    //   cursorBlinkDuration: 500,
    //   pauseAfterTyping: 800,
    //   transitionDuration: 1000,
    //   text: profileData.tagline
    // });
    // landing.start();
  } catch (e) {
    // Fallback: skip landing, show main content immediately
    const landing = document.querySelector('#landing');
    const mainWrapper = document.querySelector('#main-content');
    if (landing) landing.setAttribute('aria-hidden', 'true');
    if (mainWrapper) mainWrapper.setAttribute('aria-hidden', 'false');
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
