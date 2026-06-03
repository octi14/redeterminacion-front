<script setup>
import { BModal as BvModal } from 'bootstrap-vue-next'
import { computed, useAttrs, useSlots } from 'vue'
import { unlockNavigation } from '~/utils/modalCleanup'

defineOptions({ inheritAttrs: false })

const props = defineProps({
  /** BVNext: oculta pie con OK/Cancel. Por defecto oculto salvo ok-only, #footer o show-default-footer. */
  noFooter: { type: Boolean, default: undefined },
  /** Alias legacy Bootstrap-Vue 2 */
  hideFooter: { type: Boolean, default: undefined },
  okOnly: { type: Boolean, default: undefined },
  cancelOnly: { type: Boolean, default: undefined },
  /** Opt-in: mostrar botones OK/Cancel por defecto del componente */
  showDefaultFooter: { type: Boolean, default: false },
})

const emit = defineEmits(['update:modelValue'])

const attrs = useAttrs()
const slots = useSlots()

const hasFooterSlot = computed(() =>
  Boolean(slots.footer || slots['modal-footer']),
)

function toBool(value) {
  if (value === '' || value === true || value === 'true') return true
  if (value === false || value === 'false') return false
  return undefined
}

/** Si true, BvModal muestra la zona footer (slot custom y/o OK/Cancel por defecto). */
const showFooterRegion = computed(() => {
  const okOnly = props.okOnly ?? toBool(attrs.okOnly ?? attrs['ok-only'])
  const cancelOnly = props.cancelOnly ?? toBool(attrs.cancelOnly ?? attrs['cancel-only'])

  if (props.showDefaultFooter) return true
  if (okOnly || cancelOnly) return true
  if (hasFooterSlot.value) return true

  const explicitNo =
    props.noFooter ??
    props.hideFooter ??
    toBool(attrs.noFooter ?? attrs['no-footer'] ?? attrs.hideFooter ?? attrs['hide-footer'])

  if (explicitNo === false) return true
  return false
})

const hideDefaultFooter = computed(() => !showFooterRegion.value)

const modalAttrs = computed(() => {
  const result = { ...attrs }

  delete result.noFooter
  delete result['no-footer']
  delete result.hideFooter
  delete result['hide-footer']
  delete result.okOnly
  delete result['ok-only']
  delete result.cancelOnly
  delete result['cancel-only']
  delete result.showDefaultFooter
  delete result['show-default-footer']
  delete result.hideHeaderClose
  delete result['hide-header-close']

  const okOnly = props.okOnly ?? toBool(attrs.okOnly ?? attrs['ok-only'])
  const cancelOnly = props.cancelOnly ?? toBool(attrs.cancelOnly ?? attrs['cancel-only'])
  const hideHeaderClose = toBool(attrs.hideHeaderClose ?? attrs['hide-header-close'])
  if (okOnly !== undefined) result.okOnly = okOnly
  if (cancelOnly !== undefined) result.cancelOnly = cancelOnly
  if (hideHeaderClose !== undefined) result.noHeaderClose = hideHeaderClose

  if (result.lazy === undefined) {
    result.lazy = true
  }

  return result
})

const passthroughSlotNames = computed(() =>
  Object.keys(slots).filter(
    (name) => !['modal-footer', 'modal-header', 'footer', 'header'].includes(name),
  ),
)

function onHidden() {
  unlockNavigation()
}
</script>

<template>
  <BvModal
    v-bind="modalAttrs"
    :no-footer="hideDefaultFooter"
    @update:model-value="(value) => emit('update:modelValue', value)"
    @hidden="onHidden"
  >
    <template v-if="slots['modal-header']" #header="slotData">
      <slot name="modal-header" v-bind="slotData || {}" />
    </template>
    <template v-else-if="slots.header" #header="slotData">
      <slot name="header" v-bind="slotData || {}" />
    </template>

    <template v-if="slots['modal-footer']" #footer="slotData">
      <slot name="modal-footer" v-bind="slotData || {}" />
    </template>
    <template v-else-if="slots.footer" #footer="slotData">
      <slot name="footer" v-bind="slotData || {}" />
    </template>

    <template
      v-for="name in passthroughSlotNames"
      :key="name"
      #[name]="slotData"
    >
      <slot :name="name" v-bind="slotData || {}" />
    </template>
  </BvModal>
</template>
