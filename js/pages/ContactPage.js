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
    this.updatePageHeader();
    this.updateContactInfo();
  }

  /**
   * Update page header from JSON
   */
  updatePageHeader() {
    const contact = this.state.contact;
    const site = contentService.getSiteInfo();

    // Update main page title if available
    const pageTitle = domHelper.$('.page-title');
    if (pageTitle && site.author) {
      // Keep the number, update the text
      const titleNumber = pageTitle.querySelector('.title-number');
      const numberText = titleNumber ? titleNumber.outerHTML : '<span class="title-number">04.</span>';
      pageTitle.innerHTML = `${numberText} Get In Touch`;
    }

    // Update page description
    const pageDesc = domHelper.$('.page-description');
    if (pageDesc) {
      pageDesc.textContent = "Let's create something amazing together";
    }
  }

  /**
   * Update contact information from JSON
   */
  updateContactInfo() {
    const contact = this.state.contact;
    const social = this.state.social;

    // Update CTA button text (the "Send Email" button)
    if (contact.cta) {
      const ctaButtons = domHelper.$$('.contact-visual .btn-primary span');
      ctaButtons.forEach(btn => {
        btn.textContent = contact.cta;
      });
    }

    // Update availability status
    if (contact.availability) {
      const statusElements = domHelper.$$('.availability-status');
      statusElements.forEach(el => {
        // Keep the status indicator, update text
        const indicator = el.querySelector('.status-indicator');
        const indicatorHTML = indicator ? indicator.outerHTML : '<span class="status-indicator"></span>';
        el.innerHTML = `${indicatorHTML} ${contact.availability}`;
      });
    }

    // Update response time
    if (contact.responseTime) {
      const responseElements = domHelper.$$('.response-time');
      responseElements.forEach(el => {
        el.innerHTML = `
          <i data-lucide="clock"></i>
          <span>${contact.responseTime}</span>
        `;
      });
      // Reinitialize icons if lucide is available
      if (window.lucide) window.lucide.createIcons();
    }

    // Update email in all contact methods and links
    if (social.email && social.email.address) {
      const email = social.email.address;

      // Update all mailto links (href)
      const emailLinks = domHelper.$$('a[href^="mailto:"]');
      emailLinks.forEach(link => {
        // Preserving existing subject/body if they exist in the HTML
        const currentHref = link.getAttribute('href');
        if (currentHref.includes('?')) {
          const params = currentHref.split('?')[1];
          link.href = `mailto:${email}?${params}`;
        } else {
          link.href = `mailto:${email}`;
        }
      });

      // Update displayed email text (any element with class method-value inside an email link)
      const emailTexts = domHelper.$$('.contact-method[href^="mailto:"] .method-value');
      emailTexts.forEach(el => {
        el.textContent = email;
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