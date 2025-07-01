// Script de debugging para móviles
(function() {
  'use strict';
  
  // Detectar si es móvil
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  if (isMobile) {
    console.log('Dispositivo móvil detectado');
    
    // Debug de navegación
    document.addEventListener('DOMContentLoaded', () => {
      const links = document.querySelectorAll('a[href^="/"]');
      links.forEach(link => {
        link.addEventListener('click', (e) => {
          console.log('Link clicked:', link.href);
          // Verificar si el enlace funciona
          fetch(link.href, { method: 'HEAD' })
            .then(response => {
              console.log('Link status:', response.status, link.href);
            })
            .catch(error => {
              console.error('Link error:', error, link.href);
            });
        });
      });
    });
    
    // Debug de Service Worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(registrations => {
        console.log('SW registrations:', registrations.length);
        registrations.forEach(reg => {
          console.log('SW state:', reg.active?.state, reg.scope);
        });
      });
      
      // Monitorear errores del SW
      navigator.serviceWorker.addEventListener('error', (error) => {
        console.error('SW error:', error);
      });
    }
    
    // Debug de errores de red
    window.addEventListener('online', () => console.log('Conexión restaurada'));
    window.addEventListener('offline', () => console.log('Conexión perdida'));
    
    // Debug de performance
    window.addEventListener('load', () => {
      setTimeout(() => {
        const perfData = performance.getEntriesByType('navigation')[0];
        console.log('Load time:', perfData.loadEventEnd - perfData.fetchStart, 'ms');
      }, 0);
    });
  }
})();
