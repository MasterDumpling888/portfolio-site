/* ========================================
   ProjectCard Component
   Reusable card for showcasing projects
   ======================================== */

import Component from '../core/Component.js';
import domHelper from '../utils/DOMHelper.js';

class ProjectCard extends Component {
  /**
   * Create a ProjectCard
   * @param {Object} project - Project data object
   * @param {Object} options - Component options (index, etc)
   */
  constructor(project, options = {}) {
    super(null, options);
    this.project = project;
    this.index = options.index || 0;
  }

  /**
   * Render the project card HTML
   * @returns {string} HTML string
   */
  render() {
    const { project } = this;
    const delay = this.index * 0.1;
    
    // Format categories for display
    const categories = project.categories || (project.category ? [project.category] : ['misc']);
    const categoryDisplay = categories.map(cat => this.formatCategory(cat)).join(' • ');

    return `
      <article class="project-card scroll-reveal clickable" 
               data-project-id="${project.id}" 
               style="animation-delay: ${delay}s">
        ${project.featured ? '<span class="featured-badge">FEATURED</span>' : ''}
        
        <div class="project-image">
          ${project.image
            ? `<img src="${project.image}" alt="${project.title}" loading="lazy" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">`
            : ''
          }
          <div class="project-image-placeholder" style="${project.image ? 'display: none;' : 'display: flex;'}">
            ${domHelper.getIconHTML('folder')}
          </div>
          <div class="project-overlay">
            <span class="overlay-text">VIEW_LOG</span>
          </div>
        </div>
        
        <div class="project-content">
          <div class="project-category">${categoryDisplay}</div>
          <h3 class="project-title">${project.title}</h3>
          <p class="project-description">${project.description}</p>
          
          <div class="project-tech">
            ${(project.technologies || []).slice(0, 3).map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
            ${project.technologies?.length > 3 ? `<span class="tech-tag">+${project.technologies.length - 3}</span>` : ''}
          </div>
          
          <div class="project-links" onclick="event.stopPropagation()">
            ${project.links?.github
              ? `<a href="${project.links.github}" target="_blank" class="project-link" rel="noopener noreferrer">${domHelper.getIconHTML('github')} <span>GITHUB</span></a>`
              : ''
            }
            ${project.links?.demo
              ? `<a href="${project.links.demo}" target="_blank" class="project-link" rel="noopener noreferrer">${domHelper.getIconHTML('external-link')} <span>${project.type === 'art' ? 'VISIT' : 'DEMO'}</span></a>`
              : ''
            }
          </div>
        </div>
      </article>
    `;
  }

  /**
   * Render the project in a bar/row layout for carousels
   * @returns {string} HTML string
   */
  renderBar() {
    const { project } = this;
    const categories = project.categories || (project.category ? [project.category] : ['misc']);
    const primaryCategory = categories[0]?.toUpperCase().replace(/-/g, '_');

    return `
      <div class="project-bar-item ${project.type}" data-project-id="${project.id}">
        <div class="bar-type-tag">${primaryCategory}</div>
        <div class="bar-info">
          <h4 class="bar-title">${project.title}</h4>
          <div class="bar-tech">
            ${(project.technologies || []).slice(0, 2).map(tech => `<span class="bar-tech-tag">${tech}</span>`).join('')}
          </div>
        </div>
        <div class="bar-action">
          <i data-lucide="chevron-right"></i>
        </div>
      </div>
    `;
  }

  /**
   * Format category ID into display name
   * @param {string} category - Category ID
   * @returns {string} Display name
   */
  formatCategory(category) {
    const categoryMap = {
      'webdev': 'Web Dev',
      'ai': 'AI/ML',
      'fintech': 'FinTech',
      'medtech': 'MedTech',
      'image-processing': 'Image Processing',
      'datavis': 'Data Viz',
      'mobiledev': 'Mobile Dev'
    };

    return categoryMap[category] || (category.charAt(0).toUpperCase() + category.slice(1));
  }
}

export default ProjectCard;