/* ========================================
   DOMHelper Utility
   DOM manipulation helper functions
   ======================================== */

class DOMHelper {
  /**
   * Create an element with attributes and content
   * @param {string} tag - HTML tag name
   * @param {Object} attributes - Element attributes
   * @param {string|HTMLElement|Array} content - Element content
   * @returns {HTMLElement} Created element
   */
  createElement(tag, attributes = {}, content = null) {
    const element = document.createElement(tag);

    // Set attributes
    Object.entries(attributes).forEach(([key, value]) => {
      if (key === 'className') {
        element.className = value;
      } else if (key === 'dataset') {
        Object.entries(value).forEach(([dataKey, dataValue]) => {
          element.dataset[dataKey] = dataValue;
        });
      } else if (key.startsWith('on') && typeof value === 'function') {
        const eventName = key.substring(2).toLowerCase();
        element.addEventListener(eventName, value);
      } else {
        element.setAttribute(key, value);
      }
    });

    // Set content
    if (content !== null) {
      if (typeof content === 'string') {
        element.textContent = content;
      } else if (content instanceof HTMLElement) {
        element.appendChild(content);
      } else if (Array.isArray(content)) {
        content.forEach(child => {
          if (typeof child === 'string') {
            element.appendChild(document.createTextNode(child));
          } else if (child instanceof HTMLElement) {
            element.appendChild(child);
          }
        });
      }
    }

    return element;
  }

  /**
   * Query selector (shorthand)
   * @param {string} selector - CSS selector
   * @param {HTMLElement} parent - Parent element (optional)
   * @returns {HTMLElement|null} Element or null
   */
  $(selector, parent = document) {
    return parent.querySelector(selector);
  }

  /**
   * Query selector all (shorthand)
   * @param {string} selector - CSS selector
   * @param {HTMLElement} parent - Parent element (optional)
   * @returns {NodeList} NodeList of elements
   */
  $$(selector, parent = document) {
    return parent.querySelectorAll(selector);
  }

  /**
   * Add class to element(s)
   * @param {HTMLElement|NodeList|string} target - Element(s) or selector
   * @param {string|Array} classes - Class name(s)
   */
  addClass(target, classes) {
    const elements = this.getElements(target);
    const classList = Array.isArray(classes) ? classes : [classes];

    elements.forEach(el => el.classList.add(...classList));
  }

  /**
   * Remove class from element(s)
   * @param {HTMLElement|NodeList|string} target - Element(s) or selector
   * @param {string|Array} classes - Class name(s)
   */
  removeClass(target, classes) {
    const elements = this.getElements(target);
    const classList = Array.isArray(classes) ? classes : [classes];

    elements.forEach(el => el.classList.remove(...classList));
  }

  /**
   * Toggle class on element(s)
   * @param {HTMLElement|NodeList|string} target - Element(s) or selector
   * @param {string} className - Class name
   */
  toggleClass(target, className) {
    const elements = this.getElements(target);
    elements.forEach(el => el.classList.toggle(className));
  }

  /**
   * Check if element has class
   * @param {HTMLElement|string} target - Element or selector
   * @param {string} className - Class name
   * @returns {boolean} True if has class
   */
  hasClass(target, className) {
    const element = this.getElement(target);
    return element ? element.classList.contains(className) : false;
  }

  /**
   * Show element(s)
   * @param {HTMLElement|NodeList|string} target - Element(s) or selector
   */
  show(target) {
    this.removeClass(target, 'hidden');
  }

  /**
   * Hide element(s)
   * @param {HTMLElement|NodeList|string} target - Element(s) or selector
   */
  hide(target) {
    this.addClass(target, 'hidden');
  }

  /**
   * Toggle visibility of element(s)
   * @param {HTMLElement|NodeList|string} target - Element(s) or selector
   */
  toggle(target) {
    this.toggleClass(target, 'hidden');
  }

  /**
   * Set HTML content
   * @param {HTMLElement|string} target - Element or selector
   * @param {string} html - HTML string
   */
  setHTML(target, html) {
    const element = this.getElement(target);
    if (element) {
      element.innerHTML = html;
    }
  }

  /**
   * Set text content
   * @param {HTMLElement|string} target - Element or selector
   * @param {string} text - Text string
   */
  setText(target, text) {
    const element = this.getElement(target);
    if (element) {
      element.textContent = text;
    }
  }

  /**
   * Get element(s) from various input types
   * @param {HTMLElement|NodeList|string} target - Element(s) or selector
   * @returns {Array} Array of elements
   */
  getElements(target) {
    if (typeof target === 'string') {
      return Array.from(this.$$(target));
    } else if (target instanceof HTMLElement) {
      return [target];
    } else if (target instanceof NodeList || Array.isArray(target)) {
      return Array.from(target);
    }
    return [];
  }

  /**
   * Get single element
   * @param {HTMLElement|string} target - Element or selector
   * @returns {HTMLElement|null} Element or null
   */
  getElement(target) {
    if (typeof target === 'string') {
      return this.$(target);
    } else if (target instanceof HTMLElement) {
      return target;
    }
    return null;
  }

  /**
   * Remove element(s) from DOM
   * @param {HTMLElement|NodeList|string} target - Element(s) or selector
   */
  remove(target) {
    const elements = this.getElements(target);
    elements.forEach(el => el.remove());
  }

  /**
   * Empty element (remove all children)
   * @param {HTMLElement|string} target - Element or selector
   */
  empty(target) {
    const element = this.getElement(target);
    if (element) {
      element.innerHTML = '';
    }
  }

  /**
   * Append child to element
   * @param {HTMLElement|string} parent - Parent element or selector
   * @param {HTMLElement|string} child - Child element or HTML string
   */
  append(parent, child) {
    const parentEl = this.getElement(parent);
    if (!parentEl) return;

    if (typeof child === 'string') {
      parentEl.insertAdjacentHTML('beforeend', child);
    } else if (child instanceof HTMLElement) {
      parentEl.appendChild(child);
    }
  }

  /**
   * Prepend child to element
   * @param {HTMLElement|string} parent - Parent element or selector
   * @param {HTMLElement|string} child - Child element or HTML string
   */
  prepend(parent, child) {
    const parentEl = this.getElement(parent);
    if (!parentEl) return;

    if (typeof child === 'string') {
      parentEl.insertAdjacentHTML('afterbegin', child);
    } else if (child instanceof HTMLElement) {
      parentEl.insertBefore(child, parentEl.firstChild);
    }
  }

  /**
   * Get/Set attribute
   * @param {HTMLElement|string} target - Element or selector
   * @param {string} attr - Attribute name
   * @param {string} value - Attribute value (optional)
   * @returns {string|null} Attribute value if getting
   */
  attr(target, attr, value = undefined) {
    const element = this.getElement(target);
    if (!element) return null;

    if (value === undefined) {
      return element.getAttribute(attr);
    } else {
      element.setAttribute(attr, value);
      return null;
    }
  }

  /**
   * Remove attribute
   * @param {HTMLElement|string} target - Element or selector
   * @param {string} attr - Attribute name
   */
  removeAttr(target, attr) {
    const element = this.getElement(target);
    if (element) {
      element.removeAttribute(attr);
    }
  }

  /**
   * Get/Set data attribute
   * @param {HTMLElement|string} target - Element or selector
   * @param {string} key - Data key
   * @param {*} value - Data value (optional)
   * @returns {*} Data value if getting
   */
  data(target, key, value = undefined) {
    const element = this.getElement(target);
    if (!element) return null;

    if (value === undefined) {
      return element.dataset[key];
    } else {
      element.dataset[key] = value;
      return null;
    }
  }

  /**
   * Scroll to element smoothly
   * @param {HTMLElement|string} target - Element or selector
   * @param {Object} options - Scroll options
   */
  scrollTo(target, options = {}) {
    const element = this.getElement(target);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        ...options
      });
    }
  }

  /**
   * Get icon HTML (Lucide or raw SVG for brands)
   * @param {string} iconName - Icon name
   * @param {string} className - Optional extra class
   * @returns {string} HTML string for the icon
   */
  getIconHTML(iconName, className = '') {
    const brandIcons = {
      github:
        '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon brand-icon github-icon ' +
        className +
        '"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.28 1.15-.28 2.35 0 3.5-.73 1.02-1.08 2.25-1 3.5 0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>',
      linkedin:
        '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon brand-icon linkedin-icon ' +
        className +
        '"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>',
      twitter:
        '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon brand-icon twitter-icon ' +
        className +
        '"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>',
      figma:
        '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon brand-icon figma-icon ' +
        className +
        '"><path d="M5 5.5A3.5 3.5 0 0 1 8.5 2H12v7H8.5A3.5 3.5 0 0 1 5 5.5z"/><path d="M12 2h3.5a3.5 3.5 0 1 1 0 7H12V2z"/><path d="M5 12.5A3.5 3.5 0 0 1 8.5 9H12v7H8.5A3.5 3.5 0 0 1 5 12.5z"/><path d="M5 19.5A3.5 3.5 0 0 1 8.5 16H12v3.5a3.5 3.5 0 1 1-7 0z"/><circle cx="15.5" cy="12.5" r="3.5"/></svg>',
    };

    if (brandIcons[iconName]) {
      return brandIcons[iconName];
    }

    return `<i data-lucide="${iconName}" class="${className}"></i>`;
  }
}

// Create singleton instance
const domHelper = new DOMHelper();

export default domHelper;