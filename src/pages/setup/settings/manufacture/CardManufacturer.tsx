/* eslint-disable react-hooks/exhaustive-deps */
import {DataTable} from '@components/datatable'
import {ExportPdfExcel} from '@components/export/ExportPdfExcel'
import {Search} from '@components/form/searchAlert'
import {ToastMessage} from '@components/toast-message'
import ToolbarImport from '@components/ToolbarActions/import'
import {configClass, guidBulkChecked, hasPermission, KTSVG} from '@helpers'
import {useQuery} from '@tanstack/react-query'
import {FC, memo, useEffect, useState} from 'react'
import Dropdown from 'react-bootstrap/Dropdown'

import {exportManufacturer, getManufacturer} from './Service'
const label: string = 'Manufacturer'
type Props = {
  onDelete: any
  deleteReload: any
  setShowModalConfirmBulk: any
  dataChecked: any
  setDataChecked: any
  reloadManufacturer: any
  setManufacturerDetail: any
  setShowModalManufacturer: any
  setShowModalDetail: any
  setPage: any
  page: any
  totalPage: any
  setTotalPage: any
  setTotalPerPage: any
  resetKeyword: any
  setResetKeyword: any
}
let CardManufacturer: FC<Props> = ({
  onDelete,
  deleteReload,
  setShowModalConfirmBulk,
  dataChecked,
  setDataChecked,
  reloadManufacturer,
  setManufacturerDetail,
  setShowModalManufacturer,
  setShowModalDetail,
  setPage,
  page,
  totalPage,
  setTotalPage,
  setTotalPerPage,
  resetKeyword,
  setResetKeyword,
}) => {
  const [limit, setLimit] = useState<number>(10)
  const [keyword, setKeyword] = useState<string>('')

  const [orderDir, setOrderDir] = useState<string>('asc')
  const [orderCol, setOrderCol] = useState<string>('name')

  const PermissionExport: any = hasPermission('setting.manufacturer.export') || false
  const columns: any = [
    {header: 'checkbox', width: '20px'},
    {header: 'View', width: '20px'},
    {header: 'Manufacturer', value: 'name', sort: true},
    {header: 'Description', value: 'description', sort: true},
    {header: 'Edit', width: '20px'},
    {header: 'Delete', width: '20px'},
  ]
  useEffect(() => {
    ToastMessage({type: 'clear'})
  }, [])
  const onExport = (e: any) => {
    exportManufacturer({type: e, keyword})
      .then(({data: res}) => {
        const {data, message}: any = res || {}
        const {url}: any = data || {}
        ToastMessage({message, type: 'success'})
        setTimeout(() => totalPage <= 500 && window.open(url, '_blank'), 2000)
      })
      .catch(({response}: any) => {
        const {message}: any = response?.data || {}
        ToastMessage({message, type: 'error'})
      })
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
    setManufacturerDetail(e)
    setShowModalDetail(true)
  }
  const onEdit = (e: any) => {
    setManufacturerDetail(e)
    setShowModalManufacturer(true)
  }
  const onChecked = (e: any) => {
    const ar_guid: any = guidBulkChecked(e)
    setDataChecked(ar_guid)
  }
  const onSort = (value: any) => {
    setOrderCol(value)
    setOrderDir(orderDir === 'asc' ? 'desc' : 'asc')
  }

  const dataManufacturerParam: any = {page, limit, keyword, orderDir, orderCol}
  const dataManufacturerQuery: any = useQuery({
    // initialData: {data: []},
    queryKey: ['getManufacturer', {...dataManufacturerParam, reloadManufacturer, deleteReload}],
    queryFn: async () => {
      const res: any = await getManufacturer(dataManufacturerParam)
      const {total, from}: any = res?.data?.meta || {}
      setTotalPage(total)
      setTotalPerPage(from)
      const dataResult: any = res?.data?.data?.map((manufacture: any) => {
        const {guid, name, description}: any = manufacture || {}
        return {
          original: manufacture,
          checkbox: manufacture,
          view: 'view',
          guid: guid,
          name,
          description,
          edit: 'Edit',
          delete: 'Delete',
        }
      })

      return dataResult
    },
    // refactor react-query v5 (change onError => throwOnError)
    onError: ({response}: any) => {
      ToastMessage({message: response?.data?.message, type: 'error'})
    },
  })

  const dataManufacturer: any = dataManufacturerQuery?.data || []

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
                  data-cy='bulkDelete'
                  className='btn btn-sm btn-primary me-2'
                  onClick={() => setShowModalConfirmBulk(true)}
                >
                  <span className='indicator-label'>Delete Selected</span>
                </button>
              )}
              <button
                data-cy='addManufacturer'
                className='btn btn-sm btn-primary'
                type='button'
                onClick={() => {
                  setManufacturerDetail(undefined)
                  setShowModalManufacturer(true)
                }}
              >
                + Add New {label}
              </button>
            </div>
            <div className='dropdown' style={{marginRight: '5px'}}>
              <Dropdown>
                <Dropdown.Toggle
                  size='sm'
                  data-cy='actions'
                  id='dropdown-basic'
                  variant='light-primary'
                >
                  Actions
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {PermissionExport && <ExportPdfExcel onExport={onExport} />}
                  <ToolbarImport
                    type='manufacturer'
                    pathName='/tools/import'
                    actionName='Import New Manufacturer'
                    permission='import-export.import_manufacturer'
                  />
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>
        </div>
      </div>
      <div className='collapse' id='collapseExample'>
        <div className='p-8 border-bottom'>
          <div className='row'>
            <label htmlFor='country' className={configClass?.label}>
              Companies
            </label>
            <div className='col-md-4'>
              <select className={configClass?.select} name='country'>
                <option value=''>All Companies</option>
              </select>
            </div>
            <div className='col-md-6'>&nbsp;</div>
          </div>
        </div>
      </div>
      <div className='card-body'>
        <DataTable
          page={page}
          limit={limit}
          onEdit={onEdit}
          onSort={onSort}
          data={dataManufacturer}
          columns={columns}
          loading={!dataManufacturerQuery?.isFetched}
          total={totalPage}
          onDelete={onDelete}
          onDetail={onDetail}
          onChecked={onChecked}
          onChangePage={onPageChange}
          onChangeLimit={onChangeLimit}
        />
      </div>
    </div>
  )
}
CardManufacturer = memo(
  CardManufacturer,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export default CardManufacturer
