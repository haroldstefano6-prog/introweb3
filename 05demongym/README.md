# Demon Gym - Sistema Web de Gestión y Membresías

Sitio web oficial y sistema de administración desarrollado para **Demon Gym**, un centro de acondicionamiento físico de alto rendimiento. Este proyecto incluye páginas informativas, catálogo de productos, planes de entrenamiento y un panel interactivo con operaciones CRUD para la gestión de inscripciones de socios.

---

## Características del Proyecto

**Diseño Responsivo y Temático:** Interfaz moderna con modo oscuro ("Demon Mode") y modo claro mediante un selector interactivo.
**Sección de Inicio Dinámica:** Incluye testimonios de la comunidad y un formulario interactivo para que los usuarios publiquen sus propias experiencias en tiempo real.
**Planes y Promociones:** Tarifas detalladas que incluyen planes individuales, la **Promo Dúo** para parejas/amigos y la **Anualidad Legendaria**.
**Infraestructura Detallada:** Apartado "Nosotros" con especificaciones técnicas sobre las zonas de fuerza, máquinas biomecánicas, cardio y combate.
**Demon Store (Tienda):** Catálogo ampliado de suplementación avanzada (Proteínas, Creatina, Pre-entrenos, BCAA) y ropa de alto rendimiento con opciones de pago mediante **Banco Pichincha** y **DE UNA**.
**Sistema de Inscripciones (CRUD):** Módulo completo para registrar, actualizar, eliminar y filtrar socios, con estadísticas en tiempo real y persistencia local (`localStorage`).

---

## Tecnologías Utilizadas

**HTML5:** Estructura semántica de las páginas web.
**CSS3:** Estilos avanzados, diseño adaptativo (Grid/Flexbox) y variables para los temas visuales.
**JavaScript (ES6+):** Lógica del sistema CRUD, manipulación del DOM, cambio de temas e interactividad de formularios.

---

## Estructura de Archivos
/
── index.html          # Página principal y muro de experiencias
── planes.html         # Tarifas y membresías especiales
── nosotros.html       # Filosofía y zonas del gimnasio
── productos.html      # Tienda de suplementos y ropa
── inscripciones.html  # Panel de control y registro (CRUD)
── css/
   ── style.css       # Hoja de estilos general
── js/
   ── app.js          # Lógica de JavaScript