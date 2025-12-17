/* ========================================
   ThemeManager Utility
   Manages theme switching and persistence
   ======================================== */

import { CONFIG, log } from '../config.js';
import eventBus from '../core/EventBus.js';

class ThemeManager {
  constructor() {
    this.currentTheme = null;
    this.initialized = false;
  }

  /**
   * Initialize theme manager
   */
  init() {
    if (this.initialized) return;

    // Load saved theme or use default
    const savedTheme = this.getSavedTheme();
    const theme = savedTheme || CONFIG.theme.default;

    this.setTheme(theme, false);
    this.initialized = true;

    log('ThemeManager initialized with theme:', theme);
  }

  /**
   * Get saved theme from localStorage
   * @returns {string|null} Saved theme or null
   */
  getSavedTheme() {
    try {
      return localStorage.getItem(CONFIG.theme.storageKey);
    } catch (error) {
      log('Unable to access localStorage:', error);
      return null;
    }
  }

  /**
   * Save theme to localStorage
   * @param {string} theme - Theme name
   */
  saveTheme(theme) {
    try {
      localStorage.setItem(CONFIG.theme.storageKey, theme);
      log('Theme saved:', theme);
    } catch (error) {
      log('Unable to save theme to localStorage:', error);
    }
  }

  /**
   * Set current theme
   * @param {string} theme - Theme name ('dark' or 'light')
   * @param {boolean} save - Whether to save to localStorage
   */
  setTheme(theme, save = true) {
    // Validate theme
    if (theme !== 'dark' && theme !== 'light') {
      log('Invalid theme:', theme);
      return;
    }

    // Update document attribute
    document.body.setAttribute(CONFIG.theme.attribute, theme);

    this.currentTheme = theme;

    // Save to localStorage
    if (save) {
      this.saveTheme(theme);
    }

    // Emit theme change event
    eventBus.emit('theme:changed', { theme });

    log('Theme set to:', theme);
  }

  /**
   * Toggle between dark and light themes
   */
  toggle() {
    const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
    this.setTheme(newTheme);

    return newTheme;
  }

  /**
   * Get current theme
   * @returns {string} Current theme name
   */
  getCurrentTheme() {
    return this.currentTheme;
  }

  /**
   * Check if dark mode is active
   * @returns {boolean} True if dark mode
   */
  isDarkMode() {
    return this.currentTheme === 'dark';
  }

  /**
   * Check if light mode is active
   * @returns {boolean} True if light mode
   */
  isLightMode() {
    return this.currentTheme === 'light';
  }

  /**
   * Set dark theme
   */
  setDark() {
    this.setTheme('dark');
  }

  /**
   * Set light theme
   */
  setLight() {
    this.setTheme('light');
  }

  /**
   * Check system preference for dark mode
   * @returns {boolean} True if system prefers dark mode
   */
  prefersDarkMode() {
    return window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  /**
   * Set theme based on system preference
   */
  useSystemTheme() {
    const theme = this.prefersDarkMode() ? 'dark' : 'light';
    this.setTheme(theme);
  }

  /**
   * Listen to system theme changes
   * @param {function} callback - Callback function
   * @returns {function} Cleanup function
   */
  watchSystemTheme(callback) {
    if (!window.matchMedia) return () => { };

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handler = (e) => {
      const theme = e.matches ? 'dark' : 'light';
      callback(theme);
    };

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    }
    // Older browsers
    else if (mediaQuery.addListener) {
      mediaQuery.addListener(handler);
      return () => mediaQuery.removeListener(handler);
    }

    return () => { };
  }

  /**
   * Reset theme to default
   */
  reset() {
    this.setTheme(CONFIG.theme.default);
  }

  /**
   * Clear saved theme
   */
  clearSaved() {
    try {
      localStorage.removeItem(CONFIG.theme.storageKey);
      log('Saved theme cleared');
    } catch (error) {
      log('Unable to clear saved theme:', error);
    }
  }
}

// Create singleton instance
const themeManager = new ThemeManager();

export default themeManager;