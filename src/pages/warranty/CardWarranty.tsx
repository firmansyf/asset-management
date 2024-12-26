/* eslint-disable react-hooks/exhaustive-deps */
import {DataTable} from '@components/datatable'
import {matchColumns, toColumns} from '@components/dnd/table'
import {ExportPdfExcel} from '@components/export/ExportPdfExcel'
import {FilterAll, FilterColumns} from '@components/filter/FilterAll'
import {Search} from '@components/form/searchAlert'
import {ToastMessage} from '@components/toast-message'
import ToolbarImport from '@components/ToolbarActions/import'
import {hasPermission, KTSVG, preferenceDate, setColumn} from '@helpers'
import {useQuery} from '@tanstack/react-query'
import moment from 'moment'
import {FC, memo, useCallback, useEffect} from 'react'
import Dropdown from 'react-bootstrap/Dropdown'
import {useNavigate} from 'react-router-dom'

import {
  exportWarranty,
  getDetailWarranty,
  getOptionsColumns,
  getSetupColumn,
  getWarranty,
} from './redux/WarrantyCRUD'

type Props = {
  onDelete: any
  preference: any
  setShowModaWarranty: any
  setShowModalDetail: any
  setWarrantyDetail: any
  reloadWarranty: any
  setShowModalConfirmBulk: any
  dataChecked: any
  setDataChecked: any
  page: any
  setPage: any
  limit: any
  setLimit: any
  setColumns: any
  totalPage: any
  keyword: any
  setKeyword: any
  setOrderCol: any
  orderCol: any
  orderDir: any
  setOrderDir: any
  setFilterAll: any
  setPageFrom: any
  filterAll: any
  setTotalPage: any
  resetKeyword?: any
  setResetKeyword?: any
  setGuidDetail?: any
  dataFilterParams?: any
}

let CardWarranty: FC<Props> = ({
  preference,
  onDelete,
  setShowModaWarranty,
  setShowModalDetail,
  setWarrantyDetail,
  reloadWarranty,
  setShowModalConfirmBulk,
  dataChecked,
  setDataChecked,
  page,
  setPage,
  limit,
  setLimit,
  setColumns,
  totalPage,
  keyword,
  setKeyword,
  setOrderCol,
  orderCol,
  orderDir,
  setOrderDir,
  setPageFrom,
  filterAll,
  setTotalPage,
  setFilterAll,
  resetKeyword,
  setResetKeyword,
  setGuidDetail,
  dataFilterParams,
}) => {
  const navigate: any = useNavigate()
  const pref_date: any = preferenceDate()
  const params: any = new URLSearchParams(location?.search)
  const statusParam: any = params.get('status') || ''

  const PermissionAdd: any = hasPermission('warranty.add') || false
  const PermissionEdit: any = hasPermission('warranty.edit') || false
  const PermissionView: any = hasPermission('warranty.view') || false
  const PermissionDelete: any = hasPermission('warranty.delete') || false
  const PermissionExport: any = hasPermission('warranty.export') || false
  const PermissionSetup: any = hasPermission('setup-column.setup_column_warranty') || false

  const onExport = (e: any) => {
    const filters: any = filterAll?.child || {}
    const fields: any = columns?.filter(({value}: any) => value)?.map(({value}: any) => value)
    exportWarranty({type: e, keyword, columns: fields?.join(','), ...filters})
      .then(({data: res}) => {
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

  const onSearch = useCallback(
    (e: any) => {
      setPage(1)
      setKeyword(`*${e || ''}*`)
    },
    [setKeyword, setPage]
  )

  const onDetail = ({guid}: any) => {
    setGuidDetail(guid)
    setShowModalDetail(true)
    getDetailWarranty(guid).then(({data: {data: res_warranty}}: any) => {
      setWarrantyDetail(res_warranty)
    })
  }

  const onEdit = ({guid}: any) => {
    setShowModaWarranty(true)
    getDetailWarranty(guid).then(({data: {data: res_warranty}}: any) => {
      setWarrantyDetail(res_warranty)
    })
  }

  const onChecked = (e: any) => {
    const ar_guid: any = []
    e?.forEach((ck: any) => {
      const {checked}: any = ck || {}
      if (checked) {
        const {original}: any = ck || {}
        const {guid} = original || {}
        ar_guid?.push(guid)
      }
    })
    setDataChecked(ar_guid as never[])
  }

  const onSort = (value: any) => {
    setOrderCol(value)
    setOrderDir(orderDir === 'asc' ? 'desc' : 'asc')
  }

  const onRender = (val: any) => ({
    asset_name: <span className='fw-bold text-nowrap'>{val || ''}</span>,
    // length: val ? `${val} month(s)` : '-',
    expired: () => {
      const dt: any = val
        ? moment(val)
            ?.format(pref_date)
            ?.split('-')
            ?.map((m: any) => m?.padStart(2, '0'))
            ?.join('-')
        : '-'
      return dt
    },
    status: () => {
      switch (val?.toLowerCase()) {
        case 'active':
          return <span className='badge badge-light-success'>{val || ''}</span>
        case 'expired':
          return <span className='badge badge-light-danger'>{val || ''}</span>
        case 'expiring':
          return <span className='badge badge-light-info'>{val || ''}</span>
        default:
          return <span className='badge rounded-pill badge-light text-dark'>{val || ''}</span>
      }
    },
  })

  const _dateFormat: any = preference?.date_format
  const columnsQuery: any = useQuery({
    queryKey: ['getSetupColumnWaranty'],
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
        if (c?.value === 'status_warranty') {
          ColData?.push({value: 'status', header: 'Status', sort: true})
        } else {
          ColData?.push(c)
        }
      })

      setColumns(dataResult)
      return {columns: dataResult, columnsFilter: ColData}
    },
  })
  const {columns, columnsFilter}: any = columnsQuery?.data || {}

  const warrantyQuery: any = useQuery({
    // initialData: {data: []},
    queryKey: [
      'getWarranty',
      {
        page,
        limit,
        keyword,
        orderDir,
        orderCol,
        filterAll,
        reloadWarranty,
        statusParam,
        dataFilterParams,
        columns,
      },
    ],
    queryFn: async () => {
      if (columns?.length > 0) {
        const filterParams2: any = {}
        const filters: any = filterAll?.child || {}
        statusParam && (filters[`filter[status]`] = statusParam)

        const res: any = await getWarranty({
          page,
          limit,
          keyword,
          orderDir,
          orderCol,
          ...filters,
          ...filterParams2,
          ...dataFilterParams,
        })

        const {current_page, total, per_page, from}: any = res?.data?.meta || {}
        setPageFrom(from)
        setLimit(per_page)
        setTotalPage(total)
        setPage(current_page)

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
  const dataWarranty: any = warrantyQuery?.data || []

  useEffect(() => {
    ToastMessage({type: 'clear'})
  }, [])

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
                  className='btn btn-sm btn-primary me-2'
                  data-cy='btnBulkDelete'
                  onClick={() => setShowModalConfirmBulk(true)}
                >
                  <span className='indicator-label'>Delete Selected</span>
                </button>
              )}

              {PermissionAdd && (
                <button
                  className='btn btn-sm btn-primary'
                  type='button'
                  data-cy='addWarranty'
                  onClick={() => {
                    setWarrantyDetail({})
                    setShowModaWarranty(true)
                  }}
                >
                  + Add New Warranty
                </button>
              )}
            </div>
            <div className='dropdown' data-cy='actions' style={{marginRight: '5px'}}>
              <Dropdown>
                <Dropdown.Toggle
                  variant='light-primary'
                  size='sm'
                  id='dropdown-basic'
                  data-cy='actionWarranty'
                >
                  Actions
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {PermissionExport && <ExportPdfExcel onExport={onExport} />}

                  <ToolbarImport
                    actionName='Import New Warranty'
                    pathName='/tools/import'
                    type='warranty'
                    permission='import-export.import_warranty'
                  />

                  {PermissionSetup && (
                    <Dropdown.Item href='#' onClick={() => navigate('/warranty/columns')}>
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
          onChange={setFilterAll}
          api={getOptionsColumns}
        />
      </div>

      <div className='card-body'>
        <DataTable
          limit={limit}
          onSort={onSort}
          onEdit={onEdit}
          render={onRender}
          total={totalPage}
          page={page}
          columns={columns}
          onDelete={onDelete}
          data={dataWarranty}
          onDetail={onDetail}
          onChecked={onChecked}
          edit={PermissionEdit}
          view={PermissionView}
          del={PermissionDelete}
          onChangePage={onPageChange}
          onChangeLimit={onChangeLimit}
          loading={!warrantyQuery?.isFetched || !columnsQuery?.isFetched}
        />
      </div>
    </div>
  )
}

CardWarranty = memo(
  CardWarranty,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export default CardWarranty
