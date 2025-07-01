// Configuración de performance y Core Web Vitals
export const performanceConfig = {
  // Preload de recursos críticos
  criticalResources: [
    { href: '/logo.svg', as: 'image', type: 'image/svg+xml' },
    { href: '/favicon.svg', as: 'image', type: 'image/svg+xml' }
  ],
  
  // DNS Prefetch para dominios externos
  dnsPrefetch: [
    '//fonts.googleapis.com',
    '//fonts.gstatic.com',
    '//github.com',
    '//linkedin.com',
    '//twitter.com',
    '//www.googletagmanager.com'
  ],
  
  // Preconnect para recursos críticos externos
  preconnect: [
    { href: 'https://fonts.googleapis.com' },
    { href: 'https://fonts.gstatic.com', crossorigin: true }
  ],
  
  // Service Worker configuration
  serviceWorker: {
    enabled: true,
    path: '/sw.js'
  },
  
  // Compression settings
  compression: {
    brotli: true,
    gzip: true
  },
  
  // Image optimization
  images: {
    formats: ['webp', 'jpg', 'png'],
    sizes: [400, 800, 1200],
    quality: 80,
    lazyLoading: true
  }
};

export default performanceConfig;
