/* eslint-disable react-hooks/exhaustive-deps */
import {Alert} from '@components/alert'
import {DataTable} from '@components/datatable'
import {ExportPdfExcel} from '@components/export/ExportPdfExcel'
import {Search} from '@components/form/searchAlert'
import {ToastMessage} from '@components/toast-message'
import {guidBulkChecked, KTSVG, useTimeOutMessage} from '@helpers'
import {useQuery} from '@tanstack/react-query'
import {FC, memo, useCallback, useEffect, useMemo, useState} from 'react'
import Dropdown from 'react-bootstrap/Dropdown'
import {useNavigate} from 'react-router-dom'

import {
  deleteBulkMaintenanceCategory,
  exportMaintenanceCategory,
  getMaintenanceCategory,
} from './Service'

type Props = {
  page: any
  setPage: any
  pageFrom: any
  onDelete: any
  onDetail: any
  totalPage: any
  setPageFrom: any
  setTotalPage: any
  resetKeyword: any
  setResetKeyword: any
  setShowModalCustomer: any
  reloadMaintenanceCategory: any
  setDetailMaintenanceCategory: any
}

let CardMintenanceCategory: FC<Props> = ({
  page,
  setPage,
  onDelete,
  onDetail,
  pageFrom,
  totalPage,
  setPageFrom,
  setTotalPage,
  resetKeyword,
  setResetKeyword,
  setShowModalCustomer,
  reloadMaintenanceCategory,
  setDetailMaintenanceCategory,
}) => {
  const navigate: any = useNavigate()

  const [meta, setMeta] = useState<any>({})
  const [limit, setLimit] = useState<number>(10)
  const [keyword, setKeyword] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [dataChecked, setDataChecked] = useState<any>([])
  const [orderDir, setOrderDir] = useState<string>('asc')
  const [reloadDelete, setReloadDelete] = useState<any>(1)
  const [orderCol, setOrderCol] = useState<string>('name')
  const [totalPerPage, setTotalPerPage] = useState<number>(0)
  const [showModalBulk, setShowModalConfirmBulk] = useState<boolean>(false)

  const columns: any = useMemo(() => {
    return [
      {header: 'checkbox', width: '20px'},
      {header: 'View', width: '20px'},
      {header: 'Maintenance Category', sort: true, value: 'name'},
      {header: 'Edit', width: '20px'},
      {header: 'Delete', width: '20px'},
    ]
  }, [])

  const msg_alert_bulk_delete: any = [
    'Are you sure you want to delete',
    <strong key='full_name'> {dataChecked?.length || 0} </strong>,
    'Maintenance Category data?',
  ]

  const onExport = (e: string) => {
    exportMaintenanceCategory({type: e, orderDir, orderCol})
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

  const onSearch = (e: any) => {
    setPage(1)
    setKeyword(e ? `*${e}*` : '')
  }

  const onEdit = (e: any) => {
    setShowModalCustomer(true)
    setDetailMaintenanceCategory(e)
  }

  const onSort = (value: any) => {
    setOrderCol(value)
    setOrderDir(orderDir === 'asc' ? 'desc' : 'asc')
  }

  const onChecked = (e: any) => {
    const ar_guid: any = guidBulkChecked(e)
    setDataChecked(ar_guid)
  }

  const confirmDeleteBulk = useCallback(() => {
    setLoading(true)
    deleteBulkMaintenanceCategory({guids: dataChecked})
      .then(({data: {message}}: any) => {
        const total_data_page: number = totalPage - pageFrom
        if (total_data_page - dataChecked?.length <= 0) {
          if (page > 1) {
            setPage(page - 1)
          } else {
            setPage(page)
            setResetKeyword(true)
          }
        } else {
          setPage(page)
        }

        setLoading(false)
        setDataChecked([])
        setShowModalConfirmBulk(false)
        setReloadDelete(reloadDelete + 1)
        ToastMessage({type: 'success', message})
      })
      .catch(({response}: any) => {
        setLoading(false)
        const {message} = response?.data || {}
        ToastMessage({type: 'error', message})
      })
  }, [dataChecked, reloadDelete])

  useEffect(() => {
    useTimeOutMessage('clear', 5000)
  }, [])

  const maintenanceCategoryQuery: any = useQuery({
    // initialData: {data: []},
    queryKey: [
      'getMaintenanceCategory',
      {
        page,
        limit,
        keyword,
        reloadMaintenanceCategory,
        reloadDelete,
        orderDir,
        orderCol,
      },
    ],
    queryFn: async () => {
      const filters: any = {}
      const res: any = await getMaintenanceCategory({
        page,
        limit,
        orderDir,
        orderCol,
        keyword,
        ...filters,
      })
      const {total, from}: any = res?.data?.meta || {}
      setTotalPage(total)
      setPageFrom(from)
      setMeta(res?.data?.meta || {})
      const dataResult: any = res?.data?.data?.map((maintenanceCategory: any) => {
        const {guid, name}: any = maintenanceCategory
        return {
          original: maintenanceCategory,
          checkbox: maintenanceCategory,
          guid: guid,
          view: 'view',
          name,
          edit: 'Edit',
          delete: 'Delete',
        }
      })

      setTotalPerPage(dataResult?.length || 0)
      return dataResult as never[]
    },
    // refactor react-query v5 (change onError => throwOnError)
    onError: ({response}: any) => {
      ToastMessage({message: response?.data?.message, type: 'error'})
    },
  })

  const dataMaintenanceCategory: any = maintenanceCategoryQuery?.data || []

  useEffect(() => {
    if (totalPerPage === 0 && Object.keys(meta || {})?.length > 0) {
      setPage(meta?.current_page > 1 ? meta?.current_page - 1 : 1)
    }
  }, [totalPerPage, meta])

  useEffect(() => {
    if (resetKeyword) {
      onSearch('')
      setResetKeyword(false)
    }
  }, [resetKeyword])

  useEffect(() => {
    ToastMessage({type: 'clear'})
  }, [])

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
                  setDetailMaintenanceCategory(undefined)
                }}
              >
                + Add New Maintenance Category
              </button>
            </div>

            <div className='dropdown' style={{marginRight: '5px'}}>
              <Dropdown>
                <Dropdown.Toggle
                  size='sm'
                  id='dropdown-basic'
                  variant='light-primary'
                  data-cy='actionMaintenanceCategory'
                >
                  Actions
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <ExportPdfExcel onExport={onExport} />
                  <Dropdown.Item
                    href='#'
                    data-cy='importMaintenanceCategory'
                    onClick={() => {
                      navigate({
                        pathname: '/tools/import',
                        search: 'type=maintenance-category',
                      })
                    }}
                  >
                    Import New Maintenance Category
                  </Dropdown.Item>
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
          columns={columns}
          total={totalPage}
          data={dataMaintenanceCategory}
          onDelete={onDelete}
          onChecked={onChecked}
          loading={!maintenanceCategoryQuery?.isFetched}
          onChangePage={onPageChange}
          onChangeLimit={onChangeLimit}
          onDetail={(e: any) => onDetail(e)}
        />

        <Alert
          type={'delete'}
          loading={loading}
          confirmLabel={'Delete'}
          showModal={showModalBulk}
          body={msg_alert_bulk_delete}
          title={'Delete Maintenance Category'}
          setShowModal={setShowModalConfirmBulk}
          onCancel={() => setShowModalConfirmBulk(false)}
          onConfirm={() => {
            confirmDeleteBulk()
            setLoading(false)
          }}
        />
      </div>
    </div>
  )
}

CardMintenanceCategory = memo(
  CardMintenanceCategory,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export default CardMintenanceCategory
