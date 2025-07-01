// Configuración específica para móviles
export const mobileConfig = {
  // Detectar si es dispositivo móvil
  isMobile: () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  },
  
  // Configuración de viewport para móviles
  setupMobileViewport: () => {
    if (mobileConfig.isMobile()) {
      // Prevenir zoom en inputs
      const viewport = document.querySelector('meta[name="viewport"]');
      if (viewport) {
        viewport.setAttribute('content', 
          'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'
        );
      }
      
      // Agregar clase CSS para móviles
      document.documentElement.classList.add('mobile-device');
    }
  },
  
  // Manejo de navegación para móviles
  setupMobileNavigation: () => {
    if (mobileConfig.isMobile()) {
      // Interceptar clics en enlaces para debug
      document.addEventListener('click', (e) => {
        const link = e.target.closest('a[href^="/"]');
        if (link) {
          console.log('Mobile navigation to:', link.href);
          
          // Verificar conectividad antes de navegar
          if (!navigator.onLine) {
            e.preventDefault();
            console.warn('Sin conexión - navegación cancelada');
            return;
          }
        }
      });
      
      // Manejar eventos de conectividad
      window.addEventListener('online', () => {
        console.log('Conexión restaurada en móvil');
      });
      
      window.addEventListener('offline', () => {
        console.log('Conexión perdida en móvil');
      });
    }
  },
  
  // Debug específico para móviles
  setupMobileDebug: () => {
    if (mobileConfig.isMobile() && window.location.hostname === 'localhost') {
      // Mostrar información de debug en móvil
      const debugInfo = document.createElement('div');
      debugInfo.style.cssText = `
        position: fixed;
        top: 0;
        right: 0;
        background: rgba(0,0,0,0.8);
        color: white;
        padding: 5px;
        font-size: 10px;
        z-index: 9999;
        max-width: 200px;
        word-break: break-all;
      `;
      
      const updateDebugInfo = () => {
        debugInfo.innerHTML = `
          URL: ${window.location.pathname}<br>
          Online: ${navigator.onLine}<br>
          SW: ${'serviceWorker' in navigator}<br>
          Time: ${new Date().toLocaleTimeString()}
        `;
      };
      
      updateDebugInfo();
      setInterval(updateDebugInfo, 1000);
      document.body.appendChild(debugInfo);
    }
  }
};

// Auto-inicializar en DOMContentLoaded
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    mobileConfig.setupMobileViewport();
    mobileConfig.setupMobileNavigation();
    mobileConfig.setupMobileDebug();
  });
}
