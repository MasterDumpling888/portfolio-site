/* ========================================
   ProjectModal Component
   Popup window for detailed project view
   ======================================== */

import Component from '../core/Component.js';
import domHelper from '../utils/DOMHelper.js';

class ProjectModal extends Component {
  constructor() {
    super('project-modal-root');
    this.project = null;
    this.isOpen = false;
    this.currentImageIndex = 0;
  }

  /**
   * Render the modal HTML
   * @returns {string} HTML string
   */
  render() {
    if (!this.project) return '';

    const { project } = this;
    const isArt = project.type === 'art';
    const themeClass = isArt ? 'theme-art' : 'theme-tech';
    const images = project.images || [project.image];
    const currentImg = images[this.currentImageIndex];
    
    return `
      <div class="modal-backdrop ${this.isOpen ? 'active' : ''}" id="modal-backdrop">
        <div class="modal-container ${themeClass} ${this.isOpen ? 'active' : ''}">
          <button class="modal-close" id="modal-close-btn" aria-label="Close modal">
            ${domHelper.getIconHTML('x')}
          </button>
          
          <div class="modal-content-wrapper">
            <header class="modal-header">
              <div class="project-meta">
                <span class="project-type-tag">[ ${project.type.toUpperCase()} ]</span>
                <span class="project-date">${new Date(project.date).toLocaleDateString('en-GB', { year: 'numeric', month: 'short' })}</span>
              </div>
              <h2 class="modal-title">${project.title}</h2>
              <div class="project-categories">
                ${(project.categories || []).map(cat => `<span class="cat-tag">${cat.toUpperCase()}</span>`).join(' ')}
              </div>
            </header>

            <div class="modal-body">
              <div class="modal-info">
                <section class="info-section">
                  <h3 class="section-title">OVERVIEW</h3>
                  <p class="project-long-desc">${project.longDescription || project.description}</p>
                </section>

                <section class="info-section">
                  <h3 class="section-title">TECHNOLOGIES</h3>
                  <div class="tech-grid">
                    ${(project.technologies || []).map(tech => `<span class="modal-tech-tag">${tech}</span>`).join('')}
                  </div>
                </section>

                <section class="modal-actions">
                  ${project.links?.github ? `
                    <a href="${project.links.github}" target="_blank" class="modal-link github" rel="noopener noreferrer">
                      ${domHelper.getIconHTML('github')} GITHUB
                    </a>
                  ` : ''}
                  ${project.links?.demo ? `
                    <a href="${project.links.demo}" target="_blank" class="modal-link demo" rel="noopener noreferrer">
                      ${domHelper.getIconHTML('external-link')} ${isArt ? 'VISIT' : 'DEMO'}
                    </a>
                  ` : ''}
                </section>
              </div>

              <div class="modal-gallery">
                <h3 class="section-title">VISUAL_LOGS</h3>
                <div class="carousel-container">
                  <div class="carousel-main">
                    ${images.length > 1 ? `
                      <button class="carousel-control prev" id="carousel-prev">
                        ${domHelper.getIconHTML('chevron-left')}
                      </button>
                    ` : ''}
                    
                    <div class="carousel-image-wrapper" id="carousel-viewport">
                      <img src="${currentImg}" alt="${project.title} - Image ${this.currentImageIndex + 1}" class="carousel-img" id="main-carousel-img">
                    </div>

                    ${images.length > 1 ? `
                      <button class="carousel-control next" id="carousel-next">
                        ${domHelper.getIconHTML('chevron-right')}
                      </button>
                    ` : ''}
                  </div>
                  
                  ${images.length > 1 ? `
                    <div class="carousel-indicators" id="carousel-indicators">
                      ${images.map((_, i) => `
                        <button class="indicator ${i === this.currentImageIndex ? 'active' : ''}" data-index="${i}"></button>
                      `).join('')}
                    </div>
                  ` : ''}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Show modal with project data
   * @param {Object} project - Project data
   */
  show(project) {
    this.project = project;
    this.isOpen = true;
    this.currentImageIndex = 0;
    this.mount();
    document.body.style.overflow = 'hidden'; // Prevent scrolling

    // Re-initialize Lucide icons
    if (window.lucide) window.lucide.createIcons();
  }

  /**
   * Close the modal
   */
  close() {
    this.isOpen = false;
    const backdrop = domHelper.$('#modal-backdrop');
    const container = domHelper.$('.modal-container');

    if (backdrop && container) {
      backdrop.classList.remove('active');
      container.classList.remove('active');

      // Wait for animation to finish
      setTimeout(() => {
        this.element.innerHTML = '';
        this.project = null;
        document.body.style.overflow = ''; // Restore scrolling
      }, 300);
    }
  }

  /**
   * Set up event listeners
   */
  afterMount() {
    const backdrop = domHelper.$('#modal-backdrop');
    const closeBtn = domHelper.$('#modal-close-btn');
    const prevBtn = domHelper.$('#carousel-prev');
    const nextBtn = domHelper.$('#carousel-next');
    const indicators = domHelper.$$('.carousel-indicators .indicator');

    if (backdrop) {
      this.addEventListener(backdrop, 'click', (e) => {
        if (e.target === backdrop) this.close();
      });
    }

    if (closeBtn) {
      this.addEventListener(closeBtn, 'click', () => this.close());
    }

    // Carousel events
    if (prevBtn) {
      this.addEventListener(prevBtn, 'click', (e) => {
        e.stopPropagation();
        this.prevImage();
      });
    }

    if (nextBtn) {
      this.addEventListener(nextBtn, 'click', (e) => {
        e.stopPropagation();
        this.nextImage();
      });
    }

    indicators.forEach(indicator => {
      this.addEventListener(indicator, 'click', (e) => {
        e.stopPropagation();
        const index = parseInt(indicator.getAttribute('data-index'));
        this.goToImage(index);
      });
    });

    // Escape key listener
    const handleKeys = (e) => {
      if (!this.isOpen) return;
      
      if (e.key === 'Escape') {
        this.close();
        window.removeEventListener('keydown', handleKeys);
      } else if (e.key === 'ArrowLeft') {
        this.prevImage();
      } else if (e.key === 'ArrowRight') {
        this.nextImage();
      }
    };
    window.addEventListener('keydown', handleKeys);
  }

  nextImage() {
    const images = this.project.images || [this.project.image];
    this.currentImageIndex = (this.currentImageIndex + 1) % images.length;
    this.updateCarouselUI();
  }

  prevImage() {
    const images = this.project.images || [this.project.image];
    this.currentImageIndex = (this.currentImageIndex - 1 + images.length) % images.length;
    this.updateCarouselUI();
  }

  goToImage(index) {
    this.currentImageIndex = index;
    this.updateCarouselUI();
  }

  /**
   * Update only the carousel parts of the UI without full re-render
   * This prevents the modal from jumping/scrolling to top on mobile
   */
  updateCarouselUI() {
    const images = this.project.images || [this.project.image];
    const currentImg = images[this.currentImageIndex];
    
    // Update image
    const imgEl = domHelper.$('#main-carousel-img');
    const viewport = domHelper.$('#carousel-viewport');
    
    if (imgEl) {
      imgEl.style.opacity = '0';
      setTimeout(() => {
        imgEl.src = currentImg;
        imgEl.alt = `${this.project.title} - Image ${this.currentImageIndex + 1}`;
        imgEl.style.opacity = '1';
        if (viewport) viewport.scrollTop = 0;
      }, 150);
    }
    
    // Update indicators
    const indicators = domHelper.$$('.indicator');
    indicators.forEach((ind, i) => {
      if (i === this.currentImageIndex) {
        ind.classList.add('active');
      } else {
        ind.classList.remove('active');
      }
    });
  }
}

export default ProjectModal;
