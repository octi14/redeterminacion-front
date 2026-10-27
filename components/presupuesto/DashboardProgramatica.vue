<template>
  <div class="dash" @click="openFilter = null">
    <section class="filters">
      <div
        v-for="d in dims"
        :key="d.key"
        class="f"
        :class="{ open: openFilter === d.key }"
        @click.stop
      >
        <label>{{ d.label }}</label>
        <button type="button" :class="{ on: filters[d.key].length }" @click="toggleOpen(d.key)">
          <span>{{ filterLabel(d.key) }}</span>
          <span>▾</span>
        </button>
        <div class="panel">
          <input v-model="filterSearch[d.key]" type="search" placeholder="Buscar…">
          <div class="opts">
            <label v-for="opt in filterOptions(d.key)" :key="opt.value" class="opt">
              <input
                type="checkbox"
                :checked="filters[d.key].includes(opt.value)"
                @change="toggleFilter(d.key, opt.value)"
              >
              <span class="n">{{ opt.value }}</span>
              <span class="v">{{ mm(opt.amount) }}</span>
            </label>
            <div v-if="!filterOptions(d.key).length" class="empty">Sin opciones</div>
          </div>
        </div>
      </div>
      <div class="f">
        <label>Búsqueda libre</label>
        <input v-model.trim="q" type="search" placeholder="Texto en cualquier campo">
      </div>
      <div class="f">
        <label>Crédito mínimo ($)</label>
        <input v-model="min" type="number" min="0" step="1000000">
      </div>
      <div class="f">
        <label>Crédito máximo ($)</label>
        <input v-model="max" type="number" min="0" step="1000000">
      </div>
      <button type="button" @click="reset">Limpiar filtros</button>
      <button type="button" @click="exportCsv">Exportar CSV</button>
    </section>

    <div class="chips">
      <span v-for="c in chips" :key="c.text" class="chip" @click="c.clear">{{ c.text }} ✕</span>
    </div>

    <section class="kpis">
      <div v-for="k in kpis" :key="k.title" class="kpi" :class="{ big: k.big }">
        <small>{{ k.title }}</small>
        <b>{{ k.value }}</b>
        <i>{{ k.sub }}</i>
      </div>
    </section>

    <section class="grid">
      <div class="card">
        <h2>Crédito por secretaría / jurisdicción <small>(clic para filtrar)</small></h2>
        <div class="scroll">
          <div
            v-for="b in barsSec"
            :key="b.v"
            class="bar"
            :class="{ sel: b.sel }"
            :title="b.v + ': ' + money(b.a)"
            @click="toggleFilter('s', b.v)"
          >
            <span class="l">{{ b.v }}</span>
            <span class="t"><i :style="{ width: b.w + '%' }"></i></span>
            <span class="v">{{ mm(b.a) }}</span>
          </div>
          <div v-if="!barsSec.length" class="empty">Sin datos para los filtros actuales</div>
        </div>
      </div>
      <div class="card">
        <h2>Participación por nivel de apertura <small>(clic para filtrar)</small></h2>
        <div v-if="donutSlices.length" class="donut">
          <svg viewBox="0 0 170 170">
            <path
              v-for="s in donutSlices"
              :key="s.v"
              :d="s.d"
              :fill="s.fill"
              :opacity="s.opacity"
              :title="s.v + ': ' + money(s.a)"
              @click="toggleFilter('n', s.v)"
            >
              <title>{{ s.v }}: {{ money(s.a) }}</title>
            </path>
          </svg>
          <div class="lg">
            <div v-for="s in donutSlices" :key="'lg-' + s.v" @click="toggleFilter('n', s.v)">
              <i :style="{ background: s.fill }"></i>{{ s.v }}<br>
              <small>{{ mm(s.a) }} · {{ pct(s.pct) }}</small>
            </div>
          </div>
        </div>
        <div v-else class="empty">Sin datos</div>
        <h2 class="mt">Órgano <small>(clic para filtrar)</small></h2>
        <div
          v-for="b in barsOrg"
          :key="b.v"
          class="bar"
          :class="{ sel: b.sel }"
          :title="b.v + ': ' + money(b.a)"
          @click="toggleFilter('o', b.v)"
        >
          <span class="l">{{ b.v }}</span>
          <span class="t"><i :style="{ width: b.w + '%' }"></i></span>
          <span class="v">{{ mm(b.a) }}</span>
        </div>
      </div>
      <div class="card card-wide">
        <h2>Mayores programas <small>(top 15 · clic para filtrar)</small></h2>
        <div
          v-for="b in barsProg"
          :key="b.v"
          class="bar"
          :class="{ sel: b.sel }"
          :title="b.v + ': ' + money(b.a)"
          @click="toggleFilter('pk', b.v)"
        >
          <span class="l">{{ b.v }}</span>
          <span class="t"><i :style="{ width: b.w + '%' }"></i></span>
          <span class="v">{{ mm(b.a) }}</span>
        </div>
      </div>
    </section>

    <div class="tabs">
      <button type="button" :class="{ on: view === 't' }" @click="view = 't'">Árbol jerárquico</button>
      <button type="button" :class="{ on: view === 'f' }" @click="view = 'f'">Detalle plano</button>
      <button v-if="view === 't'" type="button" @click="expandAll">Expandir todo</button>
      <button v-if="view === 't'" type="button" @click="collapseAll">Contraer todo</button>
    </div>

    <div class="tw">
      <table v-if="view === 't'">
        <thead>
          <tr>
            <th>Estructura programática</th>
            <th>Nivel</th>
            <th class="r">Crédito original</th>
            <th class="r">% filtrado</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="row in treeRows"
            :key="row.id"
            :class="[row.cls, { tg: row.has }]"
            @click="row.has && toggleOpenId(row.id)"
          >
            <td :style="{ paddingLeft: 8 + row.pad * 20 + 'px' }">
              {{ row.has ? (open[row.id] ? '▾ ' : '▸ ') : '· ' }}{{ row.lbl }}
            </td>
            <td>{{ row.niv }}</td>
            <td class="r">{{ money(row.m) }}</td>
            <td class="r">{{ pct(row.pct) }}</td>
          </tr>
        </tbody>
      </table>
      <table v-else>
        <thead>
          <tr>
            <th
              v-for="c in cols"
              :key="c.k"
              :class="c.cls"
              @click="sortBy(c.k)"
            >
              {{ c.label }}{{ sortK === c.k ? (sortD > 0 ? ' ▲' : ' ▼') : '' }}
            </th>
            <th class="r">% filtrado</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(r, i) in flatPage" :key="i">
            <td>{{ r.s }}</td>
            <td>{{ r.pk }}</td>
            <td>{{ r.sk }}</td>
            <td>{{ r.ok }}</td>
            <td>{{ r.n }}</td>
            <td class="r">{{ money(r.m) }}</td>
            <td class="r">{{ pct(filteredTot ? r.m / filteredTot : 0) }}</td>
          </tr>
        </tbody>
      </table>
      <div v-if="!filtered.length" class="empty">Sin datos para los filtros actuales</div>
    </div>
    <div v-if="view === 'f'" class="pg">
      <button type="button" @click="page = Math.max(0, page - 1)">‹</button>
      <span>Página {{ page + 1 }} de {{ pageCount }} · {{ filtered.length }} líneas</span>
      <button type="button" @click="page = Math.min(pageCount - 1, page + 1)">›</button>
    </div>
  </div>
</template>

<script>
import DATA from '~/assets/data/presupuesto-2027-programatica.json'
import { money, mm, pct, downloadCsv } from '~/utils/presupuestoFormat'

const PAL = ['#28a745', '#17a2b8', '#ffc107', '#e53749', '#9966FF', '#e27910']
const DIMS = [
  { key: 'o', label: 'Órgano' },
  { key: 's', label: 'Secretaría / jurisdicción' },
  { key: 'pk', label: 'Programa' },
  { key: 'sk', label: 'Subprograma' },
  { key: 'n', label: 'Nivel de apertura' },
]
const COLS = [
  { k: 's', label: 'Secretaría / jurisdicción' },
  { k: 'pk', label: 'Programa' },
  { k: 'sk', label: 'Subprograma' },
  { k: 'ok', label: 'Obra / actividad' },
  { k: 'n', label: 'Nivel' },
  { k: 'm', label: 'Crédito original', cls: 'r' },
]
const PS = 20

export default {
  name: 'DashboardProgramatica',
  data() {
    return {
      dims: DIMS,
      cols: COLS,
      filters: { o: [], s: [], pk: [], sk: [], n: [] },
      filterSearch: { o: '', s: '', pk: '', sk: '', n: '' },
      openFilter: null,
      q: '',
      min: '',
      max: '',
      view: 't',
      sortK: 'm',
      sortD: -1,
      page: 0,
      open: {},
    }
  },
  computed: {
    allRows() {
      return DATA.map((r) => ({
        ...r,
        pk: r.pc + ' - ' + r.p,
        sk: r.sc ? r.sc + ' - ' + r.sn : '(sin subprograma)',
        ok: r.oc ? r.oc + ' - ' + r.on : '—',
      }))
    },
    totalAll() {
      return this.allRows.reduce((a, r) => a + r.m, 0)
    },
    filtered() {
      return this.allRows.filter((r) => this.pass(r))
    },
    filteredTot() {
      return this.filtered.reduce((a, r) => a + r.m, 0)
    },
    kpis() {
      const rows = this.filtered
      const t = this.filteredTot
      const s = this.sumMap(rows, 's')
      const top = [...s].sort((a, b) => b[1] - a[1])[0]
      return [
        { title: 'Crédito filtrado', value: money(t), sub: 'Total general: ' + money(this.totalAll), big: true },
        { title: '% del presupuesto total', value: pct(this.totalAll ? t / this.totalAll : 0), sub: '' },
        { title: 'Líneas presupuestarias', value: rows.length.toLocaleString('es-AR'), sub: 'de ' + this.allRows.length },
        { title: 'Secretarías / jurisdicciones', value: s.size, sub: 'de ' + new Set(this.allRows.map((r) => r.s)).size },
        { title: 'Programas', value: new Set(rows.map((r) => r.pk)).size, sub: 'de ' + new Set(this.allRows.map((r) => r.pk)).size },
        { title: 'Promedio por línea', value: rows.length ? mm(t / rows.length) : '—', sub: '' },
        { title: 'Mayor jurisdicción', value: top ? pct(top[1] / t) : '—', sub: top ? top[0] : '' },
      ]
    },
    barsSec() {
      return this.barList(this.sumMap(this.filtered, 's'), 's')
    },
    barsOrg() {
      return this.barList(this.sumMap(this.filtered, 'o'), 'o')
    },
    barsProg() {
      return this.barList(this.sumMap(this.filtered, 'pk'), 'pk', 15)
    },
    donutSlices() {
      const rows = this.filtered
      const tot = this.filteredTot
      if (!tot) return []
      const m = [...this.sumMap(rows, 'n')].sort((a, b) => b[1] - a[1])
      let a0 = -Math.PI / 2
      return m.map(([v, a], i) => {
        const a1 = a0 + Math.min(a / tot, 0.9999) * 2 * Math.PI
        const lg = a1 - a0 > Math.PI ? 1 : 0
        const x = (t) => 85 + 80 * Math.cos(t)
        const y = (t) => 85 + 80 * Math.sin(t)
        const x2 = (t) => 85 + 48 * Math.cos(t)
        const y2 = (t) => 85 + 48 * Math.sin(t)
        const d = `M${x(a0)} ${y(a0)}A80 80 0 ${lg} 1 ${x(a1)} ${y(a1)}L${x2(a1)} ${y2(a1)}A48 48 0 ${lg} 0 ${x2(a0)} ${y2(a0)}Z`
        a0 = a1
        return {
          v,
          a,
          fill: PAL[i % 6],
          d,
          opacity: this.filters.n.length && !this.filters.n.includes(v) ? 0.35 : 1,
          pct: a / tot,
        }
      })
    },
    chips() {
      const c = []
      DIMS.forEach((d) => {
        this.filters[d.key].forEach((v) => {
          c.push({ text: `${d.label}: ${v}`, clear: () => this.toggleFilter(d.key, v) })
        })
      })
      if (this.q) c.push({ text: 'Texto: ' + this.q, clear: () => { this.q = '' } })
      if (this.min !== '') c.push({ text: 'Mín: ' + mm(+this.min), clear: () => { this.min = '' } })
      if (this.max !== '') c.push({ text: 'Máx: ' + mm(+this.max), clear: () => { this.max = '' } })
      return c
    },
    treeRows() {
      const rows = this.filtered
      const tot = this.filteredTot
      const T = new Map()
      rows.forEach((r) => {
        const a = T.get(r.s) || T.set(r.s, { m: 0, c: new Map() }).get(r.s)
        a.m += r.m
        const b = a.c.get(r.pk) || a.c.set(r.pk, { m: 0, r: [] }).get(r.pk)
        b.m += r.m
        b.r.push(r)
      })
      const out = []
      ;[...T].sort((a, b) => b[1].m - a[1].m).forEach(([s, a]) => {
        const sid = 's:' + s
        out.push({ id: sid, cls: 'g1', pad: 0, lbl: s, niv: 'Jurisdicción', m: a.m, has: true, pct: tot ? a.m / tot : 0 })
        if (this.open[sid]) {
          ;[...a.c].sort((x, y) => y[1].m - x[1].m).forEach(([p, b]) => {
            const id = 'p:' + s + p
            const leaf = b.r.length === 1 && b.r[0].n === 'Programa'
            out.push({ id, cls: 'g2', pad: 1, lbl: p, niv: 'Programa', m: b.m, has: !leaf, pct: tot ? b.m / tot : 0 })
            if (this.open[id] && !leaf) {
              b.r.sort((x, y) => y.m - x.m).forEach((r) => {
                out.push({
                  id: id + r.sk + r.ok,
                  cls: '',
                  pad: 2,
                  lbl: r.n === 'Programa' ? '(crédito directo del programa)' : r.oc ? r.sk + ' › ' + r.ok : r.sk,
                  niv: r.n,
                  m: r.m,
                  has: false,
                  pct: tot ? r.m / tot : 0,
                })
              })
            }
          })
        }
      })
      return out
    },
    pageCount() {
      return Math.max(1, Math.ceil(this.filtered.length / PS))
    },
    flatPage() {
      const l = [...this.filtered].sort((a, b) => (a[this.sortK] > b[this.sortK] ? 1 : -1) * this.sortD)
      const p = Math.min(this.page, this.pageCount - 1)
      return l.slice(p * PS, p * PS + PS)
    },
  },
  watch: {
    q() { this.page = 0 },
    min() { this.page = 0 },
    max() { this.page = 0 },
  },
  methods: {
    money,
    mm,
    pct,
    pass(r, skip) {
      const q = this.q.toLowerCase()
      if (skip !== 'q' && q && !(r.s + r.pk + r.sk + r.ok + r.o).toLowerCase().includes(q)) return false
      if (this.min !== '' && r.m < +this.min) return false
      if (this.max !== '' && r.m > +this.max) return false
      for (const k of Object.keys(this.filters)) {
        if (k !== skip && this.filters[k].length && !this.filters[k].includes(r[k])) return false
      }
      return true
    },
    sumMap(rows, k) {
      const m = new Map()
      rows.forEach((r) => m.set(r[k], (m.get(r[k]) || 0) + r.m))
      return m
    },
    barList(map, k, max) {
      const l = [...map].sort((a, b) => b[1] - a[1]).slice(0, max || 99)
      const top = l[0] ? l[0][1] : 1
      return l.map(([v, a]) => ({ v, a, sel: this.filters[k].includes(v), w: (a / top) * 100 }))
    },
    filterOptions(k) {
      const t = (this.filterSearch[k] || '').trim().toLowerCase()
      const m = this.sumMap(this.allRows.filter((r) => this.pass(r, k)), k)
      this.filters[k].forEach((v) => { if (!m.has(v)) m.set(v, 0) })
      return [...m]
        .filter((x) => String(x[0]).toLowerCase().includes(t))
        .sort((a, b) => b[1] - a[1])
        .map(([value, amount]) => ({ value, amount }))
    },
    filterLabel(k) {
      const n = this.filters[k].length
      return n ? n + ' seleccionado' + (n > 1 ? 's' : '') : 'Todos'
    },
    toggleOpen(k) {
      this.openFilter = this.openFilter === k ? null : k
    },
    toggleFilter(k, v) {
      const arr = this.filters[k]
      const i = arr.indexOf(v)
      if (i >= 0) arr.splice(i, 1)
      else arr.push(v)
      this.page = 0
    },
    toggleOpenId(id) {
      this.open = { ...this.open, [id]: !this.open[id] }
    },
    expandAll() {
      const o = {}
      this.allRows.forEach((r) => {
        o['s:' + r.s] = true
        o['p:' + r.s + r.pk] = true
      })
      this.open = o
    },
    collapseAll() {
      this.open = {}
    },
    reset() {
      this.filters = { o: [], s: [], pk: [], sk: [], n: [] }
      this.q = ''
      this.min = ''
      this.max = ''
      this.page = 0
    },
    sortBy(k) {
      this.sortD = this.sortK === k ? -this.sortD : k === 'm' ? -1 : 1
      this.sortK = k
    },
    async exportCsv() {
      const q = (v) => '"' + String(v).replace(/"/g, '""') + '"'
      const head = ['Órgano', 'Secretaría', 'Programa', 'Subprograma', 'Obra / actividad', 'Nivel', 'Crédito original'].join(';')
      const body = this.filtered
        .map((r) => [r.o, r.s, r.pk, r.sk, r.ok, r.n].map(q).concat(r.m.toFixed(2).replace('.', ',')).join(';'))
        .join('\n')
      await downloadCsv(head + '\n' + body, 'presupuesto_2027_filtrado.csv')
    },
  },
}
</script>

<style scoped>
.dash {
  --bg: var(--gray-bs-100);
  --card: var(--color-white);
  --ink: #353535;
  --mut: var(--gray-bs-600);
  --line: var(--gray-bs-300);
  --brand: #0c681a;
  --acc: #28a745;
  --acc2: #e27910;
  --sel: var(--green-fill);
  color: var(--ink);
}
.filters {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  align-items: flex-end;
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: 8px;
  padding: 12px;
}
.f { position: relative; min-width: 0; width: 100%; }
.f > label { display: block; font-size: 12px; color: var(--mut); margin-bottom: 2px; }
.f > button, .f > input, .filters > button {
  font: inherit;
  color: inherit;
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: 6px;
  padding: 6px 12px;
  cursor: pointer;
  width: 100%;
}
.f > button { text-align: left; display: flex; justify-content: space-between; gap: 8px; }
.f > button.on { background: var(--sel); border-color: var(--acc); }
.filters > button { width: auto; }
.f > input { cursor: text; background: var(--bg); }
.panel {
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  width: min(340px, 90vw);
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: 8px;
  box-shadow: 0 8px 24px #0003;
  padding: 8px;
  z-index: 30;
}
.f.open .panel { display: block; }
.panel input[type=search] {
  width: 100%;
  margin-bottom: 6px;
  background: var(--bg);
  border: 1px solid var(--line);
  border-radius: 6px;
  padding: 6px 8px;
  color: inherit;
  font: inherit;
}
.opts { max-height: 260px; overflow: auto; }
.opt { display: flex; gap: 8px; padding: 3px 4px; border-radius: 4px; cursor: pointer; align-items: flex-start; }
.opt:hover { background: var(--sel); }
.opt span.n { flex: 1; }
.opt span.v { color: var(--mut); white-space: nowrap; font-size: 12px; }
.chips { margin: 10px 0; display: flex; gap: 6px; flex-wrap: wrap; }
.chip { background: var(--sel); border: 1px solid var(--acc); border-radius: 99px; padding: 2px 10px; font-size: 12px; cursor: pointer; }
.kpis { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin: 12px 0; }
.kpi, .card { background: var(--card); border: 1px solid var(--line); border-radius: 8px; padding: 12px 14px; }
.kpi small { color: var(--mut); }
.kpi b { display: block; font-size: 18px; margin-top: 2px; }
.kpi i { font-style: normal; font-size: 12px; color: var(--mut); }
.kpi.big { border-left: 5px solid var(--acc); grid-column: 1 / -1; }
.grid { display: grid; grid-template-columns: 1fr; gap: 12px; }
.card h2 { margin: 0 0 8px; font-size: 15px; }
.card h2 small { font-weight: 400; color: var(--mut); }
.card .mt { margin-top: 14px; }
.bar {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 6px 8px;
  align-items: center;
  padding: 3px 4px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
}
.bar .t { grid-column: 1 / -1; height: 14px; background: var(--line); border-radius: 3px; overflow: hidden; }
.bar .t i { display: block; height: 100%; background: var(--acc); }
.bar .l { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.bar .v { font-variant-numeric: tabular-nums; color: var(--mut); font-size: 12px; }
.bar:hover, .bar.sel { background: var(--sel); }
.scroll { max-height: 380px; overflow: auto; }
.donut { display: flex; gap: 16px; align-items: center; flex-wrap: wrap; }
.donut svg { width: 170px; height: 170px; }
.donut path { cursor: pointer; }
.lg div { cursor: pointer; padding: 2px 4px; border-radius: 4px; }
.lg div:hover { background: var(--sel); }
.lg i { display: inline-block; width: 11px; height: 11px; border-radius: 2px; margin-right: 6px; }
.tabs { display: flex; gap: 6px; margin: 14px 0 8px; align-items: center; flex-wrap: wrap; }
.tabs button, .pg button {
  font: inherit;
  color: inherit;
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: 6px;
  padding: 6px 12px;
  cursor: pointer;
}
.tabs .on { background: var(--brand); color: #fff; border-color: var(--brand); }
.tw { background: var(--card); border: 1px solid var(--line); border-radius: 8px; max-height: 560px; overflow: auto; }
table { border-collapse: collapse; width: 100%; font-size: 13px; }
th, td { padding: 6px 8px; border-bottom: 1px solid var(--line); text-align: left; vertical-align: top; }
th { cursor: pointer; position: sticky; top: 0; background: var(--card); white-space: nowrap; }
td.r, th.r { text-align: right; font-variant-numeric: tabular-nums; }
tr.g1 td { font-weight: 700; background: var(--sel); }
tr.g2 td { font-weight: 600; }
tr.tg { cursor: pointer; }
tr.tg:hover td { background: var(--sel); }
.pg { display: flex; gap: 8px; align-items: center; margin-top: 8px; color: var(--mut); font-size: 13px; }
.empty { padding: 20px; text-align: center; color: var(--mut); }
@media (min-width: 640px) {
  .f { min-width: 170px; width: auto; }
  .kpis { grid-template-columns: repeat(auto-fit, minmax(190px, 1fr)); }
  .kpi.big { grid-column: auto; }
  .kpi b { font-size: 22px; }
  .bar { grid-template-columns: minmax(120px, 38%) 1fr auto; }
  .bar .t { grid-column: auto; }
}
@media (min-width: 900px) {
  .grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .card-wide { grid-column: 1 / -1; }
}
</style>
