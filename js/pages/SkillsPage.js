/* ========================================
   SkillsPage Controller
   Manages skills page display
   ======================================== */

import Page from '../core/Page.js';
import contentService from '../services/ContentService.js';
import { log } from '../config.js';
import domHelper from '../utils/DOMHelper.js';

class SkillsPage extends Page {
  constructor() {
    super('skills');
  }

  /**
   * Load page data
   */
  async loadData() {
    // Ensure content service is initialized
    if (!contentService.isReady()) {
      await contentService.init();
    }

    // Get all skills
    this.state.skills = contentService.getSkills();

    log('SkillsPage data loaded:', this.state.skills.length, 'categories');
  }

  /**
   * Set up page components
   */
  setupComponents() {
    this.renderSkills();
  }

  /**
   * Render all skills by category
   */
  renderSkills() {
    const categories = this.state.skills;

    if (!categories || categories.length === 0) {
      log('No skills data available');
      return;
    }

    categories.forEach(category => {
      this.renderSkillCategory(category);
    });

    log(`Rendered ${categories.length} skill categories`);

    // Reinitialize Lucide icons
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  /**
   * Render a single skill category
   * @param {Object} category - Category data
   */
  renderSkillCategory(category) {
    const containerId = `${category.id}-skills`;
    const container = domHelper.$(`#${containerId}`);

    if (!container) {
      log(`Container not found: ${containerId}`);
      return;
    }

    // Clear container
    container.innerHTML = '';

    // Render each skill in the category
    if (category.skills && category.skills.length > 0) {
      category.skills.forEach((skill, index) => {
        const skillCard = this.createSkillCard(skill, index);
        container.appendChild(skillCard);
      });

      log(`Rendered ${category.skills.length} skills in ${category.name}`);
    }
  }

  /**
   * Create skill card element
   * @param {Object} skill - Skill data
   * @param {number} index - Skill index for animation delay
   * @returns {HTMLElement} Skill card element
   */
  createSkillCard(skill, index) {
    const card = document.createElement('div');
    card.className = 'skill-card scroll-reveal';
    card.style.animationDelay = `${index * 0.05}s`;

    // Skill icon
    const icon = document.createElement('div');
    icon.className = 'skill-icon';
    icon.innerHTML = `<i data-lucide="${skill.icon || 'code'}"></i>`;
    card.appendChild(icon);

    // Skill name
    const name = document.createElement('div');
    name.className = 'skill-name';
    name.textContent = skill.name;
    card.appendChild(name);

    // Skill level (optional)
    if (skill.level) {
      const level = document.createElement('div');
      level.className = 'skill-level';
      level.textContent = this.formatLevel(skill.level);
      card.appendChild(level);
    }

    return card;
  }

  /**
   * Format skill level
   * @param {string} level - Level identifier
   * @returns {string} Formatted level
   */
  formatLevel(level) {
    const levelMap = {
      'beginner': 'Beginner',
      'intermediate': 'Intermediate',
      'advanced': 'Advanced',
      'expert': 'Expert'
    };

    return levelMap[level] || level;
  }

  /**
   * Get level class for styling
   * @param {string} level - Level identifier
   * @returns {string} CSS class name
   */
  getLevelClass(level) {
    return `level-${level}`;
  }

  /**
   * Called when page becomes active
   */
  onActivate() {
    super.onActivate();

    // Reinitialize Lucide icons
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }
}

export default SkillsPage;