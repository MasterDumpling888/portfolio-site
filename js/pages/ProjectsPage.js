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
    this.renderProjects();
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

    if (category === 'all') {
      this.state.filteredProjects = this.state.projects;
    } else {
      this.state.filteredProjects = contentService.getProjectsByCategory(category);
    }

    log(`Filtered projects by ${category}:`, this.state.filteredProjects.length);

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