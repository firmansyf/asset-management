/* eslint-disable react-hooks/exhaustive-deps */
import {Alert} from '@components/alert'
import {DataTable} from '@components/datatable'
import {FilterAll, FilterColumns} from '@components/filter/FilterAll'
import {Search} from '@components/form/searchAlert'
import {ToastMessage} from '@components/toast-message'
import {guidBulkChecked, KTSVG, useTimeOutMessage} from '@helpers'
import {useQuery} from '@tanstack/react-query'
import {FC, memo, useCallback, useEffect, useMemo, useState} from 'react'
import {Link, useNavigate} from 'react-router-dom'

import {deleteBulkMaintenanceChecklist, getMaintenanceChecklist, getOptionsColumns} from './Service'

type Props = {
  onDelete: any
  onDetail: any
  reloadMaintenanceChecklist: any
  page: any
  setPage: any
  pageFrom: any
  setPageFrom: any
  totalPage: any
  setTotalPage: any
  resetKeyword: any
  setResetKeyword: any
}

const MintenanceChecklist: FC<Props> = ({
  onDelete,
  onDetail,
  reloadMaintenanceChecklist,
  page,
  setPage,
  pageFrom,
  setPageFrom,
  totalPage,
  setTotalPage,
  resetKeyword,
  setResetKeyword,
}) => {
  const navigate: any = useNavigate()

  const [meta, setMeta] = useState<any>({})
  const [limit, setLimit] = useState<number>(10)
  const [keyword, setKeyword] = useState<string>('')
  const [filterAll, setFilterAll] = useState<any>({})
  const [loading, setLoading] = useState<boolean>(false)
  const [dataChecked, setDataChecked] = useState<any>([])
  const [orderDir, setOrderDir] = useState<string>('asc')
  const [orderCol, setOrderCol] = useState<string>('name')
  const [reloadDelete, setReloadDelete] = useState<number>(1)
  const [totalPerPage, setTotalPerPage] = useState<number>(0)
  const [showModalBulk, setShowModalConfirmBulk] = useState<boolean>(false)

  const columns: any = useMemo(() => {
    return [
      {header: 'checkbox', width: '20px'},
      {header: 'View', width: '20px'},
      {header: 'Maintenance Checklist', sort: true, value: 'name'},
      {header: 'Description', sort: true, value: 'description'},
      {header: 'Number of Ticket', sort: true, value: 'total_tasks'},
      {header: 'Edit', width: '20px'},
      {header: 'Delete', width: '20px'},
    ]
  }, [])

  const msg_alert_bulk_delete: any = [
    'Are you sure you want to delete',
    <strong key='full_name'> {dataChecked?.length || 0} </strong>,
    'maintenance checklist data?',
  ]

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

  const onEdit = ({guid}: any) => {
    navigate(`/setup/maintenance/checklistes/add?id=${guid || ''}`)
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
    deleteBulkMaintenanceChecklist({guids: dataChecked})
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

        setDataChecked([])
        setShowModalConfirmBulk(false)
        setReloadDelete(reloadDelete + 1)
        ToastMessage({type: 'success', message})
        setTimeout(() => setLoading(false), 800)
      })
      .catch(({response}: any) => {
        const {message} = response?.data || {}
        ToastMessage({type: 'error', message})
        setTimeout(() => setLoading(false), 800)
      })
  }, [dataChecked, reloadDelete])

  useEffect(() => {
    useTimeOutMessage('clear', 5000)
  }, [])

  const maintenanceChecklistQuery: any = useQuery({
    // initialData: {data: []},
    queryKey: [
      'getMaintenanceChecklist',
      {
        page,
        limit,
        keyword,
        filterAll,
        reloadMaintenanceChecklist,
        reloadDelete,
        orderDir,
        orderCol,
      },
    ],
    queryFn: async () => {
      const filters: any = filterAll?.child || {}
      const res: any = await getMaintenanceChecklist({
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
      const dataResult: any = res?.data?.data?.map((maintenanceChecklist: any) => {
        const {guid, name, description, total_tasks}: any = maintenanceChecklist || {}
        return {
          original: maintenanceChecklist,
          checkbox: maintenanceChecklist,
          guid: guid,
          view: 'view',
          name,
          description,
          total_tasks,
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

  const dataMaintenanceChecklist: any = maintenanceChecklistQuery?.data || []

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

            <FilterAll columns={columns} filterAll={filterAll} onChange={setFilterAll} />
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

              <Link className='btn btn-sm btn-primary' to='/setup/maintenance/checklistes/add'>
                + Add New Checklist
              </Link>
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
          page={page}
          limit={limit}
          onEdit={onEdit}
          onSort={onSort}
          columns={columns}
          total={totalPage}
          onDelete={onDelete}
          data={dataMaintenanceChecklist}
          onChecked={onChecked}
          loading={!maintenanceChecklistQuery?.isFetched}
          onChangePage={onPageChange}
          onChangeLimit={onChangeLimit}
          onDetail={(e: any) => onDetail(e)}
        />

        <Alert
          loading={loading}
          type={'delete'}
          confirmLabel={'Delete'}
          showModal={showModalBulk}
          title={'Delete Checklist'}
          body={msg_alert_bulk_delete}
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

const CardMintenanceChecklist = memo(
  MintenanceChecklist,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export default CardMintenanceChecklist
