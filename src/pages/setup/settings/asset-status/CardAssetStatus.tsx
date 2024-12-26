/* eslint-disable react-hooks/exhaustive-deps */
import {DataTable} from '@components/datatable'
import {ExportPdfExcel} from '@components/export/ExportPdfExcel'
import {Search} from '@components/form/searchAlert'
import {ToastMessage} from '@components/toast-message'
import ToolbarImport from '@components/ToolbarActions/import'
import {guidBulkChecked, hasPermission, KTSVG, useTimeOutMessage} from '@helpers'
import {useQuery} from '@tanstack/react-query'
import {FC, memo, useEffect, useState} from 'react'
import Dropdown from 'react-bootstrap/Dropdown'

import {assetStatusExport, getAssetStatus} from './Service'
const label = 'Asset Status'
type Props = {
  onDelete: any
  setShowModalAssetStatus: any
  setShowModalDetailAssetStatus: any
  setAssetStatusDetail: any
  reloadAssetStatus: any
  reloadDelete: any
  setShowModalConfirmBulk: any
  dataChecked: any
  setDataChecked: any
  setAssignAssetStatus: any
  page: number
  setPage: any
  setTotalPerPage: any
  totalPage: number
  setTotalPage: any
  resetKeyword: boolean
  setResetKeyword: any
}
let CardAssetStatus: FC<Props> = ({
  onDelete,
  setShowModalAssetStatus,
  setShowModalDetailAssetStatus,
  setAssetStatusDetail,
  reloadAssetStatus,
  reloadDelete,
  setShowModalConfirmBulk,
  dataChecked,
  setDataChecked,
  setAssignAssetStatus,
  page,
  setPage,
  setTotalPerPage,
  totalPage,
  setTotalPage,
  resetKeyword,
  setResetKeyword,
}) => {
  const [filter] = useState<any>([])
  const [limit, setLimit] = useState<number>(10)
  const [keyword, setKeyword] = useState<string>('')
  const [orderDir, setOrderDir] = useState<string>('asc')
  const [orderCol, setOrderCol] = useState<string>('name')
  const PermissionExport: any = hasPermission('setting.status.export') || false
  useEffect(() => {
    useTimeOutMessage('clear', 800)
  }, [])

  const columns: any = [
    {header: 'checkbox', width: '20px'},
    {header: 'View', width: '20px'},
    {header: 'Asset Status', value: 'name', sort: true},
    {header: 'Description', value: 'description', sort: true},
    {header: 'Edit', width: '20px'},
    {header: 'Delete', width: '20px'},
  ]
  const onExport = (e: any) => {
    assetStatusExport({type: e, keyword})
      .then(({data: res}) => {
        const {data, message}: any = res || {}
        const {url}: any = data || {}
        ToastMessage({message, type: 'success'})
        setTimeout(() => totalPage <= 500 && window.open(url, '_blank'), 2000)
      })
      .catch(() => '')
  }
  const onChangeLimit = (e: any) => {
    setPage(1)
    setLimit(e)
    setDataChecked([])
  }
  const onPageChange = (e: any) => {
    setPage(e)
    setDataChecked([])
  }
  const onSearch = (e: any) => {
    setPage(1)
    setKeyword(e ? `*${e}*` : '')
  }
  const onDetail = (e: any) => {
    setAssetStatusDetail(e)
    setShowModalDetailAssetStatus(true)
  }
  const onEdit = (e: any) => {
    setAssetStatusDetail(e)
    setShowModalAssetStatus(true)
  }
  const onChecked = (e: any) => {
    const ar_guid: any = guidBulkChecked(e)
    setDataChecked(ar_guid)
  }
  const onSort = (value: any) => {
    setOrderCol(value)
    setOrderDir(orderDir === 'asc' ? 'desc' : 'asc')
  }

  const assetStatusQuery: any = useQuery({
    // initialData: {data: []},
    queryKey: [
      'getAssetStatus',
      {page, limit, keyword, filter, orderDir, orderCol, reloadAssetStatus, reloadDelete},
    ],
    queryFn: async () => {
      const res: any = await getAssetStatus({page, limit, keyword, filter, orderDir, orderCol})
      const {total, from}: any = res?.data?.meta || {}
      setTotalPage(total)
      setTotalPerPage(from)
      const dataResult: any = res?.data?.data?.map((assetStatus: any) => {
        const {guid, name, description} = assetStatus || {}
        return {
          original: assetStatus,
          checkbox: assetStatus,
          view: 'view',
          guid: guid,
          name,
          description: description || '-',
          edit: 'Edit',
          delete: 'Delete',
        }
      })

      setAssignAssetStatus(dataResult)
      return dataResult
    },
    // refactor react-query v5 (change onError => throwOnError)
    onError: ({response}: any) => {
      ToastMessage({message: response?.data?.message, type: 'error'})
    },
  })

  const dataAssetStatus: any = assetStatusQuery?.data || []

  useEffect(() => {
    if (resetKeyword) {
      onSearch('')
      setResetKeyword(false)
    }
  }, [resetKeyword, setResetKeyword])
  return (
    <div className='card card-custom card-table'>
      <div className='card-table-header'>
        <div className='d-flex flex-wrap flex-stack'>
          <div className='d-flex align-items-center position-relative me-4 my-1'>
            <KTSVG
              path='/media/icons/duotone/General/Search.svg'
              className='svg-icon-3 position-absolute ms-3'
            />
            <Search
              bg='solid'
              onChange={onSearch}
              resetKeyword={resetKeyword}
              setResetKeyword={setResetKeyword}
            />
          </div>
          <div className='d-flex my-1'>
            <div style={{marginRight: '5px'}}>
              {dataChecked?.length > 0 && (
                <button
                  type='button'
                  className='btn btn-sm btn-primary me-2'
                  onClick={() => setShowModalConfirmBulk(true)}
                >
                  <span className='indicator-label'>Delete Selected</span>
                </button>
              )}
              <button
                data-cy='addNewAssetStatus'
                className='btn btn-sm btn-primary'
                type='button'
                onClick={() => {
                  setAssetStatusDetail(undefined)
                  setShowModalAssetStatus(true)
                }}
              >
                + Add New {label}
              </button>
            </div>
            <div className='dropdown' style={{marginRight: '5px'}}>
              <Dropdown>
                <Dropdown.Toggle
                  variant='light-primary'
                  size='sm'
                  id='dropdown-basic'
                  data-cy='actions'
                >
                  Actions
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {PermissionExport && <ExportPdfExcel onExport={onExport} />}
                  <ToolbarImport
                    actionName='Import New Asset Status'
                    pathName='/tools/import'
                    type='asset-status'
                    permission='import-export.import_asset_status'
                  />
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
          onEdit={onEdit}
          onSort={onSort}
          loading={!assetStatusQuery?.isFetched}
          total={totalPage}
          columns={columns}
          onDelete={onDelete}
          onDetail={onDetail}
          onChecked={onChecked}
          data={dataAssetStatus}
          onChangePage={onPageChange}
          onChangeLimit={onChangeLimit}
        />
      </div>
    </div>
  )
}
CardAssetStatus = memo(
  CardAssetStatus,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export default CardAssetStatus
