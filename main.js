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
 * NavigationController — Handles panel-based navigation with slide transitions.
 * About is the base layer. Interests slides from left, Coder slides from right.
 * Requirements: 2.1, 2.2, 2.3, 2.4, 2.5
 */
class NavigationController {
  constructor(navEl, panels) {
    this._navEl = navEl;
    this._panels = Array.from(panels);
    this._navLinks = navEl.querySelectorAll('.nav__link');
    this._logo = navEl.querySelector('.nav__logo');
    this._mobileToggle = navEl.querySelector('.nav__mobile-toggle');
    this._navLinksContainer = navEl.querySelector('.nav__links');
    this._currentSection = 'about';
    this._activePanel = null;
    this._mobileMenuOpen = false;

    this._init();
  }

  /**
   * Initialize event listeners for panel navigation.
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

    // Logo click returns to About (closes any panel)
    if (this._logo) {
      this._logo.addEventListener('click', (e) => {
        e.preventDefault();
        this.navigateTo('about');
      });
    }

    // Mobile toggle button click handler
    if (this._mobileToggle) {
      this._mobileToggle.addEventListener('click', () => {
        this.toggleMobileMenu();
      });
    }

    // Set About as active initially
    this._updateNavLinks();
  }

  /**
   * Navigate to a section by toggling panels.
   * - "about": close any open panel
   * - "interests": open left panel (close right if open)
   * - "coder": open right panel (close left if open)
   * @param {string} sectionId
   */
  navigateTo(sectionId) {
    // Close currently active panel
    if (this._activePanel) {
      this._activePanel.classList.remove('panel--active');
      this._activePanel.setAttribute('aria-hidden', 'true');
    }

    if (sectionId === 'about') {
      // Just close panels, About is always visible
      this._activePanel = null;
    } else {
      // Open the target panel
      const panel = document.getElementById(sectionId);
      if (panel) {
        panel.classList.add('panel--active');
        panel.setAttribute('aria-hidden', 'false');
        // Scroll panel content to top
        const scrollContainer = panel.querySelector('.panel__scroll');
        if (scrollContainer) scrollContainer.scrollTop = 0;
        this._activePanel = panel;
      }
    }

    this._currentSection = sectionId;
    this._updateNavLinks();
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
   * Update active state (public method).
   */
  updateActiveState() {
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

/**
 * ContentRenderer — Builds HTML from structured content data objects.
 * Separates content from presentation per Requirement 13.
 * Requirements: 3.1, 3.3, 13.1, 13.3
 */
class ContentRenderer {
  constructor(contentData) {
    this._profileData = contentData.profileData;
    this._interestsData = contentData.interestsData;
    this._coderData = contentData.coderData;
  }

  /**
   * Render the About section content into the given container.
   * Generates: profile image, name heading, bio paragraph, traits grid, social links.
   * @param {Element} containerEl - The section container to render into
   */
  renderAbout(containerEl) {
    if (!containerEl || !this._profileData) return;

    const { name, bio, traits, social } = this._profileData;

    // Profile image
    const profileImg = document.createElement('div');
    profileImg.className = 'about__profile will-animate';
    profileImg.innerHTML = `
      <img
        src="profile_image.jpg"
        alt="Portrait of ${name}"
        class="about__image"
        loading="lazy"
      >
    `;

    // Name heading
    const nameHeading = document.createElement('h2');
    nameHeading.className = 'about__name will-animate';
    nameHeading.textContent = name;

    // Bio paragraph
    const bioParagraph = document.createElement('p');
    bioParagraph.className = 'about__bio will-animate';
    bioParagraph.textContent = bio;

    // Traits grid
    const traitsSection = document.createElement('div');
    traitsSection.className = 'about__traits will-animate';
    traitsSection.setAttribute('aria-label', 'Personality traits');

    const traitsGrid = document.createElement('div');
    traitsGrid.className = 'about__traits-grid';
    traitsGrid.setAttribute('role', 'list');

    traits.forEach(trait => {
      const card = document.createElement('div');
      card.className = 'about__trait-card';
      card.setAttribute('role', 'listitem');

      const label = document.createElement('h3');
      label.className = 'about__trait-label';
      label.textContent = trait.label;

      const description = document.createElement('p');
      description.className = 'about__trait-description';
      description.textContent = trait.description;

      card.appendChild(label);
      card.appendChild(description);
      traitsGrid.appendChild(card);
    });

    traitsSection.appendChild(traitsGrid);

    // Append all elements to container
    containerEl.appendChild(profileImg);
    containerEl.appendChild(nameHeading);
    containerEl.appendChild(bioParagraph);
    containerEl.appendChild(traitsSection);
  }

  /**
   * Render interest cards into the given container element.
   * Generates a card for each item in interestsData with icon, title, description,
   * per-card accent color, size class, and accessibility attributes.
   * @param {Element} containerEl - The .interests-grid container (role="list")
   */
  renderInterestCards(containerEl) {
    if (!containerEl || !this._interestsData) return;

    this._interestsData.forEach(item => {
      const card = document.createElement('div');
      card.className = `interest-card interest-card--${item.size} will-animate`;
      card.setAttribute('role', 'listitem');
      card.style.setProperty('--card-accent', item.accentColor);

      // Icon
      const iconSpan = document.createElement('span');
      iconSpan.className = 'interest-card__icon';
      iconSpan.setAttribute('aria-hidden', 'true');
      iconSpan.textContent = item.icon;

      // Title
      const title = document.createElement('h3');
      title.className = 'interest-card__title';
      title.textContent = item.title;

      // Description (hidden by default, revealed on hover via CSS)
      const description = document.createElement('p');
      description.className = 'interest-card__description';
      description.textContent = item.description;

      card.appendChild(iconSpan);
      card.appendChild(title);
      card.appendChild(description);
      containerEl.appendChild(card);
    });
  }

  /**
   * Render the entire Coder section: heading, skills, projects, and timeline.
   * @param {Element} containerEl - The #coder .section__container element
   */
  renderCoder(containerEl) {
    if (!containerEl || !this._coderData) return;

    // Section heading
    const heading = document.createElement('h2');
    heading.className = 'coder__heading will-animate';
    heading.textContent = 'Coder';
    containerEl.appendChild(heading);

    // Skills subsection
    const skillsSection = document.createElement('div');
    skillsSection.className = 'coder__skills';
    skillsSection.setAttribute('aria-label', 'Technical skills');
    this.renderSkills(skillsSection);
    containerEl.appendChild(skillsSection);

    // Projects subsection
    const projectsSection = document.createElement('div');
    projectsSection.className = 'coder__projects';
    projectsSection.setAttribute('aria-label', 'Projects');
    this.renderProjectCards(projectsSection);
    containerEl.appendChild(projectsSection);

    // Timeline subsection
    const timelineSection = document.createElement('div');
    timelineSection.className = 'coder__timeline';
    timelineSection.setAttribute('aria-label', 'Experience timeline');
    this.renderTimeline(timelineSection);
    containerEl.appendChild(timelineSection);
  }

  /**
   * Render skills grouped by category as tags/badges.
   * Categories: languages, frontend, backend, tools, design, data
   * @param {Element} containerEl - The container to render skills into
   */
  renderSkills(containerEl) {
    if (!containerEl || !this._coderData || !this._coderData.skills) return;

    const categories = ['languages', 'frontend', 'backend', 'tools', 'design', 'data'];
    const grouped = {};

    // Group skills by category
    this._coderData.skills.forEach(skill => {
      if (!grouped[skill.category]) {
        grouped[skill.category] = [];
      }
      grouped[skill.category].push(skill);
    });

    // Render each category that has skills
    categories.forEach(category => {
      if (!grouped[category] || grouped[category].length === 0) return;

      const categoryBlock = document.createElement('div');
      categoryBlock.className = 'coder__skill-category will-animate';

      const categoryHeading = document.createElement('h3');
      categoryHeading.className = 'coder__skill-category-heading';
      categoryHeading.textContent = category;
      categoryBlock.appendChild(categoryHeading);

      const tagsRow = document.createElement('div');
      tagsRow.className = 'coder__skill-tags';
      tagsRow.setAttribute('role', 'list');
      tagsRow.setAttribute('aria-label', `${category} skills`);

      grouped[category].forEach(skill => {
        const tag = document.createElement('span');
        tag.className = 'coder__skill-tag';
        tag.setAttribute('role', 'listitem');
        tag.textContent = skill.name;
        tagsRow.appendChild(tag);
      });

      categoryBlock.appendChild(tagsRow);
      containerEl.appendChild(categoryBlock);
    });
  }

  /**
   * Render project cards with title, description, tech stack tags, and link.
   * @param {Element} containerEl - The container to render project cards into
   */
  renderProjectCards(containerEl) {
    if (!containerEl || !this._coderData || !this._coderData.projects) return;

    const heading = document.createElement('h3');
    heading.className = 'coder__subsection-heading will-animate';
    heading.textContent = 'Projects';
    containerEl.appendChild(heading);

    const grid = document.createElement('div');
    grid.className = 'coder__projects-grid';
    grid.setAttribute('role', 'list');

    this._coderData.projects.forEach(project => {
      const card = document.createElement('article');
      card.className = 'coder__project-card will-animate';
      card.setAttribute('role', 'listitem');

      const title = document.createElement('h4');
      title.className = 'coder__project-title';
      title.textContent = project.title;

      const description = document.createElement('p');
      description.className = 'coder__project-description';
      description.textContent = project.description;

      const techList = document.createElement('div');
      techList.className = 'coder__project-tech';
      techList.setAttribute('aria-label', 'Technologies used');

      project.tech.forEach(techName => {
        const techTag = document.createElement('span');
        techTag.className = 'coder__project-tech-tag';
        techTag.textContent = techName;
        techList.appendChild(techTag);
      });

      const link = document.createElement('a');
      link.className = 'coder__project-link';
      link.href = project.link;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.setAttribute('aria-label', `View ${project.title} project`);
      link.textContent = 'View →';

      card.appendChild(title);
      card.appendChild(description);
      card.appendChild(techList);
      card.appendChild(link);
      grid.appendChild(card);
    });

    containerEl.appendChild(grid);
  }

  /**
   * Render a vertical timeline with year markers and event descriptions.
   * @param {Element} containerEl - The container to render the timeline into
   */
  renderTimeline(containerEl) {
    if (!containerEl || !this._coderData || !this._coderData.timeline) return;

    const heading = document.createElement('h3');
    heading.className = 'coder__subsection-heading will-animate';
    heading.textContent = 'Timeline';
    containerEl.appendChild(heading);

    const timeline = document.createElement('div');
    timeline.className = 'coder__timeline-list';
    timeline.setAttribute('role', 'list');
    timeline.setAttribute('aria-label', 'Experience timeline');

    this._coderData.timeline.forEach(entry => {
      const item = document.createElement('div');
      item.className = 'coder__timeline-item will-animate';
      item.setAttribute('role', 'listitem');

      const marker = document.createElement('div');
      marker.className = 'coder__timeline-marker';
      marker.setAttribute('aria-hidden', 'true');

      const content = document.createElement('div');
      content.className = 'coder__timeline-content';

      const year = document.createElement('span');
      year.className = 'coder__timeline-year';
      year.textContent = entry.year;

      const title = document.createElement('h4');
      title.className = 'coder__timeline-title';
      title.textContent = entry.title;

      const description = document.createElement('p');
      description.className = 'coder__timeline-description';
      description.textContent = entry.description;

      content.appendChild(year);
      content.appendChild(title);
      content.appendChild(description);

      item.appendChild(marker);
      item.appendChild(content);
      timeline.appendChild(item);
    });

    containerEl.appendChild(timeline);
  }
}

document.addEventListener('DOMContentLoaded', () => {
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
      document.querySelectorAll('.panel')
    );
  } catch (e) {
    console.warn('NavigationController failed to initialize:', e);
  }

  // --- ContentRenderer ---
  try {
    const renderer = new ContentRenderer({ profileData, interestsData, coderData });
    renderer.renderAbout(document.querySelector('#about .section__container'));
    renderer.renderInterestCards(document.querySelector('.interests-grid'));
    renderer.renderCoder(document.querySelector('#coder .section__container'));
  } catch (e) {
    console.warn('ContentRenderer failed to initialize:', e);
  }

  // --- Clone footer into panel scroll containers ---
  try {
    const footer = document.querySelector('.footer');
    if (footer) {
      document.querySelectorAll('.panel__footer-slot').forEach(slot => {
        const clone = footer.cloneNode(true);
        clone.removeAttribute('id');
        slot.appendChild(clone);
      });
    }
  } catch (e) {
    console.warn('Footer cloning failed:', e);
  }

  // --- AnimationSystem (after ContentRenderer so dynamically added .will-animate elements are observed) ---
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
