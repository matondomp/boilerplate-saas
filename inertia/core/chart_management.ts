import { Charts } from './types/chart_types'
import ApexCharts from 'apexcharts'

type Prop = {
  component: HTMLElement
  data: {
    xColumn: number[]
    yColumn: number[]
  }
}

type PropAndType = Prop & {
  chartType: keyof typeof Charts
}

export const chartManagement = ({ component, chartType, data }: PropAndType) => {
  const graphics = {
    [Charts.LINE]: lineChart({ component, data }),
    [Charts.BAR]: barChart({ component, data }),
    [Charts.PIZZA]: pizzaChart({ component, data }),
  }
  return graphics[chartType]
}

const lineChart = ({ component, data }: Prop) => {
  return lineChartImplementation({ component, data })
}

const pizzaChart = ({ component, data }: Prop) => {
  return pizzaChartImplementation({ component, data })
}

const barChart = ({ component, data }: Prop) => {
  return barChartImplementation({ component, data })
}

const lineChartImplementation = ({ component, data }: Prop) => {
  return new ApexCharts(component, {
    series: [
      {
        data: data ? data.yColumn : [],
      },
    ],
    chart: {
      height: '100%',
      type: 'area',
      zoom: {
        enabled: false,
      },
      toolbar: {
        show: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: 'smooth',
    },
    xaxis: {
      categories: data ? data.xColumn : [],
    },
  })
}

const pizzaChartImplementation = ({ component, data }: Prop) => {
  return new ApexCharts(component, {
    series: data ? data.yColumn : [],
    chart: {
      width: '100%',
      height: '100%',
      type: 'donut',
    },
    labels: data ? data.xColumn : [],
    legend: {
      show: false,
    },
  })
}

const barChartImplementation = ({ component, data }: Prop) => {
  return new ApexCharts(component, {
    series: [
      {
        data: data ? data.yColumn : [],
      },
    ],
    chart: {
      height: '100%',
      type: 'bar',
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        columnWidth: '75%',
        distributed: true,
      },
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    xaxis: {
      categories: data ? data.xColumn : [],
      labels: {
        style: {
          fontSize: '12px',
        },
      },
    },
  })
}

export const updateChartOptions = {
  updateCoord({ chart, xColumn, yColumn }: any) {
    if (chart.core) {
      chart.updateOptions(
        {
          series: this.setDataByChartType(chart.opts.chart.type, yColumn),
          xaxis: {
            categories: xColumn,
          },
          yaxis: {
            categories: yColumn,
          },
        },
        false,
        true,
        false
      )
    }
  },

  updateColor({ chart, color }: any) {
    if (chart.core) {
      chart.updateOptions(
        {
          xaxis: {
            labels: {
              style: {
                colors: color,
              },
            },
          },
          yaxis: {
            labels: {
              style: {
                colors: color,
              },
            },
          },
        },
        false,
        false
      )
    }
  },

  setDataByChartType(chartType: string, data: number[] | string[]) {
    if (chartType === 'donut' || chartType === 'pie') {
      return data
    }
    return [{ data }]
  },
}
