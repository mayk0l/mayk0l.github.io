#!/bin/bash

# Script para probar las rutas en desarrollo
echo "🧪 Probando rutas de la aplicación..."

# Verificar que el servidor esté corriendo
if ! curl -s http://localhost:4321 > /dev/null; then
    echo "❌ Servidor no está corriendo en localhost:4321"
    echo "Ejecuta: npm run dev"
    exit 1
fi

echo "✅ Servidor está corriendo"

# Probar rutas principales
routes=("/" "/projects" "/blog")

for route in "${routes[@]}"; do
    echo "🔍 Probando ruta: $route"
    
    status_code=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:4321$route")
    
    if [ "$status_code" = "200" ]; then
        echo "✅ $route - OK ($status_code)"
    else
        echo "❌ $route - Error ($status_code)"
    fi
done

echo ""
echo "🔍 Verificando archivos generados..."

# Verificar que los archivos existan en dist (después de build)
if [ -d "dist" ]; then
    echo "✅ Directorio dist existe"
    
    if [ -f "dist/projects.html" ]; then
        echo "✅ projects.html generado"
    else
        echo "❌ projects.html NO generado"
    fi
    
    if [ -f "dist/blog/index.html" ]; then
        echo "✅ blog/index.html generado"
    else
        echo "❌ blog/index.html NO generado"
    fi
else
    echo "⚠️  Directorio dist no existe - ejecuta: npm run build"
fi

echo ""
echo "📱 Para probar en móvil:"
echo "1. Asegúrate de estar en la misma red WiFi"
echo "2. Usa la IP local (ej: http://192.168.1.100:4321)"
echo "3. Abre las herramientas de desarrollo en Chrome móvil"
