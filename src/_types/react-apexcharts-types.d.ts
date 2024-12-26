import {ApexOptions} from 'apexcharts'
import {FC} from 'react'
declare module 'react-apexcharts' {
  export interface Props {
    type?:
      | 'line'
      | 'area'
      | 'bar'
      | 'histogram'
      | 'pie'
      | 'donut'
      | 'radialBar'
      | 'scatter'
      | 'bubble'
      | 'heatmap'
      | 'treemap'
      | 'boxPlot'
      | 'candlestick'
      | 'radar'
      | 'polarArea'
      | 'rangeBar'
    series?: ApexOptions['series']
    width?: string | number
    height?: string | number
    options?: ApexOptions
    [key: string]: any
  }
  const ReactApexChart: FC<Props>
  export default ReactApexChart
}
