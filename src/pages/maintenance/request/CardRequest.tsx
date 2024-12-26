/* eslint-disable react-hooks/exhaustive-deps */
import {DataTable} from '@components/datatable'
import {matchColumns, toColumns} from '@components/dnd/table'
import {FilterAll, FilterColumns} from '@components/filter/FilterAll'
import {Search} from '@components/form/searchAlert'
import {ToastMessage} from '@components/toast-message'
import {
  guidBulkChecked,
  hasPermission,
  KTSVG,
  preferenceDate,
  roleName,
  setColumn,
  useTimeOutMessage,
} from '@helpers'
import {useQuery} from '@tanstack/react-query'
import moment from 'moment'
import {FC, memo, useEffect, useState} from 'react'
import Dropdown from 'react-bootstrap/Dropdown'
import {Link, useNavigate} from 'react-router-dom'

import UpdateStatusConfirm from './confirm/ConfirmModal'
import {getOptionsColumns, getRequest, getSetupColumnRequest} from './core/service'

interface Props {
  dataChecked: any
  setDataChecked: any
  setTitle: any
  setGuid: any
  setShowModalConfirm: any
  reloadDelete: any
  setShowModalFormSettings: any
  page: any
  setPage: any
  setPageFrom: any
  totalPage: any
  setTotalPage: any
  resetKeyword: any
  setResetKeyword: any
}

const CardRequestCode: FC<Props> = ({
  setShowModalFormSettings,
  dataChecked,
  setDataChecked,
  setTitle,
  setGuid,
  setShowModalConfirm,
  reloadDelete,
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
  const isAdmin: boolean = roleName() === 'owner' || roleName() === 'admin'

  const [limit, setLimit] = useState<number>(10)
  const [keyword, setKeyword] = useState<any>('')
  const [filterAll, setFilterAll] = useState<any>({})
  const [orderDir, setOrderDir] = useState<string>('asc')
  const [orderCol, setOrderCol] = useState<string>('title')
  const [reloadTable, setReloadTable] = useState<number>(0)
  const [showModalBulkStatus, setShowModalBulkStatus] = useState<boolean>(false)

  const PermissionAdd: any = hasPermission('maintenance.request.add') || false
  const PermissionEdit: any = hasPermission('maintenance.request.edit') || false
  const PermissionDelete: any = hasPermission('maintenance.request.delete') || false
  const PermissionSetting: any = hasPermission('maintenance.request.form-setting') || false
  const PermissionUpdateStatus: any = hasPermission('maintenance.request.update-status') || false
  const PermissionSetup: any =
    hasPermission('setup-column.setup_column_maintenance_request') || false

  const onChangeLimit = (e: any) => {
    setPage(1)
    setLimit(e)
    setDataChecked([])
  }

  const onChangePage = (e: any) => {
    setPage(e)
    setDataChecked([])
  }

  const onDetail = ({guid}: any) => {
    navigate(`/maintenance/request/detail/${guid || ''}`)
  }

  const onEdit = ({guid}: any) => {
    navigate(`maintenance/request/edit?id=${guid || ''}`)
  }

  const onDelete = (e: any) => {
    const {title, guid}: any = e || {}

    setGuid(guid || '')
    setTitle(title || '')
    setShowModalConfirm(true)
  }

  const onSearch = (e: any) => {
    setPage(1)
    setKeyword(e ? `*${e || ''}*` : '')
  }

  const onChecked = (e: any) => {
    const ar_guid: any = guidBulkChecked(e)
    setDataChecked(ar_guid)
  }

  const onSort = (value: any) => {
    setOrderCol(value)
    setOrderDir(orderDir === 'asc' ? 'desc' : 'asc')
  }

  const onRender = (val: any) => ({
    status_name: () => {
      switch (val?.toLowerCase()) {
        case 'approved':
          return <span className='badge badge-light-success'>{val || ''}</span>
        case 'rejected (need review)':
          return <span className='badge badge-light-danger'>{val || ''}</span>
        case 'pending approval':
          return <span className='badge badge-light-info'>{val || ''}</span>
        default:
          return <span className='badge badge-light'>{val || ''}</span>
      }
    },
    due_date: val ? moment(val || '')?.format(pref_date) : '-',
  })

  const columnsQuery: any = useQuery({
    queryKey: [
      'getSetupColumnRequest',
      {page, limit, keyword, orderDir, orderCol, reloadTable, reloadDelete},
    ],
    queryFn: async () => {
      const res: any = await getSetupColumnRequest({})
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
  const {columns}: any = columnsQuery?.data || []

  const requestQuery: any = useQuery({
    // initialData: {data: []},
    queryKey: [
      'getRequest',
      {
        page,
        limit,
        orderDir,
        reloadDelete,
        orderCol,
        keyword,
        columns,
        filterAll,
        reloadTable,
      },
    ],
    queryFn: async () => {
      if (columns?.length > 0) {
        const filters: any = filterAll?.child || {}
        const res: any = await getRequest({
          page,
          limit,
          orderDir,
          orderCol,
          keyword,
          ...filters,
        })

        const {current_page, per_page, total, from}: any = res?.data?.meta || {}
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
  const dataRequest: any = requestQuery?.data || []

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
                delay={1500}
                onChange={onSearch}
                resetKeyword={resetKeyword}
                setResetKeyword={setResetKeyword}
              />
              <FilterAll columns={columns} filterAll={filterAll} onChange={setFilterAll} />
            </div>

            <div className='d-flex my-1'>
              <div style={{marginRight: '5px'}}>
                {PermissionUpdateStatus && dataChecked?.length > 0 && (
                  <button
                    type='button'
                    data-cy='bulkUpdateStatus'
                    className='btn btn-sm btn-primary me-2'
                    onClick={() => setShowModalBulkStatus(true)}
                  >
                    <span className='indicator-label'>Approve/Reject</span>
                  </button>
                )}

                {PermissionAdd && (
                  <Link
                    data-cy='addRequest'
                    to='/maintenance/request/add'
                    className='btn btn-sm btn-primary'
                  >
                    + Add New Request
                  </Link>
                )}
              </div>

              <div className='dropdown' style={{marginRight: '5px'}}>
                <Dropdown>
                  <Dropdown.Toggle
                    size='sm'
                    data-cy='actions'
                    id='dropdown-basic'
                    className='fw-bolder'
                    variant='light-primary'
                  >
                    Actions
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    {isAdmin && PermissionSetting && (
                      <Dropdown.Item
                        href='#'
                        data-cy='formSettings'
                        aria-labelledby='formSettings'
                        onClick={() => setShowModalFormSettings(true)}
                      >
                        Form Settings
                      </Dropdown.Item>
                    )}
                    {PermissionSetup && (
                      <Dropdown.Item
                        href='#'
                        data-cy='setupColumn'
                        onClick={() => navigate('/maintenance/request/setup-column')}
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
            api={getOptionsColumns}
          />
        </div>

        <div className='card-body'>
          {Array.isArray(dataRequest) && (
            <DataTable
              page={page}
              limit={limit}
              onSort={onSort}
              onEdit={onEdit}
              render={onRender}
              total={totalPage}
              columns={columns}
              data={dataRequest}
              onDelete={onDelete}
              onDetail={onDetail}
              onChecked={onChecked}
              onChangePage={onChangePage}
              onChangeLimit={onChangeLimit}
              loading={!requestQuery?.isFetched || !columnsQuery?.isFetched}
              editRequestPermission={PermissionEdit}
              deleteRequestPermission={PermissionDelete}
            />
          )}
        </div>
      </div>

      <UpdateStatusConfirm
        dataChecked={dataChecked}
        reloadTable={reloadTable}
        setDataChecked={setDataChecked}
        setReloadTable={setReloadTable}
        showModal={showModalBulkStatus}
        setShowModal={setShowModalBulkStatus}
      />
    </>
  )
}

const CardRequest = memo(
  CardRequestCode,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export {CardRequest}
