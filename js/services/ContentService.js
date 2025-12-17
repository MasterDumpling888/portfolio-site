/* ========================================
   ContentService
   Manages content loading and access
   ======================================== */

import { CONFIG, log, logError } from '../config.js';
import dataLoader from '../utils/DataLoader.js';

class ContentService {
  constructor() {
    this.content = null;
    this.projects = null;
    this.skills = null;
    this.initialized = false;
  }

  /**
   * Initialize and load all content
   * @returns {Promise<boolean>} Success status
   */
  async init() {
    if (this.initialized) {
      log('ContentService already initialized');
      return true;
    }

    try {
      log('Initializing ContentService...');

      await this.loadAll();

      this.initialized = true;
      log('ContentService initialized successfully');

      return true;
    } catch (error) {
      logError('Failed to initialize ContentService:', error);
      return false;
    }
  }

  /**
   * Load all data files
   * @returns {Promise<void>}
   */
  async loadAll() {
    try {
      const [content, projects, skills] = await dataLoader.loadMultiple([
        CONFIG.data.content,
        CONFIG.data.projects,
        CONFIG.data.skills
      ]);

      this.content = content;
      this.projects = projects.projects || [];
      this.skills = skills.categories || [];

      log('All content loaded successfully');
    } catch (error) {
      logError('Failed to load content:', error);

      // Set empty defaults if loading fails
      this.content = this.getDefaultContent();
      this.projects = [];
      this.skills = [];
    }
  }

  /**
   * Get default content (fallback)
   * @returns {Object} Default content object
   */
  getDefaultContent() {
    return {
      site: {
        title: 'Portfolio',
        description: 'Computer Science Student Portfolio',
        author: 'Your Name'
      },
      hero: {
        greeting: 'Hi, I\'m',
        name: 'Your Name',
        title: 'Computer Science Student',
        description: 'Building innovative solutions'
      },
      about: {
        title: 'About Me',
        paragraphs: ['Welcome to my portfolio']
      },
      social: {},
      contact: {}
    };
  }

  /**
   * Get all content
   * @returns {Object} All content data
   */
  getContent() {
    return this.content;
  }

  /**
   * Get site metadata
   * @returns {Object} Site metadata
   */
  getSiteInfo() {
    return this.content?.site || {};
  }

  /**
   * Get hero section content
   * @returns {Object} Hero content
   */
  getHeroContent() {
    return this.content?.hero || {};
  }

  /**
   * Get about section content
   * @returns {Object} About content
   */
  getAboutContent() {
    return this.content?.about || {};
  }

  /**
   * Get social links
   * @returns {Object} Social links
   */
  getSocialLinks() {
    return this.content?.social || {};
  }

  /**
   * Get contact information
   * @returns {Object} Contact info
   */
  getContactInfo() {
    return this.content?.contact || {};
  }

  /**
   * Get all projects
   * @returns {Array} Array of projects
   */
  getProjects() {
    return this.projects || [];
  }

  /**
   * Get project by ID
   * @param {string} id - Project ID
   * @returns {Object|null} Project object or null
   */
  getProjectById(id) {
    return this.projects.find(project => project.id === id) || null;
  }

  /**
   * Get projects by category
   * @param {string} category - Category name
   * @returns {Array} Filtered projects
   */
  getProjectsByCategory(category) {
    if (category === 'all' || !category) {
      return this.projects;
    }

    return this.projects.filter(project =>
      project.categories.includes(category) || project.category === category
    );
  }

  /**
   * Get featured projects
   * @param {number} limit - Maximum number of projects (optional)
   * @returns {Array} Featured projects
   */
  getFeaturedProjects(limit = null) {
    const featured = this.projects.filter(project => project.featured);

    if (limit) {
      return featured.slice(0, limit);
    }

    return featured;
  }

  /**
   * Get all skills
   * @returns {Array} Array of skill categories
   */
  getSkills() {
    return this.skills || [];
  }

  /**
   * Get skills by category ID
   * @param {string} categoryId - Category ID
   * @returns {Object|null} Skill category or null
   */
  getSkillsByCategory(categoryId) {
    return this.skills.find(cat => cat.id === categoryId) || null;
  }

  /**
   * Search projects
   * @param {string} query - Search query
   * @returns {Array} Matching projects
   */
  searchProjects(query) {
    if (!query) return this.projects;

    const lowerQuery = query.toLowerCase();

    return this.projects.filter(project => {
      const searchableText = `
        ${project.title}
        ${project.description}
        ${project.longDescription || ''}
        ${project.technologies.join(' ')}
      `.toLowerCase();

      return searchableText.includes(lowerQuery);
    });
  }

  /**
   * Get project statistics
   * @returns {Object} Project stats
   */
  getProjectStats() {
    return {
      total: this.projects.length,
      featured: this.projects.filter(p => p.featured).length,
      byCategory: {
        webdev: this.getProjectsByCategory('webdev').length,
        ai: this.getProjectsByCategory('ai').length,
        fintech: this.getProjectsByCategory('fintech').length,
        medtech: this.getProjectsByCategory('medtech').length
      },
      completed: this.projects.filter(p => p.status === 'completed').length
    };
  }

  /**
   * Get all technologies used across projects
   * @returns {Array} Unique technologies
   */
  getAllTechnologies() {
    const techSet = new Set();

    this.projects.forEach(project => {
      project.technologies.forEach(tech => techSet.add(tech));
    });

    return Array.from(techSet).sort();
  }

  /**
   * Reload all content
   * @returns {Promise<boolean>} Success status
   */
  async reload() {
    this.initialized = false;
    return this.init();
  }

  /**
   * Check if service is ready
   * @returns {boolean} True if initialized
   */
  isReady() {
    return this.initialized;
  }
}

// Create singleton instance
const contentService = new ContentService();

export default contentService;