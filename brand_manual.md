# Manual de Marca - Car Rental Medellin

Este documento define las directrices visuales, de comunicación y estilo para la marca **Car Rental Medellin**, garantizando consistencia en toda la plataforma web y futuras aplicaciones.

---

## 1. Identidad Visual (Logos)

Debido a su estilo minimalista y premium, el logotipo de la marca debe transmitir elegancia, seguridad y velocidad. 

A continuación, proveemos versiones en formato vectorial (SVG) que puedes usar directamente en tu proyecto web reemplazando iconos genéricos, especialmente diseñados para la estética "*Glassmorphism*" actual de la web.

### Logo Principal (Versión Horizontal)
Ideal para el `Navbar.tsx` y encabezados principales.

```svg
<svg width="240" height="48" viewBox="0 0 240 48" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Símbolo del carro -->
  <path d="M16 32a4 4 0 1 0 8 0 4 4 0 1 0-8 0zm24 0a4 4 0 1 0 8 0 4 4 0 1 0-8 0z" fill="#DC2626"/>
  <path d="M12 28h36c1.5 0 2.8-1 3.2-2.5L54 16H22l-4-8H6L2 28h10z" stroke="#DC2626" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
  
  <!-- Texto -->
  <text x="70" y="32" font-family="'Inter', sans-serif" font-weight="700" font-size="22" fill="#FFFFFF" letter-spacing="1">
    CAR RENTAL
  </text>
  <text x="70" y="44" font-family="'Inter', sans-serif" font-weight="400" font-size="10" fill="#9CA3AF" letter-spacing="3.5">
    MEDELLIN
  </text>
</svg>
```

### Isotipo (Símbolo solo)
Ideal para avatares, favicon (`index.html`), o esquinas de la web donde el espacio es reducido.

```svg
<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="24" cy="24" r="24" fill="#DC2626"/>
  <path d="M16 34a3 3 0 1 0 6 0 3 3 0 1 0-6 0zm14 0a3 3 0 1 0 6 0 3 3 0 1 0-6 0z" fill="#FFFFFF"/>
  <path d="M13 31h26c1 0 2-.8 2.3-1.8L44 20H20l-3-6H7l-3 17h9z" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
```

*(Puedes copiar y pegar este código SVG directamente en los componentes de React)*

---

## 2. Paleta de Colores

La paleta se centra en transmitir modernidad y agresividad deportiva, contrastando fuertemente para mantener legibilidad en el diseño oscuro/glassmorphism de la web.

| Color | Hexadecimal | Clases Tailwind | Uso |
| :--- | :--- | :--- | :--- |
| **Rojo Primario** | `#DC2626` | `bg-red-600`, `text-red-600` | Botones de acción principal (CTAs), Isotipo, iconos destacados (ej: `User` o `Settings`). |
| **Rojo Acento** | `#EF4444` | `bg-red-500`, `text-red-500` | Estados hover de botones primarios, notificaciones de error. |
| **Gris Oscuro/Negro** | `#111827` | `bg-gray-900`, `text-gray-900` | Fondos base de la web si no hay una imagen de fondo (Hero temporal). |
| **Blanco** | `#FFFFFF` | `bg-white`, `text-white` | Texto principal, iconos sobre fondos oscuros (Navbar). |
| **Glass/Translúcido** | `rgba(255, 255, 255, 0.1)`| `bg-white/10` | Menús flotantes (Navbar, Modales), tarjetas y fondos de utilidades para dar el efecto *Glass*. |

---

## 3. Tipografía

El sitio web utiliza fuentes sin serifas (Sans-serif) para mantener un estilo limpio, fácil de leer y moderno.

*   **Fuente Principal (Headings y Textos):** `Inter` o `Roboto`.
*   **Pesos Tipográficos:**
    *   **Regular (400):** Para párrafos largos y descripciones de los vehículos (Flota).
    *   **Medium (500):** Para enlaces de navegación (ej: los links del `Navbar`) y textos en botones.
    *   **Bold (700):** Para títulos de secciones (H1, H2) y el nombre de la marca en el logo.

---

## 4. Tono de Comunicación

De cara a los clientes, la marca de **Car Rental Medellin** se comunica de la siguiente manera:
*   **Profesional y Confiable:** "Tu seguridad y confort es nuestra prioridad."
*   **Moderna y Dinámica:** Textos cortos, directos al grano y orientados a la acción.
*   **Lenguaje:** Español neutro (Colombia), cordial pero sin excesivos formalismos (tratamiento de 'tú', no 'usted', para más cercanía). 

---

## 5. Elementos UI y Componentes

### Botones
*   **Botón Primario:** Fondo rojo (`bg-red-600`) con texto blanco. Puntas ligeramente redondeadas (`rounded-md` o `rounded-full`).
*   **Glass Buttons:** Usados en la navegación. Tienen fondo translúcido (`bg-white/10`) y deben incrementar su opacidad al hacer hover para mostrar interactividad.

### Tarjetas (Cards)
Deben seguir el estilo de las demás partes del diseño. Si se muestra un vehículo, la tarjeta debe tener un ligero difuminado (*backdrop-blur*) o borde tenue translúcido, manteniendo consistencia con los modales (ej: `AuthModal.tsx`).
