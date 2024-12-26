import {DataTable} from '@components/datatable'
import {Search} from '@components/form/searchAlert'
import {ToastMessage} from '@components/toast-message'
import {checkFeature, hasPermission, KTSVG, preferenceDate} from '@helpers'
import {PageTitle} from '@metronic/layout/core'
import {Forbidden} from '@metronic/partials'
import {useQuery} from '@tanstack/react-query'
import moment from 'moment'
import {FC, useEffect, useState} from 'react'
import {useIntl} from 'react-intl'

import {getApproveHistory} from '../Service'

const CardApprovalHistory: FC<any> = () => {
  const pref_date: any = preferenceDate()

  const [page, setPage] = useState<number>(1)
  const [keyword, setKeyword] = useState<any>()
  const [limit, setLimit] = useState<number>(10)
  const [totalPage, setTotalPage] = useState<number>(0)
  const [orderDir, setOrderDir] = useState<string>('desc')
  const [orderCol, setOrderCol] = useState<string>('approved_at')

  const viewPermission: any = hasPermission('approval.list.history') || false

  const columns: any = [
    {header: 'checkbox', width: '20px'},
    {header: 'View', width: '20px'},
    {header: 'Module', sort: true, value: 'module'},
    {header: 'Case ID', sort: true, value: 'case_id'},
    {header: 'Approved By', sort: true, value: 'approved_by'},
    {header: 'Status', sort: true, value: 'status_name'},
    {header: 'Date Submitted For Approval', sort: true, value: 'submitted_at'},
    {header: 'Approval Date', sort: true, value: 'approved_at'},
  ]

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

  const onDetail = ({approvable}: any) => {
    const {guid} = approvable || {}
    window.location.href = `/insurance-claims/${guid || ''}/detail`
  }

  useEffect(() => {
    ToastMessage({type: 'clear'})
  }, [])

  const approvalHistoryQuery: any = useQuery({
    // initialData: {data: []},
    queryKey: ['getApproveHistory', {page, limit, keyword, orderDir, orderCol, pref_date}],
    queryFn: async () => {
      const res: any = await getApproveHistory({page, limit, keyword, orderDir, orderCol})
      const {current_page, per_page, total}: any = res?.data?.meta || {}
      setLimit(per_page)
      setTotalPage(total)
      setPage(current_page)
      const dataResult: any = res?.data?.data?.map((res: any) => {
        const {module, status, submitted_at, approved_at, approvable, approved_by}: any = res
        return {
          checkbox: res,
          view: 'view',
          module: module?.name || '-',
          case_id: approvable?.data_id || '-',
          approved_by: approved_by || '-',
          status_name: status?.name || '-',
          submitted_at: submitted_at !== null ? moment(submitted_at)?.format(pref_date) : '-',
          approved_at: approved_at !== null ? moment(approved_at)?.format(pref_date) : '-',
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
  const dataApprovalHistory: any = approvalHistoryQuery?.data || []

  return (
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
        </div>
      </div>

      <div className='card-body'>
        <DataTable
          limit={limit}
          onSort={onSort}
          total={totalPage}
          columns={columns}
          onDetail={onDetail}
          view={viewPermission}
          data={dataApprovalHistory}
          onChangePage={onPageChange}
          onChangeLimit={onChangeLimit}
          loading={!approvalHistoryQuery?.isFetched}
        />
      </div>
    </div>
  )
}

const ApprovalHistory: FC = () => {
  const intl: any = useIntl()
  const pagePermission: any = checkFeature('approval')

  const [loadingPage, setLoadingPage] = useState<boolean>(true)

  useEffect(() => {
    setTimeout(() => setLoadingPage(false), 10)
  }, [])

  return (
    <>
      <PageTitle breadcrumbs={[]}>{intl.formatMessage({id: 'MENU.APPROVAL.HISTORY'})}</PageTitle>
      {loadingPage ? '' : <>{!pagePermission ? <Forbidden /> : <CardApprovalHistory />}</>}
    </>
  )
}

export default ApprovalHistory
