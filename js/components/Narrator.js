/* ========================================
   Narrator Component
   Global persistent dialogue system
   ======================================== */

import Component from '../core/Component.js';
import domHelper from '../utils/DOMHelper.js';
import narratorService from '../services/NarratorService.js';
import eventBus from '../core/EventBus.js';
import { log } from '../config.js';

class Narrator extends Component {
  constructor() {
    super('narrator-root');
    this.avatar = narratorService.getAvatar();
    this.currentText = '';
    this.isMinimized = false;
    this.isHeroMode = narratorService.getHeroMode();
    this.typingInterval = null;
  }

  /**
   * Initialize narrator
   */
  async init() {
    const success = super.init();
    if (!success) return false;

    // Listen for narrative changes
    eventBus.on('narrator:message', ({ text }) => this.updateDialogue(text));
    eventBus.on('narrator:avatar_changed', ({ avatar }) => {
      this.avatar = avatar;
      this.mount();
    });
    eventBus.on('narrator:mode_changed', ({ isHeroMode }) => {
      this.isHeroMode = isHeroMode;
      this.mount();
    });

    this.mount();
    return true;
  }

  /**
   * Render component HTML
   */
  render() {
    if (!this.avatar) return '<div class="narrator-hidden"></div>';

    const spriteClass = this.avatar === 'onigiri' ? 'sprite-onigiri' : 'sprite-dino';
    const activeTheme = this.avatar === 'onigiri' ? 'onigiri-theme' : 'dino-theme';
    const modeClass = this.isHeroMode ? 'hero-mode' : '';

    return `
      <div class="narrator-wrapper ${activeTheme} ${modeClass} ${this.isMinimized ? 'minimized' : ''}">
        <div class="narrator-container">
          <!-- Avatar Portrait -->
          <div class="narrator-portrait animate-float">
            <div class="portrait-glow"></div>
            <div class="sprite-animated ${spriteClass}"></div>
          </div>

          <!-- Dialogue Box -->
          <div class="narrator-dialogue">
            <div class="dialogue-header">
              <span class="unit-tag">${this.avatar.toUpperCase()}_UNIT</span>
              <button class="minimize-btn" id="narrator-toggle">
                <i data-lucide="${this.isMinimized ? 'maximize-2' : 'minimize-2'}"></i>
              </button>
            </div>
            <div class="dialogue-content">
              <p id="narrator-text" class="narrator-text">${this.currentText}</p>
            </div>
            <div class="dialogue-footer">
              <span class="lore-hint">CLICK_FOR_LORE</span>
              <div class="next-indicator"></div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * After mount logic
   */
  afterMount() {
    if (!this.avatar) return;

    if (window.lucide) window.lucide.createIcons();

    const toggle = domHelper.$('#narrator-toggle', this.element);
    if (toggle) {
      toggle.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleMinimize();
      });
    }

    const container = domHelper.$('.narrator-container', this.element);
    if (container) {
      container.addEventListener('click', () => {
        // Notify others that dialogue was clicked
        eventBus.emit('narrator:dialogue_clicked');

        if (this.isMinimized) {
          this.toggleMinimize();
        } else {
          this.showLore();
        }
      });
    }
  }

  /**
   * Update dialogue with typewriter effect
   * @param {string} text - Text to display
   */
  updateDialogue(text) {
    if (this.typingInterval) clearInterval(this.typingInterval);
    
    const textEl = domHelper.$('#narrator-text', this.element);
    if (!textEl) {
      this.currentText = text;
      return;
    }

    this.typingInterval = narratorService.typeEffect(
      text,
      (partial) => { textEl.textContent = partial; },
      () => { this.currentText = text; }
    );
  }

  /**
   * Show a random lore snippet for current page
   */
  showLore() {
    if (this.isHeroMode) return;
    
    const pageName = this.getCurrentPageName();
    narratorService.setPageMessage(pageName, 'lore');
  }

  /**
   * Toggle minimized state
   */
  toggleMinimize() {
    this.isMinimized = !this.isMinimized;
    this.mount();
  }

  /**
   * Helper: Get current page name from URL
   */
  getCurrentPageName() {
    const path = window.location.pathname;
    if (path === '/' || path.includes('index.html')) return 'home';
    if (path.includes('projects.html')) return 'projects';
    if (path.includes('skills.html')) return 'skills';
    if (path.includes('contact.html')) return 'contact';
    return 'home';
  }
}

export default Narrator;
