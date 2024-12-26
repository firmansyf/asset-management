/* eslint-disable react-hooks/exhaustive-deps */
// import {Dropdown1} from '@metronic/partials/content/dropdown/Dropdown1'
import {KTSVG} from '@helpers'
import {getCSS} from '@metronic/assets/ts/_utils'
import {getDataWidget} from '@pages/dashboard/redux/DashboardService'
import ApexCharts, {ApexOptions} from 'apexcharts'
import {FC, memo, useEffect, useRef} from 'react'

function getChartOptions(_height: number, labels: any, series: any): ApexOptions {
  return {
    series: series,
    labels: labels,
    chart: {
      fontFamily: 'inherit',
      type: 'donut',
      // height: height,
      height: 'auto',
      width: '100%',
    },
    tooltip: {
      style: {
        fontSize: '12px',
      },
      y: {
        formatter: function (val) {
          return val?.toString() || ''
        },
      },
    },
    colors: [
      '#36d5e3',
      '#0549e1',
      '#40b781',
      '#ffc500',
      '#ff7171',
      '#a244e2',
      '#007EA7',
      '#FFDD4A',
      '#FE9000',
      '#519872',
      '#06D6A0',
      '#8A89C0',
    ],
  }
}

type Props = {
  data?: string
  title: string
  unique_id: string
  dashboard_guid?: string
}

let PieChart: FC<Props> = ({data, title, unique_id, dashboard_guid}) => {
  const chartRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!chartRef.current) {
      return
    }

    const height = parseInt(getCSS(chartRef.current, 'height'))
    if (dashboard_guid) {
      getDataWidget(dashboard_guid, unique_id)
        .then(() => {
          // {data: {data: result_widget}}
          // const labels = result_widget?.map(({ name }: any) => { return name });
          // const series = result_widget?.map(({ total }: any) => { return total });
          const series = [44, 55, 13, 33]
          const labels = ['Apple', 'Mango', 'Orange', 'Watermelon']
          const chart = new ApexCharts(chartRef.current, getChartOptions(height, labels, series))
          if (chart) {
            chart.render()
          }
        })
        .catch(() => '')
    } else {
      const series = [44, 55, 13, 33]
      const labels = ['Apple', 'Mango', 'Orange', 'Watermelon']
      const chart = new ApexCharts(chartRef.current, getChartOptions(height, labels, series))
      if (chart) {
        chart.render()
      }
    }

    // return () => {
    //   if (chart) {
    //     chart.destroy()
    //   }
    // }
  }, [chartRef, dashboard_guid, data, unique_id])
  return (
    <div className={`card`}>
      <div className='card-header border-0 pt-5'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bolder fs-3 mb-1'>{title}</span>
        </h3>
        <div className='card-toolbar'>
          <button
            type='button'
            className='btn btn-sm btn-icon btn-color-primary btn-active-light-primary'
            data-kt-menu-trigger='click'
            data-kt-menu-placement='bottom-end'
            data-kt-menu-flip='top-end'
          >
            <KTSVG
              path='/media/icons/duotone/Layout/Layout-4-blocks-2.svg'
              className='svg-icon-2'
            />
          </button>
          {/* <Dropdown1 /> */}
        </div>
      </div>

      <div className='card-body'>
        <div ref={chartRef} id={`${unique_id}_chart`} style={{height: '350px'}} />
      </div>
    </div>
  )
}

PieChart = memo(PieChart, (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next))
export {PieChart}
