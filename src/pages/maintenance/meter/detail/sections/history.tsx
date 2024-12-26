import {DataTable} from '@components/datatable'
import {preferenceDate, preferenceDateTime} from '@helpers'
import moment from 'moment'
import {FC, memo, useEffect, useState} from 'react'
import Chart from 'react-apexcharts'

let History: FC<any> = ({detail}) => {
  const [data, setData] = useState<any>({})
  const [series, setSeries] = useState<any>([])
  const [history, setHistory] = useState<any>([])
  const [dateHistory, setDateHistory] = useState<any>([])
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [totalPage, setTotalPage] = useState(0)
  const [loading, setLoading] = useState(false)
  const pref_date_time = preferenceDateTime()
  const pref_date = preferenceDate()

  useEffect(() => {
    setLoading(true)
    detail && setData(detail)
    setHistory(
      detail
        ? detail?.histories
            ?.sort((a: any, b: any) => (a.created_at > b.created_at ? 1 : -1))
            ?.map(({value}: any) => value)
        : []
    )
    setDateHistory(
      detail
        ? detail?.histories
            ?.sort((a: any, b: any) => (a.created_at > b.created_at ? 1 : -1))
            ?.map(({created_at}: any) => moment(created_at).format(pref_date))
        : []
    )
    setTimeout(() => {
      detail && setTotalPage(detail?.histories?.length)
      detail && setLoading(false)
    }, 2000)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [detail, page])

  const options: any = {
    chart: {
      height: 350,
      type: 'line',
      zoom: {
        enabled: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: 'straight',
    },
    title: {
      text: '',
      align: 'left',
    },
    grid: {
      row: {
        colors: ['#f3f3f3', 'transparent'],
        opacity: 0.5,
      },
    },
    xaxis: {
      type: 'date',
      categories: dateHistory,
    },
  }

  useEffect(() => {
    setSeries([
      {
        name: 'Fahrenheit',
        data: history,
      },
    ])
  }, [history])

  return (
    <div className='card card-custom'>
      <div className='card-body p-5'>
        <div className='row'>
          <div className='col-md-12 mb-2'>
            <div id='chart'>
              <Chart options={options} series={series} type='area' height={350} />
            </div>
          </div>
          <hr />
          <div className='col-md-12 mt-2'>
            <DataTable
              loading={loading}
              limit={limit}
              total={totalPage}
              data={data?.histories
                ?.sort((a: any, b: any) => (a.created_at > b.created_at ? 1 : -1))
                ?.map((res: any) => {
                  const item: any = {}
                  item.original = res
                  item.value = res.value + ' Fahrenheit' || '-'
                  item.created_at = moment(res.created_at).format(pref_date_time) || '-'
                  item.user = res.user || '-'

                  return item
                })}
              columns={[
                {header: 'Meter', value: 'value', sort: false},
                {header: 'Time', value: 'created_at', sort: false},
                {header: 'User', value: 'user', sort: false},
              ]}
              onChangePage={(e: any) => setPage(e)}
              onChangeLimit={(e: any) => {
                setPage(1)
                setLimit(e)
              }}
              render={(val: any) => {
                return {
                  date: (
                    <div className='fs-8 fw-bold'>
                      <i className='las la-clock me-1' />
                      {val?.toString()?.split(' ')[0]}
                      <span className='text-gray-500 ms-2'> {val?.toString()?.split(' ')[1]}</span>
                    </div>
                  ),
                  event: <div className='fs-8 fw-bolder text-primary'>{val}</div>,
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

History = memo(History, (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next))
export default History
