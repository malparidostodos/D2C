# Project Progress

## 🚀 AÑADIR (Nuevas Funcionalidades)

- [x] **Panel de Administrador (AdminDashboard.jsx)**
  - Implementado con vista protegida, lista de reservas, cambio de estados y estadísticas básicas.
- [x] **Galería de Antes/Después (Gallery.jsx)**
  - Implementado componente de slider comparativo de imágenes.
- [x] **Sección de Testimonios/Reseñas**
  - Componente `Testimonials` presente en `App.jsx`.
- [ ] **Notificaciones Automáticas (Email/SMS)**
  - Edge functions para bienvenida y reset password implementadas.
  - *Falta:* Recordatorios automáticos (Cron jobs).
- [x] **SEO Dinámico (react-helmet-async)**
  - Implementado componente `SEO` reutilizable.
  - Integrado en todas las páginas (Home, Booking, Auth, Dashboard, Legal).
  - Títulos dinámicos por sección en la Landing Page.

## 🔄 CAMBIAR (Refactorización y Lógica)

- [ ] **Gestión de Estado del Servidor (React Query)**
  - *Pendiente.* Actualmente usa `useEffect` manual.
- [ ] **Lógica del Menú (useMenu hook)**
  - *Pendiente.* Lógica aún en `Header.jsx`.
- [ ] **Validación de Formularios (React Hook Form + Zod)**
  - *Pendiente.* Validación manual en uso.

## ✨ MEJORAR (UX/UI y Performance)

- [ ] **Feedback de Usuario (Toasts)**
  - *Parcial.* Implementación custom básica. Falta librería robusta (sonner/hot-toast).
- [ ] **Optimización de CSS**
  - *Pendiente.* `index.css` sigue siendo monolítico.
- [ ] **Carga de Imágenes (Lazy Loading)**
  - *Pendiente revisión global.*

## 🗑️ ELIMINAR (Limpieza)

- [ ] **src/components/AuthExample.jsx**
  - Archivo existe y debe ser eliminado.
- [ ] **Código Muerto en index.css**
  - *Pendiente.*
- [ ] **Console Logs**
  - *Pendiente.* Logs visibles en `Header.jsx` y otros.
