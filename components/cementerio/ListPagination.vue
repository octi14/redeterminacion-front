<template>
  <div v-if="totalRows > 0" class="d-flex flex-column flex-md-row align-items-center justify-content-between mt-3">
    <small class="text-muted mb-2 mb-md-0">
      Mostrando {{ firstRow }}-{{ lastRow }} de {{ totalRows }}
    </small>
    <b-pagination
      :value="value"
      :total-rows="totalRows"
      :per-page="perPage"
      align="center"
      class="mb-0"
      @input="$emit('input', $event)"
    />
  </div>
</template>

<script>
export default {
  props: {
    value: { type: Number, default: 1 },
    totalRows: { type: Number, default: 0 },
    perPage: { type: Number, default: 10 },
  },
  computed: {
    firstRow() {
      return (this.value - 1) * this.perPage + 1
    },
    lastRow() {
      return Math.min(this.value * this.perPage, this.totalRows)
    },
  },
}
</script>
