/* eslint-disable react-hooks/exhaustive-deps */
import {Alert} from '@components/alert'
import {DataTable} from '@components/datatable'
import {matchColumns} from '@components/dnd/table'
import {ExportPdfExcel} from '@components/export/ExportPdfExcel'
import {FilterAll, FilterColumns} from '@components/filter/FilterAll'
import {Search} from '@components/form/searchAlert' //search
import {ToastMessage} from '@components/toast-message'
import {guidBulkChecked, hasPermission, KTSVG} from '@helpers'
import {PageTitle} from '@metronic/layout/core'
import {
  bulkDeleteShifts,
  deleteShifts,
  exportShifts,
  getShiftOptionsColumns,
  getShifts,
} from '@pages/help-desk/shift/Service'
import {useQuery} from '@tanstack/react-query'
import {FC, memo, useCallback, useEffect, useMemo, useState} from 'react'
import Dropdown from 'react-bootstrap/Dropdown'
import {useIntl} from 'react-intl'

import AddShift from './add'
import {DetailShift} from './detail'

const ShiftsPage: FC<any> = () => {
  const intl: any = useIntl()

  const [page, setPage] = useState<number>(1)
  const [reload, setReload] = useState<any>([])
  const [detail, setDetail] = useState<any>({})
  const [limit, setLimit] = useState<number>(10)
  const [keyword, setKeyword] = useState<string>('')
  const [filterAll, setFilterAll] = useState<any>({})
  const [pageFrom, setPageFrom] = useState<number>(0)
  const [totalPage, setTotalPage] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(false)
  const [shiftName, setShiftName] = useState<string>('')
  const [shiftGuid, setShiftGuid] = useState<string>('')
  const [orderDir, setOrderDir] = useState<string>('asc')
  const [dataChecked, setDataChecked] = useState<any>([])
  const [orderCol, setOrderCol] = useState<string>('name')
  const [showModalAdd, setShowModalAdd] = useState<boolean>(false)
  const [resetKeyword, setResetKeyword] = useState<boolean>(false)
  const [showModalDelete, setShowModalDelete] = useState<boolean>(false)
  const [showModalDetail, setShowModalDetail] = useState<boolean>(false)
  const [showModalConfirmBulk, setShowModalConfirmBulk] = useState<boolean>(false)

  const PermissionAdd: any = hasPermission('help-desk.shift.add') || false
  const PermissionEdit: any = hasPermission('help-desk.shift.edit') || false
  const PermissionDelete: any = hasPermission('help-desk.shift.delete') || false
  const PermissionExport: any = hasPermission('help-desk.shift.export') || false

  const columns: any = useMemo(
    () => [
      {header: 'checkbox', width: '20px'},
      {header: 'View', width: '20px'},
      {header: 'Shift Name', value: 'name', sort: true},
      {header: 'Timezone', value: 'timezone', sort: true},
      {header: 'Working Hours', value: 'working_hour_name', sort: true},
      {header: 'Edit', width: '20px'},
      {header: 'Delete', width: '20px'},
    ],
    []
  )

  const onDelete = (e: any) => {
    const {name, guid}: any = e || {}
    setShiftName(name || '')
    setShiftGuid(guid || '')
    setShowModalDelete(true)
  }

  const onDetail = (e: any) => {
    setDetail(e)
    setShowModalDetail(true)
  }

  const onEdit = (e: any) => {
    setDetail(e)
    setShowModalAdd(true)
  }

  const onSort = (value: any) => {
    setOrderCol(value)
    setOrderDir(orderDir === 'asc' ? 'desc' : 'asc')
  }

  const onChangePage = (e: any) => {
    setPage(e)
    setDataChecked([])
  }

  const onLimit = (e: any) => {
    setPage(1)
    setLimit(e)
    setDataChecked([])
  }

  // BulkDeleteMark
  const onChecked = (e: any) => {
    const ar_guid: any = guidBulkChecked(e)
    setDataChecked(ar_guid)
  }

  const onSearch = (e: any) => {
    setPage(1)
    setKeyword(e ? `*${e}*` : '')
  }

  const shiftQuery: any = useQuery({
    // initialData: {data: []},
    queryKey: ['getShifts', {columns, page, orderDir, orderCol, limit, keyword, reload, filterAll}],
    queryFn: async () => {
      const filters: any = filterAll?.child || {}
      const res: any = await getShifts({
        page,
        orderDir,
        orderCol,
        limit,
        keyword,
        ...filters,
      })
      const {current_page, per_page, total, from}: any = res?.data?.meta || {}
      setPageFrom(from)
      setLimit(per_page)
      setTotalPage(total)
      setPage(current_page)

      return matchColumns(res?.data?.data, columns)
    },
    // refactor react-query v5 (change onError => throwOnError)
    onError: ({response}: any) => {
      ToastMessage({message: response?.data?.message, type: 'error'})
    },
  })
  const dataShift: any = shiftQuery?.data || []

  const onExport = (e: any) => {
    const filters: any = filterAll?.child || {}
    exportShifts({type: e, keyword: `*${keyword}*`, ...filters})
      .then(({data: {message, data}}: any) => {
        const {url}: any = data || {}
        window.open(url, '_blank')
        ToastMessage({message, type: 'success'})
      })
      .catch(({response}: any) => {
        const {message}: any = response?.data || {}
        ToastMessage({message, type: 'error'})
      })
  }

  const confirmDelete = useCallback(() => {
    setLoading(true)
    deleteShifts(shiftGuid)
      .then(({data: {message}}: any) => {
        setTimeout(() => {
          ToastMessage({message, type: 'success'})
          const total_data_page: number = totalPage - pageFrom
          const thisPage: any = page

          if (total_data_page - 1 <= 0) {
            if (thisPage > 1) {
              setPage(thisPage - 1)
            } else {
              setPage(thisPage)
              setResetKeyword(true)
            }
          } else {
            setPage(thisPage)
          }
          setLoading(false)
          setShowModalDelete(false)
          setReload(reload + 1)
          setDataChecked([])
        }, 1000)
      })
      .catch(({response}: any) => {
        setLoading(false)
        const {message} = response?.data || {}
        ToastMessage({message, type: 'error'})
      })
  }, [shiftGuid, reload])

  const msg_alert: any = [
    'Are you sure you want to delete this shift ',
    <strong key='shift_name'>{shiftName || ''}</strong>,
    '?',
  ]

  // bulk delete
  const confirmBulkDelete = useCallback(() => {
    setLoading(true)
    bulkDeleteShifts({guids: dataChecked})
      .then(({data: {message}}: any) => {
        setTimeout(() => {
          ToastMessage({message, type: 'success'})
          setLoading(false)
          setShowModalConfirmBulk(false)
          const total_data_page: number = totalPage - pageFrom
          const thisPage: any = page

          if (total_data_page - dataChecked?.length <= 0) {
            if (thisPage > 1) {
              setPage(thisPage - 1)
            } else {
              setPage(thisPage)
              setResetKeyword(true)
            }
          } else {
            setPage(thisPage)
          }
          setReload(reload + 1)
          setDataChecked([])
        }, 1000)
      })
      .catch(({response}: any) => {
        setLoading(false)
        const {message}: any = response?.data || {}
        ToastMessage({message, type: 'error'})
      })
  }, [dataChecked, reload])

  const msg_alert_bulk: any = [
    'Are you sure want to remove',
    <span key='span1' className='text-dark fw-bolder'>
      {dataChecked?.length || 0}
    </span>,
    'shift(s) ?',
  ]

  useEffect(() => {
    setTimeout(() => ToastMessage({type: 'clear'}), 1000)
  }, [])

  useEffect(() => {
    if (resetKeyword) {
      onSearch('')
      setResetKeyword(false)
    }
  }, [resetKeyword])

  return (
    <>
      <PageTitle breadcrumbs={[]}>{intl.formatMessage({id: 'HELPDESK.SHIFTS'})}</PageTitle>
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

                {PermissionAdd && (
                  <button
                    type='button'
                    data-cy='add'
                    className='btn btn-sm btn-primary'
                    onClick={() => {
                      setDetail(undefined)
                      setShowModalAdd(true)
                    }}
                  >
                    + Add New Shifts
                  </button>
                )}
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
                  {PermissionExport && (
                    <Dropdown.Menu>
                      <ExportPdfExcel onExport={onExport} />
                    </Dropdown.Menu>
                  )}
                </Dropdown>
              </div>
            </div>
          </div>

          <FilterColumns
            setPage={setPage}
            filterAll={filterAll}
            onChange={setFilterAll}
            api={getShiftOptionsColumns}
          />
        </div>

        <div className='card-body'>
          <DataTable
            page={page}
            limit={limit}
            onEdit={onEdit}
            onSort={onSort}
            data={dataShift}
            columns={columns}
            total={totalPage}
            onDelete={onDelete}
            onDetail={onDetail}
            onChecked={onChecked}
            edit={PermissionEdit}
            del={PermissionDelete}
            bulk={PermissionDelete}
            onChangeLimit={onLimit}
            onChangePage={onChangePage}
            loading={!shiftQuery?.isFetched}
          />
        </div>
      </div>

      <AddShift
        detail={detail}
        reload={reload}
        setReload={setReload}
        showModal={showModalAdd}
        setShowModal={setShowModalAdd}
        setDataChecked={setDataChecked}
      />

      <Alert
        type={'delete'}
        body={msg_alert}
        loading={loading}
        title={'Delete Shift'}
        confirmLabel={'Delete'}
        showModal={showModalDelete}
        setShowModal={setShowModalDelete}
        onConfirm={() => confirmDelete()}
        onCancel={() => setShowModalDelete(false)}
      />

      {/* bulk delete */}
      <Alert
        loading={loading}
        type={'blukdelete'}
        body={msg_alert_bulk}
        confirmLabel={'Delete'}
        title={'Bulk Delete Shift(s)'}
        showModal={showModalConfirmBulk}
        setShowModal={setShowModalConfirmBulk}
        onConfirm={() => confirmBulkDelete()}
        onCancel={() => setShowModalConfirmBulk(false)}
      />

      <DetailShift
        dataDetail={detail}
        showModal={showModalDetail}
        setShowModal={setShowModalDetail}
      />
    </>
  )
}

const Shifts = memo(
  ShiftsPage,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export default Shifts
