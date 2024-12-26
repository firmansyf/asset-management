import './style.scss'

import {PageLoader} from '@components/loader/cloud'
import {getDataWidget} from '@pages/dashboard/redux/DashboardService'
import {QueryObserver, useQueryClient} from '@tanstack/react-query'
import map from 'lodash/map'
import {FC, memo, useEffect, useState} from 'react'
import Chart from 'react-apexcharts'
import {useInView} from 'react-intersection-observer'
import {useNavigate} from 'react-router-dom'

import {dropShadow, labelStyle, legendStyle} from './config'

let PieChart: FC<any> = ({
  width = '100%',
  size = '0%',
  titleAlign = 'bottom',
  height = 'auto',
  unique_id = '',
  dashboard_guid = '',
  selectedYear = '',
}) => {
  const navigate: any = useNavigate()
  const queryClient: any = useQueryClient()

  const dataWidgetQuery: any = new QueryObserver(queryClient, {
    initialData: {labels: [], series: []},
    queryKey: [
      'getDataWidget',
      {
        dashboard_guid,
        unique_id,
        selectedYear,
      },
    ],
    queryFn: async () => {
      if (dashboard_guid && unique_id) {
        const params: any = selectedYear ? {year: selectedYear} : {}
        const api: any = await getDataWidget(dashboard_guid, unique_id, params)
        const res: any = api?.data?.data
        let dataResult: any = {labels: [], series: []}

        if (res && res?.length > 0) {
          const checkSum: number = map(res, 'total').reduce((a: any, b: any) => a + b)
          if (unique_id === 'number-tickets-request-lastweek') {
            dataResult = {
              labels: map(res, 'day'),
              series: checkSum > 0 ? map(res, 'total') : [],
            }
          } else if (unique_id === 'insurance-claim-by-status') {
            const dataRes: any = res?.map((e: any) => {
              return {
                name: e?.name || e?.status_name || '',
                total: e?.total || 0,
              }
            })
            dataResult = {
              labels: map(dataRes, 'name'),
              series: checkSum > 0 ? map(res, 'total') : [],
            }
          } else {
            dataResult = {
              labels: map(res, 'name'),
              series: checkSum > 0 ? map(res, 'total') : [],
            }
          }
        }

        return dataResult
      } else {
        return {labels: [], series: []}
      }
    },
  })
  const {data: dataWidget, isFetched}: any = dataWidgetQuery?.currentResult

  const [loadingPage, setLoadingPage] = useState<any>(!isFetched)

  const {
    ref: pieRef,
    inView,
    entry: _entry,
  } = useInView({
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

  const handleStatus = (event: any, chartContext: any, config: any) => {
    const dataLabel = chartContext?.opts?.labels?.[config?.dataPointIndex]
    const dataLabelSplit = dataLabel
      ?.toLowerCase()
      ?.split('-')
      ?.map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
      ?.join(' ')

    if (unique_id === 'insurance-claim-by-status' && event?.detail === 2) {
      if (dataLabel !== undefined) {
        setTimeout(
          () => navigate('/insurance-claims/all?filter[status]=' + dataLabel?.toString()),
          300
        )
      }
    } else if (unique_id === 'asset-by-status' && event?.detail === 2) {
      if (dataLabel !== undefined) {
        setTimeout(
          () => navigate('/asset-management/all?filter[status_name]=' + dataLabel?.toString()),
          300
        )
      }
    } else if (unique_id === 'asset-by-category' && event?.detail === 2) {
      if (dataLabel !== undefined) {
        setTimeout(
          () => navigate('/asset-management/all?filter[category_name]=' + dataLabel?.toString()),
          300
        )
      }
    } else if (unique_id === 'ticket-by-types' && event?.detail === 2) {
      if (dataLabel !== undefined) {
        setTimeout(
          () => navigate(`/help-desk/ticket/?filter[type_name]=${dataLabel?.toString()}`),
          300
        )
      }
    } else if (unique_id === 'unresolved-tickets-by-priority' && event?.detail === 2) {
      if (dataLabel !== undefined) {
        setTimeout(
          () =>
            navigate(
              `/help-desk/ticket/?filter[priority_name]=${dataLabelSplit}&filter[quick_filter]=all_unresolved_ticket`
            ),
          300
        )
      }
    } else if (unique_id === 'unresolved-tickets-by-status' && event?.detail === 2) {
      if (dataLabel !== undefined) {
        setTimeout(
          () =>
            navigate(
              `/help-desk/ticket/?filter[status_name]=${dataLabelSplit}&filter[quick_filter]=all_unresolved_ticket`
            ),
          300
        )
      }
    } else {
      /**/
    }
  }

  const options: any = {
    chart: {
      fontFamily: 'inherit',
      toolbar: {show: false},
      stacked: false,
      width,
      events: {dataPointSelection: handleStatus},
    },
    labels: dataWidget?.labels,
    dataLabels: {
      enabled: true,
      formatter: function (val: any) {
        return parseInt(val) + '%'
      },
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
    plotOptions: {
      pie: {
        expandOnClick: true,
        donut: {
          size,
        },
      },
    },
    legend: {
      position: titleAlign,
      ...legendStyle,
    },
    title: {
      text: undefined,
      align: 'center',
      style: {
        fontSize: '12px',
        color: '#444',
      },
    },
  }

  return (
    <div ref={pieRef} style={{height: inView ? 'auto' : height}} className='w-100'>
      {inView ? (
        <div className='position-relative'>
          <Chart options={options} type='donut' series={dataWidget?.series || []} height={height} />
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

PieChart = memo(PieChart, (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next))
export {PieChart}
