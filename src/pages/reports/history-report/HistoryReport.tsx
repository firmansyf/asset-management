import {DataTable} from '@components/datatable'
import {ExportPdfExcel} from '@components/export/ExportPdfExcel'
import {Search} from '@components/form/searchAlert'
import {ToastMessage} from '@components/toast-message'
import {convertDate, hasPermission, KTSVG, preferenceDateTime} from '@helpers'
import {PageTitle} from '@metronic/layout/core'
import {exportAssetHistory, getAssetHistory} from '@pages/asset-management/redux/AssetRedux'
import {useQuery} from '@tanstack/react-query'
import {keyBy, mapValues} from 'lodash'
import moment from 'moment'
import {FC, memo, useEffect, useState} from 'react'
import Dropdown from 'react-bootstrap/Dropdown'
import {useIntl} from 'react-intl'
import {shallowEqual, useSelector} from 'react-redux'
import {useNavigate} from 'react-router-dom'

import ModalAutomatedReport from '../automated-report/ModalAddEdit'

const convertLog: any = (log: any) => {
  if (!log) {
    return '-'
  } else if (Array.isArray(log)) {
    if (typeof log?.[0] === 'string') {
      return log?.[0]
    } else {
      return log !== null
        ? log?.[1]?.global_custom_fields !== undefined
          ? Object.keys(log?.[1]?.global_custom_fields || {})
              ?.map((m: any) => m)
              ?.join(', ')
          : '-'
        : '-'
    }
  } else {
    return '-'
  }
}

const CardReportHistory: FC<any> = () => {
  const navigate: any = useNavigate()
  const date: any = convertDate({time: true})
  const pref_date_time: any = preferenceDateTime()
  const preferenceStore: any = useSelector(({preference}: any) => preference, shallowEqual)
  const {feature}: any = preferenceStore || {}

  const [page, setPage] = useState<number>(1)
  const [limit, setLimit] = useState<number>(10)
  const [isFeature, setFeature] = useState<any>({})
  const [keyword, setKeyword] = useState<string>('')
  const [totalPage, setTotalPage] = useState<number>(0)
  const [orderDir, setOrderDir] = useState<string>('asc')
  const [orderCol, setOrderCol] = useState<string>('asset_name')
  const [showModalAutomatedReport, setShowModalAutomatedReport] = useState<boolean>(false)

  const PermissionAdd: any = hasPermission('reports.automation_report.add') || false
  const PermissionView: any = hasPermission('reports.automation_report.view') || false

  const columns: any = [
    {header: 'Asset ID', sort: true, value: 'asset_id'},
    {header: 'Asset Name', sort: true, value: 'asset_name'},
    {header: 'Changed Date/Time', sort: true, value: 'changed_at'},
    {header: 'Changed User', sort: true, value: 'changed_by_first_name'},
    {header: 'Event', sort: true, value: 'event_name'},
    {header: 'Asset Change Comment', sort: true, value: 'comment'},
    {header: 'Change Details', sort: true, value: 'description'},
    {header: 'Field', sort: true, value: 'field'},
    {header: 'Changed From', sort: true, value: 'changed_from'},
    {header: 'Changed To', sort: true, value: 'changed_to'},
  ]

  const onExport = (e: any) => {
    const params: any = [
      'asset_id',
      'asset_name',
      'changed_at',
      'changed_by_first_name',
      'changed_by_last_name',
      'event_name',
      'comment',
      'description',
    ]

    exportAssetHistory({type: e, columns: params?.join(',')})
      .then(({data: res}) => {
        const {data, message}: any = res || {}
        const {url}: any = data || {}
        ToastMessage({message, type: 'success'})
        setTimeout(() => totalPage <= 500 && window.open(url, '_blank'), 1000)
      })
      .catch(({response}: any) => {
        const {message}: any = response?.data || {}
        ToastMessage({message, type: 'error'})
      })
  }

  const onChangeLimit = (e: any) => {
    setPage(1)
    setLimit(e)
  }

  const onPageChange = (e: any) => {
    setPage(e)
  }

  const onSort = (value: any) => {
    setOrderCol(value)
    setOrderDir(orderDir === 'asc' ? 'desc' : 'asc')
  }

  const onSearch = (e: any) => {
    setPage(1)
    setKeyword(e ? `*${e}*` : '')
  }

  const onRender = (val: any) => {
    return {
      changed_at: val !== '-' ? moment(val || '')?.format(pref_date_time) : '-',
    }
  }

  const getValueOrDefault = (value: any) => (value === null ? '-' : value)

  const dataHistoryReportParam: any = {page, limit, keyword, orderDir, orderCol}
  const dataHistoryReportQuery: any = useQuery({
    // initialData: {data: []},
    queryKey: ['getAssetHistory', {...dataHistoryReportParam}],
    queryFn: async () => {
      if (columns?.length > 0) {
        const res: any = await getAssetHistory(dataHistoryReportParam)
        const {current_page, total}: any = res?.data?.meta || {}
        const thisLimit: any = limit
        setTotalPage(total)
        setPage(current_page)
        setLimit(thisLimit)

        const dataResult: any = res?.data?.data?.map((m: any) => {
          const {
            asset_id,
            asset_name,
            changed_at,
            changed_by_first_name,
            changed_by_last_name,
            event_name,
            comment,
            description,
            field,
            changed_from,
            changed_to,
          }: any = m || {}

          return {
            asset_id: getValueOrDefault(asset_id),
            asset_name: getValueOrDefault(asset_name),
            changed_at: moment(changed_at).format(date) || '-',
            changed_by: `${changed_by_first_name} ${changed_by_last_name}` || '-',
            event_name: getValueOrDefault(event_name),
            comment: getValueOrDefault(comment),
            description: getValueOrDefault(description),
            field: field !== null ? field?.join(', ')?.replace(/_/g, ' ') : '-',
            changed_from: convertLog(changed_from),
            changed_to: convertLog(changed_to),
            original: m,
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
  const dataHistoryReport: any = dataHistoryReportQuery?.data || []

  useEffect(() => {
    ToastMessage({type: 'clear'})
  }, [])

  useEffect(() => {
    if (feature) {
      const resObj: any = keyBy(feature, 'unique_name')
      setFeature(mapValues(resObj, 'value'))
    }
  }, [feature])

  return (
    <>
      <div className='card card-custom card-table'>
        <div className='card-table-header'>
          <div className='d-flex flex-wrap flex-stack'>
            <div className='d-flex align-items-center position-relative me-4 my-1'>
              <KTSVG
                path='/media/icons/duotone/General/Search.svg'
                className='svg-icon-3 position-absolute ms-3'
              />

              <Search bg='solid' onChange={onSearch} />
            </div>

            <div className='d-flex my-1'>
              <div className='dropdown' style={{marginRight: '5px'}}>
                <Dropdown>
                  <Dropdown.Toggle variant='light-primary' size='sm' id='dropdown-basic'>
                    Actions
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    {PermissionAdd && isFeature?.automated_report === 1 && (
                      <Dropdown.Item href='#' onClick={() => setShowModalAutomatedReport(true)}>
                        Automated Report
                      </Dropdown.Item>
                    )}
                    <ExportPdfExcel onExport={onExport} />
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </div>
          </div>
        </div>

        <div className='card-body'>
          <DataTable
            page={page}
            limit={limit}
            onSort={onSort}
            total={totalPage}
            columns={columns}
            render={onRender}
            data={dataHistoryReport}
            onChangePage={onPageChange}
            onChangeLimit={onChangeLimit}
            loading={!dataHistoryReportQuery?.isFetched}
          />
        </div>
      </div>

      {PermissionView && (
        <ModalAutomatedReport
          type={'add'}
          columns={columns}
          showModal={showModalAutomatedReport}
          setShowModal={setShowModalAutomatedReport}
          detail={{name: 'History', type: 'history'}}
          onSubmit={() => {
            setShowModalAutomatedReport(false)
            navigate('/reports/automated-report')
          }}
        />
      )}
    </>
  )
}

let ReportHistory: FC = () => {
  const intl: any = useIntl()
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({id: 'MENU.REPORTS.HISTORY_REPORTS'})}
      </PageTitle>
      <CardReportHistory />
    </>
  )
}

ReportHistory = memo(
  ReportHistory,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export default ReportHistory
