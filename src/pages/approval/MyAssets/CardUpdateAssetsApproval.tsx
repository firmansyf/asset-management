import {DataTable} from '@components/datatable'
import {FilterAll, FilterColumns} from '@components/filter/FilterAll'
import {Search} from '@components/form/searchAlert'
import {ToastMessage} from '@components/toast-message'
import {hasPermission, KTSVG} from '@helpers'
import {
  getAssetUpdateApprovalOptColumns,
  getUpdatedAssetApproval,
} from '@pages/asset-management/redux/AssetRedux'
import {useQuery} from '@tanstack/react-query'
import {FC, memo, useState} from 'react'
import {Link, useNavigate} from 'react-router-dom'

const MyAssetsApproval: FC<any> = () => {
  const navigate: any = useNavigate()

  const [page, setPage] = useState<number>(1)
  const [limit, setLimit] = useState<number>(10)
  const [keyword, setKeyword] = useState<string>('')
  const [totalPage, setTotalPage] = useState<number>(0)
  const [orderDir, setOrderDir] = useState<string>('asc')
  const [orderCol, setOrderCol] = useState<string>('asset_id')
  const [filterAll, setFilterAll] = useState<any>({'filter[approval_type]': 'New Asset'})

  const PermissionEdit: any = hasPermission('my-assets.edit') || false

  const columns: any = [
    {header: 'checkbox', width: '20px'},
    {header: 'View', width: '20px'},
    {header: 'Asset ID', sort: true, value: 'asset_id'},
    {header: 'Asset Name', sort: true, value: 'asset_name'},
    {header: 'Asset Category', sort: true, value: 'category'},
    {header: 'Assignee', sort: true, value: 'assign_to'},
    {header: 'Department', sort: true, value: 'department'},
    {header: 'Serial Number', sort: true, value: 'serial_number'},
    {header: 'QR Code', sort: true, value: 'qr_code'},
    {header: 'Asset Assignee Status', sort: true, value: 'status'},
    {header: 'Edit', width: '20px'},
  ]

  const filter_columns: any = [
    {header: 'Assignee', sort: true, value: 'assign_to'},
    {header: 'Department', sort: true, value: 'department'},
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

  const onDetail = ({guid}: any) => {
    navigate(`/asset-management/detail/${guid || ''}`)
  }

  const onEdit = ({guid}: any) => {
    navigate(`/asset-management/edit?id=${guid || ''}`)
  }

  const onRender = (val: any, original: any) => {
    return {
      status:
        val === 'Rejected' ? (
          <>
            <span className='badge badge-danger'>{val || ''}</span>
            <Link
              target='_blank'
              to={`/help-desk/ticket/detail/${original?.original?.ticket_guid || ''}`}
              style={{
                marginLeft: '10px',
                fontSize: '12px',
                textDecoration: 'underline',
              }}
            >
              View Ticket
            </Link>
          </>
        ) : (
          <span className='badge badge-light-blue'>{val || ''}</span>
        ),
    }
  }

  const varFilterAll: any = filterAll?.child || {}
  const approvalUpdateAssetQuery: any = useQuery({
    // initialData: {data: []},
    queryKey: ['getUpdatedAssetApproval', {page, limit, keyword, orderDir, orderCol, varFilterAll}],
    queryFn: async () => {
      const res: any = await getUpdatedAssetApproval({
        page,
        limit,
        orderDir,
        orderCol,
        keyword,
        ...(filterAll?.child || {}),
      })
      const {total, current_page}: any = res?.data?.meta || {}
      const thisLimit: any = limit
      setLimit(thisLimit)
      setTotalPage(total)
      setPage(current_page)
      const dataResult: any = res?.data?.data?.map((res: any) => {
        const {
          asset_id,
          asset_name,
          category,
          assign_to,
          department,
          serial_number,
          qr_code,
          status,
        }: any = res || {}
        return {
          original: res,
          checkbox: res,
          view: 'view',
          asset_id: asset_id || '-',
          asset_name: asset_name || '-',
          category: category || '-',
          assign_to: assign_to || '-',
          department: department || '-',
          serial_number: serial_number || '-',
          qr_code: qr_code || '-',
          status: status,
          Edit: status !== 'Pending Approval' || false,
        }
      })
      return dataResult as never[]
    },
    // refactor react-query v5 (change onError => throwOnError)
    onError: ({response}: any) => {
      ToastMessage({message: response?.data?.message, type: 'error'})
    },
  })
  const dataApprovalUpdateAsset: any = approvalUpdateAssetQuery?.data || []

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
            <FilterAll columns={filter_columns} filterAll={filterAll} onChange={setFilterAll} />
          </div>
        </div>

        <FilterColumns
          setPage={setPage}
          filterAll={filterAll}
          onChange={setFilterAll}
          api={getAssetUpdateApprovalOptColumns}
        />
      </div>

      <div className='card-body'>
        <DataTable
          page={page}
          limit={limit}
          onSort={onSort}
          onEdit={onEdit}
          total={totalPage}
          columns={columns}
          render={onRender}
          onDetail={onDetail}
          edit={PermissionEdit}
          onChangePage={onPageChange}
          onChangeLimit={onChangeLimit}
          data={dataApprovalUpdateAsset}
          loading={!approvalUpdateAssetQuery?.isFetched}
          customEmptyTable='No Asset Updates Approval Added'
        />
      </div>
    </div>
  )
}

const CardUpdateAssetsApproval = memo(
  MyAssetsApproval,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export {CardUpdateAssetsApproval}
