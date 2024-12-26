import {DataTable} from '@components/datatable'
import {Search} from '@components/form/searchAlert'
import {ToastMessage} from '@components/toast-message'
import {checkFeature, hasPermission, KTSVG, preferenceDateTime} from '@helpers'
import {PageTitle} from '@metronic/layout/core'
import {Forbidden} from '@metronic/partials'
import {useQuery} from '@tanstack/react-query'
import moment from 'moment'
import {FC, useEffect, useState} from 'react'
import {useIntl} from 'react-intl'
import {useNavigate} from 'react-router-dom'

import {getApproveMaintenance} from '../Service'

const CardApprovalMaintenance: FC<any> = () => {
  const navigate: any = useNavigate()
  const pref_date_time: any = preferenceDateTime()
  const [page, setPage] = useState<number>(1)
  const [limit, setLimit] = useState<number>(10)
  const [keyword, setKeyword] = useState<string>('')
  const [totalPage, setTotalPage] = useState<number>(0)
  const [orderDir, setOrderDir] = useState<string>('asc')
  const [orderCol, setOrderCol] = useState<string>('wo_title')

  const viewPermission: any = hasPermission('approval.list.maintenance') || false

  const columns: any = [
    // {header: 'checkbox', width: '20px'},
    {header: 'View', width: '20px'},
    {header: 'Work Order ID', sort: true, value: 'wo_id'},
    {header: 'Work Order Title', sort: true, value: 'wo_title'},
    {header: 'Location', sort: true, value: 'location_name'},
    {header: 'Vendor', sort: true, value: 'vendor_name'},
    {header: 'Approval Send Date', sort: false, value: 'submitted_at'},
    {header: 'Status', sort: true, value: 'status_name'},
    // {header: 'Edit', width: '20px'},
    // {header: 'Delete', width: '20px'},
  ]

  const onChangeLimit = (e: any) => {
    setPage(1)
    setLimit(e)
  }

  const onSearch = (e: any) => {
    setPage(1)
    setKeyword(e ? `*${e}*` : '')
  }

  const onSort = (value: any) => {
    setOrderCol(value)
    setOrderDir(orderDir === 'asc' ? 'desc' : 'asc')
  }

  const onPageChange = (e: any) => {
    setPage(e)
  }

  const onDetail = (e: any) => {
    const {maintenance}: any = e || {}
    const {guid}: any = maintenance || {}
    navigate('/maintenance/work-order/detail/' + guid || '')
  }

  const onRender = (val: any) => {
    return {
      submitted_at: val ? moment(val || '')?.format(pref_date_time) : '-',
      status_name: <span className='badge badge-light-blue'>{val || ''}</span>,
    }
  }

  useEffect(() => {
    ToastMessage({type: 'clear'})
  }, [])

  const approvalMaintenanceQuery: any = useQuery({
    // initialData: {data: []},
    queryKey: ['getApproveMaintenance', {page, limit, keyword, orderDir, orderCol}],
    queryFn: async () => {
      const res: any = await getApproveMaintenance({
        page,
        orderDir,
        orderCol,
        limit,
        keyword,
      })
      const {current_page, per_page, total}: any = res?.data?.meta || {}
      setTotalPage(total)
      setLimit(per_page)
      setPage(current_page)
      const dataResult: any = res?.data?.data?.map((res: any) => {
        const {maintenance, status}: any = res || {}
        const {wo_id, wo_title, location, vendor, submitted_at}: any = maintenance || {}
        const {name: location_name}: any = location || {}
        const {name: vendor_name}: any = vendor || {}
        const {name: status_name}: any = status || {}
        return {
          view: 'view',
          wo_id: wo_id || '-',
          wo_title: wo_title || '-',
          location_name: location_name || '-',
          vendor_name: vendor_name || '-',
          submitted_at: submitted_at || '-',
          status_name: status_name || '-',
          original: res,
        }
      })
      return dataResult as never[]
    },
    // refactor react-query v5 (change onError => throwOnError)
    onError: ({response}: any) => {
      ToastMessage({message: response?.data?.message, type: 'error'})
    },
  })
  const dataApprovalMaintenance: any = approvalMaintenanceQuery?.data || []

  return (
    <div className='card card-custom card-table'>
      <div className='card-table-header'>
        <div className='d-flex flex-wrap flex-stack'>
          <div className='d-flex align-items-center position-relative me-4'>
            <KTSVG
              path='/media/icons/duotone/General/Search.svg'
              className='svg-icon-3 position-absolute ms-3'
            />
            <Search bg='solid' onChange={onSearch} />
          </div>
        </div>
      </div>
      <div className='card-body'>
        <DataTable
          limit={limit}
          onSort={onSort}
          total={totalPage}
          columns={columns}
          render={onRender}
          onDetail={onDetail}
          view={viewPermission}
          onChangePage={onPageChange}
          onChangeLimit={onChangeLimit}
          data={dataApprovalMaintenance}
          loading={!approvalMaintenanceQuery?.isFetched}
        />
      </div>
    </div>
  )
}

const ApprovalMaintenance: FC = () => {
  const intl: any = useIntl()
  const pagePermission: any = checkFeature('approval')

  const [loadingPage, setLoadingPage] = useState<boolean>(true)

  useEffect(() => {
    setTimeout(() => setLoadingPage(false), 10)
  }, [])

  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({id: 'MENU.APPROVAL.MAINTENANCE'})}
      </PageTitle>
      {loadingPage ? null : <>{!pagePermission ? <Forbidden /> : <CardApprovalMaintenance />}</>}
    </>
  )
}

export default ApprovalMaintenance
