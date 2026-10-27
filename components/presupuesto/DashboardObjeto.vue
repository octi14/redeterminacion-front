<template>
  <div class="dash">
    <section class="kpis">
      <div v-for="k in kpis" :key="k.title" class="card kpi">
        <small>{{ k.title }}</small>
        <b>{{ k.value }}</b>
        <small>{{ k.sub }}</small>
      </div>
    </section>

    <section class="card flt">
      <h2>Filtros</h2>
      <div class="frow">
        <span>Inciso</span>
        <div class="frow wrap">
          <button
            v-for="[k, t] in Object.entries(incisos)"
            :key="k"
            type="button"
            class="chip"
            :class="{ on: inc.includes(+k) }"
            @click="tog(inc, +k)"
          >{{ k }} · {{ t }}</button>
        </div>
      </div>
      <div class="frow">
        <span>Tipo de gasto</span>
        <div class="frow wrap">
          <button
            v-for="t in tipos"
            :key="t"
            type="button"
            class="chip"
            :class="{ on: tip.includes(t) }"
            @click="tog(tip, t)"
          >{{ t }}</button>
        </div>
      </div>
      <div class="frow">
        <span>Buscar</span>
        <input v-model="q" type="search" placeholder="Código o nombre de partida…">
        <span class="min-lab">Crédito mínimo</span>
        <input v-model.number="minPct" type="range" min="0" max="100">
        <b>{{ minPct ? mm(min * 1e6) : 'Sin mínimo' }}</b>
        <button type="button" class="obtn" @click="reset">Limpiar filtros</button>
      </div>
    </section>

    <section class="g2">
      <div class="card">
        <h2>Distribución por inciso</h2>
        <svg viewBox="0 0 120 120" class="dn">
          <circle
            v-for="s in donut"
            :key="s.i"
            cx="60"
            cy="60"
            r="40"
            fill="none"
            :stroke="s.color"
            stroke-width="20"
            :stroke-dasharray="s.f + ' ' + (100 - s.f)"
            :stroke-dashoffset="-s.off"
            pathLength="100"
            transform="rotate(-90 60 60)"
            :opacity="s.dim ? 0.25 : 1"
            style="cursor: pointer"
            @click="tog(inc, s.i)"
          >
            <title>{{ s.name }}: {{ mm(s.v) }}</title>
          </circle>
          <text x="60" y="58" text-anchor="middle" font-size="7" fill="currentColor">{{ mm(donutTot) }}</text>
          <text x="60" y="68" text-anchor="middle" font-size="5" fill="currentColor" opacity=".6">según filtros</text>
        </svg>
        <div>
          <div
            v-for="s in donut"
            :key="'lg-' + s.i"
            class="leg"
            :style="{ opacity: s.dim ? 0.45 : 1 }"
            @click="tog(inc, s.i)"
          >
            <span class="dot" :style="{ background: s.color }"></span>
            <span class="flex">{{ s.i }} · {{ s.name }}</span>
            <b>{{ pct(s.share) }}</b>
          </div>
        </div>
      </div>
      <div class="card">
        <h2>Principales partidas <small>(clic para filtrar)</small></h2>
        <div
          v-for="d in topBars"
          :key="d.c"
          class="br"
          :class="{ sel: par.includes(d.c) }"
          :title="d.c + ' ' + d.n"
          @click="tog(par, d.c)"
        >
          <span>{{ d.n }}</span>
          <span><i :style="{ width: d.w + '%', background: COL[d.i - 1 < 5 ? d.i - 1 : 5] }"></i></span>
          <b>{{ mm(d.v) }}</b>
        </div>
        <div v-if="!topBars.length" class="empty">Sin resultados</div>
      </div>
    </section>

    <section class="card">
      <h2>
        Detalle de partidas
        <button type="button" class="obtn csv" @click="exportCsv">Exportar CSV</button>
      </h2>
      <div class="tw">
        <table>
          <thead>
            <tr>
              <th v-for="c in cols" :key="c.k" :class="c.cls" @click="sortBy(c.k)">{{ c.label }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="d in sorted" :key="d.c">
              <td>{{ d.c }}</td>
              <td>{{ d.n }}</td>
              <td>{{ d.i }} · {{ incisos[d.i] }}</td>
              <td>{{ d.t }}</td>
              <td class="n">{{ money0(d.v) }}</td>
              <td>
                {{ pct(d.v / (filteredTot || 1)) }}
                <span class="pb" :style="{ width: (d.v / (filteredTot || 1) * 80) + 'px' }"></span>
              </td>
            </tr>
            <tr v-if="!sorted.length"><td colspan="6" class="empty">Sin resultados</td></tr>
          </tbody>
          <tfoot>
            <tr>
              <td colspan="4">Total</td>
              <td class="n">{{ money0(filteredTot) }}</td>
              <td>{{ pct(filteredTot / totalAll) }} del general</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </section>
  </div>
</template>

<script>
import DATA from '~/assets/data/presupuesto-2027-objeto.json'
import { money0, mm, pct, downloadCsv } from '~/utils/presupuestoFormat'

const COL = ['#28a745', '#17a2b8', '#ffc107', '#e53749', '#9966FF', '#e27910']
const TIPOS = ['Gastos corrientes', 'Gastos de capital', 'Aplicaciones financieras']

export default {
  name: 'DashboardObjeto',
  data() {
    return {
      incisos: DATA.incisos,
      partidas: DATA.partidas,
      COL,
      tipos: TIPOS,
      cols: [
        { k: 'c', label: 'Código' },
        { k: 'n', label: 'Partida' },
        { k: 'i', label: 'Inciso' },
        { k: 't', label: 'Tipo' },
        { k: 'v', label: 'Crédito original', cls: 'n' },
        { k: 'pct', label: '% del filtrado' },
      ],
      inc: [],
      tip: [],
      par: [],
      q: '',
      minPct: 0,
      sortK: 'c',
      sortD: 1,
    }
  },
  computed: {
    totalAll() {
      return this.partidas.reduce((a, d) => a + d.v, 0)
    },
    MX() {
      return Math.max(...this.partidas.map((d) => d.v)) / 1e6
    },
    min() {
      return Math.round(Math.pow(this.minPct / 100, 3) * this.MX)
    },
    filtered() {
      return this.rows(false)
    },
    filteredTot() {
      return this.filtered.reduce((a, d) => a + d.v, 0)
    },
    kpis() {
      const r = this.filtered
      const tot = this.filteredTot
      const big = r.slice().sort((a, b) => b.v - a.v)[0]
      const cap = r.filter((d) => d.t === TIPOS[1]).reduce((a, d) => a + d.v, 0)
      return [
        { title: 'Crédito original filtrado', value: mm(tot), sub: money0(tot) },
        { title: 'Participación sobre el total', value: pct(tot / this.totalAll), sub: 'Total general: ' + mm(this.totalAll) },
        { title: 'Partidas', value: r.length, sub: 'de ' + this.partidas.length },
        { title: 'Mayor partida', value: big ? mm(big.v) : '—', sub: big ? big.n : 'Sin datos' },
        { title: 'Gastos de capital', value: mm(cap), sub: tot ? pct(cap / tot) + ' del filtrado' : '—' },
      ]
    },
    donutTot() {
      return this.rows(true).reduce((a, d) => a + d.v, 0)
    },
    donut() {
      const ri = this.rows(true)
      const ti = this.donutTot || 1
      let off = 0
      return Object.keys(this.incisos).map((k, j) => {
        const v = ri.filter((d) => d.i == k).reduce((a, d) => a + d.v, 0)
        const f = (v / ti) * 100
        const slice = {
          i: +k,
          name: this.incisos[k],
          v,
          f,
          off,
          color: COL[j],
          dim: this.inc.length && !this.inc.includes(+k),
          share: v / ti,
        }
        off += f
        return slice
      })
    },
    topBars() {
      const top = this.filtered.slice().sort((a, b) => b.v - a.v).slice(0, 12)
      const mx = top[0] ? top[0].v : 1
      return top.map((d) => ({ ...d, w: (d.v / mx) * 100 }))
    },
    sorted() {
      const k = this.sortK === 'pct' ? 'v' : this.sortK
      return this.filtered.slice().sort((a, b) => (a[k] > b[k] ? 1 : -1) * this.sortD)
    },
  },
  methods: {
    money0,
    mm,
    pct,
    rows(ignoreInciso) {
      const q = this.q.toLowerCase().trim()
      return this.partidas.filter((d) =>
        (ignoreInciso || !this.inc.length || this.inc.includes(d.i)) &&
        (!this.tip.length || this.tip.includes(d.t)) &&
        (!this.par.length || this.par.includes(d.c)) &&
        d.v >= this.min * 1e6 &&
        (!q || (d.c + ' ' + d.n).toLowerCase().includes(q)),
      )
    },
    tog(arr, x) {
      const i = arr.indexOf(x)
      if (i >= 0) arr.splice(i, 1)
      else arr.push(x)
    },
    reset() {
      this.inc = []
      this.tip = []
      this.par = []
      this.q = ''
      this.minPct = 0
    },
    sortBy(k) {
      this.sortD = this.sortK === k ? -this.sortD : k === 'v' || k === 'pct' ? -1 : 1
      this.sortK = k
    },
    async exportCsv() {
      const r = this.filtered
      const t = 'Código;Partida;Inciso;Tipo;Crédito original\n' +
        r.map((d) => [d.c, '"' + d.n + '"', this.incisos[d.i], d.t, d.v.toFixed(2).replace('.', ',')].join(';')).join('\n')
      await downloadCsv(t, 'presupuesto_2027_gasto_por_objeto.csv')
    },
  },
}
</script>

<style scoped>
.dash {
  --bg: var(--gray-bs-100);
  --card: var(--color-white);
  --tx: #353535;
  --mu: var(--gray-bs-600);
  --bd: var(--gray-bs-300);
  --ac: #0c681a;
  --ac2: var(--green-fill);
  color: var(--tx);
  display: grid;
  gap: 14px;
}
.card { background: var(--card); border: 1px solid var(--bd); border-radius: 10px; padding: 14px; min-width: 0; }
.card h2 { margin: 0 0 10px; font-size: 13px; text-transform: uppercase; letter-spacing: .04em; color: var(--mu); }
.kpis { display: grid; grid-template-columns: 1fr; gap: 12px; }
.kpi b { display: block; font-size: 20px; margin-top: 2px; }
.kpi small { color: var(--mu); }
.flt { display: grid; gap: 10px; }
.frow { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; }
.frow > span { color: var(--mu); font-size: 12px; min-width: 92px; }
.wrap { flex: 1; min-width: 0; }
.chip {
  border: 1px solid var(--bd);
  background: var(--card);
  color: var(--tx);
  border-radius: 16px;
  padding: 6px 11px;
  cursor: pointer;
  font: inherit;
  font-size: 12px;
}
.chip.on { background: var(--ac); color: #fff; border-color: var(--ac); }
input[type=search] {
  padding: 6px 10px;
  border: 1px solid var(--bd);
  border-radius: 6px;
  background: var(--bg);
  color: var(--tx);
  font: inherit;
  min-width: 0;
  flex: 1;
}
input[type=range] { width: 100%; max-width: 220px; accent-color: var(--ac); }
.min-lab { min-width: 0; }
.obtn {
  border: 1px solid var(--ac);
  background: none;
  color: var(--ac);
  border-radius: 6px;
  padding: 5px 12px;
  cursor: pointer;
  font: inherit;
}
.csv { float: right; padding: 2px 10px; text-transform: none; letter-spacing: 0; }
.g2 { display: grid; grid-template-columns: 1fr; gap: 14px; }
.dn { width: 100%; max-width: 230px; display: block; margin: 0 auto 8px; }
.leg { display: flex; align-items: center; gap: 7px; font-size: 12px; padding: 3px 4px; border-radius: 5px; cursor: pointer; }
.leg:hover, .br:hover { background: var(--ac2); }
.dot { width: 10px; height: 10px; border-radius: 2px; flex: none; }
.flex { flex: 1; }
.br {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 6px 8px;
  align-items: center;
  padding: 3px 4px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 12px;
}
.br span:nth-child(2) { grid-column: 1 / -1; }
.br.sel { outline: 2px solid var(--ac); }
.br i { display: block; height: 12px; border-radius: 3px; background: var(--ac); }
.br span:first-child { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.tw { overflow-x: auto; max-height: 480px; overflow-y: auto; }
table { border-collapse: collapse; width: 100%; font-size: 13px; }
th, td { padding: 6px 8px; border-bottom: 1px solid var(--bd); text-align: left; white-space: nowrap; }
th { position: sticky; top: 0; background: var(--card); cursor: pointer; color: var(--mu); font-size: 12px; }
td.n, th.n { text-align: right; }
tfoot td { font-weight: 700; }
.pb { display: inline-block; height: 8px; background: var(--ac); border-radius: 3px; vertical-align: middle; margin-left: 6px; }
.empty { color: var(--mu); padding: 20px; text-align: center; }
@media (min-width: 640px) {
  .kpis { grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); }
  .kpi b { font-size: 22px; }
  .br { grid-template-columns: minmax(120px, 38%) 1fr auto; }
  .br span:nth-child(2) { grid-column: auto; }
}
@media (min-width: 800px) {
  .g2 { grid-template-columns: minmax(260px, 1fr) 2fr; }
}
</style>
