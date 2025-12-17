/* ========================================
   Footer Component
   Reusable footer for all pages
   ======================================== */

import Component from '../core/Component.js';
import contentService from '../services/ContentService.js';
import { log } from '../config.js';

class Footer extends Component {
  constructor() {
    super('site-footer');
  }

  /**
   * Initialize component
   */
  init() {
    this.element = document.querySelector('.site-footer');

    if (!this.element) {
      log('Footer element not found');
      return false;
    }

    // Update footer with JSON data
    this.updateFromJSON();
    return true;
  }

  /**
   * Update footer content from JSON
   */
  updateFromJSON() {
    const siteInfo = contentService.getSiteInfo();

    if (!siteInfo) {
      log('No site info available for footer');
      return;
    }

    // Update footer text with author name
    const footerText = this.element.querySelector('.footer-text');
    if (footerText && siteInfo.author) {
      const highlight = footerText.querySelector('.highlight');
      if (highlight) {
        highlight.textContent = siteInfo.author;
      }
    }

    // Update copyright year to current year
    const footerSubtext = this.element.querySelector('.footer-subtext');
    if (footerSubtext) {
      const currentYear = new Date().getFullYear();
      footerSubtext.textContent = `© ${currentYear} All rights reserved`;
    }

    log('Footer updated from JSON');
  }

  /**
   * Render footer HTML (if needed to create from scratch)
   * @returns {string} Footer HTML
   */
  render() {
    const siteInfo = contentService.getSiteInfo();
    const currentYear = new Date().getFullYear();
    const authorName = siteInfo?.author || '[Your Name]';

    return `
      <div class="footer-container">
        <p class="footer-text">
          Designed & Built by <span class="highlight">${authorName}</span>
        </p>
        <p class="footer-subtext">
          © ${currentYear} All rights reserved
        </p>
      </div>
    `;
  }
}

export default Footer;