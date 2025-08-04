// Performance utilities module
export const PerformanceUtils = {
    // Debounce function for performance optimization
    debounce(func, wait, immediate) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                timeout = null;
                if (!immediate) func(...args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func(...args);
        };
    },

    // Throttle function for scroll/resize events
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    // Intersection Observer for lazy loading
    createIntersectionObserver(callback, options = {}) {
        const defaultOptions = {
            root: null,
            rootMargin: '50px',
            threshold: 0.1
        };
        
        return new IntersectionObserver(callback, { ...defaultOptions, ...options });
    },

    // Memory usage monitoring
    getMemoryUsage() {
        if ('memory' in performance) {
            return {
                used: Math.round(performance.memory.usedJSHeapSize / 1048576),
                total: Math.round(performance.memory.totalJSHeapSize / 1048576),
                limit: Math.round(performance.memory.jsHeapSizeLimit / 1048576)
            };
        }
        return null;
    },

    // Performance timing
    measurePerformance(name, fn) {
        const startTime = performance.now();
        const result = fn();
        const endTime = performance.now();
        console.log(`${name} took ${endTime - startTime} milliseconds`);
        return result;
    },

    // Web Vitals monitoring
    measureWebVitals() {
        if ('PerformanceObserver' in window) {
            // Largest Contentful Paint
            new PerformanceObserver((entryList) => {
                const entries = entryList.getEntries();
                const lastEntry = entries[entries.length - 1];
                console.log('LCP:', lastEntry.startTime);
            }).observe({ entryTypes: ['largest-contentful-paint'] });

            // First Input Delay
            new PerformanceObserver((entryList) => {
                const entries = entryList.getEntries();
                entries.forEach((entry) => {
                    console.log('FID:', entry.processingStart - entry.startTime);
                });
            }).observe({ entryTypes: ['first-input'] });

            // Cumulative Layout Shift
            new PerformanceObserver((entryList) => {
                let cumulativeScore = 0;
                const entries = entryList.getEntries();
                entries.forEach((entry) => {
                    if (!entry.hadRecentInput) {
                        cumulativeScore += entry.value;
                    }
                });
                console.log('CLS:', cumulativeScore);
            }).observe({ entryTypes: ['layout-shift'] });
        }
    }
};

// Cache manager for better resource management
export const CacheManager = {
    cache: new Map(),
    maxSize: 50,

    set(key, value, ttl = 300000) { // 5 minutes default TTL
        if (this.cache.size >= this.maxSize) {
            const firstKey = this.cache.keys().next().value;
            this.cache.delete(firstKey);
        }

        this.cache.set(key, {
            value,
            timestamp: Date.now(),
            ttl
        });
    },

    get(key) {
        const item = this.cache.get(key);
        if (!item) return null;

        if (Date.now() - item.timestamp > item.ttl) {
            this.cache.delete(key);
            return null;
        }

        return item.value;
    },

    clear() {
        this.cache.clear();
    },

    size() {
        return this.cache.size;
    }
};

// Image optimization utilities
export const ImageUtils = {
    // Create optimized image element with loading states
    createOptimizedImage(src, alt, options = {}) {
        const img = document.createElement('img');
        img.alt = alt;
        img.loading = 'lazy';
        img.decoding = 'async';
        
        if (options.sizes) img.sizes = options.sizes;
        if (options.srcset) img.srcset = options.srcset;
        
        // Add loading placeholder
        img.style.backgroundColor = '#f0f0f0';
        img.style.minHeight = '200px';
        
        img.onload = () => {
            img.style.backgroundColor = 'transparent';
            img.style.minHeight = 'auto';
        };
        
        img.src = src;
        return img;
    },

    // Convert image to WebP if supported
    getOptimalImageFormat(src) {
        const supportsWebP = (() => {
            const canvas = document.createElement('canvas');
            return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
        })();

        if (supportsWebP && src.includes('.jpg') || src.includes('.png')) {
            return src.replace(/\.(jpg|png)$/, '.webp');
        }
        
        return src;
    }
};

// Analytics and tracking utilities
export const Analytics = {
    // Track user interactions
    trackEvent(action, category = 'User Interaction', label = '') {
        if ('gtag' in window) {
            gtag('event', action, {
                event_category: category,
                event_label: label
            });
        }
        
        console.log(`Event tracked: ${category} - ${action} - ${label}`);
    },

    // Track page performance
    trackPerformance() {
        window.addEventListener('load', () => {
            setTimeout(() => {
                const navigation = performance.getEntriesByType('navigation')[0];
                const paint = performance.getEntriesByType('paint');
                
                const metrics = {
                    dom_content_loaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
                    load_complete: navigation.loadEventEnd - navigation.loadEventStart,
                    first_paint: paint.find(p => p.name === 'first-paint')?.startTime,
                    first_contentful_paint: paint.find(p => p.name === 'first-contentful-paint')?.startTime
                };
                
                console.log('Performance Metrics:', metrics);
                
                // Send to analytics if available
                if ('gtag' in window) {
                    Object.entries(metrics).forEach(([key, value]) => {
                        if (value) {
                            gtag('event', 'timing_complete', {
                                name: key,
                                value: Math.round(value)
                            });
                        }
                    });
                }
            }, 1000);
        });
    }
};
