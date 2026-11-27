
---

### SCREENS (18 total)

---

**SCREEN 1 — Dashboard Gerencial**
Layout: Top bar with user avatar + notifications. Row of 4 KPI cards: "Eventos Este Mes" (calendar icon, violet), "Ingresos del Mes" (money icon, green), "Saldos Pendientes Clientes" (warning icon, amber), "Pagos Pendientes Proveedores" (truck icon, red). Below: left 65% = table "Próximos Eventos" (columns: Evento, Cliente, Fecha, Locación, Estado) with 6 rows. Right 35% = card "Alertas Operativas" with a vertical feed of colored alert pills (tareas vencidas, equipos en préstamo, incidentes abiertos, cotizaciones por vencer). Small line chart for "Ingresos del mes" at bottom.

---

**SCREEN 2 — Gestión de Roles**
Page header: "Roles" + button "+ Nuevo Rol". Search bar + filter "Estado: Todos". Data table columns: Nombre del Rol | Descripción | Permisos Asignados (count badge: "12 módulos") | Estado (Activo/Inactivo badge) | Acciones. Below table a section "Permisos por Módulo" showing a grid of toggle switches per module (Dashboard, Usuarios, Empleados, Clientes, etc.) organized in a 4-column permission matrix.

---

**SCREEN 3 — Gestión de Usuarios**
Page header: "Usuarios" + "+ Nuevo Usuario". Filters: Rol (dropdown), Estado (dropdown). Data table columns: Avatar + Nombre | Email | Rol (badge: Admin/Operador/Financiero/etc.) | Último Acceso | Estado (Activo/Inactivo) | Acciones (view, edit, toggle active). Row actions include a "Resetear Contraseña" option.

---

**SCREEN 4 — Gestión de Acceso (Login Screen)**
Full-screen dark page (#111318 background). Centered card 440px wide (#1A1D23). Top: The High Events logo/wordmark + tagline "Sistema de Gestión de Eventos". Fields: Email input, Password input (with eye toggle), "Recordarme" checkbox. Primary button: "Iniciar Sesión" (full-width, violet #7C3AED). Link below: "¿Olvidaste tu contraseña?". Optional: small session history table on right side for admin context.

---

**SCREEN 5 — Gestión de Empleados**
Page header: "Empleados" + "+ Nuevo Empleado". Filters: Cargo (dropdown), Estado. Data table columns: Avatar + Nombre | Documento | Cargo | Tipo Vinculación (badge: "Fijo" green / "Por Evento" amber) | Teléfono | Estado | Acciones. Detail modal shows: info personal, cargo, contacto emergencia (nombre + teléfono + parentesco), estado salud/SST fields.

---

**SCREEN 6 — Gestión de Clientes**
Page header: "Clientes" + "+ Nuevo Cliente". Filters: Tipo Cliente (Natural / Empresa), Estado. Data table columns: Nombre / Razón Social | Tipo (badge: "Natural" blue / "Empresa" violet) | NIT/Cédula | Email | Teléfono | Ciudad | Estado | Acciones. 

---

**SCREEN 7 — Gestión de Servicios**
Page header: "Servicios" + "+ Nuevo Servicio". Filter: Categoría (Sonido / Iluminación / Pantallas / Escenografía / DJ / Fotografía / Video / Logística / Otros). Data table columns: Nombre | Categoría (colored badge) | Descripción | Precio Base | Estado | Acciones. Top of page shows 6 category cards in a row with icon + count of services.

---

**SCREEN 8 — Gestión de Cotizaciones**
Page header: "Cotizaciones" + "+ Nueva Cotización". Filters: Estado (Borrador/Enviada/Aceptada/Rechazada), Cliente, Fecha rango. Data table columns: # Cotización | Cliente | Fecha Creación | Servicios (tags: up to 3 visible + "+N more") | Total | Estado (4-color badge) | Acciones (view, edit, download PDF, delete). Status badge colors: Borrador=gray, Enviada=blue, Aceptada=green, Rechazada=red.

---

**SCREEN 9 — Gestión de Ventas**
Page header: "Ventas" + "+ Registrar Venta". Filters: Tipo Venta (Servicio Cliente / Evento Propio), Estado Pago, Fecha. Data table columns: # Venta | Tipo (badge) | Cliente/Evento | Fecha | Total | Estado Pago (Pendiente/Parcial/Pagado) | Acciones (view, download comprobante). Small donut chart sidebar showing "Ventas por Tipo" (% cliente vs propio).

---

**SCREEN 10 — Gestión de Eventos**
Page header: "Eventos" + "+ Nuevo Evento". Tab row: Todos | Propios | Clientes Externos. Filters: Estado (Cotización/Confirmado/En Ejecución/Finalizado/Cancelado), Fecha. Data table columns: Nombre Evento | Origen (badge: "Propio" violet / "Cliente Externo" blue) | Cliente | Fecha | Locación | Servicios (colored tags) | Estado | Acciones. Each row expandable to show brief event summary.

---

**SCREEN 11 — Gestión de Agendamiento**
Layout split: Left 70% = full monthly calendar view (#242830 bg), dates with colored event dots (one color per event type/state), today highlighted with violet border. Right 30% = sidebar "Disponibilidad de Locaciones" with a list of locations (Salón Principal, Terraza, etc.) each with a colored availability bar. Below calendar: legend row with color codes. Clicking a date opens right panel with event details for that day.

---

**SCREEN 12 — Gestión de Proveedores**
Page header: "Proveedores" + "+ Nuevo Proveedor". Filters: Servicios (multiselect tags), Estado. Data table columns: Nombre Empresa | NIT | Servicios Ofrecidos (colored tag pills: "Sonido" "Luces" "DJ") | Contacto | Estado | # Contratos | Acciones. Detail view shows "Historial de Contrataciones" tab with table of past events.

---

**SCREEN 13 — Actas de Entrega/Recepción**
Page header: "Actas Entrega/Recepción". Data table columns: # Acta | Evento/Subcontratación | Proveedor | Tipo (Entrega/Recepción badge) | Fecha | Estado (Pendiente/Firmada/Observada) | Acciones. Detail modal shows: inspection form with equipment list + condition fields + photo upload area (drag & drop zone with camera icon) + digital signature placeholder at bottom.

---

**SCREEN 14 — Gestión de Abonos**
Layout: Two-tab view "Abonos Clientes" | "Abonos Proveedores". Each tab shows a data table: Evento | Monto Total | Anticipo (50%) | Saldo (50%) | Estado Anticipo (Pagado/Pendiente badge) | Estado Saldo | Fecha Pago. Each row has a horizontal progress bar showing payment % (0%, 50%, 100%). Summary KPI cards at top: Total Anticipos Recibidos, Total Saldos Pendientes Clientes, Total Anticipos Pagados Proveedores, Total Saldos Pendientes Proveedores.

---

**SCREEN 15 — Gestión de Equipos**
Page header: "Equipos" + "+ Nuevo Equipo". Filters: Categoría, Estado Operativo, Disponibilidad. Data table columns: Foto (small square thumbnail) | Nombre | Categoría (badge) | Número Serie | Estado Operativo (Disponible green / En Préstamo amber / Mantenimiento red / Dañado red-dark) | Ubicación actual | Acciones. Top row: 4 KPI cards (Total Equipos, Disponibles, En Préstamo, En Mantenimiento).

---

**SCREEN 16 — Préstamos de Equipos**
Page header: "Préstamos de Equipos" + "+ Registrar Préstamo". Tab row: Activos | Devueltos | Todos. Data table columns: # Préstamo | Responsable (avatar + name) | Evento | Equipos (count badge "3 equipos") | Fecha Salida | Fecha Devolución Esperada | Estado (En Préstamo amber / Devuelto green / Vencido red) | Acciones (view, register return). Detail modal shows list of individual equipment items with condition at return.

---

**SCREEN 17 — Gestión de Tareas**
Layout: Top filters for Evento, Fase (Planificación/Montaje/Prueba Técnica/Ejecución/Desmontaje), Empleado, Prioridad (Alta/Media/Baja). Main area: Kanban-style column view OR table view (toggle button). Table view columns: Tarea | Fase (colored badge) | Responsable (avatar) | Evento | Prioridad (🔴 Alta / 🟡 Media / 🟢 Baja) | Fecha Límite | Estado (Pendiente/En Proceso/Completada/Cancelada) | Acciones. Kanban view: 4 columns (Pendiente / En Proceso / Completada / Cancelada) with draggable task cards.

---

**SCREEN 18 — Gestión de Incidentes**
Page header: "Incidentes" + "+ Registrar Incidente". Filters: Criticidad (Alta/Media/Baja), Evento, Estado (Abierto/En Revisión/Resuelto/Cerrado). Data table columns: # Incidente | Título | Evento | Empleado Reporta | Criticidad (colored badge 🔴🟡🟢) | Fecha Reporte | Estado | Acciones. Detail modal: description field, affected area, corrective action taken, resolution date, incident history timeline (vertical feed of status changes with timestamps).

---

### ADDITIONAL NOTES FOR AI GENERATION:
- All screens share the same fixed sidebar on the left
- Top bar: fixed, 56px height, dark (#111318), breadcrumb left, notification bell + user avatar right
- Scrollable content area: right of sidebar, fills remaining width
- All forms use slide-in drawer from right (not full-page modals) to avoid losing table context
- All tables support bulk selection with top action bar appearing when rows are checked (Delete selected, Export CSV)
- Empty states: centered illustration + "No hay registros" text + primary action button
- Mobile note: this is a web admin app — no mobile breakpoints needed