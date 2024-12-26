/* eslint-disable react-hooks/exhaustive-deps */
import {DataTable} from '@components/datatable'
import {matchColumns, toColumns} from '@components/dnd/table'
import {ExportPdfExcel} from '@components/export/ExportPdfExcel'
import {FilterAll, FilterColumns} from '@components/filter/FilterAll'
import {Search} from '@components/form/searchAlert'
import {ToastMessage} from '@components/toast-message'
import {guidBulkChecked, hasPermission, KTSVG, setColumn, useTimeOutMessage} from '@helpers'
import {useQuery} from '@tanstack/react-query'
import {FC, memo, useEffect, useState} from 'react'
import Dropdown from 'react-bootstrap/Dropdown'
import {Link, useNavigate} from 'react-router-dom'

import {
  exportMeter,
  getDetailMeter,
  getMeter,
  getMeterOptionsColumns,
  getSetupColumnMeter,
} from '../Service'
import AddMeter from './add/add'
import ValidationSchema from './add/validation'

type Props = {
  onDelete: any
  reloadMeter: any
  setReloadMeter: any
  dataChecked: any
  setDataChecked: any
  setShowModalConfirmBulk: any
  page: any
  setPage: any
  setPageFrom: any
  totalPage: any
  setTotalPage: any
  resetKeyword: any
  setResetKeyword: any
}

const CardMeterCode: FC<Props> = ({
  onDelete,
  reloadMeter,
  setReloadMeter,
  dataChecked,
  setDataChecked,
  setShowModalConfirmBulk,
  page,
  setPage,
  setPageFrom,
  totalPage,
  setTotalPage,
  resetKeyword,
  setResetKeyword,
}) => {
  const navigate: any = useNavigate()

  const [limit, setLimit] = useState<number>(10)
  const [keyword, setKeyword] = useState<string>('')
  const [filterAll, setFilterAll] = useState<any>({})
  const [detailMeter, setDetailMeter] = useState<any>()
  const [orderDir, setOrderDir] = useState<string>('asc')
  const [meterSchema, setMeterSchema] = useState<any>([])
  const [orderCol, setOrderCol] = useState<string>('name')
  const [showModalAdd, setShowModalAdd] = useState<boolean>(false)

  const PermissionAdd: any = hasPermission('maintenance.meter.add') || false
  const PermissionEdit: any = hasPermission('maintenance.meter.edit') || false
  const PermissionView: any = hasPermission('maintenance.meter.view') || false
  const PermissionDelete: any = hasPermission('maintenance.meter.delete') || false
  const PermissionSetup: any = hasPermission('maintenance.meter.setup-column') || false

  const onExport = (e: any) => {
    const filters: any = filterAll?.child || {}
    const fields: any = columns
      ?.filter(({value}: any) => value)
      ?.map(({value}: any) => value)
      ?.join()

    exportMeter({type: e, keyword, orderDir, orderCol, columns: fields, ...filters})
      .then(({data: res}: any) => {
        const {data, message}: any = res || {}
        const {url}: any = data || {}
        useTimeOutMessage('success', 0, message)
        setTimeout(() => totalPage <= 500 && window.open(url, '_blank'), 1000)
      })
      .catch(({response}) => {
        const {message}: any = response?.data || {}
        useTimeOutMessage('error', 0, message)
      })
  }

  const onChangeLimit = (e: any) => {
    setPage(1)
    setLimit(e)
  }

  const onPageChange = (e: any) => {
    setPage(e)
  }

  const onDetail = ({guid}: any) => {
    navigate(`/maintenance/meter/detail/${guid || ''}`)
  }

  const onEdit = ({guid}: any) => {
    guid &&
      getDetailMeter(guid).then(({data: {data: res}}: any) => {
        res && setDetailMeter(res)
        res && setShowModalAdd(true)
      })
  }

  const onSort = (value: any) => {
    setOrderCol(value)
    setOrderDir(orderDir === 'asc' ? 'desc' : 'asc')
  }

  const onSearch = (e: any) => {
    setPage(1)
    setKeyword(e ? `*${e}*` : '')
  }

  const onChecked = (e: any) => {
    const ar_guid: any = guidBulkChecked(e)
    setDataChecked(ar_guid)
  }

  const columnsQuery: any = useQuery({
    queryKey: ['getSetupColumnMeter', {page, limit, keyword, orderDir, orderCol, reloadMeter}],
    queryFn: async () => {
      const res: any = await getSetupColumnMeter({})
      const {fields}: any = res?.data?.data || {}
      const mapColumns: any = toColumns(fields, {checked: true, order: true})?.map(
        ({value, label: header, is_filter, is_sortable}: any) => {
          let head: any = header
          const change: string = 'Checkbox '
          header === 'Checkbox' && (head = change)
          header === 'title' && (head = 'wo_title')
          return {
            value,
            header: head,
            sort: is_sortable === 1 ? true : false,
            is_filter,
          }
        }
      )
      const dataResult: any = setColumn(mapColumns)
      const columnsFilter: any = dataResult?.filter(({is_filter}: any) => is_filter === 1)
      return {columns: dataResult, columnsFilter}
    },
  })
  const {columns}: any = columnsQuery?.data || []

  const meterQuery: any = useQuery({
    // initialData: {data: []},
    queryKey: [
      'getMeter',
      {
        page,
        limit,
        keyword,
        orderDir,
        orderCol,
        columns,
        filterAll,
        reloadMeter,
      },
    ],
    queryFn: async () => {
      if (columns?.length > 0) {
        const filters: any = filterAll?.child || {}
        const res: any = await getMeter({
          page,
          limit,
          keyword,
          orderDir,
          orderCol,
          ...filters,
        })

        const {current_page, per_page, total, from}: any = res?.data?.meta || {}
        setPageFrom(from)
        setLimit(per_page)
        setTotalPage(total)
        setPage(current_page)

        const resData: any = res?.data?.data?.map((m: any) => ({
          ...m,
          checkbox: m,
          location_name: m?.location_name || m?.location?.name || '-',
          asset_name: m?.asset_name || m?.asset?.name || '-',
          created_at: m?.created_on || '-',
          unique_id: m?.wo_id || '-',
          duedate: m?.due_date || '-',
        }))

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
  const dataMeter: any = meterQuery?.data || []

  useEffect(() => {
    useTimeOutMessage('clear', 5000)
  }, [])

  useEffect(() => {
    if (resetKeyword) {
      onSearch('')
      setResetKeyword(false)
    }
  }, [resetKeyword])

  return (
    <>
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

              <FilterAll columns={columns} filterAll={filterAll} onChange={setFilterAll} />
            </div>

            <div className='d-flex my-1'>
              <div style={{marginRight: '5px'}}>
                {dataChecked?.length > 0 && PermissionDelete && (
                  <button
                    type='button'
                    className='btn btn-sm btn-primary me-2'
                    onClick={() => setShowModalConfirmBulk(true)}
                  >
                    <span className='indicator-label'>Delete Selected</span>
                  </button>
                )}

                {PermissionAdd && (
                  <Link
                    to='#'
                    className='btn btn-sm btn-primary me-1'
                    onClick={() => {
                      setShowModalAdd(true)
                      setDetailMeter(undefined)
                    }}
                  >
                    + Add New Meter
                  </Link>
                )}
              </div>

              <div className='dropdown' style={{marginRight: '5px'}}>
                <Dropdown>
                  <Dropdown.Toggle
                    size='sm'
                    id='dropdown-basic'
                    className='fw-bolder'
                    variant='light-primary'
                  >
                    Actions
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <ExportPdfExcel onExport={onExport} />
                    {PermissionSetup && (
                      <Dropdown.Item
                        href='#'
                        onClick={() => navigate('/maintenance/meter/setup-column')}
                      >
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
            api={getMeterOptionsColumns}
          />
        </div>

        <div className='card-body'>
          {Array.isArray(dataMeter) && (
            <DataTable
              page={page}
              limit={limit}
              onEdit={onEdit}
              onSort={onSort}
              data={dataMeter}
              columns={columns}
              total={totalPage}
              onDelete={onDelete}
              onDetail={onDetail}
              onChecked={onChecked}
              edit={PermissionEdit}
              view={PermissionView}
              del={PermissionDelete}
              onChangePage={onPageChange}
              onChangeLimit={onChangeLimit}
              loading={!meterQuery?.isFetched || !columnsQuery?.isFetched}
            />
          )}
        </div>
      </div>

      <AddMeter
        showModal={showModalAdd}
        reloadMeter={reloadMeter}
        meterDetail={detailMeter}
        meterSchema={meterSchema}
        setShowModal={setShowModalAdd}
        setReloadMeter={setReloadMeter}
      />

      <ValidationSchema setMeterSchema={setMeterSchema} />
    </>
  )
}

const CardMeter = memo(
  CardMeterCode,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export default CardMeter
