---
title: >-
  Organizando el caos: por qué hice Vision Stock y cómo lo uso en mis propios
  proyectos
description: >-
  La historia detrás de Vision Stock, un sistema de inventario minimalista que
  nació de una necesidad personal y se convirtió en herramienta para pequeños
  negocios.
date: 2025-07-01T12:10:23.389Z
author: Maykol Salgado
tags:
  - react
  - zustand
  - mongodb
  - inventario
  - minimalismo
coverImage: >-
  https://res.cloudinary.com/de5auto5x/image/upload/v1751360459/portfolio-blog/j34oyisuizavaqxfbo9g.webp
draft: false
---
# Organizando el caos: por qué hice Vision Stock y cómo lo uso en mis propios proyectos

**Vision Stock** no comenzó como un producto para clientes. Empezó como una solución personal para un problema que me estaba volviendo loco: **no encontrar las cosas cuando las necesitaba**.

## El problema que me llevó al límite

### La situación:
- Cables en 5 cajas diferentes sin etiquetar
- Componentes electrónicos perdidos por toda la casa
- Comprar lo mismo dos veces porque "juraba que lo tenía"
- Buscar 20 minutos algo que debería estar "ahí mismo"

### El punto de quiebre:
Un día necesitaba un cable USB-C específico para un proyecto urgente. **Perdí 45 minutos buscándolo**, llegué tarde a una reunión, y finalmente lo encontré en una caja etiquetada como "cables varios" que tenía de todo menos cables USB-C.

Ese día decidí: **"Esto se acaba hoy"**.

## La solución: simplicidad extrema

### Principios de diseño:
1. **Minimalista:** Solo lo esencial
2. **Rápido:** Agregar items en segundos
3. **Searcheable:** Encontrar todo con búsqueda
4. **Visual:** Una foto vale más que mil descripciones
5. **Offline-first:** Funciona sin internet

### Stack elegido para flexibilidad:
- **Frontend:** React + TypeScript + Zustand
- **Backend:** Node.js + Express
- **Base de datos:** MongoDB (flexibilidad de esquemas)
- **Storage:** Cloudinary (manejo de imágenes)
- **PWA:** Para usar en móvil como app nativa

## ¿Por qué Zustand en lugar de Redux?

### El problema con Redux para este caso:
```typescript
// Redux: demasiado boilerplate para operaciones simples
const ADD_ITEM = 'inventory/ADD_ITEM';
const UPDATE_ITEM = 'inventory/UPDATE_ITEM';
const DELETE_ITEM = 'inventory/DELETE_ITEM';

interface AddItemAction {
  type: typeof ADD_ITEM;
  payload: Item;
}
// ... más código solo para setup
```

### La solución con Zustand:
```typescript
// Zustand: directo al punto
interface InventoryStore {
  items: Item[];
  addItem: (item: Item) => void;
  updateItem: (id: string, updates: Partial<Item>) => void;
  deleteItem: (id: string) => void;
  searchItems: (query: string) => Item[];
}

const useInventoryStore = create<InventoryStore>((set, get) => ({
  items: [],
  
  addItem: (item) => set((state) => ({ 
    items: [...state.items, { ...item, id: generateId() }] 
  })),
  
  updateItem: (id, updates) => set((state) => ({
    items: state.items.map(item => 
      item.id === id ? { ...item, ...updates } : item
    )
  })),
  
  deleteItem: (id) => set((state) => ({
    items: state.items.filter(item => item.id !== id)
  })),
  
  searchItems: (query) => {
    const { items } = get();
    return items.filter(item => 
      item.name.toLowerCase().includes(query.toLowerCase()) ||
      item.description.toLowerCase().includes(query.toLowerCase()) ||
      item.location.toLowerCase().includes(query.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
    );
  }
}));
```

**¿El resultado?** 90% menos código para la misma funcionalidad.

## MongoDB: la elección perfecta para inventarios

### ¿Por qué NoSQL para este proyecto?

```typescript
// Los items de inventario son muy diversos
interface BaseItem {
  id: string;
  name: string;
  description: string;
  location: string;
  quantity: number;
  photos: string[];
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Pero cada tipo puede tener campos únicos
interface ElectronicItem extends BaseItem {
  type: 'electronic';
  voltage?: string;
  brand?: string;
  model?: string;
  serialNumber?: string;
}

interface ToolItem extends BaseItem {
  type: 'tool';
  material?: string;
  size?: string;
  condition?: 'nuevo' | 'usado' | 'reparar';
}

interface BookItem extends BaseItem {
  type: 'book';
  author?: string;
  isbn?: string;
  language?: string;
}
```

Con MongoDB, cada documento puede tener campos diferentes sin problemas de esquema rígido.

## Características implementadas

### 1. Búsqueda inteligente
```typescript
const useSearch = () => {
  const { searchItems } = useInventoryStore();
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({});
  
  const results = useMemo(() => {
    let filtered = searchItems(query);
    
    // Filtros por ubicación
    if (filters.location) {
      filtered = filtered.filter(item => 
        item.location.toLowerCase().includes(filters.location!.toLowerCase())
      );
    }
    
    // Filtros por tags
    if (filters.tags?.length) {
      filtered = filtered.filter(item =>
        filters.tags!.some(tag => item.tags.includes(tag))
      );
    }
    
    // Ordenamiento por relevancia
    return filtered.sort((a, b) => {
      const aRelevance = calculateRelevance(a, query);
      const bRelevance = calculateRelevance(b, query);
      return bRelevance - aRelevance;
    });
  }, [query, filters, searchItems]);
  
  return { results, query, setQuery, filters, setFilters };
};
```

### 2. Sistema de ubicaciones inteligente
```typescript
// Auto-completado de ubicaciones basado en uso frecuente
const getLocationSuggestions = (input: string): string[] => {
  const frequentLocations = useInventoryStore.getState().items
    .reduce((acc, item) => {
      acc[item.location] = (acc[item.location] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
  return Object.entries(frequentLocations)
    .sort(([,a], [,b]) => b - a)
    .map(([location]) => location)
    .filter(location => 
      location.toLowerCase().includes(input.toLowerCase())
    )
    .slice(0, 5);
};
```

### 3. PWA para uso móvil
```typescript
// Service Worker para funcionalidad offline
self.addEventListener('fetch', (event) => {
  if (event.request.method === 'GET' && event.request.url.includes('/api/inventory')) {
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          // Retorna cache si está disponible
          if (response) return response;
          
          // Si no, fetch y cachea
          return fetch(event.request)
            .then(response => {
              const responseClone = response.clone();
              caches.open('inventory-v1')
                .then(cache => cache.put(event.request, responseClone));
              return response;
            });
        })
    );
  }
});
```

## Mi flujo de trabajo personal

### Cómo uso Vision Stock día a día:

**1. Al recibir algo nuevo:**
- Foto rápida con el móvil
- Nombre descriptivo
- Ubicación específica ("Cajón escritorio #2")
- Tags relevantes ("electrónica", "trabajo", "urgente")

**2. Al buscar algo:**
- Búsqueda por nombre, descripción o tag
- Filtro por ubicación si recuerdo vagamente dónde está
- La foto me confirma que es lo correcto

**3. Al reorganizar:**
- Actualizo ubicaciones en lote
- Reviso items sin usar en 6+ meses
- Consolido ubicaciones similares

### Resultados después de 6 meses:
- **Tiempo de búsqueda:** De 15-45 min → 30 segundos promedio
- **Compras duplicadas:** De 2-3/mes → 0
- **Stress por desorganización:** Eliminado completamente
- **Productividad:** +25% en proyectos personales

## Casos de uso que descubrí

### Uso personal expandido:
- **Biblioteca personal:** Libros físicos y digitales
- **Herramientas:** Desde destornilladores hasta taladros
- **Cocina:** Inventario de despensa y especias
- **Ropa:** Organización de closet por temporadas

### Casos de negocio emergentes:
- **Talleres pequeños:** Control de herramientas y repuestos
- **Consultorios:** Inventario de insumos médicos
- **Tiendas de barrio:** Stock básico sin complejidad
- **Oficinas:** Suministros y equipos

## Optimizaciones técnicas interesantes

### 1. Compresión de imágenes automática
```typescript
const compressImage = async (file: File): Promise<File> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    const img = new Image();
    
    img.onload = () => {
      // Redimensionar manteniendo aspect ratio
      const maxWidth = 800;
      const maxHeight = 600;
      let { width, height } = img;
      
      if (width > height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
      }
      
      canvas.width = width;
      canvas.height = height;
      
      ctx.drawImage(img, 0, 0, width, height);
      
      canvas.toBlob((blob) => {
        resolve(new File([blob!], file.name, { 
          type: 'image/jpeg', 
          lastModified: Date.now() 
        }));
      }, 'image/jpeg', 0.8);
    };
    
    img.src = URL.createObjectURL(file);
  });
};
```

### 2. Sincronización offline-online
```typescript
const useSyncManager = () => {
  const [pendingChanges, setPendingChanges] = useState<Change[]>([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      syncPendingChanges();
    };
    
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  const syncPendingChanges = async () => {
    for (const change of pendingChanges) {
      try {
        await syncChange(change);
        setPendingChanges(prev => prev.filter(c => c.id !== change.id));
      } catch (error) {
        console.error('Sync failed:', error);
        break; // Stop sync on first failure
      }
    }
  };
  
  return { isOnline, pendingChanges: pendingChanges.length };
};
```

## Próximas funcionalidades

### En desarrollo:
- **Códigos QR:** Para ubicación física → digital
- **Compartir inventarios:** Para equipos/familias
- **Reportes de uso:** Items más/menos utilizados
- **Integración con compras:** Links a Amazon/MercadoLibre

### Ideas locas que podrían funcionar:
- **AI para categorización:** Detectar automáticamente tipo de item por foto
- **Realidad aumentada:** Overlay de información sobre items físicos
- **Blockchain:** Para inventarios compartidos entre negocios
- **IoT:** Sensores de peso para alertas de stock bajo

## Lecciones aprendidas

### 1. Resolver tu propio problema = product-market fit garantizado
Cuando usas tu propio producto diariamente, las mejoras surgen naturalmente.

### 2. Simplicidad > Features
Cada funcionalidad agregada debe justificar su existencia. Si no la usas personalmente, probablemente no la necesita nadie.

### 3. MongoDB es excelente para prototipos
La flexibilidad de esquemas permite iterar rápidamente sin migraciones complejas.

### 4. Zustand simplifica la gestión de estado
Para aplicaciones medianas, evita la complejidad innecesaria de Redux.

### 5. PWAs son el futuro para herramientas de productividad
La experiencia near-native en móviles es crucial para adopción.

## Conclusión

**Vision Stock** empezó como una solución personal y se está convirtiendo en una herramienta que otros también necesitan. Es prueba de que **los mejores productos nacen de problemas reales que vives en carne propia**.

El proyecto me enseñó que:
- **La tecnología debe servir al usuario, no al revés**
- **Simple y funcional beats complejo y perfecto**
- **Dog-fooding es la mejor forma de validar un producto**

Si estás considerando construir algo, pregúntate: **¿Lo usarías tú mismo todos los días?** Si la respuesta es sí, probablemente vale la pena construirlo.

---

**¿Quieres ver Vision Stock en desarrollo?**

Demo beta: [Próximamente]  
GitHub: [github.com/mayk0l/vision-stock](https://github.com/mayk0l/vision-stock)

**¿Tienes un problema similar que necesita solución?** Conversemos: [WhatsApp](https://wa.me/56972438969)
