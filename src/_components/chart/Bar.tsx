import './style.scss'

import {PageLoader} from '@components/loader/cloud'
import {getDataWidget} from '@pages/dashboard/redux/DashboardService'
import {QueryObserver, useQueryClient} from '@tanstack/react-query'
import keyBy from 'lodash/keyBy'
import keys from 'lodash/keys'
import map from 'lodash/map'
import mapValues from 'lodash/mapValues'
import omit from 'lodash/omit'
import values from 'lodash/values'
import {FC, memo, useEffect, useState} from 'react'
import Chart from 'react-apexcharts'
import {useInView} from 'react-intersection-observer'
import {useNavigate} from 'react-router-dom'

import {dropShadow, labelStyle, legendStyle} from './config'

const textForHuman = (text: string) =>
  text
    ?.split('_')
    ?.join(' ')
    ?.replace(/(?:^|\s)\S/g, (a: any) => a?.toUpperCase())

const tooltipOptions = (stacked: boolean) => ({
  enabled: true,
  enabledOnSeries: undefined,
  shared: stacked,
  followCursor: false,
  intersect: false,
  inverseOrder: false,
  custom: undefined,
  fillSeriesColor: false,
  theme: 'dark',
  style: {
    fontSize: '7pt',
    fontFamily: 'inherit',
  },
  onDatasetHover: {
    highlightDataSeries: false,
  },
  x: {
    show: true,
    formatter: undefined,
  },
  y: {
    formatter: undefined,
    title: {
      formatter: (seriesName: any) => seriesName,
    },
  },
  z: {
    formatter: undefined,
  },
  marker: {
    show: true,
  },
  items: {
    display: 'flex',
  },
  fixed: {
    enabled: false,
    position: 'topRight',
    offsetX: 0,
    offsetY: 0,
  },
})

let BarChart: FC<any> = ({
  stacked = false,
  width = '100%',
  height = 'auto',
  unique_id = '',
  selectedYear = '',
  dashboard_guid = '',
  render = false,
}) => {
  const navigate: any = useNavigate()
  const queryClient: any = useQueryClient()
  const dataWidgetQuery: any = new QueryObserver(queryClient, {
    initialData: {result: {series: [], categories: []}, horizontal: false},
    queryKey: [
      'getDataWidget',
      {
        dashboard_guid,
        unique_id,
        render,
        stacked,
        selectedYear,
      },
    ],
    queryFn: async () => {
      if (dashboard_guid && unique_id && render) {
        const params: any = selectedYear ? {year: selectedYear} : {}

        const api: any = await getDataWidget(dashboard_guid, unique_id, params)
        let res: any = api?.data?.data
        let dataResult: any = {series: [], categories: []}
        let horizontal: any = false

        if (unique_id === 'asset-category-by-location') {
          const paramss: any = []
          let paramRes: any = []
          Object.keys(res || {})?.forEach((item: any) => {
            Object.keys(res?.[item] || {})?.forEach((arr: any) => {
              if (!paramss.includes(arr)) {
                paramss?.push(arr)
              }
            })
          })

          Object.keys(res || {})?.forEach((item: any) => {
            let items = {}
            paramss?.forEach((arr: any) => {
              items = {
                ...items,
                [arr]: res?.[item]?.[arr] || 0,
              }
            })
            paramRes = {
              ...paramRes,
              [item]: items,
            }
          })
          res = paramRes
        }

        if (res?.length && !stacked) {
          const categories = map(res, 'name')?.filter((f: any) => f)
          let data: any = map(res, 'total')
          if (data?.length) {
            dataResult = {
              series: [
                {
                  name: 'Total',
                  data: data?.map((m: any) => m?.toString()?.split(',')?.join('')) as never[],
                },
              ],
              categories,
            }
          } else {
            data = omit(res?.[0], 'name')
            const name = res?.[0]?.name ? textForHuman(res?.[0]?.name) + 'asd 1' : 'Total'
            horizontal = true
            dataResult = {
              series: [{name, data: values(data)}],
              categories: keys(data),
            }
          }
        } else if (Object.values(res || {})?.length && stacked) {
          horizontal = false
          let dataObj = res
          if (res?.[0]) {
            dataObj = keyBy(dataObj, 'name')
            dataObj = mapValues(dataObj, (m: any) => omit(m, 'name'))
          }
          const obj: any = Object.values(dataObj || {})
          const name = Object.keys(obj?.[0] || {})
          const series = name?.map((m: any) => ({
            name: m
              ? unique_id === 'insurancestatus-year-region'
                ? textForHuman(m)?.toString()?.toLowerCase() === 'claim submitted'
                  ? textForHuman(m) + ' / Approved'
                  : textForHuman(m)
                : textForHuman(m)
              : 'Unnamed',
            data: obj.map((v: any) => v?.[m] || 0),
          }))
          const categories = keys(dataObj)?.map((m: any) => m || 'Unnamed')
          dataResult = {series, categories}
        } else {
          dataResult = {series: [], categories: []}
        }
        return {result: dataResult, horizontal}
      } else {
        return {result: {series: [], categories: []}, horizontal: false}
      }
    },
  })

  const {data, isFetched}: any = dataWidgetQuery?.currentResult
  const {result: dataWidget, horizontal}: any = data || {}

  const [loadingPage, setLoadingPage] = useState<any>(!isFetched)

  const {
    ref: barRef,
    inView,
    entry: _entry,
  }: any = useInView({
    threshold: 0.1,
    initialInView: false,
    trackVisibility: false,
    delay: undefined,
    triggerOnce: true,
    onChange: (view: any) => {
      if (view) {
        dataWidgetQuery.subscribe(({isFetched: isHitted}: any) => {
          setLoadingPage(!isHitted)
        })
      }
    },
  })

  useEffect(() => {
    dataWidgetQuery.subscribe(({isFetched: isHitted}: any) => {
      setLoadingPage(!isHitted)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedYear])

  const handlePeril = (event: any, _chartContext: any, config: any) => {
    const dataLabel = config?.w?.globals?.labels?.[config?.dataPointIndex]?.toString()?.split(',')
    const dataValue = config?.w?.globals?.initialSeries?.[0]?.data?.[config?.dataPointIndex]
      ?.toString()
      ?.split(',')
    if (unique_id === 'pending-policereport-region' && event?.detail === 2) {
      if (config?.w?.globals?.labels?.[config?.dataPointIndex] !== undefined) {
        if (dataLabel?.[dataLabel?.length - 1] === ' ') {
          const varDataLabel: any = []
          dataLabel?.forEach((item: any) => item !== ' ' && varDataLabel.push(item))
          navigate(
            `/insurance-claims/all?filter[region]=${varDataLabel?.join(
              ''
            )}&number_of_police_report=${dataValue}&number_of_incident_photo=${dataValue}`
          )
        } else {
          navigate(
            `/insurance-claims/all?filter[region]=${config?.w?.globals?.labels?.[
              config?.dataPointIndex
            ]
              ?.toString()
              ?.replace(/No Region/i, '-')
              ?.split(',')
              ?.join(
                ''
              )}&number_of_police_report=${dataValue}&number_of_incident_photo=${dataValue}`
          )
        }
      }
    } else if (unique_id === 'insurance-peril-region' && event?.detail === 2) {
      if (config?.w?.globals?.labels?.[config?.dataPointIndex] !== undefined) {
        if (dataLabel?.[dataLabel?.length - 1] === ' ') {
          const varDataLabel: any = []
          dataLabel?.forEach((item: any) => item !== ' ' && varDataLabel.push(item))
          navigate(
            `/insurance-claims/all` +
              `?filter[region]=${varDataLabel?.join(' ')}` +
              `&filter[type_of_peril]=${config?.w?.config?.series?.[config?.seriesIndex]?.name
                ?.toString()
                ?.replace(/No Region/i, '-')
                ?.split(',')
                ?.join(' ')}`
          )
        } else {
          navigate(
            `/insurance-claims/all` +
              `?filter[region]=${config?.w?.globals?.labels?.[config?.dataPointIndex]
                ?.toString()
                ?.replace(/No Region/i, '-')
                ?.split(',')
                ?.join('')}` +
              `&filter[type_of_peril]=${config?.w?.config?.series?.[config?.seriesIndex]?.name
                ?.toString()
                ?.split(',')
                ?.join(' ')}`
          )
        }
      }
    } else if (unique_id === 'pending-invoice-by-region' && event?.detail === 2) {
      if (dataLabel?.[dataLabel?.length - 1] === ' ') {
        const varDataLabel: any = []
        dataLabel?.forEach((item: any) => item !== ' ' && varDataLabel.push(item))
        navigate(
          `/insurance-claims/all?filter[pending_invoice_ro_number_by_region]=${varDataLabel?.join(
            ' '
          )}`
        )
      } else {
        navigate(
          `/insurance-claims/all?filter[pending_invoice_ro_number_by_region]=${config?.w?.globals?.labels?.[
            config?.dataPointIndex
          ]
            ?.toString()
            ?.split(',')
            ?.join(' ')}`
        )
      }
    } else if (unique_id === 'amount-peril' && event?.detail === 2) {
      if (config?.w?.globals?.labels?.[config?.dataPointIndex] !== undefined) {
        if (dataLabel?.[dataLabel?.length - 1] === ' ') {
          const varDataLabel: any = []
          dataLabel?.forEach((item: any) => item !== ' ' && varDataLabel.push(item))
          navigate(`/insurance-claims/all?filter[type_of_peril]=${varDataLabel?.join(' ')}`)
        } else {
          navigate(
            `/insurance-claims/all?filter[type_of_peril]=${config?.w?.globals?.labels?.[
              config?.dataPointIndex
            ]
              ?.toString()
              ?.split(',')
              ?.join(' ')}`
          )
        }
      }
      // eslint-disable-next-line sonarjs/no-collapsible-if
    } else if (unique_id === 'insurancestatus-year-region' && event?.detail === 2 && selectedYear) {
      if (config?.w?.globals?.labels?.[config?.dataPointIndex] !== undefined) {
        navigate(
          `/insurance-claims/all` +
            `?filter[region]=${config?.w?.globals?.labels?.[config?.dataPointIndex]
              ?.toString()
              ?.split(',')
              ?.join(' ')}` +
            `&filter[incident_year]=${selectedYear}`
        )
      }
    }
  }

  const statusDocumentComplete: any = [
    'Pending Documents Upload',
    'Pending GR Done',
    'Pending Invoice Upload',
    'Reverted for Revision',
    'Ready for Review 1',
    'Ready for Review 2',
    'Proposed to Reject and Close',
    'Rejected',
  ]

  const statusApprove: any = [
    'Ready for Approval',
    'Approved (Claimable)',
    'Approved (Not Claimable)',
    'Closed and Rejected',
  ]

  const handleLegend = (_chartContext: any, seriesIndex: any, config: any) => {
    if (unique_id === 'insurancestatus-year-region' && selectedYear) {
      let statusfilter: any = ''

      const statusLegend: any =
        config?.config?.series?.[seriesIndex]?.name?.toString()?.split(',')?.join(' ') || ''

      if (statusLegend === 'Pending Document Complete') {
        statusfilter = statusDocumentComplete ? statusDocumentComplete?.join(';') : ''
      } else if (statusLegend === 'Claim Submitted / Approved') {
        statusfilter = statusApprove ? statusApprove?.join(';') : ''
      }

      if (config?.config?.series?.[seriesIndex]?.name !== undefined) {
        navigate(
          `/insurance-claims/all` +
            `?filter[incident_year]=${selectedYear}` +
            `&filter[status]=${statusfilter}`
        )
      }
    }
  }

  const options: any = {
    chart: {
      toolbar: {show: false},
      fontFamily: 'inherit',
      width,
      stacked,
      events: {
        dataPointSelection: handlePeril,
        legendClick: handleLegend,
      },
    },
    plotOptions: {
      bar: {
        borderRadius: 5,
        columnWidth: '50%',
        horizontal,
        distributed: !stacked,
        dataLabels: {
          position: 'top', // top, center, bottom
        },
      },
    },
    tooltip: tooltipOptions(stacked),
    dataLabels: {
      enabled: true,
      formatter: (_val: any, opt: any) => {
        const valueStr: any = opt?.w?.globals?.initialSeries?.[opt?.seriesIndex]?.data[
          opt?.dataPointIndex
        ]
          ?.toString()
          ?.split(',')?.[0]
          ?.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
        return valueStr
      },
      offsetY: horizontal ? 0 : 0,
      style: labelStyle,
      dropShadow,
    },
    noData: {
      text: undefined,
      align: 'center',
      verticalAlign: 'middle',
      offsetX: 0,
      offsetY: -25,
      style: {
        color: '#aaa',
        fontSize: '12px',
        fontFamily: 'inherit',
      },
    },
    stroke: {width: 0},
    grid: {
      show: dataWidget?.series?.length,
      row: {colors: ['#fff', dataWidget?.series?.length ? '#f2f2f2' : '#fff']},
    },
    xaxis: {
      categories: dataWidget?.categories,
      // categories: category,
      position: 'bottom',
      tickPlacement: 'between',
      labels: {
        show: dataWidget?.series?.length,
        offsetY: 0,
        rotate: -45,
        rotateAlways: false,
        style: {
          fontSize: '8pt',
          fontWeight: 600,
        },
      },
      axisBorder: {show: false},
      axisTicks: {show: false},
      tooltip: false,
    },
    yaxis: {
      axisBorder: {show: false},
      axisTicks: {show: false},
      tooltip: {enabled: false},
      labels: {
        show: horizontal,
        formatter: function (val: any) {
          return val
        },
      },
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'light',
        type: horizontal ? 'vertical' : 'horizontal',
        shadeIntensity: 0.25,
        gradientToColors: undefined,
        inverseColors: true,
        opacityFrom: 0.85,
        opacityTo: 0.85,
        stops: [50, 0, 100],
      },
    },
    legend: {
      show: stacked,
      floating: false,
      position: 'bottom',
      horizontalAlign: 'center',
      ...legendStyle,
    },
    title: {
      text: undefined,
      floating: true,
      offsetY: 0,
      align: 'center',
      style: {
        fontSize: '12px',
        color: '#444',
      },
    },
  }

  return (
    <div ref={barRef} style={{height: inView ? 'auto' : height}} className='w-100'>
      {inView ? (
        <div className='position-relative'>
          <Chart options={options} type='bar' series={dataWidget?.series || []} height={height} />
          {loadingPage && (
            <div
              className='position-absolute d-flex flex-center w-100 bottom-0 bg-white'
              style={{height: 'calc(100% - 30px)'}}
            >
              <PageLoader />
            </div>
          )}
          {!dataWidget?.series?.length && !loadingPage && (
            <div
              className='position-absolute d-flex flex-center w-100 bottom-0 bg-white'
              style={{height: 'calc(100% - 30px)'}}
            >
              <div className='text-center'>
                <img
                  src={'/media/svg/others/no-data.png'}
                  alt='no-data'
                  style={{opacity: 0.5}}
                  className='w-auto h-100px'
                />
                <div className='text-gray-400 fw-bold'>No Data Available</div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className='position-relative' style={{height}}>
          <div
            className='position-absolute d-flex flex-center w-100 bottom-0 bg-white'
            style={{height: 'calc(100% - 30px)'}}
          >
            <PageLoader />
          </div>
        </div>
      )}
    </div>
  )
}

BarChart = memo(BarChart, (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next))
export {BarChart}
