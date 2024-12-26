/* eslint-disable react-hooks/exhaustive-deps */
import {DataTable} from '@components/datatable'
import {matchColumns} from '@components/dnd/table'
import {FilterAll, FilterColumns} from '@components/filter/FilterAll'
import {Search} from '@components/form/searchAlert'
import {ToastMessage} from '@components/toast-message'
import {guidBulkChecked, hasPermission, KTSVG, preferenceDate, useTimeOutMessage} from '@helpers'
import moment from 'moment'
import {FC, memo, useEffect, useState} from 'react'
import {Link, useNavigate} from 'react-router-dom'

import {getPreventive, getPreventiveOptionsColumns} from '../Service'

type Props = {
  onDelete: any
  setShowModalConfirmBulk: any
  reloadPreventive: any
  dataChecked: any
  setDataChecked: any
  page: any
  setPage: any
  setPageFrom: any
  totalPage: any
  setTotalPage: any
  resetKeyword: any
  setResetKeyword: any
}

import {useQuery} from '@tanstack/react-query'

import ModalDetailPreventive from './detail'

const CardPreventiveCode: FC<Props> = ({
  onDelete,
  setShowModalConfirmBulk,
  reloadPreventive,
  dataChecked,
  setDataChecked,
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

  const [limit, setLimit] = useState<number>(10)
  const [keyword, setKeyword] = useState<string>('')
  const [filterAll, setFilterAll] = useState<any>({})
  const [orderDir, setOrderDir] = useState<string>('asc')
  const [orderCol, setOrderCol] = useState<string>('name')
  const [showDetail, setShowDetail] = useState<boolean>(false)
  const [detailPreventive, setDetailPreventive] = useState<any>({})

  const PermissionAdd: any = hasPermission('maintenance.preventive.add') || false
  const PermissionEdit: any = hasPermission('maintenance.preventive.edit') || false
  const PermissionView: any = hasPermission('maintenance.preventive.view') || false
  const PermissionDelete: any = hasPermission('maintenance.preventive.delete') || false

  const columns: any = [
    {header: 'checkbox', width: '20px'},
    {header: 'View', width: '20px'},
    {header: 'Preventive Maintenance Name', value: 'name', sort: true},
    {header: 'Work Order ID', value: 'wo_id', sort: true},
    {header: 'Recurring', value: 'recuring', sort: true},
    {header: 'Edit', width: '20px'},
    {header: 'Delete', width: '20px'},
  ]

  const onChangeLimit = (e: any) => {
    setPage(1)
    setLimit(e)
  }

  const onPageChange = (e: any) => {
    setPage(e)
  }

  const onDetail = (e: any) => {
    setShowDetail(true)
    setDetailPreventive(e)
  }

  const onEdit = ({guid}: any) => {
    navigate(`/maintenance/preventive/edit?id=${guid || ''}`)
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

  const preventiveQuery: any = useQuery({
    // initialData: {data: []},
    queryKey: [
      'getPreventive',
      {
        page,
        limit,
        keyword,
        orderDir,
        orderCol,
        filterAll,
        pref_date,
        reloadPreventive,
      },
    ],
    queryFn: async () => {
      if (columns?.length > 0) {
        const filters: any = filterAll?.child || {}
        const res: any = await getPreventive({
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
          unique_id: m?.wo_id || '-',
          duedate: m?.due_date || '-',
          created_at: moment(m?.created_at).isValid()
            ? moment(m?.created_at || '')?.format(pref_date)
            : '-',
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
  const dataPreventive: any = preventiveQuery?.data || []

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
                    data-cy='addPreventive'
                    to='/maintenance/preventive/add'
                    className='btn btn-sm btn-primary me-1'
                  >
                    + Add New Preventive
                  </Link>
                )}
              </div>
            </div>
          </div>

          <FilterColumns
            setPage={setPage}
            filterAll={filterAll}
            onChange={setFilterAll}
            api={getPreventiveOptionsColumns}
          />
        </div>

        <div className='card-body'>
          {Array.isArray(dataPreventive) && Array.isArray(columns) && pref_date && (
            <DataTable
              page={page}
              limit={limit}
              onEdit={onEdit}
              onSort={onSort}
              columns={columns}
              total={totalPage}
              onDelete={onDelete}
              onDetail={onDetail}
              onChecked={onChecked}
              data={dataPreventive}
              edit={PermissionEdit}
              view={PermissionView}
              del={PermissionDelete}
              onChangePage={onPageChange}
              onChangeLimit={onChangeLimit}
              loading={!preventiveQuery?.isFetched}
            />
          )}
        </div>
      </div>

      <ModalDetailPreventive
        showDetail={showDetail}
        setShowDetail={setShowDetail}
        detailPreventive={detailPreventive}
      />
    </>
  )
}

const CardPreventive = memo(
  CardPreventiveCode,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export default CardPreventive
