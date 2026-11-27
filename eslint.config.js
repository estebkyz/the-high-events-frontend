import reactHooks from "eslint-plugin-react-hooks"
import { defineConfig, globalIgnores } from "eslint/config"
import tseslint from "typescript-eslint"

/** Reglas del estándar (CLAUDE.md §8) que una herramienta puede comprobar. */
const standard = {
  "no-alert": "error",
  "no-console": "error",
  eqeqeq: "error",
  complexity: ["error", 20],
  "max-depth": ["error", 3],
  "max-lines": ["error", { max: 300 }],
  "no-restricted-imports": [
    "error",
    { patterns: [{ regex: "^\.\./\.\./", message: "Usa el alias @/…" }] },
  ],
  "@typescript-eslint/consistent-type-imports": [
    "error",
    { fixStyle: "inline-type-imports" },
  ],
  "@typescript-eslint/no-restricted-types": [
    "error",
    {
      types: {
        "React.FC": "Usa una función con props tipadas.",
        FC: "Usa una función con props tipadas.",
        FormEvent: "Está obsoleto: usa SubmitEvent.",
        "React.FormEvent": "Está obsoleto: usa SubmitEvent.",
      },
    },
  ],
  "no-restricted-syntax": [
    "error",
    {
      selector: "JSXAttribute[name.name='defaultValue']",
      message: "Los campos son controlados: usa value + onChange.",
    },
    {
      selector:
        "JSXExpressionContainer > CallExpression > ArrowFunctionExpression.callee",
      message: "Sin funciones autoejecutables en JSX: extrae un componente.",
    },
    {
      selector:
        "CallExpression[callee.property.name='split'][callee.object.callee.property.name='toISOString']",
      message: "toISOString es UTC: usa todayISO de @/utils/format.",
    },
  ],
}

/** Además, en las páginas. */
const pages = {
  "no-restricted-globals": [
    "error",
    { name: "fetch", message: "Usa useCrudResource o apiClient." },
    { name: "confirm", message: "Usa useConfirm." },
  ],
  "no-restricted-syntax": [
    ...standard["no-restricted-syntax"],
    {
      selector: "JSXOpeningElement[name.name='table']",
      message: "Usa DataTable.",
    },
    {
      selector: "CallExpression[callee.object.name='Date'][callee.property.name='now']",
      message: "El id lo asigna el servidor.",
    },
  ],
}

export default defineConfig([
  globalIgnores(["dist", "node_modules"]),
  {
    files: ["src/**/*.{ts,tsx}"],
    extends: [tseslint.configs.recommended, reactHooks.configs.flat.recommended],
    rules: standard,
  },
  { files: ["src/pages/**/*.{ts,tsx}"], rules: pages },
])
