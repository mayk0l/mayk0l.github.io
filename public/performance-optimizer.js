// Performance Optimization and Web Vitals Monitoring
// This script optimizes Core Web Vitals and provides performance insights

class PerformanceOptimizer {
  constructor() {
    this.vitals = {
      lcp: null,
      fid: null,
      cls: null,
      ttfb: null,
      fcp: null
    };
    
    this.init();
  }

  init() {
    this.setupWebVitalsMonitoring();
    this.optimizeImageLoading();
    this.setupPreloadOptimizations();
    this.setupServiceWorker();
    this.optimizeResourceHints();
  }

  // Monitor Core Web Vitals
  setupWebVitalsMonitoring() {
    if ('PerformanceObserver' in window) {
      // Largest Contentful Paint (LCP)
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          this.vitals.lcp = lastEntry.startTime;
          this.reportVital('LCP', lastEntry.startTime);
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      } catch (e) {
        console.warn('LCP monitoring not supported');
      }

      // Cumulative Layout Shift (CLS)
      try {
        let clsValue = 0;
        const clsObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          }
          this.vitals.cls = clsValue;
          this.reportVital('CLS', clsValue);
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });
      } catch (e) {
        console.warn('CLS monitoring not supported');
      }

      // First Input Delay (FID)
      try {
        const fidObserver = new PerformanceObserver((list) => {
          const firstInput = list.getEntries()[0];
          if (firstInput) {
            this.vitals.fid = firstInput.processingStart - firstInput.startTime;
            this.reportVital('FID', this.vitals.fid);
          }
        });
        fidObserver.observe({ entryTypes: ['first-input'] });
      } catch (e) {
        console.warn('FID monitoring not supported');
      }

      // Time to First Byte (TTFB)
      try {
        const navigationObserver = new PerformanceObserver((list) => {
          const navigation = list.getEntries()[0];
          if (navigation) {
            this.vitals.ttfb = navigation.responseStart - navigation.requestStart;
            this.reportVital('TTFB', this.vitals.ttfb);
          }
        });
        navigationObserver.observe({ entryTypes: ['navigation'] });
      } catch (e) {
        console.warn('TTFB monitoring not supported');
      }
    }
  }

  // Report vital metrics
  reportVital(name, value) {
    console.log(`${name}: ${value}ms`);
    
    // Send to analytics if available
    if (typeof gtag !== 'undefined') {
      gtag('event', 'web_vitals', {
        event_category: 'Performance',
        event_label: name,
        value: Math.round(value),
        non_interaction: true,
      });
    }
  }

  // Optimize image loading
  optimizeImageLoading() {
    // Enhanced intersection observer for images
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            this.loadImage(img);
            imageObserver.unobserve(img);
          }
        });
      }, {
        rootMargin: '50px 0px',
        threshold: 0.01
      });

      // Observe all images with data-src
      document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
      });

      // Observe lazy images
      document.querySelectorAll('.lazy-image').forEach(img => {
        imageObserver.observe(img);
      });
    }
  }

  // Load image with optimization
  loadImage(img) {
    const src = img.dataset.src || img.src;
    
    // Create new image for preloading
    const newImg = new Image();
    
    newImg.onload = () => {
      img.src = newImg.src;
      img.classList.remove('lazy-image');
      img.classList.add('loaded');
      img.removeAttribute('data-src');
    };
    
    newImg.onerror = () => {
      img.classList.add('error');
    };
    
    newImg.src = src;
  }

  // Setup preload optimizations
  setupPreloadOptimizations() {
    // Preload critical resources
    this.preloadCriticalAssets();
    
    // Prefetch likely navigation targets
    this.setupPrefetch();
  }

  preloadCriticalAssets() {
    const criticalResources = [
      { href: '/favicon.ico', as: 'image' },
      // Add more critical resources here
    ];

    criticalResources.forEach(resource => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = resource.href;
      link.as = resource.as;
      document.head.appendChild(link);
    });
  }

  setupPrefetch() {
    // Prefetch on hover for likely navigation
    document.addEventListener('mouseover', (e) => {
      const link = e.target.closest('a[href]');
      if (link && link.href && !link.dataset.prefetched) {
        this.prefetchPage(link.href);
        link.dataset.prefetched = 'true';
      }
    });
  }

  prefetchPage(url) {
    if (url.startsWith(window.location.origin)) {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = url;
      document.head.appendChild(link);
    }
  }

  // Setup service worker for caching
  setupServiceWorker() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('Service Worker registered successfully');
        })
        .catch(error => {
          console.log('Service Worker registration failed');
        });
    }
  }

  // Optimize resource hints
  optimizeResourceHints() {
    // Add DNS prefetch for external domains
    const externalDomains = [
      'fonts.googleapis.com',
      'fonts.gstatic.com',
      'www.google-analytics.com',
      'www.googletagmanager.com'
    ];

    externalDomains.forEach(domain => {
      const link = document.createElement('link');
      link.rel = 'dns-prefetch';
      link.href = `//${domain}`;
      document.head.appendChild(link);
    });
  }

  // Get performance report
  getPerformanceReport() {
    return {
      vitals: this.vitals,
      navigationTiming: performance.getEntriesByType('navigation')[0],
      resourceTiming: performance.getEntriesByType('resource').slice(0, 20),
      memory: performance.memory ? {
        usedJSHeapSize: performance.memory.usedJSHeapSize,
        totalJSHeapSize: performance.memory.totalJSHeapSize,
        jsHeapSizeLimit: performance.memory.jsHeapSizeLimit
      } : null
    };
  }
}

// Social Media Integration
class SocialIntegration {
  constructor() {
    this.init();
  }

  init() {
    this.setupSocialShare();
    this.trackSocialEngagement();
  }

  setupSocialShare() {
    // Enhanced social sharing
    document.addEventListener('click', (e) => {
      const shareButton = e.target.closest('[data-social-share]');
      if (shareButton) {
        e.preventDefault();
        this.handleSocialShare(shareButton);
      }
    });
  }

  handleSocialShare(button) {
    const platform = button.dataset.socialShare;
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(document.title);
    const description = encodeURIComponent(
      document.querySelector('meta[name="description"]')?.content || ''
    );

    let shareUrl = '';
    
    switch (platform) {
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}&title=${title}&summary=${description}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}&via=mayk0ldev`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${title}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${title}%20${url}`;
        break;
    }

    if (shareUrl) {
      // Track social share
      this.trackSocialAction('share', platform);
      
      // Open share window
      window.open(shareUrl, '_blank', 'width=600,height=400,scrollbars=yes,resizable=yes');
    }
  }

  trackSocialEngagement() {
    // Track social interactions
    document.addEventListener('click', (e) => {
      const socialLink = e.target.closest('a[href*="linkedin.com"], a[href*="twitter.com"], a[href*="facebook.com"], a[href*="wa.me"]');
      if (socialLink) {
        const platform = this.getPlatformFromUrl(socialLink.href);
        this.trackSocialAction('click', platform);
      }
    });
  }

  getPlatformFromUrl(url) {
    if (url.includes('linkedin.com')) return 'linkedin';
    if (url.includes('twitter.com') || url.includes('x.com')) return 'twitter';
    if (url.includes('facebook.com')) return 'facebook';
    if (url.includes('wa.me') || url.includes('whatsapp.com')) return 'whatsapp';
    return 'unknown';
  }

  trackSocialAction(action, platform) {
    // Send to Google Analytics
    if (typeof gtag !== 'undefined') {
      gtag('event', action, {
        event_category: 'Social',
        event_label: platform,
        non_interaction: false,
      });
    }

    console.log(`Social ${action}: ${platform}`);
  }
}

// Initialize optimizations when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new PerformanceOptimizer();
    new SocialIntegration();
  });
} else {
  new PerformanceOptimizer();
  new SocialIntegration();
}

// Expose performance report for debugging
window.getPerformanceReport = () => {
  return window.performanceOptimizer?.getPerformanceReport() || {};
};

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { PerformanceOptimizer, SocialIntegration };
}
