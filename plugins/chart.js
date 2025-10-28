import {
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  BarController,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler,
  PieController
} from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels'

// Registrar todos los componentes necesarios
Chart.register(
  CategoryScale,
  LinearScale,
  BarElement,
  BarController,
  PieController,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler,
  ChartDataLabels
)

export default Chart
