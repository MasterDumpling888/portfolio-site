/* ========================================
   ProjectsPage Controller
   Manages projects page with filtering
   ======================================== */

import Page from '../core/Page.js';
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

    // Clear container
    container.innerHTML = '';

    // Render each project
    projects.forEach((project, index) => {
      const projectCard = this.createProjectCard(project);

      // Add stagger animation delay
      projectCard.style.animationDelay = `${index * 0.1}s`;

      container.appendChild(projectCard);
    });

    log(`Rendered ${projects.length} projects`);

    // Reinitialize Lucide icons
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  /**
   * Create project card element
   * @param {Object} project - Project data
   * @returns {HTMLElement} Project card element
   */
  createProjectCard(project) {
    const card = document.createElement('div');
    card.className = 'project-card scroll-reveal';
    card.setAttribute('data-project-id', project.id);
    card.setAttribute('data-categories', project.categories.join(','));

    // Create image section
    const imageSection = this.createProjectImage(project);

    // Create content section
    const contentSection = this.createProjectContent(project);

    card.appendChild(imageSection);
    card.appendChild(contentSection);

    return card;
  }

  /**
   * Create project image section
   * @param {Object} project - Project data
   * @returns {HTMLElement} Image element
   */
  createProjectImage(project) {
    const imageDiv = document.createElement('div');
    imageDiv.className = 'project-image';

    if (project.image) {
      const img = document.createElement('img');
      img.src = project.image;
      img.alt = project.title;
      img.loading = 'lazy';

      img.onerror = () => {
        imageDiv.innerHTML = `
          <div class="project-image-placeholder">
            <i data-lucide="folder"></i>
          </div>
        `;
        if (window.lucide) window.lucide.createIcons();
      };

      imageDiv.appendChild(img);
    } else {
      imageDiv.innerHTML = `
        <div class="project-image-placeholder">
          <i data-lucide="folder"></i>
        </div>
      `;
    }

    if (project.featured) {
      const badge = document.createElement('div');
      badge.className = 'featured-badge';
      badge.textContent = 'Featured';
      imageDiv.appendChild(badge);
    }

    return imageDiv;
  }

  /**
   * Create project content section
   * @param {Object} project - Project data
   * @returns {HTMLElement} Content element
   */
  createProjectContent(project) {
    const content = document.createElement('div');
    content.className = 'project-content';

    // Category tags
    const categoryDiv = document.createElement('div');
    categoryDiv.className = 'project-category';

    const categoryNames = project.categories.map(cat => this.formatCategory(cat));
    categoryDiv.textContent = categoryNames.join(' • ');
    content.appendChild(categoryDiv);

    // Title
    const title = document.createElement('h3');
    title.className = 'project-title';
    title.textContent = project.title;
    content.appendChild(title);

    // Description
    const description = document.createElement('p');
    description.className = 'project-description';
    description.textContent = project.description;
    content.appendChild(description);

    // Technologies
    if (project.technologies && project.technologies.length > 0) {
      const techDiv = document.createElement('div');
      techDiv.className = 'project-tech';

      project.technologies.forEach(tech => {
        const tag = document.createElement('span');
        tag.className = 'tech-tag';
        tag.textContent = tech;
        techDiv.appendChild(tag);
      });

      content.appendChild(techDiv);
    }

    // Links
    if (project.links) {
      const linksDiv = document.createElement('div');
      linksDiv.className = 'project-links';

      if (project.links.github) {
        linksDiv.appendChild(this.createProjectLink('GitHub', project.links.github, 'github'));
      }

      if (project.links.demo) {
        linksDiv.appendChild(this.createProjectLink('Live Demo', project.links.demo, 'external-link'));
      }

      content.appendChild(linksDiv);
    }

    return content;
  }

  /**
   * Create project link
   * @param {string} text - Link text
   * @param {string} url - Link URL
   * @param {string} icon - Icon name
   * @returns {HTMLElement} Link element
   */
  createProjectLink(text, url, icon) {
    const link = document.createElement('a');
    link.href = url;
    link.className = 'project-link';
    link.target = '_blank';
    link.rel = 'noopener noreferrer';

    link.innerHTML = `
      <i data-lucide="${icon}"></i>
      <span>${text}</span>
    `;

    return link;
  }

  /**
   * Format category name
   * @param {string} category - Category ID
   * @returns {string} Formatted category name
   */
  formatCategory(category) {
    const categoryMap = {
      'webdev': 'Web Dev',
      'ai': 'AI/ML',
      'fintech': 'FinTech',
      'medtech': 'MedTech'
    };

    return categoryMap[category] || category;
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

    // Reinitialize Lucide icons
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }
}

export default ProjectsPage;