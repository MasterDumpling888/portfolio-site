/* ========================================
   Configuration
   Application-wide configuration constants
   ======================================== */

export const CONFIG = {
  // API endpoints (if needed in future)
  api: {
    base: '',
  },

  // Data file paths
  data: {
    content: './data/content.json',
    projects: './data/projects.json',
    skills: './data/skills.json',
  },

  // Theme configuration
  theme: {
    default: 'dark',
    storageKey: 'portfolio-theme',
    attribute: 'data-theme',
  },

  // Animation configuration
  animation: {
    scrollRevealThreshold: 0.15,
    scrollRevealDelay: 100,
  },

  // Breakpoints (for JavaScript)
  breakpoints: {
    mobile: 480,
    tablet: 768,
    desktop: 1024,
    wide: 1280,
  },

  // Navigation
  navigation: {
    mobileBreakpoint: 768,
  },

  // Projects
  projects: {
    featuredCount: 3,
    filters: ['all', 'webdev', 'ai', 'fintech', 'medtech'],
  },

  // Contact
  contact: {
    email: 'your.email@example.com',
    github: 'https://github.com/yourusername',
    linkedin: 'https://linkedin.com/in/yourusername',
    twitter: 'https://twitter.com/yourusername',
  },

  // Debug mode
  debug: true,

  // Cache control (set to false during development to always fetch fresh data)
  useCache: false,
};

// Helper function to get current breakpoint
export function getCurrentBreakpoint() {
  const width = window.innerWidth;
  if (width < CONFIG.breakpoints.mobile) return 'mobile';
  if (width < CONFIG.breakpoints.tablet) return 'tablet';
  if (width < CONFIG.breakpoints.desktop) return 'desktop';
  return 'wide';
}

// Helper function to check if mobile
export function isMobile() {
  return window.innerWidth < CONFIG.breakpoints.tablet;
}

// Log helper for debugging
export function log(...args) {
  if (CONFIG.debug) {
    console.log('[Portfolio]', ...args);
  }
}

// Error log helper
export function logError(...args) {
  if (CONFIG.debug) {
    console.error('[Portfolio Error]', ...args);
  }
}