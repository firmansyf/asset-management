/* eslint-disable react-hooks/exhaustive-deps */
import {DataTable} from '@components/datatable'
import {matchColumns, toColumns} from '@components/dnd/table'
import {ExportPdfExcel} from '@components/export/ExportPdfExcel'
import {FilterAll, FilterColumns} from '@components/filter/FilterAll'
import {Search} from '@components/form/searchAlert'
import {ToastMessage} from '@components/toast-message'
import ToolbarImport from '@components/ToolbarActions/import'
import {
  guidBulkChecked,
  hasPermission,
  KTSVG,
  parseFilters,
  preferenceDate,
  preferenceDateTime,
  setColumn,
  useTimeOutMessage,
} from '@helpers'
import {useQuery} from '@tanstack/react-query'
import moment from 'moment'
import {FC, memo, useCallback, useEffect, useState} from 'react'
import Dropdown from 'react-bootstrap/Dropdown'
import {shallowEqual, useSelector} from 'react-redux'
import {Link, useNavigate} from 'react-router-dom'

import {
  downloadFormWorkOrder,
  duplicate,
  exportWorkOrder,
  getFilterWorkOrder,
  getOptionsColumns,
  getSetupColumnWorkOrder,
  getWorkOrder,
} from '../Service'
import {ModalArchive} from './archive'
import {ModalFeedback} from './feedback'

type Props = {
  onDelete: any
  reloadWorkOrder: any
  setReloadWorkOrder: any
  page: any
  setPage: any
  setPageFrom: any
  totalPage: any
  setTotalPage: any
  resetKeyword: any
  setResetKeyword: any
}

const CardWorkOrderCode: FC<Props> = ({
  onDelete,
  reloadWorkOrder,
  setReloadWorkOrder,
  page,
  setPage,
  setPageFrom,
  totalPage,
  setTotalPage,
  resetKeyword,
  setResetKeyword,
}) => {
  const navigate: any = useNavigate()
  const pref_date: any = preferenceDate()
  const pref_date_time: any = preferenceDateTime()
  const preferenceStore: any = useSelector(({preference}: any) => preference, shallowEqual)
  const {feature}: any = preferenceStore || {}

  const [limit, setLimit] = useState<any>(10)
  const [keyword, setKeyword] = useState<any>('')
  const [filterAll, setFilterAll] = useState<any>({})
  const [loading, setLoading] = useState<boolean>(true)
  const [orderDir, setOrderDir] = useState<string>('asc')
  const [dataChecked, setDataChecked] = useState<any>([])
  const [orderCol, setOrderCol] = useState<string>('wo_id')
  const [quickFilterData, setQuickFilterData] = useState<any>(0)
  const [dataFeedback, setDataFeedback] = useState<boolean>(false)
  const [showModalArchive, setShowModalArchive] = useState<boolean>(false)
  const [showModalFeedback, setShowModalFeedback] = useState<boolean>(false)
  const [feedbackPermission, setFeedbackPermission] = useState<any>(undefined)

  const addPermission: any = hasPermission('maintenance.add') || false
  const editPermission: any = hasPermission('maintenance.edit') || false
  const viewPermission: any = hasPermission('maintenance.view') || false
  const setupPermission: any = hasPermission('maintenance.setup') || false
  const deletePermission: any = hasPermission('maintenance.delete') || false
  const exportPermission: any = hasPermission('maintenance.export') || false
  const duplicatePermission: any = hasPermission('maintenance.duplicate') || false
  const feedbackPermissions: any = hasPermission('maintenance.feedback.view') || false
  const importPermission: any = hasPermission('import-export.import_maintenance') || false

  const dataFilterParams = useCallback(() => {
    const filterParams2: any = {}
    return filterParams2
  }, [])

  const onExport = (e: any) => {
    const filters: any = parseFilters(filterAll?.child) || {}
    const column: any = columns
      ?.filter(({value}: any) => value)
      ?.map(({value}: any) => value)
      ?.join()

    exportWorkOrder({
      type: e,
      keyword,
      orderDir,
      orderCol,
      columns: column,
      filter: filters,
    })
      .then(({data: res}: any) => {
        const {data, message}: any = res || {}
        const {url}: any = data || {}
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
    setLimit(e || 10)
  }

  const onPageChange = (e: any) => {
    setPage(e || 1)
  }

  const onDetail = ({guid}: any) => {
    navigate(`/maintenance/work-order/detail/${guid || ''}`)
  }

  const onEdit = ({guid}: any) => {
    navigate(`/maintenance/work-order/edit?id=${guid || ''}`)
  }

  const onSort = (value: any) => {
    setOrderCol(value)
    setOrderDir(orderDir === 'asc' ? 'desc' : 'asc')
  }

  const onSearch = (e: any) => {
    setPage(1)
    setKeyword(e || '')
  }

  const onChecked = (e: any) => {
    const ar_guid: any = guidBulkChecked(e)
    setDataChecked(ar_guid)
  }

  const onDuplicate = () => {
    setLoading(true)
    duplicate({guids: dataChecked})
      .then(({data: {message}}: any) => {
        ToastMessage({type: 'success', message})
        setReloadWorkOrder(reloadWorkOrder + 1)
      })
      .catch(({response}: any) => {
        setLoading(false)
        const {message}: any = response?.data || {}
        ToastMessage({message, type: 'error'})
      })
  }

  const onDownload = ({guid}: any) => {
    guid &&
      downloadFormWorkOrder(guid)
        .then(({data: res}) => {
          const {message, url}: any = res || {}
          setTimeout(() => {
            window.open(url, '_blank')
            ToastMessage({message, type: 'success'})
          }, 1000)
        })
        .catch(({response}: any) => {
          const {message}: any = response?.data || {}
          ToastMessage({message, type: 'error'})
        })
  }

  const onFeedback = (e: any) => {
    setDataFeedback(e)
    setShowModalFeedback(true)
  }

  const setStatus = (val: any) => {
    switch (val?.toLowerCase()) {
      case 'open':
        return <span className='badge badge-light-primary'>{val || ''}</span>
      case 'on hold':
        return <span className='badge badge-light-warning'>{val || ''}</span>
      case 'in progress':
        return <span className='badge badge-light-info'>{val || ''}</span>
      case 'completed':
        return <span className='badge badge-light-success'>{val || ''}</span>
      default:
        return <span className='badge rounded-pill badge-light text-dark'>{val || ''}</span>
    }
  }

  const onRender = (val: any) => ({
    status: setStatus(val),
    created_on: val ? moment(val || '')?.format(pref_date_time) : '-',
    duedate: val ? moment(val || '')?.format(pref_date) : '-',
    start_date: val ? moment(val || '')?.format(pref_date) : '-',
    end_date: val ? moment(val || '')?.format(pref_date) : '-',
  })

  const columnsQuery: any = useQuery({
    queryKey: ['getSetupColumnWorkOrder', {reloadWorkOrder}],
    queryFn: async () => {
      const res: any = await getSetupColumnWorkOrder({})
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
      const columnsFilter: any = dataResult?.filter(({is_filter}: any) => is_filter === 1)
      return {columns: dataResult, columnsFilter}
    },
  })
  const {columns, columnsFilter}: any = columnsQuery?.data || []

  const workOrderQuery: any = useQuery({
    // initialData: {data: []},
    queryKey: [
      'getWorkOrder',
      {
        page,
        limit,
        keyword,
        reloadWorkOrder,
        orderDir,
        orderCol,
        columns,
        filterAll,
        quickFilterData,
        dataFilterParams,
        loading,
      },
    ],
    queryFn: async () => {
      if (columns?.length > 0) {
        const filters: any = filterAll?.child || {}
        const QFilter: any =
          quickFilterData === 0
            ? {'filter[is_archive]': quickFilterData}
            : {quick_filter: quickFilterData}
        const res: any = await getWorkOrder({
          page,
          keyword,
          orderDir,
          orderCol,
          limit: limit === 0 ? 10 : limit,
          ...QFilter,
          ...filters,
          ...dataFilterParams(),
        })
        const {current_page, total, from}: any = res?.data?.meta || {}
        const thisLimit: any = limit
        setLimit(thisLimit)
        setPageFrom(from)
        setTotalPage(total)
        setPage(current_page)
        const resData: any = res?.data?.data?.map((m: any) => ({
          ...m,
          checkbox: m,
          created_at: m?.created_on || '-',
          unique_id: m?.wo_id || '-',
          title: m?.wo_title,
          duedate: m?.duedate || '-',
          Download: m?.status?.toLowerCase() === 'completed' ? 'Download Report' : false,
          Feedback: 'Feedback',
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
  const dataWorkOrder: any = workOrderQuery?.data || []

  const QuickFilterQuery: any = useQuery({
    queryKey: ['getSetupColumnWorkOrder'],
    queryFn: async () => {
      const res: any = await getFilterWorkOrder()
      const result: any = res?.data || {}
      const filterData: any = []
      Object.keys(result || {})?.forEach((item: any) => {
        filterData?.push({name: item || '', label: result?.[item] || ''})
      })
      return filterData
    },
  })
  const quickFilterColumn: any = QuickFilterQuery?.data || []

  useEffect(() => {
    useTimeOutMessage('clear', 5000)
  }, [])

  useEffect(() => {
    if (resetKeyword) {
      onSearch('')
      setResetKeyword(false)
    }
  }, [resetKeyword])

  useEffect(() => {
    if (Object.keys(feature || {})?.length > 0) {
      const feat: any = feature?.find(({unique_name}: any) => unique_name === 'maintenance_advance')
      setFeedbackPermission(feat?.value === 1 && feedbackPermissions ? true : false)
    }
  }, [feature, feedbackPermissions])

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

              <FilterAll columns={columnsFilter} filterAll={filterAll} onChange={setFilterAll} />

              <div className='dropdown'>
                <Dropdown>
                  <Dropdown.Toggle variant='light-light' size='sm' data-cy='quickFilter'>
                    <i className='las la-ellipsis-v' style={{fontSize: '28px', color: '#050990'}} />
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    {quickFilterColumn?.map((item: any, index: any) => {
                      return (
                        <Dropdown.Item
                          href='#'
                          key={index || 0}
                          data-cy={`quick-${index || ''}`}
                          onClick={() => setQuickFilterData(item?.name || '')}
                          style={
                            quickFilterData === item?.name
                              ? {padding: '10px', background: '#050990', color: '#fff'}
                              : {padding: '10px'}
                          }
                        >
                          {item?.label || '-'}
                        </Dropdown.Item>
                      )
                    })}
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </div>

            <div className='d-flex my-1'>
              {addPermission && (
                <div style={{marginRight: '5px'}}>
                  <Link
                    data-cy='addWorkOrder'
                    to='/maintenance/work-order/add'
                    className='btn btn-sm btn-primary me-1'
                  >
                    + Add New Work Order
                  </Link>
                </div>
              )}

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
                    {dataChecked?.length > 0 && (
                      <>
                        {feedbackPermission && (
                          <Dropdown.Item
                            href='#'
                            data-cy='archiveWo'
                            onClick={() => setShowModalArchive(true)}
                          >
                            Archive
                          </Dropdown.Item>
                        )}
                        {duplicatePermission && (
                          <Dropdown.Item
                            href='#'
                            data-cy='duplicateWo'
                            onClick={() => onDuplicate()}
                          >
                            Duplicated
                          </Dropdown.Item>
                        )}
                      </>
                    )}
                    {exportPermission && <ExportPdfExcel onExport={onExport} />}
                    {importPermission && (
                      <ToolbarImport
                        permission='null'
                        type='maintenance'
                        pathName='/tools/import'
                        actionName='Import New Work Order'
                      />
                    )}
                    {setupPermission && (
                      <Dropdown.Item
                        href='#'
                        onClick={() => navigate('/maintenance/work-order/setup-column')}
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
            api={getOptionsColumns}
            filterAll={filterAll}
            onChange={setFilterAll}
          />
        </div>

        <div className='card-body'>
          {Array.isArray(dataWorkOrder) && feedbackPermission !== undefined && (
            <DataTable
              page={page}
              limit={limit}
              onEdit={onEdit}
              onSort={onSort}
              total={totalPage}
              columns={columns}
              render={onRender}
              onDelete={onDelete}
              onDetail={onDetail}
              data={dataWorkOrder}
              onChecked={onChecked}
              view={viewPermission}
              edit={editPermission}
              del={deletePermission}
              onDownload={onDownload}
              onFeedback={onFeedback}
              onChangePage={onPageChange}
              onChangeLimit={onChangeLimit}
              loading={!workOrderQuery?.isFetched || !columnsQuery?.isFetched}
              feedbackPermission={feedbackPermission}
            />
          )}
        </div>
      </div>

      <ModalArchive
        data={dataChecked}
        reload={reloadWorkOrder}
        showModal={showModalArchive}
        setReload={setReloadWorkOrder}
        setShowModal={setShowModalArchive}
      />

      <ModalFeedback
        detail={dataFeedback}
        reload={reloadWorkOrder}
        showModal={showModalFeedback}
        setReload={setReloadWorkOrder}
        setShowModal={setShowModalFeedback}
      />
    </>
  )
}

const CardWorkOrder = memo(
  CardWorkOrderCode,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export default CardWorkOrder
