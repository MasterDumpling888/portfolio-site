/* ========================================
   Navigation Component
   Manages global navigation bar and menu
   ======================================== */

import Component from '../core/Page.js'; // Note: Navigation inherits from Page for simplicity or Component
import domHelper from '../utils/DOMHelper.js';
import themeManager from '../services/ThemeManager.js';
import { log } from '../config.js';

class Navigation {
  constructor(activePage = 'home') {
    this.activePage = activePage;
  }

  init() {
    this.setupThemeToggle();
    this.setupMobileMenu();
    this.updateActiveLink();
    log('Navigation initialized');
  }

  /**
   * Set up theme toggle
   */
  setupThemeToggle() {
    const themeToggle = domHelper.$('#theme-toggle');
    if (!themeToggle) return;

    // Set initial icon based on theme
    this.updateThemeIcon(themeManager.getCurrentTheme());

    themeToggle.addEventListener('click', () => {
      const newTheme = themeManager.toggle();
      this.updateThemeIcon(newTheme);
      log('Theme toggled to:', newTheme);
    });
  }

  /**
   * Update theme toggle icon
   * @param {string} theme - Current theme
   */
  updateThemeIcon(theme) {
    const icon = domHelper.$('#theme-toggle i');
    if (!icon) return;

    if (theme === 'light') {
      icon.setAttribute('data-lucide', 'sun');
    } else {
      icon.setAttribute('data-lucide', 'moon');
    }

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  /**
   * Set up mobile menu toggle
   */
  setupMobileMenu() {
    const toggle = domHelper.$('#mobile-menu-toggle');
    const menu = domHelper.$('#nav-menu');

    if (!toggle || !menu) return;

    toggle.addEventListener('click', () => {
      menu.classList.toggle('active');
      const icon = toggle.querySelector('i');
      if (icon && window.lucide) {
        const isMenuOpen = menu.classList.contains('active');
        icon.setAttribute('data-lucide', isMenuOpen ? 'x' : 'menu');
        window.lucide.createIcons();
      }
    });
  }

  /**
   * Update active link in navigation
   */
  updateActiveLink() {
    const links = domHelper.$$('#nav-menu .nav-link, .bottom-nav .nav-link');
    links.forEach(link => {
      const href = link.getAttribute('href');
      if (href && (href.includes(this.activePage) || (this.activePage === 'home' && href === 'index.html'))) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }
}

export default Navigation;