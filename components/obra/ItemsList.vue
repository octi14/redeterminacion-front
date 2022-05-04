<template>
  <div class="items-list">
    <ul>
      <li
        v-for="item in items"
        :key="item.id"
        class="list-item"
      >
        {{ getFormattedIngredient(ingredientItem) }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    ingredients: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {}
  },
  computed: {},
  methods: {
    getIngredientById(id) {
      return this.$store.getters['ingredients/getIngredientById'](id)
    },
    getFormattedIngredient(ingredient) {
      const name = this.getIngredientById(ingredient.ingredient)?.name
      return `${name}, ${ingredient.quantity}`
    },
  },
}
</script>
