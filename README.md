# 🚗 Car Rental Medellin

Plataforma web fullstack de alquiler de vehículos de lujo en Medellín, Colombia. Permite a los usuarios explorar la flota, hacer reservas, unirse a tours y gestionar su cuenta. Los administradores disponen de un panel completo para gestionar vehículos, reservas, usuarios y cotizaciones.

---

## 📋 Tabla de Contenidos

- [Demo & Capturas](#demo--capturas)
- [Características](#características)
- [Stack Tecnológico](#stack-tecnológico)
- [Arquitectura del Proyecto](#arquitectura-del-proyecto)
- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Variables de Entorno](#variables-de-entorno)
- [Base de Datos](#base-de-datos)
- [Scripts Disponibles](#scripts-disponibles)
- [Rutas de la API](#rutas-de-la-api)
- [Rutas del Frontend](#rutas-del-frontend)
- [Roles y Permisos](#roles-y-permisos)
- [Módulos Principales](#módulos-principales)
- [Estructura del Proyecto](#estructura-del-proyecto)

---

## ✨ Características

### Usuarios
- 🔐 Registro e inicio de sesión con JWT
- 🚘 Explorar flota de vehículos de lujo con filtros
- 📅 Reservar vehículos con o sin conductor
- 🗺️ Reservar tours turísticos por Medellín y Antioquia
- 📋 Panel personal: historial de reservas, estados y cancelación
- 💬 Enviar cotizaciones y consultas de contacto
- 🔔 Notificaciones toast en todas las acciones

### Administradores
- 📊 Dashboard con métricas en tiempo real (ingresos, reservas por estado, vehículos más reservados)
- 🚗 Gestión completa de vehículos: agregar, eliminar
- 📆 Gestión de reservas: confirmar, cancelar, completar con mensaje personalizado al cliente
- 👥 Listado de clientes con historial de reservas
- 📩 Gestión de cotizaciones: marcar como atendidas, eliminar
- 🔑 Acceso protegido por rol `admin`

---

## 🛠️ Stack Tecnológico

### Frontend
| Tecnología | Versión | Descripción |
|---|---|---|
| React | 19 | Librería UI |
| TypeScript | 5.x | Tipado estático |
| Vite | 6.x | Build tool y servidor de desarrollo |
| Tailwind CSS | 4.x | Estilos utilitarios |
| Radix UI | latest | Componentes accesibles headless |
| React Router DOM | 7.x | Enrutamiento SPA |
| React Hook Form | 7.x | Manejo de formularios |
| Sonner | 2.x | Notificaciones toast |
| Lucide React | latest | Íconos |
| Recharts | 2.x | Gráficas (dashboard) |
| date-fns | 4.x | Utilidades de fechas |

### Backend
| Tecnología | Versión | Descripción |
|---|---|---|
| Node.js | 18+ | Runtime |
| Express | 4.x | Framework HTTP |
| TypeScript | 5.x | Tipado estático |
| SQLite | 5.x | Base de datos embebida |
| JWT | 9.x | Autenticación por tokens |
| bcryptjs | 2.x | Hash de contraseñas |
| uuid | 13.x | Generación de IDs únicos |
| nodemon | 3.x | Hot reload en desarrollo |

---

## 🏗️ Arquitectura del Proyecto

```
┌─────────────────────────────────────────────────────┐
│                   CLIENTE (React SPA)                │
│  LandingPage → FleetPage → UserDashboard             │
│                          → AdminDashboard            │
│  Puerto: 5173 (dev) / dist/ (build)                  │
└───────────────────────┬─────────────────────────────┘
                        │ HTTP REST (fetch)
                        │ Authorization: Bearer <JWT>
┌───────────────────────▼─────────────────────────────┐
│              SERVIDOR (Express + TypeScript)         │
│  /api/auth  /api/cars  /api/reservations             │
│  /api/users  /api/quotes                             │
│  Puerto: 5000                                        │
└───────────────────────┬─────────────────────────────┘
                        │
┌───────────────────────▼─────────────────────────────┐
│              BASE DE DATOS (SQLite)                  │
│  Archivo: database.sqlite                            │
│  Tablas: users, cars, reservations, quotes           │
└─────────────────────────────────────────────────────┘
```

---

## ✅ Requisitos Previos

- **Node.js** v18 o superior — [descargar](https://nodejs.org)
- **npm** v9 o superior (incluido con Node.js)
- **Git**

---

## 🚀 Instalación

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd app
```

### 2. Instalar dependencias del frontend

```bash
npm install
```

### 3. Instalar dependencias del servidor

```bash
cd server
npm install
cd ..
```

### 4. Poblar la base de datos con datos de prueba (opcional pero recomendado)

```bash
cd server
npx ts-node src/seed.ts
cd ..
```

Esto crea:
- Un usuario **administrador**: `admin@carrentalmedellin.com` / `admin123`
- Un usuario de prueba: `user@test.com` / `user123`
- +10 vehículos de lujo con sus datos completos

### 5. Iniciar el servidor backend

```bash
cd server
npm run dev
```

El servidor estará disponible en `http://localhost:5000`

### 6. Iniciar el frontend (en otra terminal)

```bash
# En la raíz del proyecto
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

---

## 🔐 Variables de Entorno

El proyecto funciona sin configuración adicional en desarrollo. Para producción, se recomienda configurar:

### Servidor (`server/.env`)

```env
PORT=5000
JWT_SECRET=tu_clave_secreta_super_segura
```

> ⚠️ Por defecto el `JWT_SECRET` es `super-secret-key-change-me-in-production`. **Cámbialo en producción.**

---

## 🗄️ Base de Datos

El archivo `database.sqlite` se genera automáticamente en la raíz del proyecto al primer arranque del servidor.

### Esquema de tablas

#### `users`
| Columna | Tipo | Descripción |
|---|---|---|
| id | TEXT (UUID) | Clave primaria |
| name | TEXT | Nombre completo |
| email | TEXT UNIQUE | Correo electrónico |
| password | TEXT | Contraseña hasheada (bcrypt) |
| phone | TEXT | Teléfono de contacto |
| role | TEXT | `user` \| `admin` |
| createdAt | DATETIME | Fecha de registro |
| avatar | TEXT | URL avatar (opcional) |

#### `cars`
| Columna | Tipo | Descripción |
|---|---|---|
| id | INTEGER | Clave primaria autoincremental |
| name | TEXT | Nombre del vehículo |
| category | TEXT | Categoría (Sedán, SUV, etc.) |
| image | TEXT | Ruta de la imagen |
| price | REAL | Precio por día en COP |
| seats | INTEGER | Número de asientos |
| doors | INTEGER | Número de puertas |
| transmission | TEXT | `Automática` \| `Manual` |
| fuel | TEXT | Tipo de combustible |
| features | TEXT | JSON array de características |
| description | TEXT | Descripción del vehículo |
| year | INTEGER | Año del modelo |
| available | BOOLEAN | Disponibilidad |

#### `reservations`
| Columna | Tipo | Descripción |
|---|---|---|
| id | TEXT | Clave primaria (RES-XXXXXX) |
| carId | INTEGER | FK → cars.id |
| userId | TEXT | FK → users.id |
| customerName | TEXT | Nombre del cliente |
| customerEmail | TEXT | Email del cliente |
| customerPhone | TEXT | Teléfono del cliente |
| pickupDate | TEXT | Fecha de recogida |
| returnDate | TEXT | Fecha de devolución |
| pickupLocation | TEXT | Lugar de recogida |
| withDriver | BOOLEAN | Incluye conductor |
| additionalNotes | TEXT | Notas adicionales |
| totalPrice | REAL | Precio total calculado |
| status | TEXT | `pending` \| `confirmed` \| `completed` \| `cancelled` |
| adminMessage | TEXT | Mensaje del admin al cliente |
| tourName | TEXT | Nombre del tour (si aplica) |
| tourDate | TEXT | Fecha del tour (si aplica) |
| createdAt | DATETIME | Fecha de creación |

#### `quotes`
| Columna | Tipo | Descripción |
|---|---|---|
| id | INTEGER | Clave primaria |
| name | TEXT | Nombre del solicitante |
| email | TEXT | Email |
| phone | TEXT | Teléfono |
| message | TEXT | Mensaje / consulta |
| status | TEXT | `new` \| `attended` |
| createdAt | DATETIME | Fecha de envío |

---

## 📜 Scripts Disponibles

### Frontend (raíz del proyecto)

| Comando | Descripción |
|---|---|
| `npm run dev` | Inicia servidor de desarrollo Vite en puerto 5173 |
| `npm run build` | Compila TypeScript y genera bundle de producción en `dist/` |
| `npm run preview` | Sirve el bundle de producción localmente |
| `npm run lint` | Ejecuta ESLint en todos los archivos |

### Backend (`/server`)

| Comando | Descripción |
|---|---|
| `npm run dev` | Inicia servidor con nodemon (hot reload) |
| `npm run seed` | Pobla la base de datos con datos de prueba |

---

## 🌐 Rutas de la API

Base URL: `http://localhost:5000/api`

### Autenticación — `/auth`

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| POST | `/auth/register` | ❌ | Registrar nuevo usuario |
| POST | `/auth/login` | ❌ | Iniciar sesión, retorna JWT |

**Body login:**
```json
{ "email": "user@example.com", "password": "contraseña" }
```
**Body register:**
```json
{ "name": "Juan", "email": "user@example.com", "password": "contraseña", "phone": "3001234567" }
```

---

### Vehículos — `/cars`

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| GET | `/cars` | ❌ | Listar todos los vehículos |
| POST | `/cars` | 🔑 Admin | Agregar vehículo |
| PATCH | `/cars/:id` | 🔑 Admin | Actualizar vehículo |
| DELETE | `/cars/:id` | 🔑 Admin | Eliminar vehículo |

---

### Reservas — `/reservations`

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| GET | `/reservations` | 🔐 User | Retorna propias; admin retorna todas |
| POST | `/reservations` | 🔐 User | Crear reserva |
| PATCH | `/reservations/:id/status` | 🔑 Admin | Actualizar estado + mensaje |

**Body PATCH status:**
```json
{ "status": "confirmed", "adminMessage": "Tu reserva está lista." }
```

---

### Usuarios — `/users`

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| GET | `/users` | 🔑 Admin | Listar todos los usuarios |
| PATCH | `/users/:id/role` | 🔑 Admin | Cambiar rol de usuario |

---

### Cotizaciones — `/quotes`

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| POST | `/quotes` | ❌ | Enviar cotización (público) |
| GET | `/quotes` | 🔑 Admin | Listar todas las cotizaciones |
| PATCH | `/quotes/:id/status` | 🔑 Admin | Marcar como atendida |
| DELETE | `/quotes/:id` | 🔑 Admin | Eliminar cotización |

> 🔐 User = token JWT requerido | 🔑 Admin = token JWT con `role: admin`

---

## 🗺️ Rutas del Frontend

| Ruta | Componente | Protección | Descripción |
|---|---|---|---|
| `/` | `LandingPage` | Pública | Página principal con hero, flota, servicios, tours y contacto |
| `/fleet` | `FleetPage` | Pública | Catálogo completo de vehículos |
| `/dashboard` | `UserDashboardPage` | 🔐 Usuario | Panel del usuario con reservas y perfil |
| `/admin` | `AdminDashboardPage` | 🔑 Admin | Panel de administración |
| `*` | `NotFoundPage` | Pública | Página 404 |

---

## 👤 Roles y Permisos

| Acción | Público | Usuario | Admin |
|---|---|---|---|
| Ver flota | ✅ | ✅ | ✅ |
| Enviar cotización | ✅ | ✅ | ✅ |
| Registrarse / Login | ✅ | — | — |
| Crear reserva | ❌ | ✅ | ✅ |
| Ver propias reservas | ❌ | ✅ | ✅ |
| Cancelar propia reserva | ❌ | ✅ | ✅ |
| Ver todas las reservas | ❌ | ❌ | ✅ |
| Confirmar / Completar reservas | ❌ | ❌ | ✅ |
| Agregar / Eliminar vehículos | ❌ | ❌ | ✅ |
| Ver y gestionar cotizaciones | ❌ | ❌ | ✅ |
| Ver todos los usuarios | ❌ | ❌ | ✅ |

---

## 📦 Módulos Principales

### `ReservationsContext`
Contexto global que provee:
- Lista de vehículos (`cars`)
- Reservas del usuario autenticado (`reservations`)
- Control del modal de reserva (`showReservationModal`, `selectedCar`, `selectedTour`)
- Métodos: `openReservationModal`, `createReservation`, `cancelReservation`, `calculateTotalPrice`

### `AuthContext`
Contexto de autenticación que provee:
- Usuario actual (`user`)
- Estado de carga (`isLoading`)
- Métodos: `login`, `register`, `logout`
- Flag `isAdmin` calculado desde el rol

### `useAdmin` (hook)
Hook para el panel de administración que carga en paralelo vehículos, reservas y usuarios usando `Promise.all`. Expone métodos: `addCar`, `deleteCar`, `updateReservationStatus`, `updateUserRole`.

### Tours disponibles
| Tour | Precio | Día/Recurrencia |
|---|---|---|
| Jueves de Supercarros | $350.000 COP | Jueves |
| Noche VIP en El Poblado | $250.000 COP | Cualquier día |
| Fuga al Peñol | $600.000 COP | Cualquier día |
| Circuito Antioqueño | $400.000 COP | Cualquier día |
| Atardecer en Santa Elena | $200.000 COP | Cualquier día |
| Ruta del Café — Norte Cercano | $320.000 COP | Cualquier día |
| Medellín de Mil Luces | $180.000 COP | Cualquier día |
| Alto de Minas & Caramanta | $700.000 COP | Cualquier día |

---

## 🗂️ Estructura del Proyecto

```
app/
├── public/                     # Imágenes estáticas (hero-car.jpg, car-*.jpg)
├── src/
│   ├── App.tsx                 # Raíz React: RouterProvider + Providers + rutas
│   ├── main.tsx                # Entry point
│   ├── components/
│   │   ├── AdminDashboard.tsx  # Panel completo de administración
│   │   ├── UserDashboard.tsx   # Panel del usuario autenticado
│   │   ├── landing/            # Secciones de la landing page
│   │   │   ├── Hero.tsx
│   │   │   ├── Fleet.tsx
│   │   │   ├── Services.tsx
│   │   │   ├── Tours.tsx
│   │   │   ├── Contact.tsx
│   │   │   └── Footer.tsx
│   │   ├── layout/
│   │   │   ├── Navbar.tsx      # Barra de navegación flotante
│   │   │   └── GlobalModals.tsx# Montaje global de modales
│   │   ├── modals/
│   │   │   ├── AuthModal.tsx   # Login / Registro
│   │   │   ├── ReservationModal.tsx # Flujo de reserva multi-paso
│   │   │   └── AllCarsModal.tsx
│   │   ├── routing/
│   │   │   └── ProtectedRoutes.tsx # Guards: ProtectedRoute, AdminRoute
│   │   └── ui/                 # Componentes shadcn/ui + Radix
│   ├── contexts/
│   │   ├── AuthContext.tsx
│   │   └── ReservationsContext.tsx
│   ├── hooks/
│   │   └── useReservations.ts  # useReservations, useAdmin, useCars
│   ├── pages/
│   │   ├── LandingPage.tsx
│   │   ├── FleetPage.tsx
│   │   ├── UserDashboardPage.tsx
│   │   ├── AdminDashboardPage.tsx
│   │   └── NotFoundPage.tsx
│   ├── services/
│   │   └── api.ts              # Todas las llamadas al backend
│   └── types/
│       └── index.ts            # Interfaces: User, Car, Reservation, Quote
├── server/
│   ├── src/
│   │   ├── index.ts            # Entry point Express
│   │   ├── db.ts               # Conexión SQLite + inicialización de schema
│   │   ├── seed.ts             # Script para poblar datos de prueba
│   │   └── routes/
│   │       ├── auth.ts
│   │       ├── cars.ts
│   │       ├── reservations.ts
│   │       ├── users.ts
│   │       └── quotes.ts
│   ├── package.json
│   └── tsconfig.json
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── README.md
```

---

## 🔧 Configuración adicional

### Alias de paths
El frontend usa `@/` como alias para `src/`. Configurado en `vite.config.ts` y `tsconfig.app.json`.

### CORS
El servidor permite todas las origins en desarrollo (`cors()` sin restricciones). Para producción, restringir al dominio del frontend:
```typescript
app.use(cors({ origin: 'https://tudominio.com' }));
```

### Precio del conductor
El costo adicional por conductor está fijado en **$200.000 COP por día** en `useReservations.ts` → `calculateTotalPrice`.

---

## 📄 Licencia

Este proyecto es privado. Todos los derechos reservados © 2026 Car Rental Medellin.
