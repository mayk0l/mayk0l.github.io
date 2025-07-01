// Configuración de Analytics
// Actualiza estos valores con tus códigos reales

export const analyticsConfig = {
  // Google Analytics GA4
  gtag: 'G-XXXXXXXXXX', // Reemplaza con tu código real
  gtagEnabled: false, // Cambiar a true cuando tengas el código
  
  // Google Search Console
  searchConsoleEnabled: true, // ✅ Activado
  searchConsoleCode: 'ztdU9J4T8QvuvURI-7jqUtZPacWSXTV5w4Qn9v-NmmQ', // ✅ Código de verificación correcto
  
  // Bing Webmaster Tools (opcional)
  bingWebmasterCode: 'tu-codigo-bing', // Reemplaza con tu código real si lo usas
  
  // Hotjar (opcional) - Para heatmaps y grabaciones de sesiones
  hotjarId: '', // Reemplaza con tu ID de Hotjar si lo usas
  
  // Microsoft Clarity (opcional) - Alternativa gratuita a Hotjar
  microsoftClarityId: '', // Reemplaza con tu ID de Clarity si lo usas
};

// Configuración por ambiente
export const getAnalyticsConfig = (isDev = false) => {
  // En desarrollo, desactiva analytics por defecto
  if (isDev) {
    return {
      ...analyticsConfig,
      gtagEnabled: false,
      searchConsoleEnabled: false,
    };
  }
  
  return analyticsConfig;
};

export default analyticsConfig;
