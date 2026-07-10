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
   * - "about": close any open panel, restore About
   * - "interests": open left panel, push About right
   * - "coder": open right panel, push About left
   * @param {string} sectionId
   */
  navigateTo(sectionId) {
    const aboutSection = document.getElementById('about');
    const sidebarNav = document.querySelector('.sidebar-nav');

    // Close currently active panel
    if (this._activePanel) {
      this._activePanel.classList.remove('panel--active');
      this._activePanel.setAttribute('aria-hidden', 'true');
    }

    // Reset About position
    if (aboutSection) {
      aboutSection.classList.remove('about--pushed-left', 'about--pushed-right');
    }

    // Hide sidebar nav
    if (sidebarNav) {
      sidebarNav.classList.remove('sidebar-nav--visible', 'sidebar-nav--left', 'sidebar-nav--right', 'sidebar-nav--dark');
      sidebarNav.setAttribute('aria-hidden', 'true');
    }

    if (sectionId === 'about') {
      // Just close panels, About restores to center
      this._activePanel = null;
      document.body.style.overflow = '';
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
        document.body.style.overflow = 'hidden';

        // Push About in the opposite direction
        if (aboutSection) {
          if (panel.classList.contains('panel--left')) {
            aboutSection.classList.add('about--pushed-right');
          } else if (panel.classList.contains('panel--right')) {
            aboutSection.classList.add('about--pushed-left');
          }
        }

        // Show sidebar nav in the peek area
        if (sidebarNav) {
          if (panel.classList.contains('panel--left')) {
            sidebarNav.classList.add('sidebar-nav--visible', 'sidebar-nav--right');
            this._populateSidebar(sidebarNav, 'interests');
          } else if (panel.classList.contains('panel--right')) {
            sidebarNav.classList.add('sidebar-nav--visible', 'sidebar-nav--left', 'sidebar-nav--dark');
            this._populateSidebar(sidebarNav, 'coder');
          }
          sidebarNav.setAttribute('aria-hidden', 'false');
        }
      }
    }

    this._currentSection = sectionId;
    this._updateNavLinks();
  }

  /**
   * Populate the sidebar nav with section links for the active panel.
   * @param {Element} sidebarNav
   * @param {string} panelType - 'interests' or 'coder'
   */
  _populateSidebar(sidebarNav, panelType) {
    const list = sidebarNav.querySelector('.sidebar-nav__list');
    if (!list) return;

    list.innerHTML = '';

    const sections = panelType === 'coder'
      ? [
          { label: 'About', id: 'opus-about' },
          { label: 'Education', id: 'opus-education' },
          { label: 'Experience', id: 'opus-experience' },
          { label: 'Skills', id: 'opus-skills' },
          { label: 'Projects', id: 'opus-projects' },
          { label: 'Achievements', id: 'opus-achievements' }
        ]
      : [{ label: 'All Interests', id: null }];

    sections.forEach(section => {
      const li = document.createElement('li');
      li.className = 'sidebar-nav__item';
      li.textContent = section.label;
      li.addEventListener('click', () => {
        if (!section.id) return;
        const panel = this._activePanel;
        if (!panel) return;
        const target = panel.querySelector(`#${section.id}`);
        const scrollContainer = panel.querySelector('.panel__scroll');
        if (scrollContainer && target) {
          const targetTop = target.offsetTop - 80;
          scrollContainer.scrollTo({ top: targetTop, behavior: 'smooth' });
        }
      });
      list.appendChild(li);
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
 * ThemeSystem — Manages night mode via CSS custom properties.
 * Toggles data-theme attribute on <html>, persists preference to localStorage,
 * respects prefers-color-scheme as initial default.
 * Requirements: 7.1, 7.2, 7.4
 */
class ThemeSystem {
  constructor(toggleEl) {
    this._toggleEl = toggleEl;
    this._storageKey = 'theme-preference';

    // Determine initial mode: localStorage > prefers-color-scheme > light
    const saved = this._loadPreference();
    let initialMode;
    if (saved) {
      initialMode = saved;
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      initialMode = 'dark';
    } else {
      initialMode = 'light';
    }

    // Apply the initial mode
    this._applyMode(initialMode);

    // Wire toggle button click
    if (this._toggleEl) {
      this._toggleEl.addEventListener('click', () => this.toggle());
    }
  }

  /**
   * Toggle between light and dark mode.
   */
  toggle() {
    const current = this.getMode();
    const next = current === 'light' ? 'dark' : 'light';
    this._applyMode(next);
    this._savePreference(next);
  }

  /**
   * Get the current theme mode.
   * @returns {'light'|'dark'}
   */
  getMode() {
    return document.documentElement.getAttribute('data-theme') || 'light';
  }

  /**
   * Apply the given mode to the document and update button icon.
   * @param {'light'|'dark'} mode
   */
  _applyMode(mode) {
    document.documentElement.setAttribute('data-theme', mode);
    if (this._toggleEl) {
      this._toggleEl.textContent = mode === 'dark' ? '☀️' : '🌙';
    }
  }

  /**
   * Save theme preference to localStorage.
   * @param {'light'|'dark'} mode
   */
  _savePreference(mode) {
    try {
      localStorage.setItem(this._storageKey, mode);
    } catch (e) {
      // localStorage unavailable — degrade gracefully
    }
  }

  /**
   * Load theme preference from localStorage.
   * @returns {'light'|'dark'|null}
   */
  _loadPreference() {
    try {
      const val = localStorage.getItem(this._storageKey);
      if (val === 'light' || val === 'dark') return val;
      return null;
    } catch (e) {
      return null;
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
        src="assets/profile_image.jpg"
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
   * Render the entire Opus section: education, experience, skills, projects, achievements, profiles.
   * @param {Element} containerEl - The #coder .section__container element
   */
  renderCoder(containerEl) {
    if (!containerEl || !this._coderData) return;

    // Education
    const eduSection = document.createElement('div');
    eduSection.className = 'coder__education';
    eduSection.id = 'opus-education';
    this._renderEducation(eduSection);
    containerEl.appendChild(eduSection);

    // Experience
    const expSection = document.createElement('div');
    expSection.className = 'coder__experience';
    expSection.id = 'opus-experience';
    this._renderExperience(expSection);
    containerEl.appendChild(expSection);

    // Skills
    const skillsSection = document.createElement('div');
    skillsSection.className = 'coder__skills';
    skillsSection.id = 'opus-skills';
    this._renderSkills(skillsSection);
    containerEl.appendChild(skillsSection);

    // Projects
    const projectsSection = document.createElement('div');
    projectsSection.className = 'coder__projects';
    projectsSection.id = 'opus-projects';
    this._renderProjects(projectsSection);
    containerEl.appendChild(projectsSection);

    // Achievements
    const achieveSection = document.createElement('div');
    achieveSection.className = 'coder__achievements';
    achieveSection.id = 'opus-achievements';
    this._renderAchievements(achieveSection);
    containerEl.appendChild(achieveSection);
  }

  _renderEducation(containerEl) {
    const heading = document.createElement('h3');
    heading.className = 'coder__subsection-heading will-animate';
    heading.textContent = 'Education';
    containerEl.appendChild(heading);

    if (!this._coderData.education) return;

    this._coderData.education.forEach(edu => {
      const item = document.createElement('div');
      item.className = 'coder__edu-item will-animate';

      const star = document.createElement('span');
      star.className = 'coder__star mss';
      star.setAttribute('aria-hidden', 'true');
      star.textContent = 'star';

      const content = document.createElement('div');
      content.className = 'coder__edu-content';

      const degree = document.createElement('h4');
      degree.className = 'coder__edu-degree';
      degree.textContent = edu.degree;

      const meta = document.createElement('p');
      meta.className = 'coder__edu-meta';
      meta.textContent = `${edu.institution} • ${edu.year}`;

      content.appendChild(degree);
      content.appendChild(meta);
      item.appendChild(star);
      item.appendChild(content);
      containerEl.appendChild(item);
    });
  }

  _renderExperience(containerEl) {
    const heading = document.createElement('h3');
    heading.className = 'coder__subsection-heading will-animate';
    heading.textContent = 'Experience';
    containerEl.appendChild(heading);

    if (!this._coderData.experience) return;

    const timeline = document.createElement('div');
    timeline.className = 'coder__timeline-list';

    this._coderData.experience.forEach(entry => {
      const item = document.createElement('div');
      item.className = 'coder__timeline-item will-animate';

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

      const company = document.createElement('span');
      company.className = 'coder__timeline-company';
      company.textContent = entry.company;

      const desc = document.createElement('p');
      desc.className = 'coder__timeline-description';
      desc.textContent = entry.description;

      content.appendChild(year);
      content.appendChild(title);
      content.appendChild(company);
      content.appendChild(desc);
      item.appendChild(marker);
      item.appendChild(content);
      timeline.appendChild(item);
    });

    containerEl.appendChild(timeline);
  }

  _renderSkills(containerEl) {
    const heading = document.createElement('h3');
    heading.className = 'coder__subsection-heading will-animate';
    heading.textContent = 'Skills';
    containerEl.appendChild(heading);

    if (!this._coderData.skills) return;

    // Technical skills
    const techBlock = document.createElement('div');
    techBlock.className = 'coder__skill-category will-animate';

    const techHeading = document.createElement('h4');
    techHeading.className = 'coder__skill-category-heading';
    techHeading.textContent = 'Technical';
    techBlock.appendChild(techHeading);

    const techTags = document.createElement('div');
    techTags.className = 'coder__skill-tags';
    this._coderData.skills.technical.forEach(skill => {
      const tag = document.createElement('span');
      tag.className = 'coder__skill-tag';
      tag.textContent = skill.name;
      techTags.appendChild(tag);
    });
    techBlock.appendChild(techTags);
    containerEl.appendChild(techBlock);

    // Non-technical skills
    const softBlock = document.createElement('div');
    softBlock.className = 'coder__skill-category will-animate';

    const softHeading = document.createElement('h4');
    softHeading.className = 'coder__skill-category-heading';
    softHeading.textContent = 'Non-Technical';
    softBlock.appendChild(softHeading);

    const softTags = document.createElement('div');
    softTags.className = 'coder__skill-tags';
    this._coderData.skills.nonTechnical.forEach(skill => {
      const tag = document.createElement('span');
      tag.className = 'coder__skill-tag coder__skill-tag--soft';
      tag.textContent = skill.name;
      softTags.appendChild(tag);
    });
    softBlock.appendChild(softTags);
    containerEl.appendChild(softBlock);

    // Languages
    if (this._coderData.languages && this._coderData.languages.length > 0) {
      const langBlock = document.createElement('div');
      langBlock.className = 'coder__skill-category will-animate';

      const langHeading = document.createElement('h4');
      langHeading.className = 'coder__skill-category-heading';
      langHeading.textContent = 'Languages';
      langBlock.appendChild(langHeading);

      const langTags = document.createElement('div');
      langTags.className = 'coder__skill-tags';
      this._coderData.languages.forEach(lang => {
        const tag = document.createElement('span');
        tag.className = 'coder__skill-tag';
        tag.textContent = `${lang.name} · ${lang.level}`;
        langTags.appendChild(tag);
      });
      langBlock.appendChild(langTags);
      containerEl.appendChild(langBlock);
    }
  }

  _renderProjects(containerEl) {
    const heading = document.createElement('h3');
    heading.className = 'coder__subsection-heading will-animate';
    heading.textContent = 'Projects';
    containerEl.appendChild(heading);

    if (!this._coderData.projects) return;

    const grid = document.createElement('div');
    grid.className = 'coder__projects-grid';

    this._coderData.projects.forEach(project => {
      const card = document.createElement('article');
      card.className = 'coder__project-card will-animate';

      const title = document.createElement('h4');
      title.className = 'coder__project-title';
      title.textContent = project.title;

      const desc = document.createElement('p');
      desc.className = 'coder__project-description';
      desc.textContent = project.description;

      const techList = document.createElement('div');
      techList.className = 'coder__project-tech';
      project.tech.forEach(t => {
        const tag = document.createElement('span');
        tag.className = 'coder__project-tech-tag';
        tag.textContent = t;
        techList.appendChild(tag);
      });

      const link = document.createElement('a');
      link.className = 'coder__project-link';
      link.href = project.link;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.textContent = 'View →';

      card.appendChild(title);
      card.appendChild(desc);
      card.appendChild(techList);
      card.appendChild(link);
      grid.appendChild(card);
    });

    containerEl.appendChild(grid);
  }

  _renderAchievements(containerEl) {
    const heading = document.createElement('h3');
    heading.className = 'coder__subsection-heading will-animate';
    heading.textContent = 'Achievements';
    containerEl.appendChild(heading);

    if (!this._coderData.achievements) return;

    this._coderData.achievements.forEach(item => {
      const card = document.createElement('div');
      card.className = 'coder__achievement-card will-animate';

      const title = document.createElement('h4');
      title.className = 'coder__achievement-title';
      title.textContent = item.title;

      const event = document.createElement('span');
      event.className = 'coder__achievement-event';
      event.textContent = item.event;

      const desc = document.createElement('p');
      desc.className = 'coder__achievement-description';
      desc.textContent = item.description;

      card.appendChild(title);
      card.appendChild(event);
      card.appendChild(desc);
      containerEl.appendChild(card);
    });
  }

  _renderProfiles(containerEl) {
    const heading = document.createElement('h3');
    heading.className = 'coder__subsection-heading will-animate';
    heading.textContent = 'Profiles';
    containerEl.appendChild(heading);

    if (!this._coderData.profiles) return;

    const grid = document.createElement('div');
    grid.className = 'coder__profiles-grid will-animate';

    this._coderData.profiles.forEach(profile => {
      const link = document.createElement('a');
      link.className = 'coder__profile-card';
      link.href = profile.url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.setAttribute('aria-label', `${profile.name} profile`);

      const icon = document.createElement('span');
      icon.className = 'coder__profile-icon';
      icon.textContent = profile.icon;

      const name = document.createElement('span');
      name.className = 'coder__profile-name';
      name.textContent = profile.name;

      link.appendChild(icon);
      link.appendChild(name);
      if (profile.stat) {
        const stat = document.createElement('span');
        stat.className = 'coder__profile-stat';
        stat.textContent = profile.stat;
        link.appendChild(stat);
      }
      grid.appendChild(link);
    });

    containerEl.appendChild(grid);
  }
}

/**
 * EasterEggSystem — Listens for hidden triggers and activates secret interactions.
 * Tracks keystrokes, matches trigger words, opens a terminal overlay.
 * Requirements: 6.1, 6.2, 6.3, 6.4, 6.5
 */
class EasterEggSystem {
  constructor() {
    this._overlay = document.getElementById('terminal-overlay');
    this._output = this._overlay ? this._overlay.querySelector('.terminal__output') : null;
    this._input = this._overlay ? this._overlay.querySelector('.terminal__input') : null;
    this._keystrokeBuffer = '';
    this._triggerWords = ['terminal', 'hello'];
    this._isVisible = false;

    this._onKeyDown = this._onKeyDown.bind(this);
    this._onInputKeyDown = this._onInputKeyDown.bind(this);
  }

  /**
   * Start listening for keyboard sequences and Ctrl+Shift+T shortcut.
   */
  activate() {
    document.addEventListener('keydown', this._onKeyDown);
    if (this._input) {
      this._input.addEventListener('keydown', this._onInputKeyDown);
    }
  }

  /**
   * Show the terminal overlay.
   */
  showTerminal() {
    if (!this._overlay) return;
    this._overlay.classList.add('terminal--visible');
    this._overlay.setAttribute('aria-hidden', 'false');
    this._isVisible = true;
    if (this._input) {
      this._input.value = '';
      this._input.focus();
    }
  }

  /**
   * Hide the terminal overlay.
   */
  hideTerminal() {
    if (!this._overlay) return;
    this._overlay.classList.remove('terminal--visible');
    this._overlay.setAttribute('aria-hidden', 'true');
    this._isVisible = false;
  }

  /**
   * Process a terminal command input.
   * @param {string} input - The user's command text
   * @returns {string} The response text
   */
  processCommand(input) {
    const cmd = input.toLowerCase().trim();

    if (typeof easterEggCommands === 'undefined') {
      return 'Command not recognized. Type \'help\' for available commands.';
    }

    if (cmd in easterEggCommands) {
      const value = easterEggCommands[cmd];
      if (value === '__CLOSE__') {
        this.hideTerminal();
        return '';
      }
      return value;
    }

    return 'Command not recognized. Type \'help\' for available commands.';
  }

  /**
   * Handle keydown events on the document for shortcut and keystroke buffer.
   * @param {KeyboardEvent} e
   */
  _onKeyDown(e) {
    // Ctrl+Shift+T shortcut to open terminal
    if (e.ctrlKey && e.shiftKey && e.key === 'T') {
      e.preventDefault();
      if (this._isVisible) {
        this.hideTerminal();
      } else {
        this.showTerminal();
      }
      return;
    }

    // Don't track keystrokes when terminal is open or when focused on inputs
    if (this._isVisible) return;
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    // Only track single character keys
    if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      this._keystrokeBuffer += e.key.toLowerCase();

      // Keep buffer limited in size
      if (this._keystrokeBuffer.length > 20) {
        this._keystrokeBuffer = this._keystrokeBuffer.slice(-20);
      }

      // Check if buffer ends with any trigger word
      for (const word of this._triggerWords) {
        if (this._keystrokeBuffer.endsWith(word)) {
          this._keystrokeBuffer = '';
          this._flashHint();
          break;
        }
      }
    }
  }

  /**
   * Handle keydown on the terminal input.
   * @param {KeyboardEvent} e
   */
  _onInputKeyDown(e) {
    if (e.key === 'Enter') {
      const value = this._input.value;
      if (!value.trim()) return;

      // Append user command to output
      this._appendOutput(`$ ${value}`);

      // Process and display response
      const response = this.processCommand(value);
      if (response) {
        this._appendOutput(response);
      }

      this._input.value = '';
    } else if (e.key === 'Escape') {
      this.hideTerminal();
    }
  }

  /**
   * Append a line to the terminal output area.
   * @param {string} text
   */
  _appendOutput(text) {
    if (!this._output) return;
    const line = document.createElement('div');
    line.className = 'terminal__line';
    line.textContent = text;
    this._output.appendChild(line);
    // Auto-scroll to bottom
    this._output.scrollTop = this._output.scrollHeight;
  }

  /**
   * Show a subtle flash/hint that a trigger word was detected.
   */
  _flashHint() {
    if (!this._overlay) return;
    // Briefly flash the terminal overlay border as a hint
    this._overlay.classList.add('terminal--hint');
    setTimeout(() => {
      this._overlay.classList.remove('terminal--hint');
    }, 600);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // --- ThemeSystem ---
  try {
    const themeSystem = new ThemeSystem(document.querySelector('.nav__theme-toggle'));
  } catch (e) {
    console.warn('ThemeSystem failed to initialize:', e);
  }

  // --- NavigationController ---
  let navController;
  try {
    navController = new NavigationController(
      document.querySelector('.nav'),
      document.querySelectorAll('.panel')
    );

    // Hero label clicks → navigate to panels
    document.querySelectorAll('.hero__label').forEach(label => {
      label.addEventListener('click', (e) => {
        e.preventDefault();
        const target = label.getAttribute('data-nav');
        if (target && navController) {
          navController.navigateTo(target);
        }
      });
    });

    // Contact Me button → smooth scroll to footer
    const contactBtn = document.querySelector('.hero__btn--contact');
    if (contactBtn) {
      contactBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const footer = document.getElementById('footer');
        if (footer) {
          footer.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }
  } catch (e) {
    console.warn('NavigationController failed to initialize:', e);
  }

  // --- ContentRenderer ---
  try {
    const renderer = new ContentRenderer({ profileData, interestsData, coderData });
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

  // --- Dot Nav scroll tracking & click handling ---
  try {
    const dotNavItems = document.querySelectorAll('.dot-nav__item');
    const coderPanel = document.querySelector('#coder .panel__scroll');

    // Click handler: scroll to section
    dotNavItems.forEach(item => {
      item.addEventListener('click', () => {
        const targetId = item.getAttribute('data-target');
        const target = document.getElementById(targetId);
        if (coderPanel && target) {
          const targetTop = target.offsetTop - 80;
          coderPanel.scrollTo({ top: targetTop, behavior: 'smooth' });
        }
      });
    });

    // Scroll handler: update active dot
    if (coderPanel) {
      coderPanel.addEventListener('scroll', () => {
        const scrollTop = coderPanel.scrollTop + 100;
        let activeItem = dotNavItems[0];

        dotNavItems.forEach(item => {
          const targetId = item.getAttribute('data-target');
          const target = document.getElementById(targetId);
          if (target && target.offsetTop <= scrollTop) {
            activeItem = item;
          }
        });

        dotNavItems.forEach(item => item.classList.remove('dot-nav__item--active'));
        if (activeItem) activeItem.classList.add('dot-nav__item--active');
      });
    }
  } catch (e) {
    console.warn('Dot nav failed to initialize:', e);
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
    const easterEggs = new EasterEggSystem();
    easterEggs.activate();
  } catch (e) {
    console.warn('EasterEggSystem failed to initialize:', e);
  }
});
