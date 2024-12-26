/* eslint-disable react-hooks/exhaustive-deps */
import {exportUser, getColumnUser, getOptionsColumns, getUser, getUserDetail} from '@api/UserCRUD'
import {DataTable} from '@components/datatable'
import {matchColumns, toColumns} from '@components/dnd/table'
import {FilterAll, FilterColumns} from '@components/filter/FilterAll'
import {Search} from '@components/form/searchAlert'
import {ToastMessage} from '@components/toast-message'
import ToolbarActions from '@components/ToolbarActions'
import {hasPermission, KTSVG, setColumn} from '@helpers'
import {useQuery} from '@tanstack/react-query'
import {FC, memo, useEffect, useState} from 'react'
import {shallowEqual, useSelector} from 'react-redux'

import AddUser from './AddUser'
import DeleteUser from './DeleteUser'
import ViewUser from './ViewUser'

type Props = {
  onChecked: any
  timezone: any
  dateFormat: any
  timeFormat: any
  setShowModalConfirmBulk: any
  dataChecked: any
  setDataChecked: any
  setPage: any
  page: any
  pageFrom: any
  limit: any
  setLimit: any
  orderCol: any
  setOrderCol: any
  orderDir: any
  setOrderDir: any
  filterAll: any
  setFilterAll: any
  totalPage: any
  setPageFrom?: any
  setTotalPage?: any
  keyword: any
  setKeyword: any
  reloadUser: any
  setReloadUser: any
  reloadDelete: any
  setReloadDelete: any
  resetKeyword: any
  setResetKeyword: any
}

let CardUser: FC<Props> = ({
  onChecked,
  dataChecked,
  setShowModalConfirmBulk,
  setDataChecked,
  setPage,
  page,
  pageFrom,
  limit,
  setLimit,
  orderCol,
  setOrderCol,
  orderDir,
  setOrderDir,
  filterAll,
  setFilterAll,
  totalPage,
  keyword,
  setKeyword,
  setPageFrom,
  reloadUser,
  setTotalPage,
  setReloadUser,
  reloadDelete,
  setReloadDelete,
  resetKeyword,
  setResetKeyword,
}) => {
  const preferenceStore: any = useSelector(({preference}: any) => preference, shallowEqual)
  const {preference: dataPreference} = preferenceStore || {}

  const [files, setFiles] = useState<any>([])
  const [userDetail, setUserDetail] = useState<any>()
  const [preference, setPreference] = useState<any>({})
  const [loading, setLoading] = useState<boolean>(false)
  const [showDelete, setShowDelete] = useState<boolean>(false)
  const [showModal, setShowModalUser] = useState<boolean>(false)
  const [showModalDetail, setShowModalDetail] = useState<boolean>(false)

  const userAdd: any = hasPermission('user-management.add') || false
  const userEdit: any = hasPermission('user-management.edit') || false
  const userDelete: any = hasPermission('user-management.delete') || false

  const onExport = (e: any) => {
    const filters: any = filterAll?.child || {}
    const fields: any = columns
      ?.filter(({value}: any) => value)
      ?.map(({value}: any) => value)
      ?.join()

    exportUser({type: e, orderDir, orderCol, columns: fields, ...filters, keyword})
      .then(({data: res}) => {
        const {data, message}: any = res || {}
        const {url}: any = data || {}
        ToastMessage({message, type: 'success'})
        setTimeout(() => totalPage <= 500 && window.open(url, '_blank'), 1000)
      })
      .catch(({response}) => {
        const {message}: any = response?.data || {}
        ToastMessage({message, type: 'error'})
      })
  }

  const onChangeLimit = (e: any) => {
    setLimit(e)
  }

  const onPageChange = (e: any) => {
    setPage(e)
  }

  const onSearch = (e: any) => {
    setPage(1)
    setKeyword(e || '')
  }

  const onDetail = (user: any) => {
    const {guid}: any = user || {}
    guid &&
      getUserDetail(guid)
        .then(({data: {data}}: any) => {
          setUserDetail(data || {})
          setShowModalDetail(true)
        })
        .catch(({response}) => {
          const {message} = response?.data || {}
          ToastMessage({message, type: 'error'})
        })
  }

  const onEdit = (user: any) => {
    const {guid}: any = user || {}
    guid &&
      getUserDetail(guid)
        .then(({data: {data}}: any) => {
          setUserDetail(data || {})
          setShowModalUser(true)
        })
        .catch(({response}) => {
          const {message}: any = response?.data || {}
          ToastMessage({message, type: 'error'})
        })
  }

  const onSort = (e: any) => {
    setOrderCol(e)
    setOrderDir('asc')
    if (orderCol === e) {
      orderDir === 'asc' && setOrderDir('desc')
    } else {
      setOrderDir('asc')
    }
  }

  const onDelete = (e: any) => {
    setUserDetail(e)
    setShowDelete(true)
  }

  const onRender = (val: any) => ({
    user_status: () => {
      switch (val?.toLowerCase()) {
        case 'owner':
          return <span className='badge badge-light-primary'>{val || ''}</span>
        case 'unverified':
          return <span className='badge badge-light-info'>{val || ''}</span>
        case 'verified':
          return <span className='badge badge-light-success'>{val || ''}</span>
        case 'suspended':
          return <span className='badge badge-light-danger'>{val || ''}</span>
        default:
          return <span className='badge badge-light'>{val || ''}</span>
      }
    },
  })

  const columnsQuery: any = useQuery({
    queryKey: ['getColumnUser'],
    queryFn: async () => {
      const res: any = await getColumnUser({})
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

  const filterChild: any = filterAll?.child || {}
  const dataUserParam: any = {page, limit, keyword, orderDir, orderCol, ...filterChild}
  const userManagementQuery: any = useQuery({
    // initialData: {data: []},
    queryKey: [
      'getContact',
      {
        ...dataUserParam,
        columns,
        reloadDelete,
        reloadUser,
        setPage,
        setLimit,
      },
    ],
    queryFn: async () => {
      if (columns && columns?.length > 0) {
        const res: any = await getUser(dataUserParam)
        const {current_page, total, from}: any = res?.data?.meta || {}
        setPageFrom(from)
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
  const dataUserManagement: any = userManagementQuery?.data || []

  useEffect(() => {
    if (dataPreference) {
      const {date_format, time_format, timezone, default_company_guid}: any = dataPreference || {}
      setPreference({
        date_format: date_format || '',
        time_format: time_format || '',
        timezone: timezone || '',
        default_company_guid: default_company_guid,
      })
    }
  }, [dataPreference])

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
              <FilterAll columns={columnsFilter} filterAll={filterAll} onChange={setFilterAll} />
            </div>

            <div className='d-flex my-1'>
              <div style={{marginRight: '5px'}}>
                {userDelete && dataChecked?.length > 0 && (
                  <button
                    type='button'
                    className='btn btn-sm btn-primary me-2'
                    onClick={() => setShowModalConfirmBulk(true)}
                  >
                    <span className='indicator-label'>Delete/Suspend</span>
                  </button>
                )}

                {userAdd && (
                  <button
                    type='button'
                    data-cy='addUser'
                    className='btn btn-sm btn-primary'
                    onClick={() => {
                      setFiles([])
                      setShowModalUser(true)
                      setUserDetail(undefined)
                    }}
                  >
                    + Add New User
                  </button>
                )}
              </div>

              <ToolbarActions onExport={onExport} />
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
            page={page}
            limit={limit}
            onEdit={onEdit}
            onSort={onSort}
            edit={userEdit}
            del={userDelete}
            total={totalPage}
            columns={columns}
            render={onRender}
            onDelete={onDelete}
            onDetail={onDetail}
            onChecked={onChecked}
            onChangePage={onPageChange}
            onChangeLimit={onChangeLimit}
            data={dataUserManagement}
            loading={!userManagementQuery?.isFetched || !columnsQuery?.isFetched}
          />
        </div>
      </div>

      <AddUser
        preference={preference}
        handleDelete={() => setShowDelete(true)}
        files={files}
        setFiles={setFiles}
        showModal={showModal}
        userDetail={userDetail}
        reloadUser={reloadUser}
        setReloadUser={setReloadUser}
        setShowModalUser={setShowModalUser}
      />

      <DeleteUser
        page={page}
        setPage={setPage}
        loading={loading}
        pageFrom={pageFrom}
        totalPage={totalPage}
        showModal={showDelete}
        userDetail={userDetail}
        setLoading={setLoading}
        reloadDelete={reloadDelete}
        setShowModal={setShowDelete}
        setShowDelete={setShowDelete}
        setDataChecked={setDataChecked}
        setReloadDelete={setReloadDelete}
        setResetKeyword={setResetKeyword}
      />

      <ViewUser data={userDetail} show={showModalDetail} onHide={() => setShowModalDetail(false)} />
    </>
  )
}

CardUser = memo(CardUser, (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next))

export default CardUser
