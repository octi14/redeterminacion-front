const MaestroService = require('../service/maestro')

export const state = () => ({
  single: null,
  all: [],
})

export const actions = {
  async get({commit, state}){
    commit('setAll', [])
    const found = await MaestroService.get(this.$axios)
    commit('setAll', found)
  },
  async getSingle({commit, state}, { cuit, legajo}){
    commit('setSingle', [])
    const found = await MaestroService.getSingle(this.$axios, {
      cuit, legajo
    })
    commit('setSingle', found)
  },
  async create({ commit, state }, { file }) {
    try {
      const response = await MaestroService.create(this.$axios, { file });

      // Si el servicio devuelve los archivos procesados, actualiza el estado con ellos
      commit('setAll', response.filesList);
    } catch (error) {
      console.error(error);
      // Manejar errores, si es necesario
    }
  },
};


export const mutations = {
  setAll(state, filesList) {
    state.all = filesList
    // [...state.latest, ...filesList]
  },
  setSingle(state, singleFile) {
    state.single = singleFile
  },
  // setMany(state, certifList) {
  //   state.certifs = certifList
  // }
}
