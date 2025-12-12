/* ========================================
   Page (Base Class)
   Base class for page controllers
   Extends Component
   ======================================== */

import Component from './Component.js';
import { log } from '../config.js';

class Page extends Component {
  /**
   * Create a page
   * @param {string} pageName - Page name/identifier
   * @param {Object} options - Page options
   */
  constructor(pageName, options = {}) {
    super('main-content', options);
    this.pageName = pageName;
    this.components = [];
    this.initialized = false;

    log(`Page created: ${pageName}`);
  }

  /**
   * Initialize the page
   * @returns {Promise<boolean>} Success status
   */
  async init() {
    if (this.initialized) return true;

    const success = super.init();
    if (!success) return false;

    try {
      await this.loadData();
      this.setupComponents();
      this.setupEventListeners();
      this.initialized = true;

      log(`Page initialized: ${this.pageName}`);
      return true;
    } catch (error) {
      console.error(`Error initializing page ${this.pageName}:`, error);
      return false;
    }
  }

  /**
   * Load page data
   * Override this in child classes
   * @returns {Promise<void>}
   */
  async loadData() {
    // Override in child classes
  }

  /**
   * Set up page components
   * Override this in child classes
   */
  setupComponents() {
    // Override in child classes
  }

  /**
   * Register a component
   * @param {Component} component - Component instance
   */
  registerComponent(component) {
    this.components.push(component);
    log(`Component registered to page ${this.pageName}:`, component.constructor.name);
  }

  /**
   * Mount all registered components
   */
  mountComponents() {
    this.components.forEach(component => {
      if (!component.mounted) {
        component.init();
        component.mount();
      }
    });
  }

  /**
   * Animate page entrance
   */
  animate() {
    // Add entrance animations
    const animatedElements = this.querySelectorAll('.animate-fade-in, .animate-fade-in-up, .animate-scale-in');
    animatedElements.forEach((el, index) => {
      setTimeout(() => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, index * 100);
    });
  }

  /**
   * Set up scroll animations using Intersection Observer
   */
  setupScrollAnimations() {
    const observerOptions = {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observe all scroll-reveal elements
    const revealElements = this.querySelectorAll('.scroll-reveal');
    revealElements.forEach(el => observer.observe(el));

    // Store observer for cleanup
    this.scrollObserver = observer;
  }

  /**
   * Called when page becomes active
   */
  onActivate() {
    log(`Page activated: ${this.pageName}`);
    this.animate();
    this.setupScrollAnimations();
    this.mountComponents();
  }

  /**
   * Called when page becomes inactive
   */
  onDeactivate() {
    log(`Page deactivated: ${this.pageName}`);
  }

  /**
   * Destroy page and all components
   */
  destroy() {
    // Destroy all components
    this.components.forEach(component => component.destroy());
    this.components = [];

    // Disconnect scroll observer
    if (this.scrollObserver) {
      this.scrollObserver.disconnect();
      this.scrollObserver = null;
    }

    super.destroy();
    this.initialized = false;

    log(`Page destroyed: ${this.pageName}`);
  }

  /**
   * Get page data
   * @returns {Object} Page data
   */
  getData() {
    return this.state;
  }

  /**
   * Update page data
   * @param {Object} newData - New data
   */
  updateData(newData) {
    this.update(newData);
  }
}

export default Page;