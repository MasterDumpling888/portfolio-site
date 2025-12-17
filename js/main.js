/* ========================================
   Main Entry Point
   Application initialization and setup
   ======================================== */

import { CONFIG, log } from './config.js';
import eventBus from './core/EventBus.js';

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
      // Initialize content service first
      const contentService = (await import('./services/ContentService.js')).default;
      await contentService.init();

      // Update page metadata from content
      this.updatePageMetadata(contentService);

      // Initialize global components
      this.initGlobalComponents();

      // Set up global event listeners
      this.setupGlobalEvents();

      // Initialize Lucide icons
      this.initIcons();

      // Set initial theme
      this.initTheme();

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
   * Initialize global components (navigation, theme switcher)
   */
  initGlobalComponents() {
    log('Initializing global components...');

    // These will be implemented in the next phase
    // For now, we'll set up basic functionality

    // Mobile menu toggle
    this.setupMobileMenu();

    // Theme switcher
    this.setupThemeToggle();

    // Scroll effects
    this.setupScrollEffects();
  }

  /**
   * Set up mobile menu
   */
  setupMobileMenu() {
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (!menuToggle || !navMenu) return;

    menuToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      const isOpen = navMenu.classList.contains('active');

      // Update icon
      const icon = menuToggle.querySelector('i');
      if (icon) {
        icon.setAttribute('data-lucide', isOpen ? 'x' : 'menu');
        if (window.lucide) {
          window.lucide.createIcons();
        }
      }

      log('Mobile menu toggled:', isOpen ? 'open' : 'closed');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!menuToggle.contains(e.target) && !navMenu.contains(e.target)) {
        navMenu.classList.remove('active');
        const icon = menuToggle.querySelector('i');
        if (icon) {
          icon.setAttribute('data-lucide', 'menu');
          if (window.lucide) {
            window.lucide.createIcons();
          }
        }
      }
    });

    // Close menu when nav link is clicked
    const navLinks = navMenu.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
      });
    });
  }

  /**
   * Set up theme toggle
   */
  setupThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;

    themeToggle.addEventListener('click', () => {
      const currentTheme = document.body.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

      this.setTheme(newTheme);
      log('Theme toggled to:', newTheme);
    });
  }

  /**
   * Initialize theme
   */
  initTheme() {
    // Try to load saved theme from localStorage
    const savedTheme = localStorage.getItem(CONFIG.theme.storageKey);
    const theme = savedTheme || CONFIG.theme.default;

    this.setTheme(theme, false);
    log('Theme initialized:', theme);
  }

  /**
   * Set theme
   * @param {string} theme - Theme name ('dark' or 'light')
   * @param {boolean} save - Whether to save to localStorage
   */
  setTheme(theme, save = true) {
    document.body.setAttribute(CONFIG.theme.attribute, theme);

    if (save) {
      localStorage.setItem(CONFIG.theme.storageKey, theme);
    }

    eventBus.emit('theme:changed', { theme });
  }

  /**
   * Set up scroll effects
   */
  setupScrollEffects() {
    const nav = document.querySelector('.navigation');
    if (!nav) return;

    let lastScroll = 0;

    window.addEventListener('scroll', () => {
      const currentScroll = window.pageYOffset;

      // Add scrolled class when scrolled down
      if (currentScroll > 50) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }

      lastScroll = currentScroll;
    });
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
   * Set up global event listeners
   */
  setupGlobalEvents() {
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