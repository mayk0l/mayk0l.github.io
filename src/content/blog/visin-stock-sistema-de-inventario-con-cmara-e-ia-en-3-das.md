---
title: 'Visión Stock: Sistema de Inventario con Cámara e IA en 3 Días'
description: >-
  Cómo desarrollé un sistema de inventario para pymes con cámara e inteligencia
  artificial, en tiempo récord y con impacto real.
date: 2025-07-01T12:10:23.389Z
author: Maykol Salgado
tags:
  - IA
  - Frontend
  - Inventario
  - Pymes
  - React
  - Computer Vision
coverImage: >-
  https://res.cloudinary.com/de5auto5x/image/upload/v1751360459/portfolio-blog/j34oyisuizavaqxfbo9g.webp
draft: false
---
## Durante la pandemia y el auge de los negocios pequeños, noté una necesidad urgente: sistemas de inventario accesibles y visuales para personas sin conocimientos técnicos. Así nació **Visión Stock**, un MVP creado en 3 días que usa la cámara del navegador y un modelo IA para detectar productos sin necesidad de escáner físico.

### 🔧 Stack usado
- **Frontend**: React + Vite + Zustand + TailwindCSS
- **Backend**: Node.js + Express
- **IA Visual**: modelo entrenado corriendo en el cliente con TensorFlow.js
- **Base de Datos**: PostgreSQL (Railway)
- **Alertas**: WhatsApp (Twilio API)

### 🚀 Funcionalidades clave
- Escaneo de productos usando WebRTC
- Reconocimiento de etiquetas con modelo entrenado en TensorFlow.js
- Detección en tiempo real y flujo simple de registro
- Botón rojo para cerrar cámara y ver resumen
- Registro de ventas y generación automática de reportes diarios

### ⚙️ Flujo UX simplificado
1. Se abre la cámara.
2. Detecta producto (nombre mostrado).
3. Se ingresa cantidad en un popup.
4. Repite hasta presionar "ver detalle".
5. Se muestra resumen y opción de "registrar venta".

### 💡 Lecciones aprendidas
- TensorFlow.js permite correr modelos ligeros localmente sin backend pesado
- UX es todo: si el flujo no es claro, nadie lo usará
- WhatsApp sigue siendo el mejor canal para notificaciones en pymes chilenas

> “Construir para pymes reales cambia tu perspectiva sobre el software.”
