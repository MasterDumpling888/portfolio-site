/* ========================================
   ContactPage Controller
   Manages cosmic keypad and signal transmission
   ======================================== */

import Page from '../core/Page.js';
import contentService from '../services/ContentService.js';
import narratorService from '../services/NarratorService.js';
import { log } from '../config.js';
import domHelper from '../utils/DOMHelper.js';

class ContactPage extends Page {
  constructor() {
    super('contact');
    this.dialedMethod = null;
    this.dialedValue = '';
  }

  /**
   * Load page data
   */
  async loadData() {
    if (!contentService.isReady()) {
      await contentService.init();
    }

    this.state.social = contentService.getSocialLinks();
    this.state.narrative = contentService.getContent()?.narrative || {};
    log('Contact data loaded');
  }

  /**
   * Set up page components
   */
  setupComponents() {
    this.renderNarrator();
    this.setupKeypad();
  }

  /**
   * Render narrator text
   */
  renderNarrator() {
    const container = domHelper.$('#contact-narrator');
    if (container) {
      // Use the global narrator service
      narratorService.setPageMessage('contact', 'guide');
      
      // Keep the local box synced for style
      const contactMsg = this.state.narrative.contact || "INITIATING_TRANSMISSION...";
      container.textContent = contactMsg;
    }
  }

  /**
   * Set up keypad event listeners
   */
  setupKeypad() {
    const keys = domHelper.$$('.key-btn[data-key]');
    const display = domHelper.$('#dial-display');
    const callBtn = domHelper.$('#call-btn');
    const clearBtn = domHelper.$('#clear-btn');

    keys.forEach(key => {
      key.addEventListener('click', () => {
        const method = key.getAttribute('data-method');
        const num = key.getAttribute('data-key');
        
        if (method) {
          this.dialedMethod = method;
          this.updateDisplay(method.toUpperCase());
        } else {
          this.updateDisplay(`SIGNAL_CH_${num}`);
        }
      });
    });

    clearBtn.addEventListener('click', () => {
      this.dialedMethod = null;
      this.updateDisplay('READY_FOR_INPUT');
    });

    callBtn.addEventListener('click', () => {
      this.initiateTransmission();
    });
  }

  /**
   * Update the dial display
   * @param {string} val - Value to display
   */
  updateDisplay(val) {
    const display = domHelper.$('#dial-display');
    if (display) {
      display.textContent = val;
      display.classList.add('animate-pulse');
      setTimeout(() => display.classList.remove('animate-pulse'), 500);
    }
  }

  /**
   * Initiate the "Call" / Transmission
   */
  initiateTransmission() {
    if (!this.dialedMethod) {
      this.updateDisplay('ERROR:NO_TARGET');
      return;
    }

    this.updateDisplay('CONNECTING...');
    
    setTimeout(() => {
      const social = this.state.social;
      let url = '';

      switch (this.dialedMethod) {
        case 'email':
          url = `mailto:${social.email.address}`;
          break;
        case 'github':
          url = social.github.url;
          break;
        case 'linkedin':
          url = social.linkedin.url;
          break;
      }

      if (url) {
        this.updateDisplay('SIGNAL_ESTABLISHED');
        setTimeout(() => {
          window.location.href = url;
        }, 1000);
      } else {
        this.updateDisplay('ERROR:LINK_NOT_FOUND');
      }
    }, 1500);
  }

  onActivate() {
    super.onActivate();
    if (window.lucide) window.lucide.createIcons();
  }
}

export default ContactPage;