/* eslint-disable react-hooks/exhaustive-deps */
import {DataTable} from '@components/datatable'
import {matchColumns, toColumns} from '@components/dnd/table'
import {ExportPdfExcel} from '@components/export/ExportPdfExcel'
import {FilterAll, FilterColumns} from '@components/filter/FilterAll'
import {Search} from '@components/form/searchAlert'
import {ToastMessage} from '@components/toast-message'
import {hasPermission, KTSVG, setColumn} from '@helpers'
import {useQuery} from '@tanstack/react-query'
import {FC, memo, useEffect} from 'react'
import Dropdown from 'react-bootstrap/Dropdown'
import {useNavigate} from 'react-router-dom'

import {
  exportVendor,
  getDetailVendor,
  getOptionsColumns,
  getSetupColumn,
  getVendor,
} from './redux/VendorCRUD'

type Props = {
  onDelete: any
  setShowModaVendor: any
  setShowModalDetail: any
  setVendorDetail: any
  reloadVendor: any
  setShowModalConfirmBulk: any
  dataChecked: any
  setDataChecked: any
  setPage: any
  page: any
  limit: any
  setLimit: any
  totalPage: any
  keyword: any
  setKeyword: any
  setOrderCol: any
  orderDir: any
  setOrderDir: any
  setFilterAll: any
  filterAll: any
  resetKeyword: any
  setResetKeyword: any
  setPageFrom: any
  setTotalPage: any
  filterStatus: any
  orderCol: any
}

let CardVendor: FC<Props> = ({
  onDelete,
  setShowModaVendor,
  setShowModalDetail,
  setVendorDetail,
  reloadVendor,
  setShowModalConfirmBulk,
  dataChecked,
  setDataChecked,
  setPage,
  page,
  limit,
  setLimit,
  totalPage,
  keyword,
  setKeyword,
  setOrderCol,
  orderDir,
  setOrderDir,
  filterAll,
  setFilterAll,
  resetKeyword,
  setResetKeyword,
  setPageFrom,
  setTotalPage,
  filterStatus,
  orderCol,
}) => {
  const navigate: any = useNavigate()

  const PermissionExport: any = hasPermission('maintenance.vendor.export') || false
  const PermissionImport: any = hasPermission('import-export.import_vendor') || false
  const PermissionSetup: any = hasPermission('setup-column.setup_column_vendor') || false

  const onExport = (e: any) => {
    const filters: any = filterAll?.child || {}
    const fields: any = columns?.filter(({value}: any) => value)?.map(({value}: any) => value)

    exportVendor({type: e, keyword, columns: fields?.join(','), ...filters})
      .then(({data: res}: any) => {
        const {data, message} = res || {}
        const {url} = data || {}
        ToastMessage({message, type: 'success'})
        setTimeout(() => totalPage <= 500 && window.open(url, '_blank'), 1000)
      })
      .catch(({response}: any) => {
        const {message} = response?.data || {}
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

  const onDetail = ({guid}: any) => {
    setShowModalDetail(true)
    getDetailVendor(guid).then(({data: {data: res}}: any) => {
      res && setVendorDetail(res || {})
    })
  }

  const onEdit = ({guid}: any) => {
    setShowModaVendor(true)
    getDetailVendor(guid).then(({data: {data: res}}: any) => {
      res && setVendorDetail(res)
    })
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

  const onSort = (value: any) => {
    setOrderCol(value)
    setOrderDir(orderDir === 'asc' ? 'desc' : 'asc')
  }

  const onRender = (val: any) => ({
    status: () => {
      switch (val.toLowerCase()) {
        case 'active':
          return <span className='badge badge-light-success'>{val}</span>
        case 'non-active':
          return <span className='badge badge-light-danger'>{val}</span>
        default:
          return <span className='badge rounded-pill badge-light text-dark'>{val}</span>
      }
    },
    phone_number: val?.length > 0 ? <span>{`+${val || ''}`}</span> : '-',
  })

  const columnsQuery: any = useQuery({
    queryKey: ['getSetupColumnVendor'],
    queryFn: async () => {
      const res: any = await getSetupColumn({})
      const {fields}: any = res?.data?.data || {}
      const mapColumns: any = toColumns(fields, {checked: true, order: true})?.map(
        ({value, label: header, is_filter, is_sortable}: any) => {
          let head: any = header
          const change: string = 'Checkbox '
          header === 'Checkbox' && (head = change)
          return {
            value,
            header: head,
            sort: is_sortable === 1 ? true : false,
            is_filter,
          }
        }
      )
      const dataResult: any = setColumn(mapColumns)
      const ColData: any = []
      dataResult?.forEach((c: any) => {
        if (c?.value === 'status_vendor') {
          ColData?.push({value: 'status', header: 'Status', sort: true})
        } else {
          ColData?.push(c)
        }
      })

      const columnsFilter: any = ColData as never[]
      return {columns: dataResult, columnsFilter}
    },
  })
  const {columns, columnsFilter}: any = columnsQuery?.data || []

  const vendorQuery: any = useQuery({
    // initialData: {data: []},
    queryKey: [
      'getVendor',
      {
        columns,
        filterStatus,
        page,
        limit,
        keyword,
        orderDir,
        orderCol,
        filterAll,
        reloadVendor,
      },
    ],
    queryFn: async () => {
      if (columns?.length > 0) {
        const filters: any = filterAll?.child || {}

        if (filterStatus) {
          filters[`filter[status]`] = filterStatus
        }
        const res: any = await getVendor({
          page,
          limit,
          keyword,
          orderDir,
          orderCol,
          ...filters,
        })

        const {current_page, per_page, total, from}: any = res?.data?.meta || {}
        setTotalPage(total)
        setPage(current_page)
        setLimit(per_page)
        setPageFrom(from)

        const resData: any = res?.data?.data as never[]
        return matchColumns(resData, columns)
      } else {
        return []
      }
    },
    // refactor react-query v5 (change onError => throwOnError)
    onError: ({response}: any) => {
      ToastMessage({message: response?.data?.message, type: 'error'})
    },
  })
  const dataVendor: any = vendorQuery?.data || []

  useEffect(() => {
    if (resetKeyword) {
      onSearch('')
      setResetKeyword(false)
    }
  }, [resetKeyword])

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
            <FilterAll columns={columnsFilter} filterAll={filterAll} onChange={setFilterAll} />
          </div>
          <div className='d-flex my-1'>
            <div style={{marginRight: '5px'}}>
              {dataChecked?.length > 0 && (
                <button
                  type='button'
                  data-cy='btnBulkDelete'
                  className='btn btn-sm btn-primary me-2'
                  onClick={() => setShowModalConfirmBulk(true)}
                >
                  <span className='indicator-label'>Delete Selected</span>
                </button>
              )}

              <button
                type='button'
                data-cy='addVendor'
                className='btn btn-sm btn-primary'
                onClick={() => {
                  setVendorDetail({})
                  setShowModaVendor(true)
                }}
              >
                + Add New Vendor
              </button>
            </div>

            <div className='dropdown' data-cy='actions' style={{marginRight: '5px'}}>
              <Dropdown>
                <Dropdown.Toggle
                  size='sm'
                  id='dropdown-basic'
                  data-cy='actionVendor'
                  variant='light-primary'
                >
                  Actions
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {PermissionExport && <ExportPdfExcel onExport={onExport} />}
                  {PermissionImport && (
                    <Dropdown.Item
                      href='#'
                      data-cy='importVendor'
                      onClick={() => navigate({pathname: '/tools/import', search: 'type=vendor'})}
                    >
                      Import New Vendor
                    </Dropdown.Item>
                  )}
                  {PermissionSetup && (
                    <Dropdown.Item href='#' onClick={() => navigate('/vendor/columns')}>
                      Setup Column
                    </Dropdown.Item>
                  )}
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>
        </div>

        <FilterColumns
          setPage={setPage}
          filterAll={filterAll}
          api={getOptionsColumns}
          onChange={setFilterAll}
        />
      </div>

      <div className='card-body'>
        <DataTable
          limit={limit}
          onEdit={onEdit}
          onSort={onSort}
          total={totalPage}
          page={page}
          data={dataVendor}
          columns={columns}
          render={onRender}
          onDelete={onDelete}
          onDetail={onDetail}
          onChecked={onChecked}
          onChangePage={onPageChange}
          onChangeLimit={onChangeLimit}
          loading={!vendorQuery?.isFetched || !columnsQuery?.isFetched}
        />
      </div>
    </div>
  )
}

CardVendor = memo(
  CardVendor,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export default CardVendor
