import {deleteBulkCustomer, exportCustomer, getCustomer} from '@api/customer'
import {Alert} from '@components/alert'
import {DataTable} from '@components/datatable'
import {ExportPdfExcel} from '@components/export/ExportPdfExcel'
import {Search} from '@components/form/searchAlert'
import {ToastMessage} from '@components/toast-message'
import {hasPermission, KTSVG} from '@helpers'
import {debounce} from 'lodash'
import {FC, memo, useCallback, useEffect, useState} from 'react'
import Dropdown from 'react-bootstrap/Dropdown'

type Props = {
  onDelete: any
  onDetail: any
  setShowModalCustomer: any
  setDetailCustomer: any
  reloadCustomer: any
}

let CardCustomer: FC<Props> = ({
  onDelete,
  onDetail,
  setShowModalCustomer,
  setDetailCustomer,
  reloadCustomer,
}) => {
  const [filter] = useState<any>([])
  const [meta, setMeta] = useState<any>({})
  const [page, setPage] = useState<number>(1)
  const [limit, setLimit] = useState<number>(10)
  const [keyword, setKeyword] = useState<string>('')
  const [totalPage, setTotalPage] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(false)
  const [dataChecked, setDataChecked] = useState<any>([])
  const [orderDir, setOrderDir] = useState<string>('asc')
  const [orderCol, setOrderCol] = useState<string>('name')
  const [dataCustomer, setDataCustomer] = useState<any>([])
  const [reloadDelete, setReloadDelete] = useState<number>(1)
  const [totalPerPage, setTotalPerPage] = useState<number>(0)
  const [tableLoading, setTableLoading] = useState<boolean>(true)
  const [resetKeyword, setResetKeyword] = useState<boolean>(false)
  const [showModalBulk, setShowModalConfirmBulk] = useState<boolean>(false)

  const PermissionExport: any = hasPermission('setting.supplier.export') || false

  const columns: any = [
    {header: 'checkbox', width: '20px'},
    {header: 'View', width: '20px'},
    {header: 'Customer Name', sort: true, value: 'name'},
    {header: 'Customer Address', sort: true, value: 'address'},
    {header: 'Customer Type', sort: true, value: 'type'},
    {header: 'Edit', width: '20px'},
    {header: 'Delete', width: '20px'},
  ]

  const msg_alert_bulk_delete: any = [
    'Are you sure you want to delete',
    <strong key='full_name'> {dataChecked?.length || 0} </strong>,
    'customer data?',
  ]

  const onExport = (e: string) => {
    const columns: any = 'name,address,phone_number,email,website,type'
    exportCustomer({type: e, orderDir, orderCol, columns, keyword})
      .then(({data: res}: any) => {
        const {data, message}: any = res || {}
        const {url}: any = data || {}
        ToastMessage({message, type: 'success'})
        setTimeout(() => totalPage <= 500 && window.open(url, '_blank'), 1000)
      })
      .catch(({response}: any) => {
        const {message} = response?.data || {}
        ToastMessage({type: 'error', message})
      })
  }

  const onChangeLimit = (e: any) => {
    setPage(1)
    setLimit(e)
  }

  const onPageChange = (e: any) => {
    setPage(e)
  }

  const onSearch = debounce((e: any) => {
    setPage(1)
    setKeyword(e)
  }, 2000)

  const onEdit = (e: any) => {
    setDetailCustomer(e)
    setShowModalCustomer(true)
  }

  const onSort = (value: any) => {
    setOrderCol(value)
    setOrderDir(orderDir === 'asc' ? 'desc' : 'asc')
  }

  const onChecked = (e: any) => {
    const ar_guid: any = []
    e?.forEach((ticked: any) => {
      const {checked} = ticked || {}
      if (checked) {
        const {original} = ticked || {}
        const {guid} = original || {}
        ar_guid.push(guid)
      }
    })
    setDataChecked(ar_guid as never[])
  }

  const confirmDeleteBulkCustomer = useCallback(() => {
    setLoading(true)
    deleteBulkCustomer({guids: dataChecked})
      .then(({data: {message}}: any) => {
        setDataChecked([])
        setShowModalConfirmBulk(false)
        setReloadDelete(reloadDelete + 1)
        ToastMessage({type: 'error', message})
      })
      .catch(({response}: any) => {
        setLoading(false)
        const {message} = response?.data || {}
        ToastMessage({type: 'error', message})
      })
  }, [dataChecked, reloadDelete])

  useEffect(() => {
    setTableLoading(true)
    getCustomer({page, limit, orderDir, orderCol, keyword, filter})
      .then(({data: {data: res_customer, meta}}: any) => {
        const {total}: any = meta || {}
        setTotalPage(total)
        setMeta(meta || {})

        if (res_customer) {
          const data: any = res_customer?.map((customer: any) => {
            const {guid, name, address, type}: any = customer || {}

            return {
              original: customer,
              checkbox: customer,
              guid: guid,
              view: 'view',
              name,
              address,
              type,
              edit: 'Edit',
              delete: 'Delete',
            }
          })
          setDataCustomer(data as never[])
          setTotalPerPage(data?.length || 0)
        }
        setTableLoading(false)
      })
      .catch(() => setTableLoading(false))
  }, [page, limit, keyword, filter, reloadCustomer, reloadDelete, orderDir, orderCol])

  useEffect(() => {
    if (totalPerPage === 0 && Object.keys(meta || {})?.length > 0) {
      setResetKeyword(true)
      setPage(meta?.current_page > 1 ? meta?.current_page - 1 : 1)
    }
  }, [totalPerPage, meta])

  useEffect(() => {
    if (resetKeyword) {
      onSearch('')
      setResetKeyword(false)
    }
  }, [resetKeyword, onSearch])

  return (
    <div className='card card-custom card-table'>
      <div className='card-table-header'>
        <div className='d-flex flex-wrap flex-stack'>
          <div className='d-flex align-items-center position-relative me-4 my-1'>
            <KTSVG
              className='svg-icon-3 position-absolute ms-3'
              path='/media/icons/duotone/General/Search.svg'
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
                  data-cy='bulkDeleteSupplier'
                  className='btn btn-sm btn-primary me-2'
                  onClick={() => setShowModalConfirmBulk(true)}
                >
                  <span className='indicator-label'>Delete Selected</span>
                </button>
              )}

              <button
                type='button'
                data-cy='addCustomer'
                className='btn btn-sm btn-primary'
                onClick={() => {
                  setShowModalCustomer(true)
                  setDetailCustomer(undefined)
                }}
              >
                + Add New Customer
              </button>
            </div>

            <div className='dropdown' style={{marginRight: '5px'}}>
              <Dropdown>
                <Dropdown.Toggle
                  size='sm'
                  id='dropdown-basic'
                  variant='light-primary'
                  data-cy='actionCustomer'
                >
                  Actions
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {PermissionExport && <ExportPdfExcel onExport={onExport} />}
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
          onEdit={onEdit}
          columns={columns}
          total={totalPage}
          onDelete={onDelete}
          data={dataCustomer}
          onChecked={onChecked}
          loading={tableLoading}
          onChangePage={onPageChange}
          onChangeLimit={onChangeLimit}
          onDetail={(e: any) => onDetail(e)}
        />

        <Alert
          type={'delete'}
          loading={loading}
          confirmLabel={'Delete'}
          title={'Delete Customer'}
          showModal={showModalBulk}
          body={msg_alert_bulk_delete}
          setShowModal={setShowModalConfirmBulk}
          onConfirm={() => confirmDeleteBulkCustomer()}
          onCancel={() => setShowModalConfirmBulk(false)}
        />
      </div>
    </div>
  )
}

CardCustomer = memo(
  CardCustomer,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export default CardCustomer
