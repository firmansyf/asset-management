import {DataTable} from '@components/datatable'
import {matchColumns, toColumns} from '@components/dnd/table'
import {ExportPdfExcel} from '@components/export/ExportPdfExcel'
import {FilterAll, FilterColumns} from '@components/filter/FilterAll'
import {Search} from '@components/form/searchAlert'
import {ToastMessage} from '@components/toast-message'
import ToolbarImport from '@components/ToolbarActions/import'
import {KTSVG, preferenceDateTime, setColumn} from '@helpers'
import {useQuery} from '@tanstack/react-query'
import moment from 'moment'
import {FC, memo, useCallback, useEffect, useState} from 'react'
import {Dropdown} from 'react-bootstrap'
import {shallowEqual, useSelector} from 'react-redux'
import {Link, useNavigate} from 'react-router-dom'

import {
  exportInventory,
  getInventory,
  getOptionsColumns,
  getSetupColumnInventory,
} from './redux/InventoryCRUD'

type Props = {
  onDelete: any
  reloadInventory: any
  setShowModalConfirmBulk: any
  dataChecked: any
  setDataChecked: any
  page: any
  setPage: any
  limit: any
  setLimit: any
  totalPage: any
  keyword: any
  setKeyword: any
  orderCol: any
  setOrderCol: any
  orderDir: any
  setOrderDir: any
  filterAll: any
  setFilterAll: any
  resetKeyword?: any
  setResetKeyword?: any
  pagePermission?: any
  setPagePermission?: any
  setPageFrom?: any
  setTotalPage?: any
}

let CardInventory: FC<Props> = ({
  onDelete,
  reloadInventory,
  setShowModalConfirmBulk,
  dataChecked,
  setDataChecked,
  page,
  setPage,
  limit,
  setLimit,
  totalPage,
  keyword,
  setKeyword,
  orderCol,
  setOrderCol,
  orderDir,
  setOrderDir,
  filterAll,
  setFilterAll,
  resetKeyword,
  setResetKeyword,
  pagePermission,
  setPagePermission,
  setPageFrom,
  setTotalPage,
}) => {
  const navigate: any = useNavigate()
  const pref_date: any = preferenceDateTime()
  const preferenceStore: any = useSelector(({preference}: any) => preference, shallowEqual)
  const {feature}: any = preferenceStore || {}

  const [meta, setMeta] = useState<any>({})
  const [totalPerPage, setTotalPerPage] = useState<any>(false)

  const onExport = (e: any) => {
    const filters: any = filterAll?.child || {}
    const column: any = columns
      ?.filter(({value}: any) => value)
      ?.map(({value}: any) => value)
      ?.join()

    exportInventory({type: e, columns: column, ...filters, keyword})
      .then(({data: res}: any) => {
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
    setDataChecked([])
    setLimit(e)
  }

  const onPageChange = (e: any) => {
    setDataChecked([])
    setPage(e)
  }

  const onSearch = useCallback(
    (e: any) => {
      setPage(1)
      setKeyword(e || '')
    },
    [setKeyword, setPage]
  )

  const onDetail = (e: any) => {
    const {guid}: any = e || {}
    navigate(`/inventory/detail/${guid || ''}`)
  }

  const onEdit = (e: any) => {
    const {guid}: any = e || {}
    navigate(`/inventory/add?id=${guid || ''}`)
  }

  const onChecked = (e: any) => {
    const ar_guid: any = []
    e?.forEach((ck: any) => {
      const {checked}: any = ck || {}
      if (checked) {
        const {original}: any = ck || {}
        const {guid}: any = original || {}
        ar_guid?.push(guid)
      }
    })
    setDataChecked(ar_guid as never[])
  }

  const onSort = (value: any) => {
    setOrderCol(value)
    setOrderDir(orderDir === 'asc' ? 'desc' : 'asc')
  }

  const columnsQuery: any = useQuery({
    queryKey: ['getSetupColumnInventory'],
    queryFn: async () => {
      const res: any = await getSetupColumnInventory({})
      const {fields}: any = res?.data?.data || {}
      const mapColumns: any = toColumns(fields, {checked: true, order: true})?.map(
        ({value, label: header}: any) => {
          return {
            value,
            header,
            sort: true,
          }
        }
      )
      const dataResult: any = setColumn(mapColumns)
      return dataResult
    },
  })
  const columns: any = columnsQuery?.data || []

  const dataInventoryQuery: any = useQuery({
    // initialData: {data: []},
    queryKey: [
      'getInventory',
      {
        pagePermission,
        page,
        limit,
        keyword,
        orderDir,
        orderCol,
        filterAll,
        reloadInventory,
        columns,
      },
    ],
    queryFn: async () => {
      if (columns?.length > 0) {
        const filters: any = filterAll?.child || {}
        const res: any = await getInventory({
          page: page > 0 ? page : 1,
          limit,
          keyword,
          orderDir,
          orderCol,
          ...filters,
        })
        const {current_page, total, from} = res?.data?.meta || {}
        setPageFrom(from)
        setMeta(meta || {})
        setTotalPage(total)
        setPage(current_page)
        setTotalPerPage(totalPerPage === false && res?.length === 0 ? false : res?.length || 0)
        return matchColumns(res?.data?.data, columns)
      } else {
        return []
      }
    },
    // refactor react-query v5 (change onError => throwOnError)
    onError: ({response}: any) => {
      ToastMessage({message: response?.data?.message, type: 'error'})
    },
  })
  const dataInventory: any = dataInventoryQuery?.data || []

  useEffect(() => {
    if (Object.keys(feature)?.length > 0) {
      feature
        ?.filter((features: {unique_name: any}) => features?.unique_name === 'inventory')
        ?.map((feature: any) => setPagePermission(feature?.value === 0 ? false : true))
    }
  }, [feature, setPagePermission])

  useEffect(() => {
    if (totalPerPage === 0 && Object.keys(meta || {})?.length > 0) {
      setPage(meta?.current_page > 1 ? meta?.current_page - 1 : 1)
    }
  }, [totalPerPage, meta, setPage])

  useEffect(() => {
    if (resetKeyword) {
      onSearch('')
      setResetKeyword(false)
    }
  }, [resetKeyword, setResetKeyword, onSearch])

  return (
    <div className='card card-table card-custom'>
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
            <FilterAll columns={columns} filterAll={filterAll} onChange={setFilterAll} />
          </div>

          <div className='d-flex my-1'>
            <div style={{marginRight: '5px'}}>
              {dataChecked?.length > 0 && (
                <button
                  type='button'
                  className='btn btn-sm btn-primary me-2'
                  onClick={() => {
                    setShowModalConfirmBulk(true)
                  }}
                >
                  <span className='indicator-label'>Delete Selected</span>
                </button>
              )}
              <Link className='btn btn-sm btn-primary' to='/inventory/add' data-cy='addInventory'>
                + Add New Inventory
              </Link>
            </div>
            <div className='dropdown' style={{marginRight: '5px'}}>
              <Dropdown>
                <Dropdown.Toggle variant='light-primary' size='sm' id='dropdown-basic'>
                  Actions
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <ExportPdfExcel onExport={onExport} />
                  <ToolbarImport
                    actionName='Import New Inventory'
                    pathName='/tools/import'
                    type='inventory'
                    permission='import-export.import_inventory'
                  />
                  <Dropdown.Item
                    href='#'
                    data-cy='setupColumn'
                    onClick={() => {
                      navigate('/inventory/columns')
                    }}
                  >
                    Setup Column
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>
        </div>

        <FilterColumns
          api={getOptionsColumns}
          filterAll={filterAll}
          onChange={setFilterAll}
          setPage={setPage}
        />
      </div>

      <div className='card-body'>
        {Array.isArray(dataInventory) && (
          <DataTable
            page={page}
            limit={limit}
            onEdit={onEdit}
            onSort={onSort}
            total={totalPage}
            columns={columns}
            onDelete={onDelete}
            onDetail={onDetail}
            data={dataInventory}
            onChecked={onChecked}
            onChangePage={onPageChange}
            onChangeLimit={onChangeLimit}
            loading={!dataInventoryQuery?.isFetched || !columnsQuery?.isFetched}
            render={(val: any) => {
              return {
                created_at: val ? moment(val).format(pref_date) : '-',
              }
            }}
          />
        )}
      </div>
    </div>
  )
}

CardInventory = memo(
  CardInventory,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export default CardInventory
