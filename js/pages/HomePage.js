/* ========================================
   HomePage Controller
   Manages cosmic intro, avatar selection, and parallax
   ======================================== */

import Page from '../core/Page.js';
import ProjectCard from '../components/ProjectCard.js';
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
    this.state.projects = contentService.getProjects(); // Ensure all projects are loaded
    this.state.featuredProjects = contentService.getFeaturedProjects(3);
    this.state.author = contentService.getContent()?.author || {};

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
    <div class="narrator-null-vessel">
      <div class="narrator-null-sprite sprite-pulse">
        <i data-lucide="person-standing" class="text-primary"></i>
      </div>
        <div class="dialogue-box">
        <div class="dialogue-tag">TORTOISE_OS</div>
        <p id="dialogue-text" class="dialogue-text"></p>
        <div class="dialogue-next">
          <i data-lucide="chevron-right"></i>
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
    domHelper.hide('#hero');
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
    const coordX = domHelper.$('#nav-sys');
    if (coordX) coordX.textContent = this.avatar === 'dino' ? 'DINO_01' : 'ONIGIRI_01';

    // Initially render only the hero section
    this.renderJourneySections(true);
    this.setupScrollTracker();
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
    const author = this.state.author || {};

    const heroHTML = `
      <section class="journey-hero">
        <div class="hero-titles ${heroOnly ? 'hidden-opacity' : 'animate-dissolve'}">
         
          <i data-lucide="ghost" class="hero-ghost-icon animate-float"></i>
         
          <h1 class="journey-title">${author.name || 'Unknown'}</h1>
          <p class="journey-subtitle">${author.subtitle || 'Unknown'}</p>
        </div>
      </section>
    `;

    const contentHTML = `
      <section class="about-journey container scroll-reveal animate-fade-in-up">
        <h2 class="section-heading">LORE_ENTRY</h2>
        <div class="about-text-grid">
          ${contentService.getAboutContent().paragraphs.map(p => `<p class="narrative-p">${p}</p>`).join('')}
        </div>
        <div class="section-actions lore-cta">
          <a href="assets/resume/Lim, Rachel - CV.pdf" download class="btn btn-primary">
            <i data-lucide="download"></i> DOWNLOAD_RESUME
          </a>
        </div>
      </section>

      <section class="featured-projects container scroll-reveal animate-fade-in-up">
        <h2 class="section-heading">FEATURED_LOGS</h2>
        <div class="projects-preview-grid">
          ${this.state.featuredProjects.map((project, index) => new ProjectCard(project, { index }).render()).join('')}
        </div>
        <div class="section-actions">
          <a href="projects.html" class="btn btn-secondary">
            <i data-lucide="arrow-right"></i> VIEW_ALL_LOGS
          </a>
        </div>
      </section>
<section class="digital-rift">
  <div class="dual-cores-container container scroll-reveal">
    <div class="rift-discovery-text" data-text="${this.state.narrative.pages.glitchNarrative.discovery}">
      <span class="rift-discovery-text-inner">${this.state.narrative.pages.glitchNarrative.discovery}</span>
      <div class="discovery-line"></div>
    </div>
    <p class="rift-subtitle animate-flicker">
      &gt; SELECT_CLASS TO ANALYZE ANCIENT_FORM: RACHEL
    </p>
    <div class="cores-grid">
            <div class="core-node tech" data-type="tech">
              <h3>[ TECH_SECTOR ]</h3>
              <p>LOGIC_GATEWAY // SYSTEM_ARCH</p>
            </div>
            <div class="core-node art" data-type="art">
              <h3>[ ART_NEBULA ]</h3>
              <p>EXPRESSION_CORE // VISUAL_MOD</p>
            </div>
          </div>

          <div id="slot-machine-reveal" class="slot-machine-reveal">
            <div class="slot-machine-container">
              <div id="slot-track" class="slot-machine-track">
                <!-- Slot items will be injected -->
              </div>
            </div>
            <div id="subfield-summary" class="subfield-summary"></div>
            <a id="view-projects-btn" href="projects.html" class="btn btn-primary">
              <i data-lucide="eye"></i> VIEW_LOGS
            </a>
          </div>
        </div>
      </section>
    `;

    container.innerHTML = heroOnly ? heroHTML : heroHTML + contentHTML;

    if (!heroOnly) {
      this.setupScrollAnimations();
      this.setupRiftInteractions();
    }

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  /**
   * Set up interactions for the Digital Rift
   */
  setupRiftInteractions() {
    const cores = domHelper.$$('.core-node');
    const slotTrack = domHelper.$('#slot-track');
    const summary = domHelper.$('#subfield-summary');
    const reveal = domHelper.$('#slot-machine-reveal');
    const viewBtn = domHelper.$('#view-projects-btn');

    if (!cores.length || !slotTrack) return;

    cores.forEach(core => {
      core.addEventListener('click', () => {
        const type = core.getAttribute('data-type');
        this.handleCoreSelection(type, slotTrack, summary, reveal, viewBtn);
      });
    });
  }

  /**
   * Handle core selection and vertical carousel animation
   */
  handleCoreSelection(type, slotTrack, summary, reveal, viewBtn) {
    const glitchContent = this.state.narrative.pages.glitchNarrative;
    const summaryText = type === 'tech' ? glitchContent.techSummary : glitchContent.artSummary;

    // Filter projects based on the selected core (tech or art)
    const filteredProjects = this.state.projects.filter(p => p.type === type);

    // Reset and show reveal section
    reveal.classList.remove('active');

    // Set theme for the button
    if (type === 'art') {
      viewBtn.className = 'btn btn-secondary theme-art';
      viewBtn.href = 'projects.html?type=art';
    } else {
      viewBtn.className = 'btn btn-primary';
      viewBtn.href = 'projects.html?type=tech';
    }

    // Populate slot track with project bars
    slotTrack.innerHTML = filteredProjects.map((project, index) => 
      new ProjectCard(project, { index }).renderBar()
    ).join('');

    // Reinitialize Lucide icons for new elements
    if (window.lucide) window.lucide.createIcons();

    // Trigger animation
    setTimeout(() => {
      reveal.classList.add('active');

      // Carousel initial state
      slotTrack.style.transition = 'none';
      slotTrack.style.transform = 'translateY(0)';

      // Slight delay before typewriter summary
      setTimeout(() => {
        this.typeWriter(summaryText, '#subfield-summary');
      }, 500);
    }, 100);
  }
  /**
   * Setup HUD updates based on scroll
   */
  setupScrollTracker() {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;

      // Update coords
      const coordY = domHelper.$('#coord-y');
      if (coordY) coordY.textContent = Math.floor(scrolled);

      // Update Progress Bar
      const progressBar = domHelper.$('.progress-bar');
      if (progressBar) {
        const progress = Math.min(100, (scrolled / (document.body.scrollHeight - window.innerHeight)) * 100);
        progressBar.style.width = `${progress}%`;
      }
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