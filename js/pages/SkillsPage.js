/* ========================================
   SkillsPage Controller
   Manages character stats and skill modules
   ======================================== */

import Page from '../core/Page.js';
import contentService from '../services/ContentService.js';
import { log } from '../config.js';
import domHelper from '../utils/DOMHelper.js';

class SkillsPage extends Page {
  constructor() {
    super('skills');
    this.avatar = localStorage.getItem('portfolio-avatar') || 'dino';
  }

  /**
   * Load page data
   */
  async loadData() {
    if (!contentService.isReady()) {
      await contentService.init();
    }

    this.state.skills = contentService.getSkills();
    this.state.author = contentService.getContent()?.author || {};
    log('Skills data loaded');
  }

  /**
   * Set up page components
   */
  setupComponents() {
    this.renderAuthorPreview();
    this.renderSkillModules();
  }

  /**
   * Render the chosen character preview
   */
  renderAuthorPreview() {
    const container = domHelper.$('#author-container');
    const author = this.state.author;


    if (!container) return;

    container.innerHTML = `
        <i data-lucide="ghost" class="user-icon"></i>
        <h2 id="author-name" class="author-name">${author.name || 'Unknown'}</h2>
        <p id="author-class" class="author-class">${author.subtitle || 'Unknown'}</p>
        <div class="author-actions" style="margin-top: var(--spacing-m);">
          <a href="assets/resume/Lim, Rachel - CV.pdf" download class="btn btn-primary btn-sm">
            <i data-lucide="download"></i> DOWNLOAD_RESUME
          </a>
        </div>
    `;


    if (window.lucide) window.lucide.createIcons();
  }

  /**
   * Render skill categories as modules
   */
  renderSkillModules() {
    const container = domHelper.$('#skills-container');
    if (!container) return;

    const categories = this.state.skills;
    container.innerHTML = '';

    categories.forEach(category => {
      const isArt = category.id === 'art';
      const categoryBlock = document.createElement('div');
      categoryBlock.className = `skill-category-block ${isArt ? 'theme-art' : ''}`;

      categoryBlock.innerHTML = `
        <div class="category-label">
          ${domHelper.getIconHTML(category.icon || 'box')}
          <span>${category.name.toUpperCase().replace(/ /g, '_')}</span>
        </div>
        <div class="skills-list">
          ${category.skills.map(skill => `
            <div class="skill-module scroll-reveal">
              <div class="module-header">
                <span class="module-name">${skill.name}</span>
                <span class="module-level">${this.formatLevel(skill.level)}</span>
              </div>
              <div class="module-bar-container">
                <div class="module-bar level-${skill.level.toLowerCase()}" ></div>
              </div>
            </div>
          `).join('')}
        </div>
      `;

      container.appendChild(categoryBlock);
    });

    // Animate bars after a short delay
    setTimeout(() => {
      const bars = domHelper.$$('.module-bar');
      bars.forEach(bar => {
        const levelClass = Array.from(bar.classList).find(c => c.startsWith('level-'));
        if (levelClass) {
          // Width is handled by CSS, we just need to trigger the change if it wasn't automatic
          // Actually, our CSS has the widths, so we just ensure they're visible
        }
      });
    }, 100);

    if (window.lucide) window.lucide.createIcons();
    this.setupScrollAnimations();
  }

  formatLevel(level) {
    return level.toUpperCase();
  }

  onActivate() {
    super.onActivate();
    log('Skills page activated');
  }
}

export default SkillsPage;