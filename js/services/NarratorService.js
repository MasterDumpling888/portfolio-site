/* ========================================
   Narrator Service
   Manages dialogue state and content
   ======================================== */

import eventBus from '../core/EventBus.js';
import contentService from './ContentService.js';
import { log } from '../config.js';

class NarratorService {
  constructor() {
    this.currentMessage = '';
    this.avatar = localStorage.getItem('portfolio-avatar') || null;
    this.isTyping = false;
    this.isHeroMode = false;
    this.narrativeData = null;
  }

  /**
   * Set hero mode
   * @param {boolean} val - True for hero mode
   */
  setHeroMode(val) {
    this.isHeroMode = val;
    eventBus.emit('narrator:mode_changed', { isHeroMode: val });
  }

  /**
   * Get hero mode status
   */
  getHeroMode() {
    return this.isHeroMode;
  }

  /**
   * Initialize service
   */
  async init() {
    if (!contentService.isReady()) {
      await contentService.init();
    }
    this.narrativeData = contentService.getContent()?.narrative || {};
    log('NarratorService initialized');
  }

  /**
   * Set message for a specific page
   * @param {string} pageKey - Page identifier
   * @param {string} type - 'guide' or 'lore'
   */
  setPageMessage(pageKey, type = 'guide') {
    const pageData = this.narrativeData.pages?.[pageKey];
    if (pageData && pageData[type]) {
      this.setMessage(pageData[type]);
    }
  }

  /**
   * Set a custom message
   * @param {string} text - Message text
   */
  setMessage(text) {
    if (this.currentMessage === text) return;
    
    this.currentMessage = text;
    eventBus.emit('narrator:message', { text });
  }

  /**
   * Update avatar
   * @param {string} choice - 'dino' or 'onigiri'
   */
  setAvatar(choice) {
    this.avatar = choice;
    eventBus.emit('narrator:avatar_changed', { avatar: choice });
  }

  /**
   * Get current avatar
   */
  getAvatar() {
    return this.avatar;
  }

  /**
   * Helper: Typewriter effect logic
   * @param {string} text - Text to type
   * @param {Function} onUpdate - Callback for each character
   * @param {Function} onComplete - Callback when finished
   * @param {number} speed - Typing speed in ms
   */
  typeEffect(text, onUpdate, onComplete, speed = 30) {
    this.isTyping = true;
    let i = 0;
    const interval = setInterval(() => {
      onUpdate(text.substring(0, i + 1));
      i++;
      if (i >= text.length) {
        clearInterval(interval);
        this.isTyping = false;
        if (onComplete) onComplete();
      }
    }, speed);

    return interval; // Return to allow cancellation
  }
}

const narratorService = new NarratorService();
export default narratorService;
