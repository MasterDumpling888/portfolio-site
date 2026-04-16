/* ========================================
   Footer Component
   Reusable footer for all pages
   ======================================== */

import Component from '../core/Component.js';
import contentService from '../services/ContentService.js';
import { log } from '../config.js';

class Footer extends Component {
  constructor() {
    super('footer-root');
  }

  /**
   * Initialize component
   */
  async init() {
    if (!contentService.isReady()) {
      await contentService.init();
    }

    const success = super.init();
    if (!success) return false;

    this.mount();
    return true;
  }

  /**
   * Render footer HTML
   * @returns {string} Footer HTML
   */
  render() {
    const siteInfo = contentService.getSiteInfo();
    const currentYear = new Date().getFullYear();
    const authorName = siteInfo?.author || 'Rachel Lim';

    return `
      <footer class="site-footer">
        <div class="footer-container">
          <p class="footer-text">
            Designed & Built by <span class="highlight">${authorName}</span>
          </p>
          <p class="footer-subtext">
            © ${currentYear} All rights reserved
          </p>
        </div>
      </footer>
    `;
  }
}

export default Footer;