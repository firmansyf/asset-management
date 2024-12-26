import {FC} from 'react'
import Chart from 'react-apexcharts'

const MultiBarChart: FC<any> = ({
  title = 'Title',
  stacked = true,
  width = '100%',
  height = 'auto',
}) => {
  const options: any = {
    series: [
      {
        name: 'Dummy Data',
        data: [8, 5, 4, 6, 6, 7],
      },
      {
        name: 'Dummy Data 2',
        data: [8, 5, 12, 3, 8, 7],
      },
    ],
    chart: {
      toolbar: {show: false},
      fontFamily: 'inherit',
      stacked,
      width,
    },
    plotOptions: {
      bar: {
        borderRadius: 5,
        columnWidth: '75%',
        dataLabels: {
          position: 'center', // top, center, bottom
        },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (val: any) => val + '%',
      offsetY: 0,
      style: {
        fontSize: '10px',
        colors: ['#000'],
      },
    },
    stroke: {
      width: 2,
    },
    grid: {
      row: {
        colors: ['#fff', '#f2f2f2'],
      },
    },

    xaxis: {
      categories: ['One', 'Two', 'Three', 'Four', 'Five', 'Six'],
      position: 'bottom',
      tickPlacement: 'between',
      labels: {
        offsetY: 0,
        rotate: 0,
        style: {
          fontSize: '9px',
          fontWeight: 600,
        },
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      tooltip: {
        enabled: false,
      },
    },
    yaxis: {
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: true,
      },
      tooltip: {
        enabled: false,
      },
      labels: {
        show: false,
        formatter: function (val) {
          return val + '%'
        },
      },
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'light',
        type: 'horizontal',
        shadeIntensity: 0.25,
        gradientToColors: undefined,
        inverseColors: true,
        opacityFrom: 0.85,
        opacityTo: 0.85,
        stops: [50, 0, 100],
      },
    },
    legend: {
      show: false,
      floating: true,
    },
    title: {
      text: title,
      floating: true,
      offsetY: 0,
      // align: 'center',
      style: {
        fontSize: '12px',
        // overflowWrap: 'break-word',
        color: '#444',
      },
    },
  }

  return <Chart options={options} type='bar' series={options?.series} height={height} />
}

export {MultiBarChart}
