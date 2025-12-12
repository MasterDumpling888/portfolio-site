/* ========================================
   Configuration
   Global configuration constants
   ======================================== */

export const CONFIG = {
  // Site Information
  site: {
    name: '[Your Name]',
    title: 'Portfolio',
    description: 'Computer Science Student specializing in Web Development, AI/ML, FinTech, and MedTech',
  },

  // API Endpoints (if needed in future)
  api: {
    baseUrl: '',
  },

  // Data Paths
  data: {
    content: './data/content.json',
    projects: './data/projects.json',
    skills: './data/skills.json',
  },

  // Theme Settings
  theme: {
    default: 'dark',
    storageKey: 'portfolio-theme',
  },

  // Animation Settings
  animations: {
    scrollRevealThreshold: 0.15, // Percentage of element visible before reveal
    scrollRevealDelay: 100, // Delay between multiple reveals (ms)
  },

  // Project Filters
  projectFilters: {
    all: 'all',
    webdev: 'webdev',
    ai: 'ai',
    fintech: 'fintech',
    medtech: 'medtech',
  },

  // Skill Categories
  skillCategories: {
    webdev: 'Web Development',
    aiml: 'AI & Machine Learning',
    backend: 'Backend & Databases',
    tools: 'Tools & DevOps',
    domain: 'Domain Expertise',
  },

  // Featured Projects Limit (for home page)
  featuredProjectsLimit: 3,

  // Breakpoints (for reference in JS)
  breakpoints: {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    xxl: 1536,
  },

  // Social Links
  social: {
    github: 'https://github.com/yourusername',
    linkedin: 'https://linkedin.com/in/yourusername',
    twitter: 'https://twitter.com/yourusername',
    email: 'your.email@example.com',
  },

  // Contact
  contact: {
    email: 'your.email@example.com',
    availableForWork: true,
    responseTime: '24-48 hours',
  },

  // Assets
  assets: {
    logo: './assets/images/logo.png',
    resume: './assets/resume/resume.pdf',
    projectImagesPath: './assets/images/projects/',
  },
};