const ObraService = require('../service/obra')

export const state = () => ({
  single: null,
  latest: [],
})

export const actions = {
  async getAll({ commit, state }) {
    const found = await ObraService.getLatestRecipes(this.$axios, {
      skip: state.latest.length,
    })
    commit('setLatest', found)
  },
  async getSingleRecipe({ commit, state }, { id }) {
    commit('setSingle', null)
    const found = await ObraService.getSingleRecipe(this.$axios, {
      id,
    })
    commit('setSingle', found)
  },
  async create({ commit, state }, { recipe, userToken }) {
    const createdRecipe = await ObraService.createRecipe(this.$axios, {
      recipe,
      userToken,
    })
    return createdRecipe
  },
}

export const mutations = {
  setLatest(state, recipesList) {
    state.latest = [...state.latest, ...recipesList]
  },
  setSingle(state, singleRecipe) {
    state.single = singleRecipe
  },
}
