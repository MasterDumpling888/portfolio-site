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
    log('Skills data loaded');
  }

  /**
   * Set up page components
   */
  setupComponents() {
    this.renderCharacterPreview();
    this.renderSkillModules();
  }

  /**
   * Render the chosen character preview
   */
  renderCharacterPreview() {
    const container = domHelper.$('#active-character');
    const nameEl = domHelper.$('#character-name');
    const classEl = domHelper.$('#character-class');

    if (!container || !nameEl || !classEl) return;

    const characterData = {
      dino: {
        name: 'DINO_EXPLORER',
        class: 'DATA_SCAVENGER_V1',
        img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCAqBea91XN1O0DpsH7EoAVHJRURn5YsBA00SeH3ynjuvRZTiKctlcxiGUihLMYhXavEZiDR3_wOkXa9uIvWTAUtdcAWDUwlLmi4-VU4xerAC45Rmg_fI4ERoBv0Sp4QnuSnzxcqlLaQSYOZ6gFnCIA1kUxxGVD0LmO1KDicxk2BGhsFtSL8T1rtOFxsAqS_DS-HLq6y8gApA-LesZXDu8GkhmKtqfnBrrpKNRs-7s41IH_mnBsWuJrO688UZZtirocbDfDa3aE-Gk'
      },
      onigiri: {
        name: 'ONIGIRI_NODE',
        class: 'SIGNAL_RELAY_V2',
        img: 'assets/images/onigiri sprite.png'
      }
    };

    const active = characterData[this.avatar] || characterData.dino;

    container.innerHTML = `<img src="${active.img}" alt="${active.name}">`;
    nameEl.textContent = active.name;
    classEl.textContent = active.class;
    
    // Apply theme color
    if (this.avatar === 'onigiri') {
      nameEl.style.color = 'var(--color-secondary)';
      container.style.filter = 'drop-shadow(0 0 15px var(--color-secondary-glow))';
    }
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
      const categoryBlock = document.createElement('div');
      categoryBlock.className = 'skill-category-block';
      
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
                <div class="module-bar level-${skill.level.toLowerCase()}" style="width: 0;"></div>
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