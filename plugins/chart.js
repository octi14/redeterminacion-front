import Chart from 'chart.js/auto'

export default ({ app }, inject) => {
  inject('chart', Chart)
}
