/* ========================================
   AnimationHelper Utility
   Animation and scroll reveal utilities
   ======================================== */

import { CONFIG } from '../config.js';
import domHelper from './DOMHelper.js';

class AnimationHelper {
  constructor() {
    this.observers = new Map();
  }

  /**
   * Set up scroll reveal animations
   * @param {string} selector - CSS selector for elements to reveal
   * @param {Object} options - IntersectionObserver options
   * @param {function} callback - Custom callback (optional)
   * @returns {IntersectionObserver} Observer instance
   */
  setupScrollReveal(selector = '.scroll-reveal', options = {}, callback = null) {
    const defaultOptions = {
      threshold: CONFIG.animation.scrollRevealThreshold || 0.15,
      rootMargin: '0px 0px -50px 0px'
    };

    const observerOptions = { ...defaultOptions, ...options };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          // Add delay based on index for staggered effect
          setTimeout(() => {
            entry.target.classList.add('revealed');

            // Custom callback
            if (callback) {
              callback(entry.target, index);
            }
          }, index * (CONFIG.animation.scrollRevealDelay || 100));

          // Stop observing once revealed
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observe all matching elements
    const elements = domHelper.$$(selector);
    elements.forEach(el => observer.observe(el));

    // Store observer for cleanup
    this.observers.set(selector, observer);

    return observer;
  }

  /**
   * Animate element entrance
   * @param {HTMLElement|string} target - Element or selector
   * @param {string} animation - Animation class name
   * @param {number} delay - Delay in ms
   */
  animateIn(target, animation = 'animate-fade-in', delay = 0) {
    const element = domHelper.getElement(target);
    if (!element) return;

    setTimeout(() => {
      element.classList.add(animation);
    }, delay);
  }

  /**
   * Stagger animations for multiple elements
   * @param {NodeList|Array|string} targets - Elements or selector
   * @param {string} animation - Animation class name
   * @param {number} staggerDelay - Delay between each element (ms)
   */
  staggerIn(targets, animation = 'animate-fade-in-up', staggerDelay = 100) {
    const elements = domHelper.getElements(targets);

    elements.forEach((el, index) => {
      setTimeout(() => {
        el.classList.add(animation);
      }, index * staggerDelay);
    });
  }

  /**
   * Fade in element
   * @param {HTMLElement|string} target - Element or selector
   * @param {number} duration - Duration in ms
   */
  fadeIn(target, duration = 300) {
    const element = domHelper.getElement(target);
    if (!element) return;

    element.style.opacity = '0';
    element.style.display = '';
    element.classList.remove('hidden');

    setTimeout(() => {
      element.style.transition = `opacity ${duration}ms ease`;
      element.style.opacity = '1';
    }, 10);
  }

  /**
   * Fade out element
   * @param {HTMLElement|string} target - Element or selector
   * @param {number} duration - Duration in ms
   * @param {boolean} hide - Whether to hide after fade out
   */
  fadeOut(target, duration = 300, hide = true) {
    const element = domHelper.getElement(target);
    if (!element) return;

    element.style.transition = `opacity ${duration}ms ease`;
    element.style.opacity = '0';

    if (hide) {
      setTimeout(() => {
        element.classList.add('hidden');
      }, duration);
    }
  }

  /**
   * Slide down element
   * @param {HTMLElement|string} target - Element or selector
   * @param {number} duration - Duration in ms
   */
  slideDown(target, duration = 300) {
    const element = domHelper.getElement(target);
    if (!element) return;

    element.style.display = '';
    element.classList.remove('hidden');
    const height = element.scrollHeight;

    element.style.height = '0';
    element.style.overflow = 'hidden';
    element.style.transition = `height ${duration}ms ease`;

    setTimeout(() => {
      element.style.height = `${height}px`;
    }, 10);

    setTimeout(() => {
      element.style.height = '';
      element.style.overflow = '';
    }, duration + 10);
  }

  /**
   * Slide up element
   * @param {HTMLElement|string} target - Element or selector
   * @param {number} duration - Duration in ms
   */
  slideUp(target, duration = 300) {
    const element = domHelper.getElement(target);
    if (!element) return;

    const height = element.scrollHeight;

    element.style.height = `${height}px`;
    element.style.overflow = 'hidden';
    element.style.transition = `height ${duration}ms ease`;

    setTimeout(() => {
      element.style.height = '0';
    }, 10);

    setTimeout(() => {
      element.classList.add('hidden');
      element.style.height = '';
      element.style.overflow = '';
    }, duration + 10);
  }

  /**
   * Animate number counter
   * @param {HTMLElement|string} target - Element or selector
   * @param {number} end - End number
   * @param {number} duration - Duration in ms
   * @param {number} start - Start number (default: 0)
   */
  countUp(target, end, duration = 2000, start = 0) {
    const element = domHelper.getElement(target);
    if (!element) return;

    const range = end - start;
    const increment = range / (duration / 16); // 60fps
    let current = start;

    const timer = setInterval(() => {
      current += increment;

      if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
        current = end;
        clearInterval(timer);
      }

      element.textContent = Math.round(current);
    }, 16);
  }

  /**
   * Add parallax effect to element
   * @param {HTMLElement|string} target - Element or selector
   * @param {number} speed - Parallax speed (0-1, lower is slower)
   */
  parallax(target, speed = 0.5) {
    const element = domHelper.getElement(target);
    if (!element) return;

    const handleScroll = () => {
      const scrolled = window.pageYOffset;
      const offset = element.offsetTop;
      const distance = scrolled - offset;

      element.style.transform = `translateY(${distance * speed}px)`;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Return cleanup function
    return () => window.removeEventListener('scroll', handleScroll);
  }

  /**
   * Add hover tilt effect
   * @param {HTMLElement|string} target - Element or selector
   * @param {number} max - Maximum tilt angle
   */
  tiltEffect(target, max = 10) {
    const element = domHelper.getElement(target);
    if (!element) return;

    const handleMouseMove = (e) => {
      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * max;
      const rotateY = ((centerX - x) / centerX) * max;

      element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    };

    const handleMouseLeave = () => {
      element.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
    };

    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseleave', handleMouseLeave);

    // Return cleanup function
    return () => {
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }

  /**
   * Cleanup all observers
   */
  cleanup() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers.clear();
  }

  /**
   * Check if reduced motion is preferred
   * @returns {boolean} True if user prefers reduced motion
   */
  prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  /**
   * Run animation only if motion is not reduced
   * @param {function} animationFn - Animation function to run
   */
  respectMotionPreference(animationFn) {
    if (!this.prefersReducedMotion()) {
      animationFn();
    }
  }
}

// Create singleton instance
const animationHelper = new AnimationHelper();

export default animationHelper;