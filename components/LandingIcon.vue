<template>
  <a
    v-if="isExternalLink"
    :href="to"
    target="_blank"
    rel="noopener noreferrer"
    class="landing-tile-link"
    @click.stop="onExternalClick"
  >
    <div class="landing-tile">
      <img
        v-if="type === 'svg'"
        :src="svgSrc"
        class="landing-tile-icon landing-tile-icon--svg"
        :alt="title"
      />
      <i
        v-else
        :class="iconClasses"
        aria-hidden="true"
      />
      <h5 class="landing-text landing-tile-title mb-0">
        <b>{{ title }}</b>
      </h5>
    </div>
  </a>

  <NuxtLink
    v-else
    :to="to"
    class="landing-tile-link"
    @click.stop="onInternalClick"
  >
    <div class="landing-tile">
      <img
        v-if="type === 'svg'"
        :src="svgSrc"
        class="landing-tile-icon landing-tile-icon--svg"
        :alt="title"
      />
      <i
        v-else
        :class="iconClasses"
        aria-hidden="true"
      />
      <h5 class="landing-text landing-tile-title mb-0">
        <b>{{ title }}</b>
      </h5>
    </div>
  </NuxtLink>
</template>

<script>
import arvigeSvg from '~/assets/tas.svg'
import { unlockNavigation } from '~/utils/modalCleanup'

export default {
  inject: {
    closeMoratoriaModal: {
      from: 'closeMoratoriaModal',
      default: null,
    },
  },
  props: {
    icon: String,
    title: String,
    type: String,
    to: String,
  },
  computed: {
    isExternalLink() {
      return this.to && this.to.startsWith('http')
    },
    svgSrc() {
      if (this.icon === 'tas.svg') {
        return arvigeSvg
      }
      return ''
    },
    iconClasses() {
      return ['bi', `bi-${this.icon}`, 'landing-tile-icon']
    },
  },
  methods: {
    prepareNavigation() {
      unlockNavigation()
      if (typeof this.closeMoratoriaModal === 'function') {
        this.closeMoratoriaModal()
      }
    },
    onInternalClick() {
      this.prepareNavigation()
    },
    onExternalClick() {
      this.prepareNavigation()
    },
  },
}
</script>

<style scoped>
.landing-tile-link {
  display: block;
  height: 100%;
  text-decoration: none;
  color: inherit;
  position: relative;
  z-index: 2;
}

.landing-tile {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 10rem;
  width: 100%;
  padding: 1rem 0.5rem;
  text-align: center;
  cursor: pointer;
  background: transparent;
  border: none;
  box-shadow: none;
}

.landing-tile-icon {
  display: block;
  font-size: 4.5rem;
  line-height: 1;
  color: #ef8918;
  margin-bottom: 1rem;
  transition: transform 0.2s ease;
}

.landing-tile:hover .landing-tile-icon {
  transform: scale(1.12);
}

.landing-tile-icon--svg {
  width: 5.5rem;
  height: 5rem;
  object-fit: contain;
  filter: brightness(0) saturate(100%) invert(50%) sepia(50%) saturate(5000%)
    hue-rotate(2deg) brightness(100%) contrast(110%);
}

.landing-tile-title {
  font-size: 1.15rem;
  line-height: 1.3;
  transition: text-shadow 0.3s ease;
}

.landing-tile-link:hover .landing-tile-title {
  text-shadow: 0 0 3px rgba(21, 255, 0, 0.8);
}
</style>
