# Alke Wallet 💳✨

Alke Wallet es una aplicación web (demo) de billetera digital desarrollada con **HTML, CSS, Bootstrap y JavaScript**, con una interfaz **mobile-first** y estilo “glassmorphism” sobre un fondo degradado oscuro.

## ⚠️ **Nota:** 
Es un proyecto educativo. No hay backend ni cifrado real. No procesa pagos reales. La información se guarda únicamente en el navegador usando **localStorage**.

## ▶️ Cómo ejecutar

1. Descarga o clona el proyecto.
2. Abre `index.html` en tu navegador.

## 🚀 Funcionalidades principales

### ✅ Autenticación
- **Registro de usuario** con validaciones (campos obligatorios, contraseña mínima, confirmación, aceptación de política).
- **Inicio de sesión** con verificación de credenciales.
- **Cierre de sesión (Logout)** para terminar la sesión actual.

### 💰 Balance
- Visualización del **saldo total** del usuario.
- El saldo se actualiza automáticamente después de:
  - Depósitos
  - Envío de dinero

### ➕ Depósitos
- Permite **agregar dinero** al saldo.
- Registra la operación como transacción de tipo **ingreso**.

### 📤 Enviar dinero
- Envío de dinero a un **contacto** seleccionado desde un desplegable.
- Validación de saldo disponible:
  - Si no alcanza, se muestra un mensaje de error.
- Registra la operación como transacción de tipo **egreso**.

### 🧾 Transacciones
- Historial completo de movimientos.
- En el dashboard se muestran las **últimas transacciones**.
- Colores por tipo:
  - **Ingresos** en verde (`+`)
  - **Egresos** en rojo (`-`)

### 👥 Contactos
- Lista de contactos guardados por usuario.
- Formulario para crear un nuevo contacto con:
  - Nombre
  - Email
  - Teléfono