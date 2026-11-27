# The High Events — Frontend

Sistema ERP y plataforma de gestión integral para **The High Events**, empresa de producción técnica, alquiler de equipos de sonido e iluminación, y organización de eventos corporativos y privados.

---

## 🚀 Tecnologías Principales

- **[React 19](https://react.dev/)**: Biblioteca de interfaz de usuario de última generación.
- **[TypeScript](https://www.typescriptlang.org/)**: Tipado estático estricto para alta confiabilidad y mantenibilidad.
- **[Vite 8](https://vitejs.dev/)**: Bundler y entorno de desarrollo ultra rápido con Hot Module Replacement (HMR).
- **[Tailwind CSS v4](https://tailwindcss.com/)**: Motor de estilos utility-first moderno con soporte nativo de Vite.
- **[React Router DOM v7](https://reactrouter.com/)**: Enrutamiento declarativo y modular con carga diferida (*lazy loading*).
- **[Lucide React](https://lucide.dev/)**: Sistema consistente de iconografía vectorial.

---

## 📋 Módulos del Sistema

1. **Dashboard Ejecutivo**: Ventas, cobros, cuentas por cobrar y por pagar, operación y disponibilidad de agenda mensual.
2. **Eventos**: Creación y edición con flujo completo en 4 secciones:
   - Datos generales del evento y cotización vinculada.
   - Servicios requeridos (sonido, iluminación, visuales, DJ, etc.).
   - Asignación de equipos técnicos: al guardar se preparan en borrador el préstamo de los propios y las recepciones.
   - Asignación de personal operativo con fases técnicas (Montaje, Ejecución, Desmontaje).
3. **Agendamiento**: Calendario de reuniones con clientes y de todos los eventos. Solo se agendan reuniones: sus datos tentativos sirven para crear la cotización y el evento, y cada evento creado aparece solo en el calendario.
4. **Cotizaciones**: Generación y seguimiento de cotizaciones para clientes.
5. **Ventas y Abonos**: Control financiero de pagos, cobros por cuotas y seguimiento de cuentas pendientes.
6. **Equipos, Préstamos y Recepciones**: Control de inventario físico, estado operativo de equipos (Bueno, Regular, Dañado) y actas de entrega/devolución.
7. **Incidentes**: Registro y resolución de novedades técnicas durante montajes y eventos.
8. **Clientes y Proveedores**: Directorios maestros y gestión comercial.
9. **Empleados, Usuarios y Roles**: Administración de personal, credenciales y matriz de permisos por rol.
10. **Catálogo de Tareas**: Actividades operativas estandarizadas sincronizadas con eventos.

---

## 🛠️ Requisitos Previos

Antes de ejecutar el proyecto, asegúrate de contar con las siguientes herramientas instaladas en tu equipo:

- **[Node.js](https://nodejs.org/)**: Versión **22** o superior.  
  Verifica tu versión en la terminal:
  ```bash
  node -v
  ```
- **Gestor de paquetes**: `npm` (incluido con Node.js).
- **[Git](https://git-scm.com/)**: Para clonar y sincronizar cambios en el repositorio.
- **[Visual Studio Code](https://code.visualstudio.com/)**: Editor de código recomendado.

### Extensiones Recomendadas para Visual Studio Code
Para tener la mejor experiencia de desarrollo, instala las siguientes extensiones desde la pestaña de Extensiones (`Ctrl + Shift + X`):
- **Tailwind CSS IntelliSense** (`bradlc.vscode-tailwindcss`)
- **ESLint** (`dbaeumer.vscode-eslint`)
- **Oxc** (`oxc.oxc-vscode`): formato con oxfmt.

*(El repositorio ya incluye la configuración automática en `.vscode/extensions.json` para que VS Code te sugiera instalarlas al abrir la carpeta).*

---

## 💻 Instrucciones para Clonar y Ejecutar en Visual Studio Code

### 1. Clonar el repositorio
Abre una terminal (PowerShell, Git Bash o CMD) y ejecuta:
```bash
git clone https://github.com/estebkyz/the-high-events-frontend.git
cd the-high-events-frontend
```

### 2. Abrir en Visual Studio Code
Puedes abrir la carpeta directamente desde la terminal:
```bash
code .
```
O desde VS Code: ve a **File (Archivo) > Open Folder (Abrir carpeta)** y selecciona la carpeta clonada.

### 3. Instalar las dependencias
Abre la terminal integrada de VS Code (`Ctrl + ñ` o `Ctrl + ` ` `) y ejecuta:
```bash
npm install
```

### 4. Conectar con la API
El frontend necesita el backend (`the-high-events-backend`), que por defecto corre en `http://localhost:3000/api`. Si usas otra dirección, copia `.env.example` a `.env` y ajusta `VITE_API_URL`.

### 5. Iniciar el servidor de desarrollo
Ejecuta el comando:
```bash
npm run dev
```

El servidor se iniciará localmente. Abre tu navegador web e ingresa a:
👉 **`http://localhost:8443`** (o la URL que muestre la consola).

---

## 📦 Scripts Disponibles

En la raíz del proyecto puedes ejecutar los siguientes scripts:

| Comando | Descripción |
| :--- | :--- |
| `npm run dev` | Inicia el servidor de desarrollo local con recarga rápida (HMR). |
| `npm run build` | Compila y optimiza la aplicación para producción en la carpeta `dist/`. |
| `npm run preview` | Levanta un servidor local para previsualizar los archivos generados en `dist/`. |
| `npm run lint` | Comprueba el estándar de código con ESLint (`eslint.config.js`). |
| `npm run typecheck` | Verifica los tipos de TypeScript (`tsc --noEmit`). |
| `npm run format` | Da formato al código con oxfmt. |
| `npm run check` | Todo lo anterior más la compilación. **Ejecútalo antes de cada commit.** |

---

## 📁 Estructura del Proyecto

```text
the-high-events-frontend/
├── .vscode/               # Configuración y extensiones recomendadas para VS Code
├── docs/                  # Especificación de pantallas
├── src/
│   ├── components/        # UI compartida
│   │   ├── detail/        #   Piezas del modal de detalle
│   │   ├── form/          #   Piezas de formulario
│   │   └── list/          #   DataTable, ListPage, filtros y celdas
│   ├── constants/         # Catálogos comunes a varios módulos
│   ├── context/           # Sesión del usuario (AuthContext)
│   ├── hooks/             # useCrudResource, useCrudActions, useRecordModal, useListFilters…
│   ├── layouts/           # AppLayout, Sidebar, TopHeader y navegación móvil
│   ├── pages/             # Un módulo por carpeta, todos con la misma estructura:
│   │   └── <modulo>/      #   XPage, types, constants, form, components/, drawers/
│   ├── routes/            # Rutas, paths y datos entre pantallas
│   ├── services/          # Cliente HTTP y sesión
│   ├── types/             # Tipos globales
│   ├── utils/             # Funciones puras (formato, listas, errores, estados)
│   ├── App.tsx            # Proveedores y enrutador
│   ├── index.css          # Estilos globales y Tailwind CSS v4
│   └── main.tsx           # Punto de entrada
├── CLAUDE.md              # Estándar de código y diseño (la sección 8 prevalece)
├── eslint.config.js       # Reglas automáticas del estándar
├── .oxfmtrc.json          # Formato
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## 🤝 Colaboración y Buenas Prácticas

1. **Crear una rama para tus cambios**:
   ```bash
   git checkout -b feature/nombre-de-tu-cambio
   ```
2. **Validar antes de hacer commit**:
   ```bash
   npm run check
   ```
3. **Confirmar y enviar tus cambios**:
   ```bash
   git add .
   git commit -m "feat: descripción clara de tu modificación"
   git push origin feature/nombre-de-tu-cambio
   ```
4. El estándar (estructura de páginas, modales, tablas, formularios y textos) está en `CLAUDE.md`.
