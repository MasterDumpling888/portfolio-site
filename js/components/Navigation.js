/* ========================================
   Navigation Component
   Reusable navigation bar for all pages
   ======================================== */

import Component from '../core/Component.js';
import { log } from '../config.js';
import domHelper from '../utils/DOMHelper.js';

class Navigation extends Component {
  constructor(currentPage = 'home') {
    super('main-navigation');
    this.currentPage = currentPage;
  }

  /**
   * Initialize component
   */
  init() {
    // Navigation already exists in HTML, so we just need to enhance it
    this.element = document.getElementById(this.elementId);

    if (!this.element) {
      log('Navigation element not found, will be created');
      return false;
    }

    this.setupEventListeners();
    this.setActivePage(this.currentPage);
    return true;
  }

  /**
   * Set up event listeners
   */
  setupEventListeners() {
    // Mobile menu toggle
    this.setupMobileMenu();

    // Scroll effects
    this.setupScrollEffects();
  }

  /**
   * Set up mobile menu functionality
   */
  setupMobileMenu() {
    const menuToggle = domHelper.$('#mobile-menu-toggle');
    const navMenu = domHelper.$('#nav-menu');

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
   * Set up scroll effects
   */
  setupScrollEffects() {
    const nav = this.element;
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
   * Set active page in navigation
   * @param {string} pageName - Current page name
   */
  setActivePage(pageName) {
    const navLinks = domHelper.$$('.nav-link');

    navLinks.forEach(link => {
      link.classList.remove('active');

      const href = link.getAttribute('href');
      const linkPage = this.getPageFromHref(href);

      if (linkPage === pageName) {
        link.classList.add('active');
      }
    });

    log('Active page set:', pageName);
  }

  /**
   * Get page name from href
   * @param {string} href - Link href
   * @returns {string} Page name
   */
  getPageFromHref(href) {
    if (href === 'index.html' || href === '/') return 'home';
    if (href.includes('projects.html')) return 'projects';
    if (href.includes('skills.html')) return 'skills';
    if (href.includes('contact.html')) return 'contact';
    return 'home';
  }
}

export default Navigation;