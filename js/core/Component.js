/* ========================================
   Component (Base Class)
   Base class for all UI components
   ======================================== */

import { log, logError } from '../config.js';
import eventBus from './EventBus.js';

class Component {
  /**
   * Create a component
   * @param {string} elementId - DOM element ID
   * @param {Object} options - Component options
   */
  constructor(elementId, options = {}) {
    this.elementId = elementId;
    this.element = null;
    this.options = options;
    this.state = {};
    this.eventListeners = [];
    this.mounted = false;

    log(`Component created: ${this.constructor.name}`, elementId);
  }

  /**
   * Initialize the component
   */
  init() {
    this.element = document.getElementById(this.elementId);

    if (!this.element) {
      logError(`Element not found: ${this.elementId}`);
      return false;
    }

    this.setupEventListeners();
    return true;
  }

  /**
   * Render the component
   * Override this in child classes
   * @returns {string} HTML string
   */
  render() {
    return '';
  }

  /**
   * Mount the component to the DOM
   */
  mount() {
    if (!this.element) {
      logError('Cannot mount: Element not found');
      return;
    }

    const html = this.render();
    if (html) {
      this.element.innerHTML = html;
    }

    this.afterMount();
    this.mounted = true;
    log(`Component mounted: ${this.constructor.name}`);
  }

  /**
   * Called after component is mounted
   * Override this in child classes for post-mount logic
   */
  afterMount() {
    // Override in child classes
  }

  /**
   * Update component with new data
   * @param {Object} newData - New data to update
   */
  update(newData) {
    this.state = { ...this.state, ...newData };
    this.mount(); // Re-render
    log(`Component updated: ${this.constructor.name}`);
  }

  /**
   * Set up event listeners
   * Override this in child classes
   */
  setupEventListeners() {
    // Override in child classes
  }

  /**
   * Add event listener and track it for cleanup
   * @param {HTMLElement} element - Element to attach listener to
   * @param {string} event - Event name
   * @param {function} handler - Event handler
   * @param {Object} options - Event listener options
   */
  addEventListener(element, event, handler, options = {}) {
    if (!element) return;

    element.addEventListener(event, handler, options);
    this.eventListeners.push({ element, event, handler, options });
  }

  /**
   * Remove all event listeners
   */
  removeEventListeners() {
    this.eventListeners.forEach(({ element, event, handler, options }) => {
      element.removeEventListener(event, handler, options);
    });
    this.eventListeners = [];
  }

  /**
   * Emit a custom event through the event bus
   * @param {string} event - Event name
   * @param {*} data - Event data
   */
  emit(event, data) {
    eventBus.emit(event, data);
  }

  /**
   * Subscribe to an event through the event bus
   * @param {string} event - Event name
   * @param {function} callback - Callback function
   * @returns {function} Unsubscribe function
   */
  on(event, callback) {
    return eventBus.on(event, callback);
  }

  /**
   * Get state value
   * @param {string} key - State key
   * @returns {*} State value
   */
  getState(key) {
    return this.state[key];
  }

  /**
   * Set state value
   * @param {string} key - State key
   * @param {*} value - State value
   * @param {boolean} rerender - Whether to re-render after setting state
   */
  setState(key, value, rerender = false) {
    this.state[key] = value;
    if (rerender) {
      this.mount();
    }
  }

  /**
   * Show the component
   */
  show() {
    if (this.element) {
      this.element.classList.remove('hidden');
      this.element.style.display = '';
    }
  }

  /**
   * Hide the component
   */
  hide() {
    if (this.element) {
      this.element.classList.add('hidden');
    }
  }

  /**
   * Destroy the component and clean up
   */
  destroy() {
    this.removeEventListeners();

    if (this.element) {
      this.element.innerHTML = '';
    }

    this.mounted = false;
    log(`Component destroyed: ${this.constructor.name}`);
  }

  /**
   * Query selector within component
   * @param {string} selector - CSS selector
   * @returns {HTMLElement} Element
   */
  querySelector(selector) {
    return this.element ? this.element.querySelector(selector) : null;
  }

  /**
   * Query selector all within component
   * @param {string} selector - CSS selector
   * @returns {NodeList} Elements
   */
  querySelectorAll(selector) {
    return this.element ? this.element.querySelectorAll(selector) : [];
  }
}

export default Component;