/* ========================================
   HomePage Controller
   Manages home page logic and content
   ======================================== */

import Page from '../core/Page.js';
import contentService from '../services/ContentService.js';
import { log } from '../config.js';
import domHelper from '../utils/DOMHelper.js';

class HomePage extends Page {
  constructor() {
    super('home');
  }

  /**
   * Load page data
   */
  async loadData() {
    // Ensure content service is initialized
    if (!contentService.isReady()) {
      await contentService.init();
    }

    // Get content
    this.state.hero = contentService.getHeroContent();
    this.state.about = contentService.getAboutContent();
    this.state.featuredProjects = contentService.getFeaturedProjects(3);
    this.state.social = contentService.getSocialLinks();

    log('HomePage data loaded');
  }

  /**
   * Set up page components
   */
  setupComponents() {
    // Update ALL dynamic content from JSON
    this.updateHeroContent();
    this.updateAboutContent();
    this.updateSocialLinks();

    // Render featured projects
    this.renderFeaturedProjects();
  }

  /**
   * Update hero content with data from JSON
   */
  updateHeroContent() {
    const hero = this.state.hero;
    if (!hero) return;

    // Update greeting
    const greetingEl = domHelper.$('.hero-greeting');
    if (greetingEl && hero.greeting) {
      greetingEl.textContent = hero.greeting;
    }

    // Update name
    const nameEl = domHelper.$('.name-text');
    if (nameEl && hero.name) {
      nameEl.textContent = hero.name;
    }

    // Update subtitle/title
    const subtitleEl = domHelper.$('.typed-text');
    if (subtitleEl && hero.title) {
      subtitleEl.textContent = hero.title;
    }

    // Update description
    const descEl = domHelper.$('.hero-description');
    if (descEl && hero.description) {
      descEl.innerHTML = hero.description;
    }

    log('Hero content updated from JSON');
  }

  /**
   * Update about section content
   */
  updateAboutContent() {
    const about = this.state.about;
    if (!about) return;

    // Update about section title
    const titleEl = domHelper.$('.about-section .section-title');
    if (titleEl && about.title) {
      const titleNumber = titleEl.querySelector('.title-number');
      const numberText = titleNumber ? titleNumber.textContent : '01.';
      titleEl.innerHTML = `<span class="title-number">${numberText}</span>${about.title}`;
    }

    // Update about paragraphs
    const textContainer = domHelper.$('.about-text');
    if (textContainer && about.paragraphs && about.paragraphs.length > 0) {
      textContainer.innerHTML = '';

      about.paragraphs.forEach(paragraph => {
        const p = document.createElement('p');
        p.textContent = paragraph;
        textContainer.appendChild(p);
      });

      log('About content updated from JSON');
    }
  }

  /**
   * Update social links
   */
  updateSocialLinks() {
    const social = this.state.social;
    if (!social) return;

    // Update GitHub link
    if (social.github && social.github.url) {
      const githubLinks = domHelper.$$('a[href*="github.com"]');
      githubLinks.forEach(link => {
        link.href = social.github.url;
      });
    }

    // Update LinkedIn link
    if (social.linkedin && social.linkedin.url) {
      const linkedinLinks = domHelper.$$('a[href*="linkedin.com"]');
      linkedinLinks.forEach(link => {
        link.href = social.linkedin.url;
      });
    }

    // Update Email link
    if (social.email && social.email.address) {
      const emailLinks = domHelper.$$('a[href^="mailto"]');
      emailLinks.forEach(link => {
        link.href = `mailto:${social.email.address}`;
      });
    }

    // Update Twitter link (if exists)
    if (social.twitter && social.twitter.url) {
      const twitterLinks = domHelper.$$('a[href*="twitter.com"]');
      twitterLinks.forEach(link => {
        link.href = social.twitter.url;
      });
    }

    log('Social links updated from JSON');
  }

  /**
   * Render featured projects
   */
  renderFeaturedProjects() {
    const container = domHelper.$('#featured-projects-container');
    if (!container) return;

    const projects = this.state.featuredProjects;

    if (!projects || projects.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <p>No featured projects available</p>
        </div>
      `;
      return;
    }

    // Clear container
    container.innerHTML = '';

    // Render each project
    projects.forEach(project => {
      const projectCard = this.createProjectCard(project);
      container.appendChild(projectCard);
    });

    log(`Rendered ${projects.length} featured projects`);
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

    // Check if image exists
    if (project.image) {
      const img = document.createElement('img');
      img.src = project.image;
      img.alt = project.title;
      img.loading = 'lazy';

      // Add error handler for missing images
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

    // Add featured badge if applicable
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

    // Category
    const category = document.createElement('div');
    category.className = 'project-category';
    category.textContent = this.formatCategory(project.category);
    content.appendChild(category);

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
      'webdev': 'Web Development',
      'ai': 'AI/ML',
      'fintech': 'FinTech',
      'medtech': 'MedTech'
    };

    return categoryMap[category] || category;
  }

  /**
   * Set up event listeners
   */
  setupEventListeners() {
    // Smooth scroll to about section
    const scrollIndicator = domHelper.$('.scroll-indicator');
    if (scrollIndicator) {
      scrollIndicator.addEventListener('click', () => {
        const aboutSection = domHelper.$('#about');
        if (aboutSection) {
          aboutSection.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }
  }

  /**
   * Called when page becomes active
   */
  onActivate() {
    super.onActivate();

    // Reinitialize Lucide icons after rendering
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }
}

export default HomePage;