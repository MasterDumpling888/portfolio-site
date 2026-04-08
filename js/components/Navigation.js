/* ========================================
   Navigation Component
   Manages global navigation bar and menu
   ======================================== */

import Component from '../core/Component.js';
import domHelper from '../utils/DOMHelper.js';
import themeManager from '../services/ThemeManager.js';
import { log } from '../config.js';

class Navigation extends Component {
  constructor(activePage = 'home') {
    super('header-root');
    this.activePage = activePage;
  }

  /**
   * Initialize navigation
   */
  init() {
    const success = super.init();
    if (!success) return false;

    this.mount();
    return true;
  }

  /**
   * Render the navigation HTML
   */
  render() {
    return `
    <header class="fixed-header">
      <div class="header-container">
        <div class="terminal-logo">
          <a href="index.html" class="terminal-logo ${this.activePage === 'home' ? 'active' : ''}">
            <i data-lucide="terminal" class="text-primary"></i>
            <h1 class="terminal-title">RACHEL_S_LOG_835</h1>
        </div>

        <nav class="desktop-nav">
          <ul class="nav-menu" id="nav-menu">
            <li><a href="index.html" class="nav-link ${this.activePage === 'home' ? 'active' : ''}">SYSTEM_BOOT</a></li>
            <li><a href="projects.html" class="nav-link ${this.activePage === 'projects' ? 'active' : ''}">EXPLORE_VOID</a></li>
            <li><a href="skills.html" class="nav-link ${this.activePage === 'skills' ? 'active' : ''}">SKILL_LOG</a></li>
            <li><a href="contact.html" class="nav-link ${this.activePage === 'contact' ? 'active' : ''}">SIGNAL_LOG</a></li>
          </ul>
        </nav>

        <div class="header-actions">
          <button id="theme-toggle" class="theme-toggle" aria-label="Toggle Theme">
            <i data-lucide="sun" class="theme-icon light"></i>
            <i data-lucide="moon" class="theme-icon dark"></i>
          </button>
          <button id="mobile-menu-toggle" class="icon-btn mobile-only">
            <i data-lucide="setting-2"></i>
          </button>
        </div>
      </div>
    </header>

    <nav class="bottom-nav mobile-only">
      <a href="index.html" class="nav-link ${this.activePage === 'home' ? 'active' : ''}">
        <i data-lucide="rocket"></i><span>DECK</span>
      </a>
      <a href="projects.html" class="nav-link ${this.activePage === 'projects' ? 'active' : ''}">
        <i data-lucide="database"></i><span>DATA</span>
      </a>
      <a href="skills.html" class="nav-link ${this.activePage === 'skills' ? 'active' : ''}">
        <i data-lucide="palette"></i><span>ART</span>
      </a>
      <a href="contact.html" class="nav-link ${this.activePage === 'contact' ? 'active' : ''}">
        <i data-lucide="turtle"></i><span>COMMS</span>
      </a>
    </nav>
    `;
  }

  /**
   * Setup event listeners after mounting
   */
  afterMount() {
    this.setupThemeToggle();
    this.setupMobileMenu();

    if (window.lucide) {
      window.lucide.createIcons();
    }

    log('Navigation mounted and initialized');
  }

  /**
   * Set up theme toggle
   */
  setupThemeToggle() {
    const themeToggle = domHelper.$('#theme-toggle', this.element);
    if (!themeToggle) return;

    themeToggle.addEventListener('click', () => {
      const newTheme = themeManager.toggle();
      log('Theme toggled to:', newTheme);
    });
  }

  /**
   * Set up mobile menu toggle
   */
  setupMobileMenu() {
    const toggle = domHelper.$('#mobile-menu-toggle', this.element);
    const menu = domHelper.$('#nav-menu', this.element);

    if (!toggle || !menu) return;

    toggle.addEventListener('click', () => {
      menu.classList.toggle('active');
      const isMenuOpen = menu.classList.contains('active');
      const iconName = isMenuOpen ? 'x' : 'menu';

      toggle.innerHTML = `<i data-lucide="${iconName}"></i>`;

      if (window.lucide) {
        window.lucide.createIcons();
      }
    });
  }
}

export default Navigation;