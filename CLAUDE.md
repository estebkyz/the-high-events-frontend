# Estándares de Código y Diseño UI/UX — The High Events

Este documento define el estándar único de arquitectura frontend, estructura de componentes, modales (`Drawer`), formularios, tablas, manejo de estado y nomenclatura para **The High Events**.  
**Regla de oro:** Todo módulo nuevo o modificación a un módulo existente DEBE seguir estrictamente esta estructura para garantizar legibilidad, mantenibilidad y consistencia visual.

---

## 1. Estructura Fija de Archivos de Página (`src/pages/*Page.tsx`)

Cada página de módulo debe organizarse exactamente en este orden de arriba hacia abajo:

1. **Orden de Imports:**
   - Primero: `import React, { useState, useMemo, useEffect } from 'react';`
   - Segundo: Componentes internos (`DataTable`, `PageHeader`, `Drawer`, `FormInput`, `FormSelect`, `StatusBadge`, `TableStatusSelect`, `KPICard`, `useToast`).
   - Tercero: Íconos de `lucide-react`.
2. **Tipos e Interfaces:** `export interface <Entidad>Item { ... }` reflejando fielmente los nombres de columna de la base de datos (`Base de datos - The High Events.mwb`).
3. **Constantes y Datos Iniciales:** `INITIAL_<ENTIDADES>`, catálogos y opciones de estado.
4. **Funciones Auxiliares (Helpers):** Funciones puras fuera del componente (`formatCOP`, `getFullName`, etc.).
5. **Componente Principal (`export default function <Modulo>Page()`):**
   - **Estados de lista y filtros:** `items`, `search`, `filter...`
   - **Estados del modal (Patrón Único):**
     ```tsx
     type ModalMode = 'closed' | 'view' | 'form';
     const [modalMode, setModalMode] = useState<ModalMode>('closed');
     const [selectedItem, setSelectedItem] = useState<EntidadItem | null>(null);
     const [isEditing, setIsEditing] = useState(false);
     const [editForm, setEditForm] = useState<Partial<EntidadItem>>({});
     ```
   - **Datos derivados:** `filteredData` (calculado con `useMemo` o `.filter()`).
   - **Funciones controladoras (`const handler = () => ...`):**
     - `openCreate()`
     - `openEdit(item: EntidadItem)`
     - `openView(item: EntidadItem)`
     - `closeModal()`
     - `handleSaveForm(e: React.FormEvent)`
     - `handleStatusChange(id: string, nuevoEstado: EstadoType)`
     - `handleDelete(item: EntidadItem)`
   - **Definición de columnas (`const columns: Column<EntidadItem>[]`)**
   - **JSX Principal:**
     1. `<PageHeader />`
     2. `<KPICard />` (si el módulo incluye indicadores superiores)
     3. `<DataTable />`
     4. `{/* ── Modal Ver Detalles ── */}` (`<Drawer>` exclusivo para vista)
     5. `{/* ── Modal Crear / Editar ── */}` (`<Drawer>` exclusivo para formulario)

---

## 2. Estándar de Modales (`Drawer`) — Dos Bloques Separados + Diseño Plano

### ❌ Prohibido
- **NO** usar un único `<Drawer>` con operadores ternarios gigantes (`drawerMode === 'view' ? (...) : (<form>...</form>)`).
- **NO** usar estados redundantes o dispersos (`isDrawerOpen` + `drawerMode`, ni múltiples booleanos `createDrawer`, `viewDrawer`, `editDrawer`).
- **NO** usar funciones autoejecutables (`{(() => { ... })()}`) dentro del JSX.
- **NO** envolver cada grupo de inputs o cada dato del detalle en recuadros/tarjetas (`p-4 bg-[#111318] border border-[#2D3748] rounded-xl` ni `bg-[#1A1D23]`).
- **NO** usar subtítulos numerados (`1. Datos básicos`, `2. Ubicación`, etc.).

### ✅ Práctica Obligatoria: 2 `<Drawer>` Independientes + *Flat Surface Design*

*(Si un módulo tiene un tercer flujo operativo especial, como registrar devolución en Préstamos o Recepciones, se añade un 3er `<Drawer>` independiente con `modalMode === 'return'`).*

#### A. Modal de Vista / Detalle (`modalMode === 'view'`)
```tsx
{/* ── Modal Ver Detalles ── */}
<Drawer
  isOpen={modalMode === 'view' && !!selectedItem}
  onClose={closeModal}
  width="max-w-2xl"
  title="Detalle de <entidad>"
>
  {selectedItem && (
    <div className="space-y-5 text-xs">
      {/* Header / Badges */}
      <div className="flex items-start justify-between gap-3 pb-4 border-b border-[#2D3748]">
        <div>
          <h3 className="text-base font-bold text-[#F1F5F9]">{selectedItem.nombre}</h3>
          <p className="text-xs text-[#94A3B8] mt-0.5">{selectedItem.subtitulo}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <StatusBadge status={selectedItem.estado} />
        </div>
      </div>

      {/* Grilla de Información General (directamente sobre la superficie del modal) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <p className="text-[#64748B] text-[11px]">Etiqueta del campo</p>
          <p className="font-medium text-[#F1F5F9] text-[13px] mt-1">{selectedItem.valor}</p>
        </div>
      </div>

      {/* Secciones adicionales separadas únicamente por línea divisoria sutil */}
      <div className="pt-4 border-t border-[#2D3748]/60 space-y-2">
        <p className="text-[#64748B] text-[11px]">Descripción / Observaciones</p>
        <p className="text-[#F1F5F9] text-[13px] leading-relaxed">{selectedItem.descripcion}</p>
      </div>

      {/* Pie de Modal de Detalle (Cerrar a la izquierda, Editar a la derecha) */}
      <div className="pt-4 flex justify-end gap-3 border-t border-[#2D3748]">
        <button
          type="button"
          onClick={closeModal}
          className="px-4 py-2 rounded-xl text-xs font-medium text-[#94A3B8] hover:text-[#F1F5F9] border border-[#2D3748] transition-colors cursor-pointer"
        >
          Cerrar
        </button>
        <button
          type="button"
          onClick={() => {
            const item = selectedItem;
            closeModal();
            openEdit(item);
          }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-[#7C3AED] text-white hover:bg-[#6D28D9] transition-all cursor-pointer"
        >
          <Edit2 size={13} />
          Editar <entidad>
        </button>
      </div>
    </div>
  )}
</Drawer>
```

#### B. Modal de Creación / Edición (`modalMode === 'form'`)
```tsx
{/* ── Modal Crear / Editar ── */}
<Drawer
  isOpen={modalMode === 'form'}
  onClose={closeModal}
  width="max-w-2xl"
  title={isEditing ? 'Editar <entidad>' : 'Crear <entidad>'}
>
  <form onSubmit={handleSaveForm} className="space-y-4">
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <FormInput
        label="Nombre"
        placeholder="Ej. ..."
        value={editForm.nombre || ''}
        onChange={(e) => setEditForm((f) => ({ ...f, nombre: e.target.value }))}
        required
      />
      <FormSelect
        label="Categoría"
        value={editForm.categoria || ''}
        onChange={(e) => setEditForm((f) => ({ ...f, categoria: e.target.value }))}
        options={CATEGORIAS.map((c) => ({ label: c, value: c }))}
        hint="Texto de ayuda opcional debajo del campo"
      />
    </div>

    {/* Pie de Botones del Formulario (Cancelar a la izquierda, Acción principal a la derecha) */}
    <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#2D3748]">
      <button
        type="button"
        onClick={closeModal}
        className="px-5 py-2.5 rounded-xl text-[13px] font-medium text-[#F1F5F9] bg-transparent border border-[#2D3748] hover:bg-[#242830] transition-colors cursor-pointer"
      >
        Cancelar
      </button>
      <button
        type="submit"
        className="px-5 py-2.5 rounded-xl text-[13px] font-semibold bg-[#7C3AED] text-white hover:bg-[#6D28D9] transition-all shadow-sm shadow-[#7C3AED]/25 cursor-pointer"
      >
        {isEditing ? 'Guardar cambios' : 'Crear <entidad>'}
      </button>
    </div>
  </form>
</Drawer>
```

---

## 3. Estándar de Estado de Formularios (`editForm`)

- **PROHIBIDO:**
  - Usar inputs no controlados (`defaultValue={...}`) que no actualizan el estado de React.
  - Crear múltiples `useState` sueltos por cada campo (`formNombre`, `formDesc`, `formEstado`).
  - Tener dos estados de formulario distintos para crear y editar (`newForm` y `editForm`).
  - Llamar al estado `formState` o `createForm`.
- **OBLIGATORIO:**
  - Usar siempre un único objeto controlado `const [editForm, setEditForm] = useState<Partial<EntidadItem>>({})`.
  - Todos los `<FormInput />` y `<FormSelect />` reciben `value={editForm.campo || ''}` y `onChange={(e) => setEditForm((f) => ({ ...f, campo: e.target.value }))}`.

---

## 4. Estándar de Tablas (`DataTable`) y `TableStatusSelect`

- **SIEMPRE usar `<DataTable />`:**
  - Prohibido escribir `<table className="...">` y barras de paginación manuales dentro de las páginas (como ocurría en `EmpleadosPage` y `UsuariosPage`). Toda tabla de registros debe usar el componente `<DataTable />` compartido (la única excepción es la matriz cruzada de permisos en `RolesPage`).
- **Definición de Columnas (`Column<T>[]`):**
  - Para campos de texto simple sin estilo adicional, usar `accessorKey: 'campo'`.
  - Usar `cell: (r) => (...)` cuando se requiera:
    - Jerarquía de dos líneas (título en `font-semibold text-[#F1F5F9]` + subtítulo en `text-[11px] text-[#94A3B8]`).
    - Valores monetarios en verde (`font-semibold text-[#10B981]`).
    - Códigos o referencias en monospace (`font-mono text-[#A78BFA] font-semibold`).
    - Badges o selectores de estado.
- **Uso de `<TableStatusSelect />`:**
  - Usar siempre las props `status={r.estado}` y `onChange={(newEst) => handleStatusChange(r.id, newEst)}` (no usar los alias antiguos `currentStatus` ni `onStatusChange`).
  - Al cambiar el estado desde la tabla, actualizar también `selectedItem` si coincide el `id` y disparar `toast.info(\`Estado actualizado a \${newEst}\`)`.
- **Jerarquía de Columnas (de izquierda a derecha):**
  1. **Identidad Principal:** Nombre o título principal + subtítulo secundario.
  2. **Identificador / Documento / Código:** NIT, CC o código de referencia.
  3. **Clasificación / Categoría / Modalidad:** Tipo o categoría.
  4. **Atributos Operativos:** Contacto, ubicación, fecha o monto (`formatCOP`).
  5. **Estado:** Última columna antes de Acciones, usando `<TableStatusSelect />`.

---

## 5. Estándar de Nomenclatura y Textos (Copywriting)

| Elemento | Formato Estándar | Ejemplo (Eventos) | Ejemplo (Servicios) |
| :--- | :--- | :--- | :--- |
| **Botón en `PageHeader`** | `Crear <entidad>` | `Crear evento` | `Crear servicio` |
| **Título Modal Vista** | `Detalle de <entidad>` | `Detalle de evento` | `Detalle de servicio` |
| **Título Modal Crear** | `Crear <entidad>` | `Crear evento` | `Crear servicio` |
| **Título Modal Editar** | `Editar <entidad>` | `Editar evento` | `Editar servicio` |
| **Botón Submit (Crear)** | `Crear <entidad>` | `Crear evento` | `Crear servicio` |
| **Botón Submit (Editar)** | `Guardar cambios` | `Guardar cambios` | `Guardar cambios` |

*Nota: Siempre usar capitalización tipo oración (solo la primera letra en mayúscula: `"Crear servicio"`, nunca `"Crear Servicio"`, `"Nuevo Servicio"` ni `"Registrar Servicio"`).*

---

## 6. Formateo de Moneda, Eliminación y Notificaciones (`useToast`)

- **Moneda (COP):**
  - Almacenar los montos como `number` en el modelo (igual que `DECIMAL(10,2)` en MySQL), evitando duplicar propiedades como `total` (string) + `totalNum` (number).
  - Formatear para visualización con:
    ```tsx
    function formatCOP(value: number): string {
      return '$ ' + value.toLocaleString('es-CO');
    }
    ```
- **Eliminación y Alertas:**
  - **PROHIBIDO** usar `alert()` nativo del navegador.
  - Toda acción de crear, editar, cambiar estado o eliminar debe dar feedback mediante `useToast()`:
    - Crear: `toast.success('<Entidad> creado exitosamente')`
    - Editar: `toast.success('<Entidad> actualizado correctamente')`
    - Eliminar: validar primero reglas de negocio (si no se puede eliminar, `toast.error('...')`), y al eliminar disparar `toast.success('<Entidad> eliminado')`.
- **Comportamiento del Toast:**
  - Máximo **3 notificaciones** simultáneas en pantalla, auto-cierre sin botón `X`.
  - **Posición dinámica:** `top-right` cuando hay un modal (`role="dialog"`) abierto o en Login; `top-center` en navegación normal.
  - **Colores:** Verde (`#10B981`) = éxito, Rojo (`#EF4444`) = advertencia o error, Ámbar (`#F59E0B`) = información.

---

## 7. Estándar de Tarjetas KPI y Métricas Estadísticas

El componente [`KPICard`](src/components/KPICard.tsx) centraliza todas las métricas del sistema y cuenta con la prop `variant?: 'linear' | 'minimal'`:

- **Variante Activa: `'linear'` (Opción 1 — Dark Mode Premium):**
  - **Contenedor:** `bg-[#181B22] border border-[#262D3D] rounded-2xl p-5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] hover:border-[#3B455A] transition-all` (resuelve el dark mode mediante micro-reflejo superior en vez de sombra negra).
  - **Cápsula de Icono:** `w-8 h-8 rounded-lg bg-[#222734] border border-[#2D3546] flex items-center justify-center text-[#94A3B8]`.
  - **Métrica Principal:** `text-[24px] font-semibold text-[#F8FAFC] font-['Inter'] leading-none tracking-tight` (evita el deslumbramiento).
  - **Subtítulo:** `text-[12px] text-[#94A3B8] mt-2`.
- **Variante Fallback: `'minimal'` (Reversión Instantánea):**
  - Con solo cambiar `variant="minimal"` (o el valor por defecto en `KPICard.tsx`), se restaura automáticamente la estética plana previa con iconos libres y cifras a `28px font-bold`.
- **Fórmulas de Copywriting Estandarizadas (Subtítulos):**
  - **Montos totales:** `"Total del período"` (ej. Ventas Totales, Ingresos Totales).
  - **Saldos / Conteos activos:** `"En el período"` (ej. Cobros Pendientes, Pagos a Proveedores).
  - **Razón / Cumplimiento:** `"<Subconjunto> / Total"` (ej. valor `8/14` con `"Confirmados / Total"`).
  - **Promedios:** `"Promedio del período"`.
  - **Capacidad operativa:** `"<Estado> en el período"` (ej. `"Bloqueadas en el período"`, `"Disponibles en el período"`, `"Pendientes en el período"`).



---

## 8. Estándar vigente (PREVALECE sobre §1–§7 en lo que se contradiga)

### 8.1 Carpeta de cada módulo (`src/pages/<modulo>/`)
```
XPage.tsx               # Orquesta: recursos, filtros, modal y handlers. Única con router/toast
types.ts                # XItem (API) y XForm
constants.ts            # X_LABEL, X_FILTERS, estados, *_OPTIONS, *_TABS
form.ts                 # EMPTY_X, xToForm, validateX, xToPayload (puro, sin UI)
utils.ts                # Helpers de dominio (opcional)
components/xColumns.tsx # getXColumns(onStatusChange): Column<XItem>[]
drawers/XDetailDrawer.tsx · XFormDrawer.tsx
```
Modelo a copiar: `src/pages/clientes/`. Máximo 300 líneas por archivo.

### 8.2 Qué lleva cada página de listado, en orden
`ListPage` → `PageHeader` → `KPIStrip` con `KPICard` (opcional) → `IndexCard` con `IndexFilters {...filters.indexProps}` (pestañas con `buildTabs`; filtros: `FilterSelect` / `FilterSegmented`) y `DataTable`. Los drawers y `BulkActionsBar` van en `overlays`.

### 8.3 Piezas obligatorias
| Necesidad | Usar | Prohibido |
| :-- | :-- | :-- |
| Leer/escribir API | `useCrudResource` | `fetch` en páginas, `setItems` local |
| Crear/editar/eliminar + toast | `useCrudActions` | toast de éxito antes de que responda la API |
| Modales y formulario | `useRecordModal` (`modal.mode`, `modal.editForm`) | varios `useState` por modal |
| Búsqueda y filtros | `useListFilters` + `matchesSearch` | un `useState` por filtro |
| Tabla, vacío, carga, error, móvil, paginación | `DataTable` | `<table>` en páginas |
| Confirmar | `useConfirm` | `confirm()` / `alert()` |
| Formulario | `FormInput`, `FormSelect`, `FormTextarea`, `FormSection`, `FormActions` | inputs y pies a mano |
| Detalle | `components/detail` (`DetailHeader`, `DetailFooter`, `DetailStatusPicker`, `DetailAction`) | botones a mano |
| Moneda y fechas | `utils/format` (`formatCOP`, `parseCOP`, `todayISO`) | `toISOString().split` |
| Color de estado | `utils/statusTones` | mapas de color por módulo |
| URLs y datos entre pantallas | `routes/paths`, `routes/navigationState` | strings sueltos |

### 8.4 Código
- Imports absolutos `@/…`; relativos solo dentro del mismo módulo.
- `function` con props tipadas (sin `React.FC`, sin `any`); eventos con `SubmitEvent` (`FormEvent` está obsoleto).
- El servidor manda: asigna `id` y códigos y calcula totales y estados derivados (p. ej. el pago de una venta). El frontend los muestra, no los edita ni los genera. Los estados se tipan igual que el ENUM de la BD.
- Las relaciones se envían con su `id` (`evento_id`), no solo con el nombre.
- Todo selector lleva nombre accesible (`label` o `ariaLabel`).
- Sin datos inventados: ni mocks, ni valores por defecto ficticios, ni acciones que solo muestran un toast.
- Textos en tipo oración y sin jerga de base de datos (`FK`, nombres de tabla).

### 8.5 Sistema visual oficial: estilo Shopify con morado (prevalece sobre los colores y clases de §2, §4 y §7)
- Colores solo por token (`bg-surface`, `text-ink`, `text-ink-muted`, `border-line`, `bg-brand`, `*-soft` / `*-ink` por estado). Se definen una sola vez en `src/index.css`, para claro y oscuro. Prohibidos los hex en clases.
- Botones: `Button` (`primary`, `secondary`, `plain`, `danger`) o `icon-btn`. Campos: clase `field`. El morado (`brand`) se reserva para la acción principal, la selección y los enlaces.
- Tarjetas: `bg-surface rounded-xl shadow-card`, sin borde. Menús: `shadow-popover`. Modales: `shadow-modal`.
- Texto mínimo de 12 px (11 px solo en fichas del calendario y la navegación inferior). Montos en color de texto: el verde queda para estados.

### 8.6 Permisos, carga y datos de la empresa
- Permisos: `constants/access` (privilegios por módulo), `useCan` y `useModuleAccess`. Los componentes compartidos ya ocultan crear, editar, eliminar y estado; una acción propia declara `needs`. La API es la que decide.
- Carga: skeleton siempre (`DataTable`, `KPICard`, `IndexFilters` con `loading`, `FormSkeleton`, `PageLoader`). Nunca un cero mientras llegan los datos.
- `useCrudResource` conserva el último listado en memoria; `enabled: false` si la persona no puede leerlo.
- Formatos de contacto, documento y contraseña: `utils/validation` (iguales a los de la API).
- Nombre, lema y sede: `constants/empresa`. Ningún otro archivo los escribe.

### 8.7 Antes de entregar
`npm run check` sin errores (ESLint + tipos + formato + build). Las reglas de §8 que se pueden automatizar están en `eslint.config.js`: no se desactivan con comentarios.
