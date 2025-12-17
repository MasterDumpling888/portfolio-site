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
   * Check if element is in viewport
   * @param {HTMLElement|string} target - Element or selector
   * @returns {boolean} True if in viewport
   */
  isInViewport(target) {
    const element = this.getElement(target);
    if (!element) return false;

    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }
}

// Create singleton instance
const domHelper = new DOMHelper();

export default domHelper;