/* ========================================
   ProjectsPage Controller
   Manages projects page with filtering
   ======================================== */

import Page from '../core/Page.js';
import ProjectCard from '../components/ProjectCard.js';
import contentService from '../services/ContentService.js';
import { log } from '../config.js';
import domHelper from '../utils/DOMHelper.js';

class ProjectsPage extends Page {
  constructor() {
    super('projects');
    this.currentFilter = 'all';
  }

  /**
   * Load page data
   */
  async loadData() {
    // Ensure content service is initialized
    if (!contentService.isReady()) {
      await contentService.init();
    }

    // Get all projects
    this.state.projects = contentService.getProjects();
    this.state.filteredProjects = this.state.projects;

    log('ProjectsPage data loaded:', this.state.projects.length, 'projects');
  }

  /**
   * Set up page components
   */
  setupComponents() {
    this.checkUrlParams();
    this.renderCoreSwitcher();
    this.renderProjects();
  }

  /**
   * Check for URL parameters to set initial filter
   */
  checkUrlParams() {
    const params = new URLSearchParams(window.location.search);
    const type = params.get('type');
    if (type) {
      this.currentCore = type;
      this.state.filteredProjects = this.state.projects.filter(p => p.type === type);
      
      // Apply theme if art
      if (type === 'art') {
        document.body.classList.add('theme-art');
      }
    } else {
      this.currentCore = 'tech';
      this.state.filteredProjects = this.state.projects.filter(p => p.type === 'tech');
      document.body.classList.remove('theme-art');
    }
  }

  /**
   * Render the core switcher (Tech vs Art)
   */
  renderCoreSwitcher() {
    const switcherContainer = domHelper.$('#core-switcher-container');
    if (!switcherContainer) return;

    switcherContainer.innerHTML = `
      <div class="core-switcher">
        <button class="core-btn tech ${this.currentCore === 'tech' ? 'active' : ''}" data-core="tech">
          [ TECH_LOGS ]
        </button>
        <button class="core-btn art ${this.currentCore === 'art' ? 'active' : ''}" data-core="art">
          [ ART_LOGS ]
        </button>
      </div>
    `;

    const buttons = domHelper.$$('.core-btn');
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const core = btn.getAttribute('data-core');
        this.switchCore(core);
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });
  }

  /**
   * Switch between Tech and Art logs
   * @param {string} core - 'tech' or 'art'
   */
  switchCore(core) {
    this.currentCore = core;
    this.currentFilter = 'all';
    
    // Apply theme to body
    if (core === 'art') {
      document.body.classList.add('theme-art');
    } else {
      document.body.classList.remove('theme-art');
    }

    this.state.filteredProjects = this.state.projects.filter(p => p.type === core);
    this.renderProjects();
    this.updateFilterButtons();
  }

  /**
   * Update filter buttons based on active core
   */
  updateFilterButtons() {
    const filterContainer = domHelper.$('#filter-buttons');
    if (!filterContainer) return;

    const categories = this.currentCore === 'tech'
      ? ['all', 'ai', 'medtech', 'webdev', 'fintech']
      : ['all', 'web-design', 'graphics', 'photography', 'drawing'];

    filterContainer.innerHTML = categories.map(cat => `
      <button class="filter-btn ${cat === 'all' ? 'active' : ''}" data-filter="${cat}">
        ${cat.toUpperCase().replace(/-/g, '_')}
      </button>
    `).join('');

    this.setupFilterButtons();
  }

  /**
   * Render all projects
   */
  renderProjects() {
    const container = domHelper.$('#projects-container');
    const emptyState = domHelper.$('#empty-state');

    if (!container) return;

    const projects = this.state.filteredProjects;

    if (!projects || projects.length === 0) {
      container.innerHTML = '';
      if (emptyState) {
        emptyState.classList.remove('hidden');
      }
      return;
    }

    // Hide empty state
    if (emptyState) {
      emptyState.classList.add('hidden');
    }

    // Clear and Render each project
    container.innerHTML = projects
      .map((project, index) => new ProjectCard(project, { index }).render())
      .join('');

    log(`Rendered ${projects.length} projects`);

    // Re-initialize scroll animations for new elements
    this.setupScrollAnimations();

    // Reinitialize Lucide icons
    if (window.lucide) window.lucide.createIcons();
  }

  /**
   * Set up filter button event listeners
   */
  setupFilterButtons() {
    const filterButtons = domHelper.$$('#filter-buttons .filter-btn');

    filterButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();

        const filter = button.getAttribute('data-filter');
        this.filterProjects(filter);

        // Update active state
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
      });
    });
  }

  /**
   * Filter projects by category
   * @param {string} category - Category to filter by
   */
  filterProjects(category) {
    this.currentFilter = category;

    const coreProjects = this.state.projects.filter(p => p.type === this.currentCore);

    if (category === 'all') {
      this.state.filteredProjects = coreProjects;
    } else {
      this.state.filteredProjects = coreProjects.filter(p => 
        p.categories.includes(category) || p.category === category
      );
    }

    log(`Filtered ${this.currentCore} projects by ${category}:`, this.state.filteredProjects.length);

    // Re-render projects
    this.renderProjects();
  }

  /**
   * Called when page becomes active
   */
  onActivate() {
    super.onActivate();
    this.setupFilterButtons();

    // Reinitialize Lucide icons
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }
}

export default ProjectsPage;