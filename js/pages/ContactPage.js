/* ========================================
   ContactPage Controller
   Manages contact page
   ======================================== */

import Page from '../core/Page.js';
import contentService from '../services/ContentService.js';
import { log } from '../config.js';
import domHelper from '../utils/DOMHelper.js';

class ContactPage extends Page {
  constructor() {
    super('contact');
  }

  /**
   * Load page data
   */
  async loadData() {
    // Ensure content service is initialized
    if (!contentService.isReady()) {
      await contentService.init();
    }

    // Get contact and social data
    this.state.contact = contentService.getContactInfo();
    this.state.social = contentService.getSocialLinks();

    log('ContactPage data loaded');
  }

  /**
   * Set up page components
   */
  setupComponents() {
    this.updateContactInfo();
    this.updatePageTitle();
  }

  /**
   * Update page title and description from JSON
   */
  updatePageTitle() {
    const contact = this.state.contact;

    // Update CTA text if available
    if (contact.cta) {
      const ctaEl = domHelper.$('.contact-subtitle');
      if (ctaEl) {
        ctaEl.textContent = contact.cta;
      }
    }
  }

  /**
   * Update contact information from JSON
   */
  updateContactInfo() {
    const contact = this.state.contact;
    const social = this.state.social;

    // Update availability status
    if (contact.availability) {
      const statusEl = domHelper.$('.availability-status');
      if (statusEl) {
        // Keep the status indicator, update text
        const statusHTML = `
          <span class="status-indicator"></span>
          ${contact.availability}
        `;
        statusEl.innerHTML = statusHTML;
      }
    }

    // Update response time
    if (contact.responseTime) {
      const responseEl = domHelper.$('.response-time');
      if (responseEl) {
        responseEl.innerHTML = `
          <i data-lucide="clock"></i>
          <span>${contact.responseTime}</span>
        `;
        // Reinitialize icon
        if (window.lucide) window.lucide.createIcons();
      }
    }

    // Update email in contact methods
    if (social.email && social.email.address) {
      // Update all mailto links
      const emailLinks = domHelper.$('a[href*="mailto"]');
      emailLinks.forEach(link => {
        link.href = `mailto:${social.email.address}`;
      });

      // Update displayed email addresses
      const emailValues = domHelper.$('.method-value');
      emailValues.forEach(el => {
        if (el.closest('a[href*="mailto"]')) {
          el.textContent = social.email.address;
        }
      });

      // Update email in contact methods specifically
      const contactMethods = domHelper.$('.contact-method[href*="mailto"]');
      contactMethods.forEach(method => {
        method.href = `mailto:${social.email.address}`;
        const valueEl = method.querySelector('.method-value');
        if (valueEl) {
          valueEl.textContent = social.email.address;
        }
      });
    }

    // Update social links
    this.updateSocialLinks();

    log('Contact info updated from JSON');
  }

  /**
   * Update social media links
   */
  updateSocialLinks() {
    const social = this.state.social;

    // Update GitHub links
    if (social.github) {
      const githubLinks = domHelper.$$('a[href*="github"]');
      githubLinks.forEach(link => {
        link.href = social.github.url;

        const username = link.querySelector('.method-value');
        if (username) {
          username.textContent = social.github.username;
        }
      });
    }

    // Update LinkedIn links
    if (social.linkedin) {
      const linkedinLinks = domHelper.$$('a[href*="linkedin"]');
      linkedinLinks.forEach(link => {
        link.href = social.linkedin.url;

        const username = link.querySelector('.method-value');
        if (username) {
          username.textContent = social.linkedin.username;
        }
      });
    }

    // Update Twitter links (if any)
    if (social.twitter) {
      const twitterLinks = domHelper.$$('a[href*="twitter"]');
      twitterLinks.forEach(link => {
        link.href = social.twitter.url;
      });
    }
  }

  /**
   * Set up event listeners
   */
  setupEventListeners() {
    // Add copy email functionality
    this.setupCopyEmail();
  }

  /**
   * Set up copy email to clipboard functionality
   */
  setupCopyEmail() {
    const emailMethod = domHelper.$('.contact-method[href*="mailto"]');

    if (emailMethod && this.state.social?.email) {
      // Add click handler for copying
      emailMethod.addEventListener('click', (e) => {
        // If user holds Ctrl/Cmd, copy instead of opening email client
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault();
          this.copyToClipboard(this.state.social.email.address);
        }
      });

      // Add tooltip hint
      const tooltip = document.createElement('span');
      tooltip.className = 'email-tooltip';
      tooltip.textContent = 'Ctrl+Click to copy';
      tooltip.style.cssText = 'font-size: 0.75rem; color: var(--color-text-muted); display: block;';

      const methodDetails = emailMethod.querySelector('.method-details');
      if (methodDetails) {
        methodDetails.appendChild(tooltip);
      }
    }
  }

  /**
   * Copy text to clipboard
   * @param {string} text - Text to copy
   */
  async copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      this.showCopyNotification('Email copied to clipboard!');
      log('Email copied to clipboard');
    } catch (error) {
      log('Failed to copy email:', error);
      this.showCopyNotification('Failed to copy email', 'error');
    }
  }

  /**
   * Show copy notification
   * @param {string} message - Notification message
   * @param {string} type - Notification type ('success' or 'error')
   */
  showCopyNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `copy-notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      padding: 1rem 1.5rem;
      background: var(--color-bg-secondary);
      border: 1px solid var(--color-accent-1);
      border-radius: var(--radius-lg);
      z-index: 1000;
      animation: slideInUp 0.3s ease;
    `;

    document.body.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
      notification.style.animation = 'fadeOut 0.3s ease';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  /**
   * Called when page becomes active
   */
  onActivate() {
    super.onActivate();

    // Reinitialize Lucide icons
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }
}

export default ContactPage;