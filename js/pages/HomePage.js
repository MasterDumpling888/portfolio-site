/* ========================================
   HomePage Controller
   Manages cosmic intro, avatar selection, and parallax
   ======================================== */

import Page from '../core/Page.js';
import contentService from '../services/ContentService.js';
import narratorService from '../services/NarratorService.js';
import eventBus from '../core/EventBus.js';
import { log } from '../config.js';
import domHelper from '../utils/DOMHelper.js';

class HomePage extends Page {
  constructor() {
    super('home');
    this.avatar = localStorage.getItem('portfolio-avatar') || null;
    this.narratorStep = 0;
    this.heroIntroStep = 0;
  }

  /**
   * Load page data
   */
  async loadData() {
    if (!contentService.isReady()) {
      await contentService.init();
    }

    this.state.narrative = contentService.getContent()?.narrative || {};
    this.state.featuredProjects = contentService.getFeaturedProjects(3);

    log('HomePage data loaded');
  }

  /**
   * Set up page components
   */
  setupComponents() {
    const skipIntro = sessionStorage.getItem('skip-intro') === 'true';
    
    if (!this.avatar) {
      if (skipIntro) {
        sessionStorage.removeItem('skip-intro');
        this.showAvatarSelection();
      } else {
        this.startIntro();
      }
    } else {
      // Re-enable scrolling just in case (for returning users)
      document.body.classList.remove('no-scroll');
      this.startJourney();
    }
  }

  /**
   * Start the narrator introduction sequence
   */
  startIntro() {
    const container = domHelper.$('#narrator-container');
    if (!container) return;

    const introText = this.state.narrative.intro || [];

    container.innerHTML = `
      <div class="narrator-sprite">
        <div class="sprite-pulse">
          <i data-lucide="person-standing" class="text-primary"></i>
        </div>
      </div>
      <div class="dialogue-box">
        <div class="dialogue-tag">VOID_NARRATOR</div>
        <p id="dialogue-text" class="dialogue-text"></p>
        <div class="dialogue-next">
          <i data-lucide="chevron-down"></i>
        </div>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();

    this.typeWriter(introText[0], '#dialogue-text', () => {
      container.addEventListener('click', () => this.nextNarratorStep(), { once: true });
    });
  }

  /**
   * Handle narrator steps
   */
  nextNarratorStep() {
    this.narratorStep++;
    const introText = this.state.narrative.intro || [];

    if (this.narratorStep < introText.length) {
      this.typeWriter(introText[this.narratorStep], '#dialogue-text', () => {
        domHelper.$('#narrator-container').addEventListener('click', () => this.nextNarratorStep(), { once: true });
      });
    } else {
      this.showAvatarSelection();
    }
  }

  /**
   * Show avatar selection cards
   */
  showAvatarSelection() {
    domHelper.hide('#narrator-container');
    const selection = domHelper.$('#avatar-selection');
    selection.classList.remove('hidden');

    selection.innerHTML = `
      <div class="avatar-card dino" data-avatar="dino">
        <div class="avatar-sprite-container">
          <div class="avatar-glow"></div>
          <div class="sprite-animated sprite-dino avatar-img"></div>
        </div>
        <h3 class="avatar-name">DINO_EXPLORER</h3>
        <p class="avatar-desc">A robust data-scavenger. Specialized in logic and architecture.</p>
        <div class="avatar-stats">
          <span class="stat-badge">STR: 08</span>
          <span class="stat-badge">INT: 05</span>
          <span class="stat-badge">HP: 12</span>
        </div>
        <button class="select-btn">SELECT_UNIT</button>
      </div>

      <div class="avatar-card onigiri" data-avatar="onigiri">
        <div class="avatar-sprite-container">
          <div class="avatar-glow onigiri"></div>
          <div class="sprite-animated sprite-onigiri avatar-img"></div>
        </div>
        <h3 class="avatar-name">ONIGIRI_NODE</h3>
        <p class="avatar-desc">A lightweight signal-relay. Optimized for swift communication and art.</p>
        <div class="avatar-stats">
          <span class="stat-badge">STR: 03</span>
          <span class="stat-badge">INT: 10</span>
          <span class="stat-badge">HP: 06</span>
        </div>
        <button class="select-btn">SELECT_UNIT</button>
      </div>
    `;

    const cards = domHelper.$$('.avatar-card');
    cards.forEach(card => {
      card.addEventListener('click', () => {
        const choice = card.getAttribute('data-avatar');
        this.selectAvatar(choice);
      });
    });
  }

  /**
   * Select avatar and start journey
   */
  selectAvatar(choice) {
    this.avatar = choice;
    localStorage.setItem('portfolio-avatar', choice);

    // Update narrator immediately
    narratorService.setAvatar(choice);
    narratorService.setPageMessage('home', 'guide');

    // Jump to hyperspace animation
    document.body.classList.add('hyperspace');

    setTimeout(() => {
      domHelper.hide('#avatar-selection');
      document.body.classList.remove('hyperspace');
      this.startJourney();
    }, 1000);
  }

  /**
   * Initialize the parallax journey
   */
  startJourney() {
    domHelper.show('#journey-content');
    log('Journey started as:', this.avatar);

    // Disable scrolling for cinematic intro
    document.body.classList.add('no-scroll');

    // Set hero mode for initial welcome
    narratorService.setHeroMode(true);
    
    // We listen for dialogue box clicks to advance the intro
    const advanceIntro = () => {
      this.nextHeroIntroStep(advanceIntro);
    };

    // Use a slightly different approach for the first message
    this.nextHeroIntroStep(advanceIntro);

    // Listen for events from Narrator component via EventBus
    eventBus.on('narrator:dialogue_clicked', advanceIntro);

    // Update side stats with choice
    const coordX = domHelper.$('#coord-x');
    if (coordX) coordX.textContent = this.avatar === 'dino' ? 'D_01' : 'O_01';

    // Initially render only the hero section
    this.renderJourneySections(true);
    this.setupParallax();
  }

  /**
   * Handle the sequence of messages when avatar is in hero mode
   */
  nextHeroIntroStep(clickCallback) {
    const introText = contentService.getContent()?.narrative?.pages?.home?.intro || [];
    
    if (this.heroIntroStep < introText.length) {
      narratorService.setMessage(introText[this.heroIntroStep]);
      this.heroIntroStep++;
    } else {
      // Transition to HUD
      narratorService.setHeroMode(false);
      narratorService.setPageMessage('home', 'guide');
      
      // Re-enable scrolling
      document.body.classList.remove('no-scroll');

      // Render the full content now
      this.renderJourneySections(false);
      
      // Remove the event listener so clicks on corner narrator don't re-trigger this
      eventBus.off('narrator:dialogue_clicked', clickCallback);
    }
  }

  /**
   * Render sections for the journey
   * @param {boolean} heroOnly - If true, only render the top hero section
   */
  renderJourneySections(heroOnly = false) {
    const container = domHelper.$('#journey-content');

    const heroHTML = `
      <section class="journey-hero">
        <div class="hero-titles">
          <h1 class="journey-title">RACHEL_LIM</h1>
          <p class="journey-subtitle">CS_STUDENT // ART_ENTHUSIAST</p>
        </div>
      </section>
    `;

    const contentHTML = `
      <section class="parallax-divider">
        <div class="divider-line"></div>
      </section>

      <section class="about-journey container">
        <h2 class="section-heading">LORE_ENTRY</h2>
        <div class="about-text-grid">
          ${contentService.getAboutContent().paragraphs.map(p => `<p class="narrative-p">${p}</p>`).join('')}
        </div>
      </section>
    `;

    container.innerHTML = heroOnly ? heroHTML : heroHTML + contentHTML;
    
    if (!heroOnly) {
      this.setupScrollAnimations();
    }
  }

  /**
   * Setup parallax effects
   */
  setupParallax() {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      const sprite = domHelper.$('.character-vessel');
      const particles = domHelper.$('#particles-js');

      if (sprite) {
        sprite.style.transform = `translateY(${scrolled * 0.1}px) rotate(${scrolled * 0.05}deg)`;
      }

      if (particles) {
        // Subtle shift effect for particles
        particles.style.transform = `translateY(${scrolled * 0.02}px)`;
      }

      // Update coords
      const coordY = domHelper.$('#coord-y');
      if (coordY) coordY.textContent = Math.floor(scrolled);
    });
  }

  /**
   * Set up page event listeners
   */
  setupEventListeners() {
    // Narrator guide for home
    if (this.avatar) {
      narratorService.setPageMessage('home', 'guide');
    }
  }

  /**
   * Helper: Typewriter effect
   */
  typeWriter(text, selector, callback) {
    const el = domHelper.$(selector);
    if (!el) return;

    el.textContent = '';
    let i = 0;
    const interval = setInterval(() => {
      el.textContent += text.charAt(i);
      i++;
      if (i >= text.length) {
        clearInterval(interval);
        if (callback) callback();
      }
    }, 40);
  }

  onActivate() {
    super.onActivate();
    if (window.lucide) window.lucide.createIcons();
  }
}

export default HomePage;