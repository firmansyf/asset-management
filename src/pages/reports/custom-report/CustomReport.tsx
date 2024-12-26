import {DataTable} from '@components/datatable'
import {FilterAll, FilterColumns} from '@components/filter/FilterAll'
import {Search} from '@components/form/searchAlert'
import {ToastMessage} from '@components/toast-message'
import {KTSVG, PageSubTitle, preferenceDateTime} from '@helpers'
import {PageTitle} from '@metronic/layout/core'
import {useQuery} from '@tanstack/react-query'
import moment from 'moment'
import {FC, memo, useEffect, useState} from 'react'
import {useIntl} from 'react-intl'
import {useNavigate} from 'react-router-dom'

import {getCustomReport} from '../Service'

let ReportCustomReport: FC<any> = () => {
  const intl: any = useIntl()
  const navigate: any = useNavigate()
  const pref_date_time: any = preferenceDateTime()

  const [page, setPage] = useState<number>(1)
  const [limit, setLimit] = useState<number>(10)
  const [keyword, setKeyword] = useState<string>('')
  const [filterAll, setFilterAll] = useState<any>({})
  const [totalPage, setTotalPage] = useState<number>(0)
  const [orderDir, setOrderDir] = useState<string>('asc')
  const [orderCol, setOrderCol] = useState<string>('name')

  useEffect(() => {
    ToastMessage({type: 'clear'})
  }, [])

  const onChangeLimit = (e: any) => {
    setPage(1)
    setLimit(e)
  }

  const onPageChange = (e: any) => {
    setPage(e)
  }

  const onSearch = (e: any) => {
    setPage(1)
    setKeyword(e ? `*${e}*` : '')
  }

  const onSort = (value: any) => {
    setOrderCol(value)
    setOrderDir(orderDir === 'asc' ? 'desc' : 'asc')
  }

  const columns: any = [
    {header: 'Report Name', sort: true, value: 'name'},
    {header: 'Created At', sort: true, value: 'created_at'},
    {header: 'Created By', sort: true, value: 'created_by'},
  ]

  const filterCustomReportQuery: any = useQuery({
    // initialData: {data: []},
    queryKey: ['filterCustomReport', {page, limit, orderDir, orderCol, pref_date_time}],
    queryFn: async () => {
      const api: any = await getCustomReport({page, limit, orderDir, orderCol})
      const res: any = api?.data?.data || []
      const {total}: any = api?.data?.meta || {}
      setTotalPage(total)
      const dataResult = res?.map((item: any) => {
        const {guid, name, created_at, created_by}: any = item || {}
        return {
          original: item,
          guid,
          name,
          created_at: moment(created_at).format(pref_date_time),
          created_by,
        }
      })
      return dataResult
    },
    // refactor react-query v5 (change onError => throwOnError)
    onError: ({response}: any) => {
      ToastMessage({message: response?.data?.message, type: 'error'})
    },
  })
  const dataFilter: any = filterCustomReportQuery?.data || []

  const customReportQueryParams: any = {
    page,
    limit,
    orderDir,
    orderCol,
    keyword,
    ...(filterAll?.child || {}),
  }
  const customReportQuery: any = useQuery({
    // initialData: {data: []},
    queryKey: ['getCustomReport', {...customReportQueryParams, pref_date_time}],
    queryFn: async () => {
      if (columns?.length > 0) {
        const api: any = await getCustomReport(customReportQueryParams)
        const res: any = api?.data?.data || []
        const {total}: any = api?.data?.meta || {}
        setTotalPage(total)
        const dataResult = res?.map((item: any) => {
          const {guid, name, created_at, created_by}: any = item || {}
          return {
            original: item,
            guid,
            name,
            created_at: moment(created_at).format(pref_date_time),
            created_by,
          }
        })
        return dataResult
      } else {
        return []
      }
    },
    // refactor react-query v5 (change onError => throwOnError)
    onError: ({response}: any) => {
      ToastMessage({message: response?.data?.message, type: 'error'})
    },
  })
  const dataCustomReport: any = customReportQuery?.data || []

  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({id: 'MENU.REPORTS.CUSTOM_REPORT'})}
      </PageTitle>
      <PageSubTitle title={`Set up your own customized report`} />
      <div className='card card-custom card-table'>
        <div className='card-table-header'>
          <div className='d-flex flex-wrap flex-stack'>
            <div className='d-flex align-items-center position-relative me-4 my-1'>
              <KTSVG
                path='/media/icons/duotone/General/Search.svg'
                className='svg-icon-3 position-absolute ms-3'
              />
              <Search bg='solid' onChange={onSearch} />
              <FilterAll columns={columns} filterAll={filterAll} onChange={setFilterAll} />
            </div>
            <div className='d-flex my-1'>
              <div style={{marginRight: '5px'}}>
                <button
                  className='btn btn-sm btn-primary'
                  type='button'
                  data-cy='addBrand'
                  onClick={() => navigate('/reports/list-custom-report?type=new')}
                >
                  New Report
                </button>
              </div>
            </div>
          </div>
          <FilterColumns data={dataFilter} filterAll={filterAll} onChange={setFilterAll} />
        </div>
        <div className='card-body'>
          <DataTable
            loading={!customReportQuery?.isFetched}
            limit={limit}
            total={totalPage}
            data={dataCustomReport}
            columns={columns}
            onChangePage={onPageChange}
            onChangeLimit={onChangeLimit}
            onSort={onSort}
            render={(val: any, original: any) => ({
              name: () => {
                return (
                  <a
                    href={
                      original?.original?.guid !== null
                        ? `/reports/list-custom-report?type=${original?.original?.guid}`
                        : 'javascript:void(0)'
                    }
                    className='cursor-pointer text-primary me-3'
                    style={{textDecoration: 'underline', fontWeight: 500}}
                  >
                    {val}
                  </a>
                )
              },
            })}
          />
        </div>
      </div>
    </>
  )
}

ReportCustomReport = memo(
  ReportCustomReport,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export default ReportCustomReport
