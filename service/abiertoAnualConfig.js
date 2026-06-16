const getDefaultConfig = (year) => ({
  minDates: [`01/05/${year}`, `01/08/${year}`, `01/10/${year}`],
  maxDates: [`31/05/${year}`, `31/08/${year}`, `31/10/${year}`],
  rectificacion: false,
  popUpAbiertoAnualCerrado: true,
})

module.exports = {
  getAbiertoAnualPeriodos: async (axios) => {
    try {
      const data = await axios.$get('/config/abiertoAnualPeriodos')
      return data
    } catch (err) {
      const year = new Date().getFullYear()
      return getDefaultConfig(year)
    }
  },
  getDefaultConfig,
}
