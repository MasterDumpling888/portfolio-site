/* ========================================
   HomePage Controller
   Manages cosmic intro, avatar selection, and parallax
   ======================================== */

import Page from '../core/Page.js';
import contentService from '../services/ContentService.js';
import { log } from '../config.js';
import domHelper from '../utils/DOMHelper.js';

class HomePage extends Page {
  constructor() {
    super('home');
    this.avatar = localStorage.getItem('portfolio-avatar') || null;
    this.narratorStep = 0;
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
    if (!this.avatar) {
      this.startIntro();
    } else {
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
          <i data-lucide="auto-awesome" class="text-primary"></i>
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
          <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCAqBea91XN1O0DpsH7EoAVHJRURn5YsBA00SeH3ynjuvRZTiKctlcxiGUihLMYhXavEZiDR3_wOkXa9uIvWTAUtdcAWDUwlLmi4-VU4xerAC45Rmg_fI4ERoBv0Sp4QnuSnzxcqlLaQSYOZ6gFnCIA1kUxxGVD0LmO1KDicxk2BGhsFtSL8T1rtOFxsAqS_DS-HLq6y8gApA-LesZXDu8GkhmKtqfnBrrpKNRs-7s41IH_mnBsWuJrO688UZZtirocbDfDa3aE-Gk" alt="Dino" class="avatar-img">
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
          <div class="avatar-glow"></div>
          <img src="assets/images/onigiri sprite.png" alt="Onigiri" class="avatar-img">
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
    
    // Update side stats with choice
    const coordX = domHelper.$('#coord-x');
    if (coordX) coordX.textContent = this.avatar === 'dino' ? 'D_01' : 'O_01';

    this.renderJourneySections();
    this.setupParallax();
  }

  /**
   * Render sections for the journey
   */
  renderJourneySections() {
    const container = domHelper.$('#journey-content');
    container.innerHTML = `
      <section class="journey-hero">
        <div class="character-vessel animate-float">
          <img src="${this.avatar === 'dino' ? 'https://lh3.googleusercontent.com/aida-public/AB6AXuCAqBea91XN1O0DpsH7EoAVHJRURn5YsBA00SeH3ynjuvRZTiKctlcxiGUihLMYhXavEZiDR3_wOkXa9uIvWTAUtdcAWDUwlLmi4-VU4xerAC45Rmg_fI4ERoBv0Sp4QnuSnzxcqlLaQSYOZ6gFnCIA1kUxxGVD0LmO1KDicxk2BGhsFtSL8T1rtOFxsAqS_DS-HLq6y8gApA-LesZXDu8GkhmKtqfnBrrpKNRs-7s41IH_mnBsWuJrO688UZZtirocbDfDa3aE-Gk' : 'assets/images/onigiri sprite.png'}" class="journey-sprite">
        </div>
        <div class="hero-titles">
          <h1 class="journey-title">RACHEL_LIM</h1>
          <p class="journey-subtitle">CS_STUDENT // ART_ENTHUSIAST</p>
        </div>
      </section>

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
  }

  /**
   * Setup parallax effects
   */
  setupParallax() {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      const sprite = domHelper.$('.character-vessel');
      const stars = domHelper.$('.starfield');
      
      if (sprite) {
        sprite.style.transform = `translateY(${scrolled * 0.1}px) rotate(${scrolled * 0.05}deg)`;
      }
      
      if (stars) {
        stars.style.backgroundPosition = `0 ${scrolled * 0.5}px`;
      }

      // Update coords
      const coordY = domHelper.$('#coord-y');
      if (coordY) coordY.textContent = Math.floor(scrolled);
    });
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