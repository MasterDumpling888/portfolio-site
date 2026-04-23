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
          <a href="index.html" class="terminal-logo ${this.activePage === 'home' ? 'active' : ''}"></a>
            <i data-lucide="egg" class="text-primary"></i>
            <h1 class="terminal-title">TAMAGO_OS</h1>
        </div>

        <nav class="desktop-nav">
          <ul class="nav-menu" id="nav-menu">
            <li><a href="index.html" class="nav-link ${this.activePage === 'home' ? 'active' : ''}">DECK</a></li>
            <li><a href="projects.html" class="nav-link ${this.activePage === 'projects' ? 'active' : ''}">PROJECT_LOG</a></li>
            <li><a href="skills.html" class="nav-link ${this.activePage === 'skills' ? 'active' : ''}">SKILL_TREE</a></li>
            <li><a href="contact.html" class="nav-link ${this.activePage === 'contact' ? 'active' : ''}">CONTACT_NODE</a></li>
            <li><a href="assets/resume/Lim, Rachel - CV.pdf" download class="nav-link">RESUME</a></li>
          </ul>
        </nav>

        <div class="header-actions">
          <button id="avatar-switcher" class="text-secondary glow-text-secondary" aria-label="Change Avatar" title="Change Avatar">
            RESET
          </button>
          <button id="theme-toggle" class="theme-toggle" aria-label="Toggle Theme">
            <i data-lucide="sun" class="theme-icon light"></i>
            <i data-lucide="moon" class="theme-icon dark"></i>
          </button>
        </div>
      </div>
      
      </header>

    <nav class="bottom-nav mobile-only">
      <a href="index.html" class="nav-link ${this.activePage === 'home' ? 'active' : ''}">
        <i data-lucide="turtle"></i><span>DECK</span>
      </a>
      <a href="projects.html" class="nav-link ${this.activePage === 'projects' ? 'active' : ''}">
        <i data-lucide="database"></i><span>PROJECT LOG</span>
      </a>
      <a href="skills.html" class="nav-link ${this.activePage === 'skills' ? 'active' : ''}">
        <i data-lucide="network"></i><span>SKILL TREE</span>
      </a>
      <a href="contact.html" class="nav-link ${this.activePage === 'contact' ? 'active' : ''}">
        <i data-lucide="keyboard"></i><span>CONTACT NODE</span>
      </a>
      <a href="assets/resume/Lim, Rachel - CV.pdf" download class="nav-link">
        <i data-lucide="download"></i><span>RESUME</span>
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
    this.setupAvatarSwitcher();

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
   * Set up avatar switcher
   */
  setupAvatarSwitcher() {
    const switcher = domHelper.$('#avatar-switcher', this.element);
    if (!switcher) return;

    switcher.addEventListener('click', () => {
      localStorage.removeItem('portfolio-avatar');
      sessionStorage.setItem('skip-intro', 'true');
      log('Avatar reset, redirecting to selection (skipping intro)');

      // Navigate back to home to trigger selection
      if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
        window.location.reload();
      } else {
        window.location.href = 'index.html';
      }
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