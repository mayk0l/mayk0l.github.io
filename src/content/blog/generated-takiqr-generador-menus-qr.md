---
title: "TakiQR: creando un generador de menús QR en tiempo récord"
description: "Cómo desarrollé TakiQR, una herramienta simple para generar menús digitales con códigos QR, usando Astro y TailwindCSS."
date: 2025-07-01T11:41:22.064Z
author: "Maykol Salgado"
tags: ["astro", "typescript", "qr", "restaurantes", "mvp"]
coverImage: ""
---

# TakiQR: creando un generador de menús QR en tiempo récord

Durante la pandemia, los códigos QR se volvieron esenciales para los restaurantes. Pero muchos negocios pequeños seguían imprimiendo menús físicos o pagando mensualidades por plataformas complejas que no necesitaban.

**TakiQR** nació como una solución: **genera menús QR simples, rápidos y efectivos en minutos**.

## El desafío: rapidez sin sacrificar calidad

### Objetivos del proyecto:
- **Desarrollo rápido:** MVP funcional en 2 semanas
- **Cero fricción:** Sin registros complicados
- **Responsive:** Perfecto en cualquier dispositivo
- **Accesible:** Fácil de usar para cualquier restaurante

### Stack elegido para velocidad:
- **Astro:** Generación estática ultra-rápida
- **TypeScript:** Tipado fuerte para menos errores
- **TailwindCSS:** Estilado rápido y consistente
- **Vercel:** Deploy automático desde GitHub

## ¿Por qué Astro para este proyecto?

### Ventajas que aproveché:

**1. Generación estática por defecto**
```astro
---
// src/pages/menu/[id].astro
export async function getStaticPaths() {
  // Los menús se generan como páginas estáticas
  const menus = await getMenus();
  return menus.map(menu => ({
    params: { id: menu.id },
    props: { menu }
  }));
}
---
```

**2. Islands Architecture**
```astro
<!-- Solo las partes interactivas usan JavaScript -->
<MenuEditor client:load />
<QRGenerator client:only="vanilla" />
<!-- El resto es HTML estático = súper rápido -->
```

**3. Integración perfecta con APIs**
```typescript
// src/utils/qr-generator.ts
import QRCode from 'qrcode';

export async function generateQR(menuUrl: string): Promise<string> {
  return await QRCode.toDataURL(menuUrl, {
    width: 300,
    margin: 2,
    color: {
      dark: '#000000',
      light: '#FFFFFF'
    }
  });
}
```

## Características implementadas

### 1. Generador de QR instantáneo
```typescript
interface MenuData {
  restaurante: string;
  items: MenuItem[];
  color: string;
  logo?: string;
}

interface MenuItem {
  nombre: string;
  descripcion: string;
  precio: number;
  categoria: string;
  disponible: boolean;
}
```

### 2. Diseño adaptativo
```css
/* TailwindCSS para responsive design */
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {menu.items.map(item => (
    <div class="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
      <h3 class="font-bold text-lg text-gray-800">{item.nombre}</h3>
      <p class="text-gray-600 text-sm mb-2">{item.descripcion}</p>
      <span class="text-xl font-semibold text-green-600">${item.precio}</span>
    </div>
  ))}
</div>
```

### 3. Customización visual
- Colores de marca
- Upload de logos
- Tipografías personalizadas
- Temas predefinidos

## Optimizaciones técnicas implementadas

### 1. Imágenes optimizadas
```astro
---
import { Image } from 'astro:assets';
---

<Image 
  src={menuItem.imagen} 
  alt={menuItem.nombre}
  width={300}
  height={200}
  format="webp"
  loading="lazy"
/>
```

### 2. Critical CSS inline
```astro
---
// Astro automáticamente inline el CSS crítico
const criticalCSS = await Astro.glob('../styles/critical.css');
---
<style is:inline>{criticalCSS}</style>
```

### 3. Preload de recursos críticos
```astro
<head>
  <link rel="preload" href="/fonts/inter.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="/images/hero.webp" as="image">
</head>
```

## Resultados de performance

### Lighthouse Score:
- **Performance:** 98/100
- **Accessibility:** 100/100
- **Best Practices:** 100/100
- **SEO:** 100/100

### Métricas reales:
- **LCP:** 0.8s (Excellent)
- **FID:** <100ms (Good)
- **CLS:** 0.02 (Good)

## Casos de uso reales

### Testimonios de usuarios:

> "En 10 minutos tenía mi menú digital funcionando. Mis clientes lo aman" - Restaurant El Fogón

> "Perfecto para mi cafetería. Simple y se ve profesional" - Café Luna

> "Exactamente lo que necesitaba, sin complicaciones" - Pizzería Don Carlos

### Métricas de adopción:
- **250+ menús generados** en primeros 3 meses
- **95% de satisfacción** en encuestas
- **0.3s tiempo promedio** de carga de menús

## Lecciones aprendidas

### 1. Astro es perfecto para contenido estático
La velocidad de desarrollo y performance son insuperables para proyectos que no requieren mucha interactividad del lado cliente.

### 2. MVP bien definido = éxito rápido
Resistir la tentación de agregar funciones innecesarias permitió lanzar rápido y iterar basado en feedback real.

### 3. TailwindCSS acelera el desarrollo UI
Especialmente útil para MVPs donde necesitas UI decente rápidamente.

### 4. La simplicidad es una feature
Los usuarios valoraron más la simplicidad que funciones avanzadas.

## Próximas funcionalidades

### En desarrollo:
- Editor visual drag & drop
- Integración con sistemas POS
- Analytics básicos de visualizaciones
- Múltiples idiomas

### Solicitadas por usuarios:
- Menús por horarios (desayuno/almuerzo/cena)
- Promociones y descuentos
- Integración con WhatsApp para pedidos
- Modo offline

## El stack perfecto para MVPs

**TakiQR me demostró que Astro + TypeScript + TailwindCSS es una combinación letal para:**
- Prototipos rápidos
- Landing pages
- Sitios de contenido
- Aplicaciones con poca interactividad

**Performance nativo + Developer Experience excelente = Combo ganador**

## Conclusión

TakiQR es prueba de que **no siempre necesitas el framework más complejo para resolver problemas reales**. A veces, la tecnología más simple y directa es la mejor opción.

El proyecto me recordó la importancia de:
- **Validar la idea rápidamente**
- **Elegir el stack correcto para el problema**
- **Priorizar performance desde el día uno**
- **Escuchar al usuario final**

---

**¿Quieres ver TakiQR en acción?** 

Demo en vivo: [takiqr.cl](https://takiqr.cl)  
Conversemos del proyecto: [WhatsApp](https://wa.me/56972438969)

**¿Tienes un MVP en mente?** Te ayudo a desarrollarlo rápido y bien.