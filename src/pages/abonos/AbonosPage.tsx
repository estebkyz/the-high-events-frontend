import { useMemo, useState, type SubmitEvent } from "react"
import { Banknote, Wallet } from "lucide-react"
import { useSearchParams } from "react-router-dom"
import { PageHeader } from "@/components/PageHeader"
import { SegmentedControl } from "@/components/SegmentedControl"
import { useToast } from "@/components/Toast"
import { DataTable } from "@/components/list/DataTable"
import { FilterSelect } from "@/components/list/FilterField"
import { IndexCard } from "@/components/list/IndexCard"
import { IndexFilters } from "@/components/list/IndexFilters"
import { ListPage } from "@/components/list/ListPage"
import { useCrudActions } from "@/hooks/useCrudActions"
import { useCrudResource } from "@/hooks/useCrudResource"
import { useListFilters } from "@/hooks/useListFilters"
import { useRecordModal } from "@/hooks/useRecordModal"
import { buildTabs, matchesSearch, withAllOption } from "@/utils/list"
import { getAbonoColumns } from "./components/abonoColumns"
import { AbonosKPIs } from "./components/AbonosKPIs"
import {
  ABONO_FILTERS,
  CARTERA,
  CARTERA_OPTIONS,
  ESTADO_CARTERA_OPTIONS,
  ESTADO_CARTERA_TABS,
} from "./constants"
import { AbonoDetailDrawer } from "./drawers/AbonoDetailDrawer"
import { PagoFormDrawer } from "./drawers/PagoFormDrawer"
import { aplicarPago, EMPTY_PAGO, pagoInicial, validatePago, verificarPago } from "./form"
import type { AbonoItem, EstadoPago, PagoForm, TipoCartera } from "./types"
import { admitePago, estadoCartera, getAbonoName, getTercero } from "./utils"
import { MODULE_ACCESS, VERIFY_PAYMENTS } from "@/constants/access"
import { useCan } from "@/hooks/useAccess"

/** Abonos de clientes y pagos a proveedores (`?cartera=Proveedores` abre esa cartera). */
export default function AbonosPage() {
  const toast = useToast()
  const canVerify = useCan()(VERIFY_PAYMENTS)
  const [searchParams] = useSearchParams()
  const [cartera, setCartera] = useState<TipoCartera>(() =>
    searchParams.get("cartera") === "Proveedores" ? "Proveedores" : "Clientes",
  )
  const copy = CARTERA[cartera]

  const abonos = useCrudResource<AbonoItem>({ endpoint: "/abonos" })
  const actions = useCrudActions(abonos, copy.label, getAbonoName)
  const filters = useListFilters(ABONO_FILTERS)
  const modal = useRecordModal<AbonoItem, PagoForm>(abonos.items, EMPTY_PAGO)

  const deCartera = useMemo(
    () => abonos.items.filter((a) => a.tipoCartera === cartera),
    [abonos.items, cartera],
  )
  const { search, matches } = filters
  const filteredData = useMemo(
    () =>
      deCartera.filter(
        (a) =>
          matches("estado", estadoCartera(a)) &&
          matchesSearch(search, [a.evento, a.servicio, getTercero(a)]),
      ),
    [deCartera, search, matches],
  )

  const openPago = (item: AbonoItem) => modal.openEdit(item, pagoInicial(item, canVerify))

  const handleVerificar = (item: AbonoItem, pagoId: string, estado: EstadoPago) =>
    actions.update(
      item.id,
      verificarPago(item, pagoId, estado),
      estado === "Pagado" ? "Pago verificado" : "Pago rechazado",
    )

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!modal.selected) return
    const error = validatePago(modal.editForm, modal.selected)
    if (error) {
      toast.error(error)
      return
    }
    const changes = aplicarPago(modal.selected, modal.editForm)
    if (await actions.update(modal.selected.id, changes, "Transacción registrada")) {
      modal.close()
    }
  }

  return (
    <ListPage
      overlays={
        <>
          <AbonoDetailDrawer
            isOpen={modal.mode === "view"}
            item={modal.selected}
            saving={actions.saving}
            onClose={modal.close}
            onRegistrarPago={openPago}
            onVerificar={handleVerificar}
          />
          <PagoFormDrawer
            isOpen={modal.mode === "form"}
            abono={modal.selected}
            saving={actions.saving}
            canVerify={canVerify}
            form={modal.editForm}
            setForm={modal.setEditForm}
            onClose={modal.close}
            onSubmit={(e) => void handleSubmit(e)}
          />
        </>
      }
    >
      <PageHeader
        title={copy.title}
        extraControls={
          <SegmentedControl
            label="Cartera"
            value={cartera}
            options={CARTERA_OPTIONS}
            onChange={(val) => setCartera(val as TipoCartera)}
          />
        }
      />

      <AbonosKPIs loading={abonos.loading} abonos={abonos.items} cartera={cartera} />

      <IndexCard>
        <IndexFilters
          tabs={buildTabs(deCartera, estadoCartera, ESTADO_CARTERA_TABS)}
          activeTab={filters.get("estado")}
          onTabChange={(tab) => filters.set("estado", tab)}
          loading={abonos.loading}
          {...filters.indexProps}
        >
          <FilterSelect
            label="Estado"
            value={filters.get("estado")}
            onChange={(val) => filters.set("estado", val)}
            options={withAllOption("Todos los registros", ESTADO_CARTERA_OPTIONS)}
          />
        </IndexFilters>
        <DataTable
          itemLabel={copy.label.plural}
          columns={getAbonoColumns(cartera)}
          data={filteredData}
          getName={getAbonoName}
          loading={abonos.loading}
          error={abonos.error}
          onRetry={() => void abonos.refresh()}
          resetKey={`${cartera}${filters.resetKey}`}
          isFiltered={filters.isFiltered}
          onResetFilters={filters.resetAll}
          onView={modal.openView}
          extraActions={[
            {
              label: "Registrar transacción",
              icon: Banknote,
              onClick: openPago,
              tone: "success",
              isVisible: admitePago,
              needs: MODULE_ACCESS.abonos.create,
            },
          ]}
          empty={{
            icon: Wallet,
            title: copy.emptyTitle,
            description: copy.emptyDescription,
          }}
        />
      </IndexCard>
    </ListPage>
  )
}
