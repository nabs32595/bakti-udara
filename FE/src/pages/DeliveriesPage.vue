<template>
  <div class="space-y-4">
    <!-- Hero / live header -->
    <div class="relative overflow-hidden rounded-xl bg-slate-900 p-4 text-white shadow-lg">
      <div class="relative flex flex-wrap items-center justify-between gap-4">
        <div>
          <div class="flex items-center gap-2">
            <span class="h-3 w-3 rounded-full bg-slate-200"></span>
            <span class="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-300">Live · OEM → Customer</span>
          </div>
          <h2 class="mt-1 text-xl font-bold tracking-tight">Delivery Operations</h2>
          <p class="mt-0.5 max-w-md text-xs text-slate-300">
            Real-time tracking of inbound OEM shipments and outbound customer deliveries across all purchase orders.
          </p>
        </div>
        <div class="text-right">
          <div class="text-4xl font-bold tabular-nums text-slate-100">{{ Math.round(onTimePct) }}<span class="text-xl">%</span></div>
          <div class="text-xs uppercase tracking-widest text-slate-300">On-Time Performance</div>
        </div>
      </div>
    </div>

    <!-- KPI cards -->
    <div class="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
      <div
        v-for="kpi in kpis"
        :key="kpi.label"
        class="group relative overflow-hidden rounded-xl border bg-card p-3 shadow-sm"
      >
        <div class="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-slate-700 to-slate-900"></div>
        <div class="flex items-start justify-between">
          <div>
            <p class="text-xs font-medium text-muted-foreground">{{ kpi.label }}</p>
            <p class="mt-0.5 text-2xl font-bold tabular-nums">{{ kpi.value }}</p>
            <p class="mt-0.5 text-[11px] text-muted-foreground">{{ kpi.sub }}</p>
          </div>
          <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
            <component :is="kpi.icon" class="h-5 w-5" />
          </div>
        </div>
      </div>
    </div>

    <!-- Performance + pipeline -->
    <div class="grid gap-3 lg:grid-cols-3">
      <!-- On-time performance -->
      <div class="rounded-xl border bg-card p-4 shadow-sm">
        <h3 class="text-sm font-semibold">Delivery Performance</h3>
        <p class="text-xs text-muted-foreground">Share of shipments meeting the original EDD</p>
        <div class="mt-3 space-y-3">
          <div>
            <div class="mb-1 flex items-center justify-between text-xs">
              <span class="font-medium text-slate-700">On Time</span>
              <span class="tabular-nums text-muted-foreground">{{ onTime }} / {{ totalShipments }}</span>
            </div>
            <div class="h-2.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                class="h-full rounded-full bg-gradient-to-r from-green-500 to-green-400"
                :style="{ width: onTimePct + '%' }"
              ></div>
            </div>
          </div>
          <div>
            <div class="mb-1 flex items-center justify-between text-xs">
              <span class="font-medium text-slate-700">Revised EDD</span>
              <span class="tabular-nums text-muted-foreground">{{ revised }} / {{ totalShipments }}</span>
            </div>
            <div class="h-2.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                class="h-full rounded-full bg-gradient-to-r from-yellow-400 to-yellow-300"
                :style="{ width: (revised / totalShipments * 100) + '%' }"
              ></div>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-3 pt-2">
            <div class="rounded-lg bg-muted/60 p-3">
              <p class="text-xs text-muted-foreground">Avg. Slippage</p>
              <p class="text-lg font-bold tabular-nums" :class="avgDelta <= 0 ? 'text-red-600' : 'text-green-600'">
                {{ avgDelta > 0 ? '+' : '' }}{{ avgDelta.toFixed(1) }}d
              </p>
            </div>
            <div class="rounded-lg bg-muted/60 p-3">
              <p class="text-xs text-muted-foreground">Delivered</p>
              <p class="text-lg font-bold tabular-nums text-slate-700">{{ delivered }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Delivery pipeline -->
      <div class="rounded-xl border bg-card p-4 shadow-sm lg:col-span-2">
        <h3 class="text-sm font-semibold">Delivery Pipeline</h3>
        <p class="text-xs text-muted-foreground">Flow of shipments from PO creation to delivery</p>
        <div class="mt-4 flex items-center justify-between gap-2">
          <template v-for="(stage, i) in stages" :key="stage.name">
            <div class="flex flex-1 flex-col items-center text-center">
              <div
                class="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-700 to-slate-900 text-white shadow-md"
              >
                <component :is="stage.icon" class="h-6 w-6" />
              </div>
              <p class="mt-2 text-2xl font-bold tabular-nums">{{ stage.count }}</p>
              <p class="text-xs font-medium text-muted-foreground">{{ stage.name }}</p>
            </div>
            <div v-if="i < stages.length - 1" class="relative -mt-8 h-1 flex-1 overflow-hidden rounded-full bg-muted">
              <div class="animate-flow absolute inset-y-0 left-0 w-1/3 rounded-full bg-gradient-to-r from-slate-400 to-slate-500"></div>
            </div>
          </template>
        </div>
        <div class="mt-6 grid grid-cols-3 gap-3 text-center text-xs text-muted-foreground">
          <div>PO Reference acts as the tracking key</div>
          <div>Status links to live PO record</div>
          <div>EDD vs actual delivery measured</div>
        </div>
      </div>
    </div>

    <!-- Filter + table -->
    <div class="rounded-xl border bg-card p-4 shadow-sm">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 class="text-sm font-semibold">Shipment Tracker</h3>
          <p class="text-xs text-muted-foreground">{{ filtered.length }} shipment{{ filtered.length === 1 ? '' : 's' }} in view</p>
        </div>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="f in filters"
            :key="f"
            @click="activeFilter = f"
            class="rounded-full border px-3 py-1 text-xs font-medium"
            :class="activeFilter === f
              ? 'border-slate-900 bg-slate-900 text-white shadow'
              : 'border-border bg-background text-muted-foreground hover:border-slate-400 hover:text-foreground'"
          >
            {{ f }}
          </button>
        </div>
      </div>

      <div class="mt-3 overflow-hidden rounded-lg border [&_td]:px-3 [&_td]:py-2 [&_th]:px-3 [&_th]:py-2">
        <Table>
          <TableHeader class="bg-muted/50">
            <TableRow>
              <TableHead>PO Reference</TableHead>
              <TableHead>Part</TableHead>
              <TableHead class="text-right">Qty</TableHead>
              <TableHead>Expected Delivery</TableHead>
              <TableHead>Actual Delivery</TableHead>
              <TableHead class="text-right">Slippage</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow
              v-for="d in filtered"
              :key="d.id"
              @click="openPO(d.poReference)"
              class="group cursor-pointer hover:bg-muted/60"
            >
              <TableCell>
                <div class="flex items-center gap-2">
                  <span class="h-2 w-2 rounded-full" :class="statusDot(d.deliveryStatus)"></span>
                  <span class="font-mono text-xs font-medium text-foreground">{{ d.poReference }}</span>
                </div>
                <span class="text-[11px] text-muted-foreground">RFQ: {{ d.rfqNo }}</span>
              </TableCell>
              <TableCell>
                <p class="text-sm font-medium">{{ d.desc }}</p>
                <p class="font-mono text-[11px] text-muted-foreground">P/N: {{ d.pno }}</p>
              </TableCell>
              <TableCell class="text-right tabular-nums">{{ d.quantity }}</TableCell>
              <TableCell class="tabular-nums text-muted-foreground">{{ d.expectedDeliveryDate }}<span v-if="d.revisedDate" class="block text-[11px] text-slate-500">rev. {{ d.revisedDate }}</span></TableCell>
              <TableCell class="tabular-nums">
                <span v-if="d.actualDeliveryDate" class="text-foreground">{{ d.actualDeliveryDate }}</span>
                <span v-else class="inline-flex items-center gap-1 text-xs text-slate-500">
                  <span class="h-1.5 w-1.5 rounded-full bg-slate-400"></span> pending
                </span>
              </TableCell>
              <TableCell class="text-right">
                <span class="tabular-nums font-medium" :class="d.daysDelta <= 0 ? 'text-red-600' : 'text-green-600'">
                  {{ d.daysDelta > 0 ? '+' : '' }}{{ d.daysDelta }}d
                </span>
              </TableCell>
              <TableCell>
                <Badge :class="statusBadge(d.deliveryStatus).class">
                  {{ d.deliveryStatus }}
                </Badge>
              </TableCell>
            </TableRow>
            <TableRow v-if="filtered.length === 0">
              <TableCell colspan="7" class="py-10 text-center text-sm text-muted-foreground">No shipments match this filter.</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
      <p class="mt-3 text-[11px] text-muted-foreground">
        Tip: click any row to open its purchase order. Linked quotation
        <span class="font-mono">#{{ deliveries[0]?.quotationNo }}</span> drives the delivery schedule.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Package, Truck, CheckCircle2, Clock, FileText } from 'lucide-vue-next'
import { useLocalStorage } from '@/composables/useLocalStorage'
import { INITIAL_PO_LIST } from '@/data/mockData/purchaseOrders'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

const router = useRouter()
const poList = useLocalStorage('poList', INITIAL_PO_LIST)

const deliveries = computed(() => poList.value as any[])

const totalShipments = computed(() => deliveries.value.length)
const onTime = computed(() => deliveries.value.filter(d => d.deliveryStatus === 'ON TIME').length)
const revised = computed(() => deliveries.value.filter(d => d.deliveryStatus === 'REVISE EDD').length)
const delivered = computed(() => deliveries.value.filter(d => !!d.actualDeliveryDate).length)
const inTransit = computed(() => deliveries.value.filter(d => !d.actualDeliveryDate).length)
const totalPOs = computed(() => new Set(deliveries.value.map(d => d.poReference)).size)
const onTimePct = computed(() => totalShipments.value ? (onTime.value / totalShipments.value) * 100 : 0)
const avgDelta = computed(() => {
  const arr = deliveries.value.map(d => d.daysDelta || 0)
  return arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0
})

const kpis = computed(() => [
  { label: 'Total Shipments', value: totalShipments.value, sub: `${totalPOs.value} purchase orders`, icon: Package },
  { label: 'On Time', value: onTime.value, sub: `${onTimePct.value.toFixed(0)}% of total`, icon: CheckCircle2 },
  { label: 'Revised EDD', value: revised.value, sub: 'Delivery date pushed out', icon: Clock },
  { label: 'In Transit', value: inTransit.value, sub: `${delivered.value} already delivered`, icon: Truck },
])

const stages = computed(() => [
  { name: 'PO Raised', count: totalShipments.value, icon: FileText },
  { name: 'In Transit', count: inTransit.value, icon: Truck },
  { name: 'Delivered', count: delivered.value, icon: CheckCircle2 },
])

const filters = ['All', 'On Time', 'Revised EDD', 'Delivered', 'In Transit']
const activeFilter = ref('All')
const filtered = computed(() => {
  const list = deliveries.value
  switch (activeFilter.value) {
    case 'On Time': return list.filter(d => d.deliveryStatus === 'ON TIME')
    case 'Revised EDD': return list.filter(d => d.deliveryStatus === 'REVISE EDD')
    case 'Delivered': return list.filter(d => !!d.actualDeliveryDate)
    case 'In Transit': return list.filter(d => !d.actualDeliveryDate)
    default: return list
  }
})

const statusBadge = (status: string) => {
  if (status === 'ON TIME') return { class: 'bg-green-100 text-green-800 border-green-200' }
  if (status === 'REVISE EDD') return { class: 'bg-yellow-100 text-yellow-800 border-yellow-200' }
  return { class: 'bg-gray-100 text-gray-700 border-gray-200' }
}
const statusDot = (status: string) =>
  status === 'ON TIME' ? 'bg-green-500' : status === 'REVISE EDD' ? 'bg-yellow-500' : 'bg-gray-300'

const openPO = (poRef: string) => router.push(`/purchase-orders/${encodeURIComponent(poRef)}`)
</script>

<style>
@keyframes flow {
  0% { transform: translateX(-120%); }
  100% { transform: translateX(320%); }
}
.animate-flow {
  animation: flow 2.2s linear infinite;
}
</style>