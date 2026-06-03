<template>
  <div class="row no-gutters justify-content-center mt-5 mb-3">
    <a
      v-if="isExternalLink"
      :href="to"
      target="_blank"
      rel="noopener noreferrer"
      class="col-md-5 menu-item-link"
    >
      <div class="d-flex w-100 white shadow-card menu-item-card align-items-center">
        <div class="flex-shrink-0 menu-item-icon-wrap">
          <slot name="icon">
            <i :class="`bi bi-${icon} landing-icon`" />
          </slot>
        </div>
        <div class="text-start my-auto flex-grow-1 menu-item-text">
          <h3 class="landing-text menu-item-title mb-1"><b>{{ title }}</b></h3>
          <h6 class="mb-0 menu-item-description">{{ description }}</h6>
        </div>
      </div>
    </a>
    <NuxtLink v-else :to="to" class="col-md-5 menu-item-link">
      <div class="d-flex w-100 white shadow-card menu-item-card align-items-center">
        <div class="flex-shrink-0 menu-item-icon-wrap">
          <slot name="icon">
            <i :class="`bi bi-${icon} landing-icon`" />
          </slot>
        </div>
        <div class="text-start my-auto flex-grow-1 menu-item-text">
          <h3 class="landing-text menu-item-title mb-1"><b>{{ title }}</b></h3>
          <h6 class="mb-0 menu-item-description">{{ description }}</h6>
        </div>
      </div>
    </NuxtLink>
  </div>
</template>

<script>
export default {
  props: {
    icon: String,
    title: String,
    description: String,
    to: {
      type: String,
      required: true,
    },
    external: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    isExternalLink() {
      return this.external || /^https?:\/\//i.test(this.to)
    },
  },
}
</script>

<style scoped>
.menu-item-link {
  color: inherit;
  display: block;
  text-decoration: none !important;
}

.menu-item-link:hover,
.menu-item-link:focus,
.menu-item-link:focus-visible,
.menu-item-link:active,
.menu-item-link:visited {
  color: inherit;
  text-decoration: none !important;
}

.menu-item-link :is(h3, h6, b, p, span, i) {
  text-decoration: none !important;
}

.menu-item-card {
  padding: 0.25rem 0;
  border: 1px solid rgba(12, 104, 26, 0.15);
  border-radius: 0.375rem;
  transition: box-shadow 0.2s ease, transform 0.2s ease;
  cursor: pointer;
}

.menu-item-link:hover .menu-item-card {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  transform: translateY(-1px);
}

.menu-item-icon-wrap {
  width: 3.75rem;
  height: 3.75rem;
  margin: 0.75rem 1.75rem 0.75rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.menu-item-text {
  padding: 0.75rem 1.25rem 0.75rem 0;
}

.menu-item-title {
  line-height: 1.25;
}

.menu-item-description {
  color: #6c757d;
  font-weight: 400;
}

.landing-icon {
  font-size: 3.75rem;
  line-height: 1;
  width: 3.75rem;
  height: 3.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ef8918;
  transition: transform 0.2s ease;
  transform-origin: center center;
}

.menu-item-icon-wrap :deep(.fuel-icon-svg),
.menu-item-icon-wrap :deep(svg) {
  width: 100%;
  height: 100%;
  color: #ef8918;
  transition: transform 0.2s ease;
  transform-origin: center center;
}

.menu-item-link:hover .landing-icon,
.menu-item-link:hover .menu-item-icon-wrap :deep(svg) {
  transform: scale(1.15);
}

@media (max-width: 767.98px) {
  .row {
    padding-left: 15px;
    padding-right: 15px;
  }

  .menu-item-icon-wrap {
    margin: 0.75rem 1.25rem 0.75rem 1rem;
  }

  .menu-item-text {
    padding-right: 1rem;
  }
}
</style>
