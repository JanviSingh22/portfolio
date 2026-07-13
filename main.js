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

    // Trigger hero animation immediately as landing fades
    const hero = document.querySelector('.hero');
    if (hero) hero.classList.add('hero--animate');

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

    // Trigger hero text animations
    const hero = document.querySelector('.hero');
    if (hero) hero.classList.add('hero--animate');

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
      const row = document.createElement('div');
      row.className = 'coder__interest-item will-animate';
      row.setAttribute('role', 'listitem');

      const star = document.createElement('span');
      star.className = 'coder__star mss';
      star.setAttribute('aria-hidden', 'true');
      star.textContent = 'star';

      const title = document.createElement('span');
      title.className = 'coder__interest-title';
      title.textContent = item.title;

      row.appendChild(star);
      row.appendChild(title);
      containerEl.appendChild(row);
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

  _createScrollWrap(scrollRow) {
    const wrap = document.createElement('div');
    wrap.className = 'hscroll-wrap';

    const leftArrow = document.createElement('button');
    leftArrow.className = 'hscroll-arrow hscroll-arrow--left';
    leftArrow.setAttribute('aria-label', 'Scroll left');
    leftArrow.innerHTML = '<span class="mss">chevron_left</span>';

    const rightArrow = document.createElement('button');
    rightArrow.className = 'hscroll-arrow hscroll-arrow--right';
    rightArrow.setAttribute('aria-label', 'Scroll right');
    rightArrow.innerHTML = '<span class="mss">chevron_right</span>';

    // Only enable scrolling and arrows if more than 4 tiles
    const tileCount = scrollRow.children.length;
    if (tileCount > 4) {
      scrollRow.classList.add('hscroll-row--scrollable');
      wrap.classList.add('hscroll-wrap--scrollable');

      leftArrow.addEventListener('click', () => {
        scrollRow.scrollLeft -= 300;
      });

      rightArrow.addEventListener('click', () => {
        scrollRow.scrollLeft += 300;
      });
    }

    wrap.appendChild(leftArrow);
    wrap.appendChild(scrollRow);
    wrap.appendChild(rightArrow);
    return wrap;
  }

  /**
   * Generic tile renderer — builds horizontal scroll tiles from any data array.
   * Each item can have: title, meta (year), subtitle, description, tags[], links[]
   * Tiles show compact view; clicking opens a detail popup.
   */
  _renderTileSection(containerEl, heading, items, clickable = false) {
    const h = document.createElement('h3');
    h.className = 'coder__subsection-heading will-animate';
    h.textContent = heading;
    containerEl.appendChild(h);

    if (!items || items.length === 0) return;

    const scrollRow = document.createElement('div');
    scrollRow.className = 'hscroll-row';

    items.forEach(item => {
      const tile = document.createElement('div');
      tile.className = 'hscroll-tile will-animate';
      tile.style.cursor = clickable ? 'pointer' : 'default';

      // Header row: title (left) + meta/year (right)
      const header = document.createElement('div');
      header.className = 'hscroll-tile__header';

      const title = document.createElement('h4');
      title.className = 'hscroll-tile__title';
      title.textContent = item.title || '';
      header.appendChild(title);

      if (item.meta) {
        const meta = document.createElement('span');
        meta.className = 'hscroll-tile__meta';
        meta.textContent = item.meta;
        header.appendChild(meta);
      }

      tile.appendChild(header);

      if (item.subtitle) {
        const sub = document.createElement('span');
        sub.className = 'hscroll-tile__sub';
        sub.textContent = item.subtitle;
        tile.appendChild(sub);
      }

      // Show tags on the compact tile too
      if (item.tags && item.tags.length > 0) {
        const tagsWrap = document.createElement('div');
        tagsWrap.className = 'hscroll-tile__tags';
        // Add a label before tags if there's a tagsLabel
        if (item.tagsLabel && !item.projectTags) {
          const label = document.createElement('span');
          label.className = 'hscroll-tile__tags-label';
          label.textContent = item.tagsLabel;
          tagsWrap.appendChild(label);
        }
        item.tags.forEach(t => {
          const tag = document.createElement('span');
          tag.className = 'hscroll-tile__tag';
          tag.textContent = t;
          tagsWrap.appendChild(tag);
        });
        tile.appendChild(tagsWrap);
      }

      // Click to open detail popup (only for clickable sections)
      if (clickable) {
        tile.addEventListener('click', (e) => {
          e.stopPropagation();
          // Remove existing popup
          const existing = document.querySelector('.tile-detail-overlay');
          if (existing) existing.remove();

          const overlay = document.createElement('div');
          overlay.className = 'tile-detail-overlay';

          const card = document.createElement('div');
          card.className = 'tile-detail-card';

          // Close button
          const closeBtn = document.createElement('button');
          closeBtn.className = 'tile-detail__close';
          closeBtn.innerHTML = '<span class="mss">close</span>';
          closeBtn.addEventListener('click', () => { overlay.remove(); document.body.classList.remove('popup-open'); });
          card.appendChild(closeBtn);

          // Title + GitHub link header
          const hdr = document.createElement('div');
          hdr.className = 'tile-detail__header';
          const t = document.createElement('h3');
          t.className = 'tile-detail__title';
          t.textContent = item.title || '';
          hdr.appendChild(t);
          if (item.links && item.links.length > 0) {
            const ghLink = document.createElement('a');
            ghLink.className = 'tile-detail__github';
            ghLink.href = item.links[0].url;
            ghLink.target = '_blank';
            ghLink.rel = 'noopener noreferrer';
            ghLink.setAttribute('aria-label', 'GitHub repository');
            ghLink.innerHTML = '<img src="assets/github.png" alt="GitHub" class="tile-detail__github-icon">';
            hdr.appendChild(ghLink);
          }
          card.appendChild(hdr);

          if (item.subtitle) {
            const s = document.createElement('p');
            s.className = 'tile-detail__sub';
            s.textContent = item.subtitle;
            card.appendChild(s);
          }
          if (item.description) {
            const d = document.createElement('p');
            d.className = 'tile-detail__desc';
            d.textContent = item.description;
            card.appendChild(d);
          }
          if (item.tags && item.tags.length > 0) {
            const tw = document.createElement('div');
            tw.className = 'tile-detail__tags';
            item.tags.forEach(tg => {
              const sp = document.createElement('span');
              sp.className = 'tile-detail__tag';
              sp.textContent = tg;
              tw.appendChild(sp);
            });
            card.appendChild(tw);
          }
          overlay.appendChild(card);
          overlay.addEventListener('click', (ev) => {
            if (ev.target === overlay) { overlay.remove(); document.body.classList.remove('popup-open'); }
          });
          document.body.appendChild(overlay);
          document.body.classList.add('popup-open');
        });
      }

      scrollRow.appendChild(tile);
    });

    containerEl.appendChild(this._createScrollWrap(scrollRow));
  }

  _showTileDetail(item) {
    // Remove existing popup if any
    const existing = document.querySelector('.tile-detail-overlay');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.className = 'tile-detail-overlay';

    const card = document.createElement('div');
    card.className = 'tile-detail-card';

    // Close button
    const closeBtn = document.createElement('button');
    closeBtn.className = 'tile-detail__close';
    closeBtn.innerHTML = '<span class="mss">close</span>';
    closeBtn.setAttribute('aria-label', 'Close');
    closeBtn.addEventListener('click', () => { overlay.remove(); document.body.classList.remove('popup-open'); });
    card.appendChild(closeBtn);

    // Header
    const header = document.createElement('div');
    header.className = 'tile-detail__header';

    const title = document.createElement('h3');
    title.className = 'tile-detail__title';
    title.textContent = item.title || '';
    header.appendChild(title);

    if (item.meta) {
      const meta = document.createElement('span');
      meta.className = 'tile-detail__meta';
      meta.textContent = item.meta;
      header.appendChild(meta);
    }
    card.appendChild(header);

    if (item.subtitle) {
      const sub = document.createElement('p');
      sub.className = 'tile-detail__sub';
      sub.textContent = item.subtitle;
      card.appendChild(sub);
    }

    if (item.description) {
      const desc = document.createElement('p');
      desc.className = 'tile-detail__desc';
      desc.textContent = item.description;
      card.appendChild(desc);
    }

    if (item.tags && item.tags.length > 0) {
      const tagsWrap = document.createElement('div');
      tagsWrap.className = 'tile-detail__tags';
      item.tags.forEach(t => {
        const tag = document.createElement('span');
        tag.className = 'tile-detail__tag';
        tag.textContent = t;
        tagsWrap.appendChild(tag);
      });
      card.appendChild(tagsWrap);
    }

    if (item.links && item.links.length > 0) {
      const linksWrap = document.createElement('div');
      linksWrap.className = 'tile-detail__links';
      item.links.forEach(l => {
        const link = document.createElement('a');
        link.className = 'tile-detail__link';
        link.href = l.url;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.textContent = l.label || 'View →';
        linksWrap.appendChild(link);
      });
      card.appendChild(linksWrap);
    }

    overlay.appendChild(card);

    // Close on overlay background click
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) { overlay.remove(); document.body.classList.remove('popup-open'); }
    });

    document.body.appendChild(overlay);
    document.body.classList.add('popup-open');
  }

  _renderEducation(containerEl) {
    const items = (this._coderData.education || []).map(edu => ({
      title: edu.title,
      meta: edu.duration,
      subtitle: edu.subtitle
    }));
    this._renderTileSection(containerEl, 'Education', items);
  }

  _renderExperience(containerEl) {
    const h = document.createElement('h3');
    h.className = 'coder__subsection-heading will-animate';
    h.textContent = 'Experience';
    containerEl.appendChild(h);

    const experiences = this._coderData.experience || [];
    if (experiences.length === 0) return;

    const scrollRow = document.createElement('div');
    scrollRow.className = 'hscroll-row';

    experiences.forEach(entry => {
      const tile = document.createElement('div');
      tile.className = 'hscroll-tile will-animate';
      tile.style.cursor = 'pointer';

      // Header: company (left) + duration (right)
      const header = document.createElement('div');
      header.className = 'hscroll-tile__header';
      const title = document.createElement('h4');
      title.className = 'hscroll-tile__title';
      title.textContent = entry.company;
      header.appendChild(title);
      const meta = document.createElement('span');
      meta.className = 'hscroll-tile__meta';
      meta.textContent = entry.duration;
      header.appendChild(meta);
      tile.appendChild(header);

      // Role subtitle
      const sub = document.createElement('span');
      sub.className = 'hscroll-tile__sub';
      sub.textContent = entry.role;
      tile.appendChild(sub);

      // Project names as tags
      if (entry.projects && entry.projects.length > 0) {
        const tagsWrap = document.createElement('div');
        tagsWrap.className = 'hscroll-tile__tags';
        const label = document.createElement('span');
        label.className = 'hscroll-tile__tags-label';
        label.textContent = 'Projects:';
        tagsWrap.appendChild(label);
        entry.projects.forEach(proj => {
          const tag = document.createElement('span');
          tag.className = 'hscroll-tile__tag';
          tag.textContent = proj.name;
          tagsWrap.appendChild(tag);
        });
        tile.appendChild(tagsWrap);
      }

      // Click → open experience popup with full project details
      tile.addEventListener('click', (e) => {
        e.stopPropagation();
        const existing = document.querySelector('.tile-detail-overlay');
        if (existing) existing.remove();

        const overlay = document.createElement('div');
        overlay.className = 'tile-detail-overlay';

        const card = document.createElement('div');
        card.className = 'tile-detail-card';

        // Close button
        const closeBtn = document.createElement('button');
        closeBtn.className = 'tile-detail__close';
        closeBtn.setAttribute('aria-label', 'Close');
        closeBtn.innerHTML = '<span class="mss">close</span>';
        closeBtn.addEventListener('click', () => { overlay.remove(); document.body.classList.remove('popup-open'); });
        card.appendChild(closeBtn);

        // Header: company + duration
        const popupHeader = document.createElement('div');
        popupHeader.className = 'tile-detail__header';
        const popupTitle = document.createElement('h3');
        popupTitle.className = 'tile-detail__title';
        popupTitle.textContent = entry.company;
        popupHeader.appendChild(popupTitle);
        const popupMeta = document.createElement('span');
        popupMeta.className = 'tile-detail__meta';
        popupMeta.textContent = entry.duration;
        popupHeader.appendChild(popupMeta);
        card.appendChild(popupHeader);

        // Role
        const popupRole = document.createElement('p');
        popupRole.className = 'tile-detail__subtitle';
        popupRole.textContent = entry.role;
        card.appendChild(popupRole);

        // Projects heading
        const projHeading = document.createElement('h4');
        projHeading.className = 'tile-detail__projects-heading';
        projHeading.textContent = 'Projects';
        card.appendChild(projHeading);

        // Each project as a stacked card
        entry.projects.forEach(proj => {
          const projCard = document.createElement('div');
          projCard.className = 'tile-detail__project-card';

          // Project name + GitHub link
          const projHeader = document.createElement('div');
          projHeader.className = 'tile-detail__project-header';
          const projName = document.createElement('span');
          projName.className = 'tile-detail__project-name';
          projName.textContent = proj.name;
          projHeader.appendChild(projName);
          if (proj.link) {
            const ghLink = document.createElement('a');
            ghLink.href = proj.link;
            ghLink.target = '_blank';
            ghLink.rel = 'noopener noreferrer';
            ghLink.className = 'tile-detail__project-link';
            ghLink.innerHTML = '<img src="assets/github.png" alt="GitHub" width="18" height="18">';
            projHeader.appendChild(ghLink);
          }
          if (proj.duration) {
            const projDur = document.createElement('span');
            projDur.className = 'tile-detail__project-duration';
            projDur.textContent = proj.duration;
            projHeader.appendChild(projDur);
          }
          projCard.appendChild(projHeader);

          // Subtitle (e.g. "Control Tower")
          if (proj.subtitle) {
            const projSub = document.createElement('p');
            projSub.className = 'tile-detail__project-subtitle';
            projSub.textContent = proj.subtitle;
            projCard.appendChild(projSub);
          }

          // Description (array = bullet points, string = paragraph)
          if (Array.isArray(proj.description)) {
            const ul = document.createElement('ul');
            ul.className = 'tile-detail__project-points';
            proj.description.forEach(point => {
              const li = document.createElement('li');
              li.textContent = point;
              ul.appendChild(li);
            });
            projCard.appendChild(ul);
          } else if (proj.description) {
            const projDesc = document.createElement('p');
            projDesc.className = 'tile-detail__project-desc';
            projDesc.textContent = proj.description;
            projCard.appendChild(projDesc);
          }

          // Tech tags
          if (proj.tech && proj.tech.length > 0) {
            const techWrap = document.createElement('div');
            techWrap.className = 'tile-detail__project-tags';
            proj.tech.forEach(t => {
              const techTag = document.createElement('span');
              techTag.className = 'tile-detail__tag';
              techTag.textContent = t;
              techWrap.appendChild(techTag);
            });
            projCard.appendChild(techWrap);
          }

          card.appendChild(projCard);
        });

        overlay.appendChild(card);
        overlay.addEventListener('click', (ev) => {
          if (ev.target === overlay) { overlay.remove(); document.body.classList.remove('popup-open'); }
        });
        document.body.appendChild(overlay);
        document.body.classList.add('popup-open');
      });

      scrollRow.appendChild(tile);
    });

    const wrap = this._createScrollWrap(scrollRow);
    containerEl.appendChild(wrap);
  }

  _renderSkills(containerEl) {
    const heading = document.createElement('h3');
    heading.className = 'coder__subsection-heading will-animate';
    heading.textContent = 'Skills';
    containerEl.appendChild(heading);

    if (!this._coderData.skills) return;

    const categories = [
      { label: 'Languages', data: this._coderData.skills.languages },
      { label: 'Frameworks', data: this._coderData.skills.frameworks },
      { label: 'Tools', data: this._coderData.skills.tools },
      { label: 'Non-Technical', data: this._coderData.skills.nonTechnical, soft: true },
      { label: 'Spoken Languages', data: this._coderData.languages, soft: true }
    ];

    categories.forEach(cat => {
      if (!cat.data || cat.data.length === 0) return;

      const block = document.createElement('div');
      block.className = 'coder__skill-category will-animate';

      const headWrap = document.createElement('div');
      headWrap.className = 'coder__skill-category-header';

      const star = document.createElement('span');
      star.className = 'coder__star mss';
      star.setAttribute('aria-hidden', 'true');
      star.textContent = 'star';

      const h = document.createElement('h4');
      h.className = 'coder__skill-category-heading';
      h.textContent = cat.label;

      headWrap.appendChild(star);
      headWrap.appendChild(h);
      block.appendChild(headWrap);

      const tags = document.createElement('div');
      tags.className = 'coder__skill-tags';
      cat.data.forEach(skill => {
        const tag = document.createElement('span');
        tag.className = cat.soft ? 'coder__skill-tag coder__skill-tag--soft' : 'coder__skill-tag';
        tag.textContent = skill.level ? `${skill.name} (${skill.level})` : skill.name;
        tags.appendChild(tag);
      });
      block.appendChild(tags);
      containerEl.appendChild(block);
    });

    // Coursework
    if (this._coderData.coursework && this._coderData.coursework.length > 0) {
      const cwBlock = document.createElement('div');
      cwBlock.className = 'coder__skill-category will-animate';

      const cwHeadWrap = document.createElement('div');
      cwHeadWrap.className = 'coder__skill-category-header';

      const cwStar = document.createElement('span');
      cwStar.className = 'coder__star mss';
      cwStar.setAttribute('aria-hidden', 'true');
      cwStar.textContent = 'star';

      const cwH = document.createElement('h4');
      cwH.className = 'coder__skill-category-heading';
      cwH.textContent = 'Coursework (2021 – 2025)';

      cwHeadWrap.appendChild(cwStar);
      cwHeadWrap.appendChild(cwH);
      cwBlock.appendChild(cwHeadWrap);

      const cwTags = document.createElement('div');
      cwTags.className = 'coder__skill-tags';
      this._coderData.coursework.forEach(course => {
        const tag = document.createElement('span');
        tag.className = 'coder__skill-tag';
        tag.textContent = course;
        cwTags.appendChild(tag);
      });
      cwBlock.appendChild(cwTags);
      containerEl.appendChild(cwBlock);
    }
  }

  _renderProjects(containerEl) {
    const items = (this._coderData.projects || []).map(project => ({
      title: project.title,
      meta: project.year,
      description: project.description,
      tags: project.tech,
      links: [{ url: project.link, label: 'View →' }]
    }));
    this._renderTileSection(containerEl, 'Projects', items, true);
  }

  _renderAchievements(containerEl) {
    const h = document.createElement('h3');
    h.className = 'coder__subsection-heading will-animate';
    h.textContent = 'Achievements';
    containerEl.appendChild(h);

    const items = this._coderData.achievements || [];
    if (items.length === 0) return;

    const grid = document.createElement('div');
    grid.className = 'achievements-grid';

    items.forEach(item => {
      const tile = document.createElement('div');
      tile.className = 'hscroll-tile will-animate';

      const header = document.createElement('div');
      header.className = 'hscroll-tile__header';
      const title = document.createElement('h4');
      title.className = 'hscroll-tile__title';
      title.textContent = item.title;
      header.appendChild(title);
      tile.appendChild(header);

      if (item.event) {
        const sub = document.createElement('span');
        sub.className = 'hscroll-tile__sub';
        sub.textContent = item.event;
        tile.appendChild(sub);
      }

      grid.appendChild(tile);
    });

    containerEl.appendChild(grid);
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


document.addEventListener('DOMContentLoaded', () => {
  // --- Hero Text Slam Animation ---
  try {
    const heroName = document.querySelector('.hero__name');
    const heroGreeting = document.querySelector('.hero__greeting');
    const heroRole = document.querySelector('.hero__role');
    const heroTagline = document.querySelector('.hero__tagline');

    let delay = 70; // starting delay in ms

    // Split greeting into words
    if (heroGreeting) {
      const text = heroGreeting.textContent;
      heroGreeting.textContent = '';
      text.split(' ').forEach((word, i) => {
        const span = document.createElement('span');
        span.className = 'hero__word hero__word--greeting';
        span.textContent = word + '\u00A0';
        span.style.animationDelay = delay + (i * 80) + 'ms';
        heroGreeting.appendChild(span);
      });
      delay += text.split(' ').length * 80 + 120;
    }

    // Split name into letters
    if (heroName) {
      const text = heroName.textContent;
      heroName.textContent = '';
      const chars = Array.from(text);
      chars.forEach((char, i) => {
        const span = document.createElement('span');
        span.className = 'hero__char';
        span.textContent = char === ' ' ? '\u00A0' : char;
        span.style.animationDelay = delay + (i * 70) + 'ms';
        heroName.appendChild(span);
      });
      delay += chars.length * 70 + 120;
    }

    // Split role into words
    if (heroRole) {
      const text = heroRole.textContent;
      heroRole.textContent = '';
      text.split(' ').forEach((word, i) => {
        const span = document.createElement('span');
        span.className = 'hero__word hero__word--role';
        span.textContent = word + '\u00A0';
        span.style.animationDelay = delay + (i * 100) + 'ms';
        heroRole.appendChild(span);
      });
      delay += text.split(' ').length * 100 + 120;
    }

    // Split tagline into words
    if (heroTagline) {
      const text = heroTagline.textContent;
      heroTagline.textContent = '';
      text.split(' ').forEach((word, i) => {
        const span = document.createElement('span');
        span.className = 'hero__word hero__word--tagline';
        span.textContent = word + '\u00A0';
        span.style.animationDelay = delay + (i * 80) + 'ms';
        heroTagline.appendChild(span);
      });
    }
  } catch (e) {
    console.warn('Hero text animation failed:', e);
  }

  // --- ThemeSystem ---
  try {
    const themeSystem = new ThemeSystem(document.querySelector('.nav__theme-toggle'));
  } catch (e) {
    console.warn('ThemeSystem failed to initialize:', e);
  }

  // --- Navigation: scroll state + floating menu ---
  try {
    const nav = document.querySelector('.nav');
    const logo = document.querySelector('.nav__logo');
    const floatingCta = document.querySelector('.floating-cta');
    const scrollCircles = document.querySelectorAll('.floating-cta__circle--scroll');
    const menuBtn = document.querySelector('.nav__menu-toggle');
    const floatingMenu = document.querySelector('.floating-menu');
    const floatingMenuLinks = document.querySelectorAll('.floating-menu__link');
    const heroSection = document.getElementById('hero');

    // Logo click → scroll to top
    if (logo) {
      logo.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    // Scroll detection: show/hide floating circles
    const handleScroll = () => {
      const heroBottom = heroSection ? heroSection.offsetTop + heroSection.offsetHeight : 500;
      const scrolled = window.scrollY > heroBottom - 100;

      if (scrolled) {
        scrollCircles.forEach(c => c.classList.add('floating-cta__circle--visible'));
      } else {
        scrollCircles.forEach(c => c.classList.remove('floating-cta__circle--visible'));
        // Close menu if open
        floatingMenu.classList.add('floating-menu--hidden');
        floatingMenu.setAttribute('aria-hidden', 'true');
      }

      // Update current section in floating menu
      const sections = document.querySelectorAll('.section[id]');
      let currentId = '';
      sections.forEach(sec => {
        if (sec.offsetTop <= window.scrollY + 200) {
          currentId = sec.id;
        }
      });
      floatingMenuLinks.forEach(link => {
        const linkSection = link.getAttribute('data-section');
        if (linkSection === currentId) {
          link.classList.add('floating-menu__link--current');
        } else {
          link.classList.remove('floating-menu__link--current');
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // initial state

    // Menu circle toggle
    if (menuBtn) {
      menuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = !floatingMenu.classList.contains('floating-menu--hidden');
        if (isOpen) {
          floatingMenu.classList.add('floating-menu--hidden');
          floatingMenu.setAttribute('aria-hidden', 'true');
          menuBtn.setAttribute('aria-expanded', 'false');
        } else {
          floatingMenu.classList.remove('floating-menu--hidden');
          floatingMenu.setAttribute('aria-hidden', 'false');
          menuBtn.setAttribute('aria-expanded', 'true');
        }
      });
    }

    // Close menu on click outside
    document.addEventListener('click', (e) => {
      if (!floatingMenu.classList.contains('floating-menu--hidden')) {
        if (!floatingMenu.contains(e.target) && e.target !== menuBtn && !menuBtn.contains(e.target)) {
          floatingMenu.classList.add('floating-menu--hidden');
          floatingMenu.setAttribute('aria-hidden', 'true');
          menuBtn.setAttribute('aria-expanded', 'false');
        }
      }
    });

    // Floating menu link clicks
    floatingMenuLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').replace('#', '');
        const target = document.getElementById(targetId);
        if (target) target.scrollIntoView({ behavior: 'smooth' });
        // Close menu
        floatingMenu.classList.add('floating-menu--hidden');
        floatingMenu.setAttribute('aria-hidden', 'true');
        menuBtn.setAttribute('aria-expanded', 'false');
      });
    });

    // Contact circle smooth scroll
    const contactCircle = document.querySelector('.floating-cta__circle[aria-label="Contact Me"]');
    if (contactCircle) {
      contactCircle.addEventListener('click', (e) => {
        e.preventDefault();
        const footer = document.getElementById('footer');
        if (footer) footer.scrollIntoView({ behavior: 'smooth' });
      });
    }
  } catch (e) {
    console.warn('Navigation failed to initialize:', e);
  }

  // --- Footer Renderer ---
  try {
    const footerHeading = document.querySelector('.footer__heading');
    const footerLinks = document.querySelector('.footer__links');
    const footerCopyright = document.querySelector('.footer__copyright');

    if (typeof footerData !== 'undefined') {
      if (footerHeading) footerHeading.textContent = footerData.heading;
      if (footerCopyright) footerCopyright.textContent = footerData.copyright;

      // Render links
      if (footerLinks && footerData.links) {
        footerData.links.forEach(link => {
          const a = document.createElement('a');
          a.href = link.url;
          a.className = 'footer__link';
          a.setAttribute('aria-label', link.name);
          if (!link.url.startsWith('mailto:')) {
            a.target = '_blank';
            a.rel = 'noopener noreferrer';
          }

          if (link.iconType === 'image') {
            a.innerHTML = `<img src="${link.iconSrc}" alt="" class="footer__icon"> ${link.name}`;
          } else {
            a.innerHTML = `<span class="mss footer__icon-mss">${link.iconSrc}</span> ${link.name}`;
          }
          footerLinks.appendChild(a);
        });
      }
    }
  } catch (e) {
    console.warn('Footer renderer failed:', e);
  }

  // --- ContentRenderer ---
  try {
    const renderer = new ContentRenderer({ profileData, interestsData, coderData });
    renderer._renderEducation(document.querySelector('#opus-education .section__container'));
    renderer._renderExperience(document.querySelector('#opus-experience .section__container'));
    renderer._renderSkills(document.querySelector('#opus-skills .section__container'));
    renderer._renderProjects(document.querySelector('#opus-projects .section__container'));
    renderer._renderAchievements(document.querySelector('#opus-achievements .section__container'));
    renderer.renderInterestCards(document.querySelector('#opus-interests .interests-grid'));
  } catch (e) {
    console.warn('ContentRenderer failed to initialize:', e);
  }

  // --- AnimationSystem ---
  try {
    const animSystem = new AnimationSystem({ threshold: 0.15, rootMargin: '0px 0px -50px 0px', once: true });
    animSystem.observe(document.querySelectorAll('.will-animate'), 'is-visible');
  } catch (e) {
    document.querySelectorAll('.will-animate').forEach(el => {
      el.classList.remove('will-animate');
    });
    console.warn('AnimationSystem failed to initialize:', e);
  }

  // --- About Bio Typewriter ---
  try {
    const bioEl = document.querySelector('[data-typewriter]');
    if (bioEl) {
      const fullText = bioEl.textContent;
      bioEl.textContent = '';
      const cursor = document.createElement('span');
      cursor.className = 'typewriter-cursor';
      bioEl.appendChild(cursor);
      let typed = false;

      const bioObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !typed) {
            typed = true;
            let i = 0;
            const type = () => {
              if (i < fullText.length) {
                bioEl.insertBefore(document.createTextNode(fullText[i]), cursor);
                i++;
                setTimeout(type, 30 + Math.random() * 30);
              } else {
                setTimeout(() => cursor.remove(), 1500);
              }
            };
            type();
            bioObserver.disconnect();
          }
        });
      }, { threshold: 0.5 });
      bioObserver.observe(bioEl);
    }
  } catch (e) {
    console.warn('About typewriter failed:', e);
  }

  // --- Bouncing Tags ---
  try {
    const container = document.querySelector('[data-bouncing-tags]');
    if (container) {
      const tags = container.querySelectorAll('.bouncing-tag');
      const tagData = [];

      // Initialize each tag with random position and velocity
      tags.forEach((tag) => {
        const speed = 0.8 + Math.random() * 0.7;
        const angle = Math.random() * Math.PI * 2;
        const data = {
          el: tag,
          x: 0,
          y: 0,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          paused: false
        };
        tagData.push(data);

        // Hover to stop
        tag.addEventListener('mouseenter', () => {
          if (!data.paused) {
            data.savedVx = data.vx;
            data.savedVy = data.vy;
            data.vx = 0;
            data.vy = 0;
          }
        });

        tag.addEventListener('mouseleave', () => {
          if (!data.paused && data.savedVx !== undefined) {
            data.vx = data.savedVx;
            data.vy = data.savedVy;
            delete data.savedVx;
            delete data.savedVy;
          }
        });

        // Click to expand/collapse
        tag.addEventListener('click', () => {
          if (data.paused) {
            tag.classList.remove('bouncing-tag--expanded');
            data.paused = false;
          } else {
            // Collapse any other expanded tag
            tagData.forEach(t => {
              if (t.paused && t !== data) {
                t.el.classList.remove('bouncing-tag--expanded');
                t.paused = false;
              }
            });
            tag.classList.add('bouncing-tag--expanded');
            data.paused = true;
          }
        });
      });

      function animateBounce() {
        const cw = container.offsetWidth;
        const ch = container.offsetHeight;

        tagData.forEach((t) => {
          if (t.paused) return;

          // Use base size (28px) for collision detection
          const tw = 28;
          const th = 28;

          t.x += t.vx;
          t.y += t.vy;

          // Bounce off walls
          if (t.x < 0) { t.x = 0; t.vx *= -1; }
          if (t.y < 0) { t.y = 0; t.vy *= -1; }
          if (t.x + tw > cw) { t.x = cw - tw; t.vx *= -1; }
          if (t.y + th > ch) { t.y = ch - th; t.vy *= -1; }

          t.el.style.left = t.x + 'px';
          t.el.style.top = t.y + 'px';
        });

        requestAnimationFrame(animateBounce);
      }

      // Set initial positions after layout
      requestAnimationFrame(() => {
        const cw = container.offsetWidth;
        const ch = container.offsetHeight;
        tagData.forEach((t) => {
          t.x = Math.random() * (cw - 28);
          t.y = Math.random() * (ch - 28);
          t.el.style.left = t.x + 'px';
          t.el.style.top = t.y + 'px';
        });
        animateBounce();
      });
    }
  } catch (e) {
    console.warn('Bouncing tags failed:', e);
  }

  // --- Photo Carousel with Swipe + Dots (Infinite Loop) ---
  try {
    const photoCarousel = document.querySelector('[data-photo-carousel]');
    if (photoCarousel) {
      const track = photoCarousel.querySelector('.about-bento__photo-track');
      const originalSlides = Array.from(photoCarousel.querySelectorAll('.about-bento__photo-slide'));
      const dotsContainer = photoCarousel.querySelector('.about-bento__photo-dots');
      const totalSlides = originalSlides.length;
      let currentSlide = 0;
      let startX = 0;
      let isDragging = false;
      let isTransitioning = false;

      // Clone first and last for infinite illusion
      const firstClone = originalSlides[0].cloneNode(true);
      const lastClone = originalSlides[totalSlides - 1].cloneNode(true);
      firstClone.setAttribute('aria-hidden', 'true');
      lastClone.setAttribute('aria-hidden', 'true');
      track.appendChild(firstClone);
      track.insertBefore(lastClone, track.firstChild);

      // Offset by 1 because of prepended clone
      track.style.transform = `translateX(-100%)`;

      // Create dots
      originalSlides.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.className = 'about-bento__photo-dot' + (i === 0 ? ' about-bento__photo-dot--active' : '');
        dot.setAttribute('aria-label', `Photo ${i + 1}`);
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
      });

      function updateDots() {
        dotsContainer.querySelectorAll('.about-bento__photo-dot').forEach((d, i) => {
          d.classList.toggle('about-bento__photo-dot--active', i === currentSlide);
        });
      }

      function goToSlide(index, animate = true) {
        currentSlide = index;
        const offset = (index + 1) * 100; // +1 for prepended clone
        if (animate) {
          track.style.transition = 'transform 0.4s ease';
        } else {
          track.style.transition = 'none';
        }
        track.style.transform = `translateX(-${offset}%)`;
        updateDots();
      }

      // After transition, check if we're on a clone and silently jump
      track.addEventListener('transitionend', () => {
        isTransitioning = false;
        if (currentSlide >= totalSlides) {
          currentSlide = 0;
          goToSlide(0, false);
        } else if (currentSlide < 0) {
          currentSlide = totalSlides - 1;
          goToSlide(totalSlides - 1, false);
        }
      });

      function nextSlide() {
        if (isTransitioning) return;
        isTransitioning = true;
        currentSlide++;
        const offset = (currentSlide + 1) * 100;
        track.style.transition = 'transform 0.4s ease';
        track.style.transform = `translateX(-${offset}%)`;
        updateDots();
      }

      function prevSlide() {
        if (isTransitioning) return;
        isTransitioning = true;
        currentSlide--;
        const offset = (currentSlide + 1) * 100;
        track.style.transition = 'transform 0.4s ease';
        track.style.transform = `translateX(-${offset}%)`;
        updateDots();
      }

      // Arrow buttons
      const leftArrow = photoCarousel.querySelector('.about-bento__photo-arrow--left');
      const rightArrow = photoCarousel.querySelector('.about-bento__photo-arrow--right');

      if (leftArrow) leftArrow.addEventListener('click', prevSlide);
      if (rightArrow) rightArrow.addEventListener('click', nextSlide);

      // Touch/swipe support
      track.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        isDragging = true;
      });

      track.addEventListener('touchend', (e) => {
        if (!isDragging) return;
        isDragging = false;
        const diff = startX - e.changedTouches[0].clientX;
        if (diff > 50) nextSlide();
        else if (diff < -50) prevSlide();
      });

      // Mouse drag support
      track.addEventListener('mousedown', (e) => {
        startX = e.clientX;
        isDragging = true;
        e.preventDefault();
      });

      track.addEventListener('mouseup', (e) => {
        if (!isDragging) return;
        isDragging = false;
        const diff = startX - e.clientX;
        if (diff > 50) nextSlide();
        else if (diff < -50) prevSlide();
      });

      // Lightbox — click image to view fullscreen
      track.addEventListener('click', (e) => {
        if (Math.abs(startX - e.clientX) > 10) return; // ignore drag clicks
        const slide = e.target.closest('.about-bento__photo-slide');
        if (!slide) return;

        const overlay = document.createElement('div');
        overlay.className = 'photo-lightbox';
        overlay.innerHTML = `
          <button class="photo-lightbox__close" aria-label="Close"><span class="mss">close</span></button>
          <img src="${slide.src}" alt="${slide.alt}" class="photo-lightbox__img">
        `;
        document.body.appendChild(overlay);

        overlay.addEventListener('click', (ev) => {
          if (ev.target === overlay || ev.target.closest('.photo-lightbox__close')) {
            overlay.remove();
          }
        });

        document.addEventListener('keydown', function escClose(ev) {
          if (ev.key === 'Escape') {
            overlay.remove();
            document.removeEventListener('keydown', escClose);
          }
        });
      });
    }
  } catch (e) {
    console.warn('Photo carousel failed:', e);
  }

  // --- Fun Fact Backspace Typewriter ---
  try {
    const funFactEl = document.querySelector('[data-backspace-typewriter]');
    if (funFactEl) {
      const phrases = [
        "☕ probably overthinking my next project rn",
        "🌏 silk road trip is on the vision board no cap",
        "🎸 will replay the same song 47 times and still not skip",
        "📰 newspaper girlie in a doomscroll world",
        "😄 small wins hit different, i celebrate everything",
        "🫠 perfection is the enemy but she's kinda valid tho"
      ];
      let phraseIndex = 0;
      let charIndex = 0;
      let isDeleting = false;

      const cursor = document.createElement('span');
      cursor.className = 'about-bento__funfact-cursor';
      cursor.textContent = '|';
      funFactEl.appendChild(cursor);

      function typeLoop() {
        const currentChars = Array.from(phrases[phraseIndex]);
        const currentPhrase = currentChars.join('');

        if (!isDeleting) {
          funFactEl.textContent = currentChars.slice(0, charIndex + 1).join('');
          funFactEl.appendChild(cursor);
          charIndex++;
          if (charIndex === currentChars.length) {
            isDeleting = true;
            setTimeout(typeLoop, 2000);
            return;
          }
          setTimeout(typeLoop, 60 + Math.random() * 40);
        } else {
          funFactEl.textContent = currentChars.slice(0, charIndex - 1).join('');
          funFactEl.appendChild(cursor);
          charIndex--;
          if (charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            setTimeout(typeLoop, 500);
            return;
          }
          setTimeout(typeLoop, 30);
        }
      }
      typeLoop();
    }
  } catch (e) {
    console.warn('Fun fact typewriter failed:', e);
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
    const hero = document.querySelector('.hero');
    if (hero) hero.classList.add('hero--animate');
    console.warn('LandingController failed to initialize:', e);
  }
});
