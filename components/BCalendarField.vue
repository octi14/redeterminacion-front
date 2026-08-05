<template>
  <div class="b-calendar" :class="{ 'd-block': block }">
    <div class="b-calendar-inner" :class="{ 'w-100': block }">
      <header v-if="!hideHeader" class="b-calendar-header">
        <output class="b-calendar-header-output" :class="{ 'text-muted': !selectedDate }">
          {{ selectedLabel }}
        </output>
      </header>

      <nav
        v-if="!hideNav"
        class="b-calendar-nav d-flex"
        role="group"
        :aria-label="labelNav"
      >
        <button
          type="button"
          class="btn btn-sm border-0 flex-fill"
          :class="navButtonClass"
          :disabled="!canGoPrevMonth"
          :aria-label="labelPrevMonth"
          @click="goPrevMonth"
        >
          <i class="bi bi-chevron-left" aria-hidden="true" />
        </button>
        <button
          type="button"
          class="btn btn-sm border-0 flex-fill"
          :class="navButtonClass"
          :disabled="!canGoThisMonth"
          :aria-label="labelThisMonth"
          @click="goThisMonth"
        >
          <i class="bi bi-circle-fill" aria-hidden="true" style="font-size: 0.45rem" />
        </button>
        <button
          type="button"
          class="btn btn-sm border-0 flex-fill"
          :class="navButtonClass"
          :disabled="!canGoNextMonth"
          :aria-label="labelNextMonth"
          @click="goNextMonth"
        >
          <i class="bi bi-chevron-right" aria-hidden="true" />
        </button>
      </nav>

      <div
        class="b-calendar-grid form-control h-auto text-center"
        role="application"
        :aria-label="labelCalendar"
      >
        <div class="b-calendar-grid-caption text-center font-weight-bold">
          {{ monthYearLabel }}
        </div>

        <div class="b-calendar-grid-weekdays row no-gutters border-bottom" aria-hidden="true">
          <small
            v-for="weekday in weekdayLabels"
            :key="weekday"
            class="col text-truncate text-muted"
          >
            {{ weekday }}
          </small>
        </div>

        <div class="b-calendar-grid-body">
          <div
            v-for="(week, wi) in weeks"
            :key="week[0]?.key || wi"
            class="row no-gutters"
          >
            <div
              v-for="day in week"
              :key="day.key"
              class="col p-0"
              :class="{ 'bg-light': day.disabled && day.inMonth }"
              role="button"
              :data-date="day.key"
              :aria-hidden="!day.inMonth ? 'true' : null"
              :aria-disabled="day.disabled ? 'true' : null"
              :aria-label="day.ariaLabel"
              :aria-selected="day.selected ? 'true' : null"
              :aria-current="day.selected ? 'date' : null"
              @click="selectDay(day)"
            >
              <span
                class="btn border-0 rounded-circle text-nowrap"
                :class="dayCellClass(day)"
              >
                {{ day.label }}
              </span>
            </div>
          </div>
        </div>

        <div v-if="labelHelp" class="b-calendar-grid-help border-top small text-muted text-center bg-light">
          <div class="small py-1">{{ labelHelp }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
function toYmd(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function stripTime(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

function isSameDay(a, b) {
  if (!a || !b) return false
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

export default {
  name: 'BCalendar',
  props: {
    modelValue: {
      type: [Date, String],
      default: null,
    },
    min: {
      type: Date,
      default: null,
    },
    max: {
      type: Date,
      default: null,
    },
    dateDisabledFn: {
      type: Function,
      default: null,
    },
    hideHeader: {
      type: Boolean,
      default: false,
    },
    hideNav: {
      type: Boolean,
      default: false,
    },
    block: {
      type: Boolean,
      default: false,
    },
    locale: {
      type: String,
      default: 'es',
    },
    valueAsDate: {
      type: Boolean,
      default: true,
    },
    selectedVariant: {
      type: String,
      default: 'success',
    },
    todayVariant: {
      type: String,
      default: 'success',
    },
    navButtonVariant: {
      type: String,
      default: 'outline-secondary',
    },
    noHighlightToday: {
      type: Boolean,
      default: false,
    },
    labelHelp: {
      type: String,
      default: 'Use las flechas para cambiar de mes',
    },
    labelNav: {
      type: String,
      default: 'Navegación del calendario',
    },
    labelCalendar: {
      type: String,
      default: 'Calendario',
    },
    labelNoDateSelected: {
      type: String,
      default: 'Ninguna fecha seleccionada',
    },
    labelPrevMonth: {
      type: String,
      default: 'Mes anterior',
    },
    labelNextMonth: {
      type: String,
      default: 'Mes siguiente',
    },
    labelThisMonth: {
      type: String,
      default: 'Mes actual',
    },
    /** Compatibilidad con props del b-calendar de BootstrapVue 2 (sin efecto visual). */
    dateFormatOptions: {
      type: Object,
      default: null,
    },
  },
  emits: ['update:modelValue'],
  data() {
    return {
      viewDate: this.initialViewDate(),
    }
  },
  computed: {
    navButtonClass() {
      return `btn-${this.navButtonVariant}`
    },
    today() {
      return stripTime(new Date())
    },
    weekdayLabels() {
      const fmt = new Intl.DateTimeFormat(this.locale, { weekday: 'short' })
      const monday = new Date(2024, 0, 1)
      return Array.from({ length: 7 }, (_, i) => {
        const d = new Date(monday)
        d.setDate(monday.getDate() + i)
        return fmt.format(d).replace('.', '')
      })
    },
    monthYearLabel() {
      return new Intl.DateTimeFormat(this.locale, {
        month: 'long',
        year: 'numeric',
      }).format(this.viewDate)
    },
    minDay() {
      return this.min ? stripTime(this.min) : null
    },
    maxDay() {
      return this.max ? stripTime(this.max) : null
    },
    selectedDate() {
      if (!this.modelValue) return null
      if (this.modelValue instanceof Date) return stripTime(this.modelValue)
      const parsed = new Date(`${this.modelValue}T12:00:00`)
      return Number.isNaN(parsed.getTime()) ? null : stripTime(parsed)
    },
    selectedLabel() {
      if (!this.selectedDate) return this.labelNoDateSelected
      return new Intl.DateTimeFormat(this.locale, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }).format(this.selectedDate)
    },
    weeks() {
      const year = this.viewDate.getFullYear()
      const month = this.viewDate.getMonth()
      const firstOfMonth = new Date(year, month, 1)
      const startOffset = (firstOfMonth.getDay() + 6) % 7
      const gridStart = new Date(year, month, 1 - startOffset)

      const weeks = []
      const cursor = new Date(gridStart)

      for (let w = 0; w < 6; w += 1) {
        const week = []
        for (let d = 0; d < 7; d += 1) {
          const date = new Date(cursor)
          week.push(this.buildDay(date, month))
          cursor.setDate(cursor.getDate() + 1)
        }
        weeks.push(week)
      }

      return weeks
    },
    canGoPrevMonth() {
      const prev = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth() - 1, 1)
      if (!this.minDay) return true
      const lastOfPrev = new Date(prev.getFullYear(), prev.getMonth() + 1, 0)
      return lastOfPrev >= this.minDay
    },
    canGoNextMonth() {
      const next = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth() + 1, 1)
      if (!this.maxDay) return true
      return next <= this.maxDay
    },
    canGoThisMonth() {
      const today = this.today
      const first = new Date(today.getFullYear(), today.getMonth(), 1)
      if (this.minDay && first < new Date(this.minDay.getFullYear(), this.minDay.getMonth(), 1)) {
        return false
      }
      if (this.maxDay && first > new Date(this.maxDay.getFullYear(), this.maxDay.getMonth(), 1)) {
        return false
      }
      return true
    },
  },
  watch: {
    modelValue: {
      handler(value) {
        if (!value) return
        const date = value instanceof Date ? value : new Date(`${value}T12:00:00`)
        if (!Number.isNaN(date.getTime())) {
          this.viewDate = new Date(date.getFullYear(), date.getMonth(), 1)
        }
      },
    },
  },
  methods: {
    initialViewDate() {
      if (this.modelValue) {
        const date =
          this.modelValue instanceof Date
            ? this.modelValue
            : new Date(`${this.modelValue}T12:00:00`)
        if (!Number.isNaN(date.getTime())) {
          return new Date(date.getFullYear(), date.getMonth(), 1)
        }
      }
      const today = new Date()
      return new Date(today.getFullYear(), today.getMonth(), 1)
    },
    buildDay(date, currentMonth) {
      const day = stripTime(date)
      const disabled = this.isDayDisabled(day)
      const selected = isSameDay(day, this.selectedDate)
      const isToday = isSameDay(day, this.today)
      const longLabel = new Intl.DateTimeFormat(this.locale, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }).format(day)

      return {
        key: toYmd(day),
        date: day,
        label: day.getDate(),
        inMonth: day.getMonth() === currentMonth,
        disabled,
        selected,
        isToday,
        ariaLabel: longLabel,
      }
    },
    dayCellClass(day) {
      const classes = []
      if (day.disabled) {
        classes.push('disabled')
      }
      if (day.selected) {
        classes.push(`btn-${this.selectedVariant}`, 'active', 'font-weight-bold')
      } else if (day.isToday && !this.noHighlightToday && day.inMonth) {
        classes.push(`btn-outline-${this.todayVariant}`, 'font-weight-bold')
      } else {
        classes.push('btn-outline-light', 'text-dark')
        if (!day.inMonth) classes.push('text-muted')
        if (day.inMonth && !day.disabled) classes.push('font-weight-bold')
      }
      return classes
    },
    isDayDisabled(date) {
      if (this.minDay && date < this.minDay) return true
      if (this.maxDay && date > this.maxDay) return true
      if (this.dateDisabledFn) {
        return this.dateDisabledFn(toYmd(date), date)
      }
      return false
    },
    goPrevMonth() {
      if (!this.canGoPrevMonth) return
      this.viewDate = new Date(
        this.viewDate.getFullYear(),
        this.viewDate.getMonth() - 1,
        1,
      )
    },
    goNextMonth() {
      if (!this.canGoNextMonth) return
      this.viewDate = new Date(
        this.viewDate.getFullYear(),
        this.viewDate.getMonth() + 1,
        1,
      )
    },
    goThisMonth() {
      if (!this.canGoThisMonth) return
      const today = this.today
      this.viewDate = new Date(today.getFullYear(), today.getMonth(), 1)
    },
    selectDay(day) {
      if (day.disabled || !day.inMonth) return
      const value = this.valueAsDate ? day.date : toYmd(day.date)
      this.$emit('update:modelValue', value)
    },
  },
}
</script>

<style scoped>
/* Basado en bootstrap-vue v2.23 _calendar.scss */
.b-calendar {
  display: inline-flex;
}

.b-calendar.d-block {
  display: block;
  width: 100%;
}

.b-calendar-inner {
  min-width: 250px;
}

.b-calendar-header,
.b-calendar-nav {
  margin-bottom: 0.25rem;
}

.b-calendar-header-output {
  display: block;
  width: 100%;
  padding: 0.25rem;
  font-size: 80%;
  text-align: center;
  text-transform: capitalize;
}

.b-calendar-nav .btn {
  padding: 0.25rem;
  color: #0c681a;
}

.b-calendar-nav .btn:disabled {
  opacity: 0.45;
}

.b-calendar-grid {
  padding: 0;
  margin: 0;
  overflow: hidden;
  border-color: #ced4da;
  background-color: #fff;
}

.b-calendar-grid-caption {
  padding: 0.5rem 0.25rem;
  text-transform: capitalize;
  color: #0c681a;
}

.b-calendar-grid-weekdays {
  margin-bottom: 0;
}

.b-calendar-grid-weekdays small {
  padding: 0.35rem 0;
  font-weight: 600;
  text-transform: capitalize;
}

.b-calendar-grid-body .col[role='button'] {
  cursor: pointer;
}

.b-calendar-grid-body .btn {
  width: 32px;
  height: 32px;
  font-size: 14px;
  line-height: 1;
  margin: 3px auto;
  padding: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.b-calendar-grid-body .btn.disabled,
.b-calendar-grid-body .col[aria-disabled='true'] .btn {
  cursor: default;
  pointer-events: none;
  opacity: 0.4;
}

.b-calendar-grid-body .btn-outline-light:hover:not(.disabled):not(.active) {
  background-color: rgba(12, 104, 26, 0.12);
}

.b-calendar-grid-body .btn-success.active {
  background-color: #0c681a;
  border-color: #0c681a;
}

.b-calendar-grid-body .btn-outline-success {
  color: #0c681a;
  border-color: #0c681a;
}

.b-calendar-grid-help {
  font-size: 0.8rem;
}

@media (max-width: 720px) {
  .b-calendar-inner {
    min-width: 0;
    width: 100%;
  }

  .b-calendar-grid-body .btn {
    width: 2rem;
    height: 2rem;
    font-size: 0.8rem;
    margin: 2px auto;
  }
}
</style>
