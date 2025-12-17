/* ========================================
   DataLoader Utility
   Handles loading JSON data files
   ======================================== */

import { log, logError } from '../config.js';

class DataLoader {
  constructor() {
    this.cache = new Map();
    this.loading = new Map();
  }

  /**
   * Load JSON data from a file
   * @param {string} url - URL to JSON file
   * @param {boolean} useCache - Whether to use cached data
   * @returns {Promise<Object>} Parsed JSON data
   */
  async load(url, useCache = true) {
    // Return cached data if available
    if (useCache && this.cache.has(url)) {
      log(`Loading from cache: ${url}`);
      return this.cache.get(url);
    }

    // If already loading, wait for existing request
    if (this.loading.has(url)) {
      log(`Already loading: ${url}`);
      return this.loading.get(url);
    }

    // Create new loading promise
    const loadPromise = this.fetchJSON(url);
    this.loading.set(url, loadPromise);

    try {
      const data = await loadPromise;

      // Cache the data
      if (useCache) {
        this.cache.set(url, data);
      }

      this.loading.delete(url);
      log(`Loaded successfully: ${url}`);

      return data;
    } catch (error) {
      this.loading.delete(url);
      throw error;
    }
  }

  /**
   * Fetch JSON from URL
   * @param {string} url - URL to fetch
   * @returns {Promise<Object>} Parsed JSON
   */
  async fetchJSON(url) {
    try {
      log(`Fetching: ${url}`);

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      logError(`Failed to load ${url}:`, error);
      throw error;
    }
  }

  /**
   * Load multiple JSON files in parallel
   * @param {string[]} urls - Array of URLs
   * @param {boolean} useCache - Whether to use cached data
   * @returns {Promise<Object[]>} Array of parsed JSON data
   */
  async loadMultiple(urls, useCache = true) {
    try {
      const promises = urls.map(url => this.load(url, useCache));
      const results = await Promise.all(promises);

      log(`Loaded ${urls.length} files successfully`);
      return results;
    } catch (error) {
      logError('Failed to load multiple files:', error);
      throw error;
    }
  }

  /**
   * Clear cache for a specific URL or all cache
   * @param {string} url - URL to clear (optional, clears all if not provided)
   */
  clearCache(url = null) {
    if (url) {
      this.cache.delete(url);
      log(`Cache cleared for: ${url}`);
    } else {
      this.cache.clear();
      log('All cache cleared');
    }
  }

  /**
   * Get cached data without loading
   * @param {string} url - URL to get from cache
   * @returns {Object|null} Cached data or null
   */
  getCached(url) {
    return this.cache.get(url) || null;
  }

  /**
   * Check if data is cached
   * @param {string} url - URL to check
   * @returns {boolean} True if cached
   */
  isCached(url) {
    return this.cache.has(url);
  }

  /**
   * Check if data is currently loading
   * @param {string} url - URL to check
   * @returns {boolean} True if loading
   */
  isLoading(url) {
    return this.loading.has(url);
  }

  /**
   * Preload data files
   * @param {string[]} urls - URLs to preload
   */
  async preload(urls) {
    log(`Preloading ${urls.length} files...`);

    try {
      await this.loadMultiple(urls, true);
      log('Preload complete');
    } catch (error) {
      logError('Preload failed:', error);
    }
  }

  /**
   * Reload data (bypasses cache)
   * @param {string} url - URL to reload
   * @returns {Promise<Object>} Fresh data
   */
  async reload(url) {
    this.clearCache(url);
    return this.load(url, false);
  }
}

// Create singleton instance
const dataLoader = new DataLoader();

export default dataLoader;