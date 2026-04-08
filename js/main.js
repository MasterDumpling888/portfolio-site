/* ========================================
   Main Entry Point
   Application initialization and setup
   ======================================== */

import { CONFIG, log } from './config.js';
import eventBus from './core/EventBus.js';
import themeManager from './services/ThemeManager.js';
import { getParticlesConfig } from './utils/ParticlesConfig.js';

class App {
  constructor() {
    this.currentPage = null;
    this.components = new Map();
    this.initialized = false;

    log('App instance created');
  }

  /**
   * Initialize the application
   */
  async init() {
    if (this.initialized) return;

    log('Initializing application...');

    try {
      // Initialize theme early
      themeManager.init();

      // Initialize content service first
      const contentService = (await import('./services/ContentService.js')).default;
      await contentService.init();

      // Update page metadata from content
      this.updatePageMetadata(contentService);

      // Initialize global components
      log('Initializing global components...');
      await this.initNavigationComponent();
      await this.initFooterComponent();
      log('Global components initialization complete');

      // Set up global event listeners
      this.setupGlobalEvents();

      // Initialize Lucide icons
      this.initIcons();

      this.initParticles();

      // Initialize current page
      await this.initCurrentPage();

      this.initialized = true;
      log('Application initialized successfully');

      // Emit app ready event
      eventBus.emit('app:ready');
    } catch (error) {
      console.error('Error initializing application:', error);
    }
  }

  /**
   * Update page metadata from JSON content
   * @param {ContentService} contentService - Content service instance
   */
  updatePageMetadata(contentService) {
    const siteInfo = contentService.getSiteInfo();

    if (!siteInfo) return;

    // Update document title
    if (siteInfo.title) {
      document.title = siteInfo.title;
    }

    // Update meta description
    if (siteInfo.description) {
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', siteInfo.description);
      }
    }

    // Update meta author
    if (siteInfo.author) {
      const metaAuthor = document.querySelector('meta[name="author"]');
      if (metaAuthor) {
        metaAuthor.setAttribute('content', siteInfo.author);
      }
    }

    log('Page metadata updated from JSON');
  }

  /**
   * Initialize Navigation component
   */
  async initNavigationComponent() {
    try {
      log('Loading Navigation component...');
      const { default: Navigation } = await import('./components/Navigation.js');

      const pageName = this.getPageNameFromPath(window.location.pathname);
      const navigation = new Navigation(pageName);
      navigation.init();

      this.registerComponent('navigation', navigation);
      log('Navigation component initialized');
    } catch (error) {
      console.error('Failed to initialize Navigation:', error);
    }
  }

  /**
   * Initialize Footer component
   */
  async initFooterComponent() {
    try {
      log('Loading Footer component...');
      const { default: Footer } = await import('./components/Footer.js');

      const footer = new Footer();
      await footer.init();

      this.registerComponent('footer', footer);
      log('Footer component initialized');
    } catch (error) {
      console.error('Failed to initialize Footer:', error);
    }
  }

  /**
   * Initialize Lucide icons
   */
  initIcons() {
    if (window.lucide) {
      window.lucide.createIcons();
      log('Lucide icons initialized');
    }
  }

  /**
   * Initialize particles.js
   */
  initParticles() {
    if (window.particlesJS) {
      const currentTheme = themeManager.getCurrentTheme();
      const config = getParticlesConfig(currentTheme);
      window.particlesJS('particles-js', config);
      log('Particles.js initialized with config for:', currentTheme);
    } else {
      log('Particles.js not found on window, retrying in 100ms...');
      setTimeout(() => this.initParticles(), 100);
    }
  }

  /**
   * Set up global event listeners
   */
  setupGlobalEvents() {
    // Handle theme changes
    eventBus.on('theme:changed', ({ theme }) => {
      this.initParticles();
    });

    // Handle window resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        eventBus.emit('window:resize', {
          width: window.innerWidth,
          height: window.innerHeight
        });
      }, 250);
    });

    // Handle page visibility
    document.addEventListener('visibilitychange', () => {
      eventBus.emit('page:visibility', {
        visible: !document.hidden
      });
    });

    log('Global events set up');
  }

  /**
   * Initialize current page
   */
  async initCurrentPage() {
    // Determine current page from URL
    const path = window.location.pathname;
    const pageName = this.getPageNameFromPath(path);

    log('Current page:', pageName);

    // Import and initialize page controller
    try {
      let PageController;

      switch (pageName) {
        case 'home':
          const { default: HomePage } = await import('./pages/HomePage.js');
          PageController = HomePage;
          break;
        case 'projects':
          const { default: ProjectsPage } = await import('./pages/ProjectsPage.js');
          PageController = ProjectsPage;
          break;
        case 'skills':
          const { default: SkillsPage } = await import('./pages/SkillsPage.js');
          PageController = SkillsPage;
          break;
        case 'contact':
          const { default: ContactPage } = await import('./pages/ContactPage.js');
          PageController = ContactPage;
          break;
        default:
          log('No page controller for:', pageName);
          return;
      }

      // Create and initialize page
      if (PageController) {
        this.currentPage = new PageController();
        await this.currentPage.init();
        this.currentPage.onActivate();

        log('Page controller initialized:', pageName);
      }
    } catch (error) {
      console.error('Error initializing page:', error);
    }

    eventBus.emit('page:loaded', { page: pageName });
  }

  /**
   * Get page name from path
   * @param {string} path - URL path
   * @returns {string} Page name
   */
  getPageNameFromPath(path) {
    if (path === '/' || path.includes('index.html')) {
      return 'home';
    } else if (path.includes('projects.html')) {
      return 'projects';
    } else if (path.includes('skills.html')) {
      return 'skills';
    } else if (path.includes('contact.html')) {
      return 'contact';
    }
    return 'home';
  }

  /**
   * Register a component
   * @param {string} name - Component name
   * @param {Component} component - Component instance
   */
  registerComponent(name, component) {
    this.components.set(name, component);
    log('Component registered:', name);
  }

  /**
   * Get a registered component
   * @param {string} name - Component name
   * @returns {Component} Component instance
   */
  getComponent(name) {
    return this.components.get(name);
  }
}

// Create app instance
const app = new App();

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => app.init());
} else {
  app.init();
}

// Export for use in other modules
export default app;