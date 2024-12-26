import {Alert} from '@components/alert'
import Tooltip from '@components/alert/tooltip'
import {DataTable} from '@components/datatable'
import {matchColumns} from '@components/dnd/table'
import {Search} from '@components/form/searchAlert'
import {Title} from '@components/form/Title'
import {ToastMessage} from '@components/toast-message'
import {errorValidation, hasPermission, KTSVG, preferenceDateTime} from '@helpers'
import {deleteBulkTrash, emptyTrash, getTrash, restoreTrash} from '@pages/trash/Services'
import {useQuery} from '@tanstack/react-query'
import {groupBy, mapValues} from 'lodash'
import moment from 'moment'
import {FC, memo, useEffect, useMemo, useState} from 'react'

const IndexTrash: FC<any> = ({filter: Filter, modules}: any) => {
  const prefDateTime: any = preferenceDateTime()
  const [page, setPage] = useState<number>(1)
  const [limit, setLimit] = useState<number>(10)
  const [totalPage, setTotalPage] = useState<number>(0)
  const [keyword, setKeyword] = useState<string>('')
  const [orderCol, setOrderCol] = useState<string>('deleted_at')
  const [orderDir, setOrderDir] = useState<string>('asc')
  const [loading, setLoading] = useState<boolean>(false)
  const [reloadData, setReloadData] = useState<boolean>(false)
  const [showrestore, setShowModalRestore] = useState<boolean>(false)
  const [dataChecked, setDataChecked] = useState<any>([])
  const [showModalBulk, setShowModalConfirmBulk] = useState<boolean>(false)
  const [showModalEmpty, setShowModalEmpty] = useState<boolean>(false)
  const [confirmMessage, setConfirmMessage] = useState<any>('')
  const [guidsOfModule, setGuidsOfModule] = useState<any>({})
  const [filter, setFilter] = useState<any>([])
  const [selectedModules, setSelectedModules] = useState<any>([])
  const [pageFrom, setPageFrom] = useState<number>(0)
  const [totalPerPage, setTotalPerPage] = useState<number>(0)
  const [resetKeyword, setResetKeyword] = useState<boolean>(false)
  const [meta, setMeta] = useState<any>({})

  const hasPermissionDelete: any = hasPermission('trash.delete')
  const hasPermissionRestore: any = hasPermission('trash.restore')
  const hasPermissionEmpty: any = hasPermission('trash.empty')

  const columns: any = useMemo(
    () => [
      {header: 'checkbox'},
      {header: 'Module', value: 'module', sort: true},
      {header: 'Name', value: 'name', sort: true},
      {header: 'Deleted At', value: 'deleted_at', sort: true},
    ],
    []
  )

  const messageConfirm1: any = [
    `Are you sure want to permanently delete `,
    <strong key='delete'>{dataChecked?.length || 0}</strong>,
    ` ${selectedModules?.length > 1 ? 'data' : selectedModules?.[0] || ''} from trash ?`,
  ]

  const messageConfirm2: any = [
    `Are you sure want to restore `,
    <strong key='restore'>{dataChecked?.length || 0}</strong>,
    ` ${selectedModules?.length > 1 ? 'data' : selectedModules?.[0] || ''} from trash ?`,
  ]

  const filtered: any = filter?.length > 0 ? filter?.filter((f: any) => f !== 'all') : modules
  const params = {
    page,
    limit,
    orderDir,
    orderCol,
    keyword,
    filter: filtered,
  }
  const queryDataTrash: any = useQuery({
    queryKey: ['getDataTrash', {...params, reloadData}],
    queryFn: async () => {
      if (filtered?.length > 0) {
        const res: any = await getTrash(params)
        const {total, from}: any = res?.data?.meta || {}
        setTotalPage(total)
        setPageFrom(from)
        setMeta(res?.data?.meta || {})

        const resData = res?.data?.data?.map((result: any) => {
          const {deleted_at} = result || {} //module
          return {
            original: result,
            checkbox: 'Checkbox',
            ...result,
            deleted_at: moment(deleted_at).format(prefDateTime) || '-',
            // module: module === 'work_order' ? 'Work Order' : module,
          }
        })
        setTotalPerPage(resData?.length || 0)
        return matchColumns(resData, columns)
      } else {
        return []
      }
    },
    onError: (err: any) => {
      setTotalPage(0)
      Object.values(errorValidation(err))?.forEach((message: any) =>
        ToastMessage({type: 'error', message})
      )
    },
  })
  const dataTrash: any = queryDataTrash?.data || []

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

  const onSort = (value: any) => {
    setOrderCol(value)
    setOrderDir(orderDir === 'asc' ? 'desc' : 'asc')
  }

  const confirmRestore = () => {
    setLoading(true)
    restoreTrash(guidsOfModule)
      .then(({data: {message}}: any) => {
        setTimeout(() => {
          setLoading(false)
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
          setDataChecked([])
          setShowModalRestore(false)
          setReloadData(!reloadData)
          // setPage(total_data_page - 1 <= 0 ? page - 1 : page)
        }, 1000)
      })
      .catch((err: any) => {
        Object.values(errorValidation(err))?.forEach((message: any) =>
          ToastMessage({type: 'error', message})
        )
      })
  }

  const onBulkDelete = () => {
    deleteBulkTrash(guidsOfModule)
      .then(({data: {message}}: any) => {
        const total_data_page: number = totalPage - totalPerPage
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
        setDataChecked([])
        setReloadData(!reloadData)
        ToastMessage({type: 'success', message})
        // setPage(total_data_page - 1 <= 0 ? page - 1 : page)
      })
      .catch((err: any) => {
        Object.values(errorValidation(err))?.forEach((message: any) =>
          ToastMessage({type: 'error', message})
        )
      })
  }

  const onEmpty = () => {
    setLoading(true)
    emptyTrash()
      .then(({data: {message}}: any) => {
        setLoading(false)
        setShowModalEmpty(false)
        setReloadData(!reloadData)
        ToastMessage({type: 'success', message})
      })
      .catch((err: any) => {
        setLoading(false)
        Object.values(errorValidation(err))?.forEach((message: any) =>
          ToastMessage({type: 'error', message})
        )
      })
  }

  const onChecked = (e: any) => {
    const checkedGuids: any = e
      ?.filter(({checked}: any) => checked)
      ?.map(({original: {guid}}: any) => guid)
    setDataChecked(checkedGuids)

    let guids: any = e?.filter(({checked}: any) => checked)
    guids = mapValues(groupBy(guids, 'module'), (a: any) => a?.map(({guid}: any) => guid))
    setGuidsOfModule(guids)
    setSelectedModules(Object.keys(guids || {}))
  }

  const onRender = (val: any) => ({
    name: <div className='fw-bold'>{val || ''}</div>,
    module: <div className='fw-bold text-capitalize'>{val || ''}</div>,
    deleted_at: (
      <div className='fw-bold' data-cy='deleted_at'>
        {val}
      </div>
    ),
  })

  useEffect(() => {
    setPage(1)
  }, [filter])

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
    <>
      <Title title='Trash' className='mb-0 px-2' />
      {filter?.length > 0 && (
        <div className='mb-3'>
          <span className='m-1 fw-bold fs-7 text-gray-500'>Filter :</span>
          {filter &&
            filter?.length > 0 &&
            filter?.map((f: any, index: number) => (
              <span className='badge badge-light text-dark m-1' key={index || 0}>
                {f || ''}
              </span>
            ))}
        </div>
      )}

      <div className='d-flex align-items-center mb-3 px-2'>
        <i className='fas fa-info-circle text-primary fs-5' />
        <div className='px-2'>
          Data that have been in the trash for more than 14 days will be deleted automatically.
        </div>
        {hasPermissionEmpty && (
          <>
            {totalPage > 0 ? (
              <u
                className='text-danger fw-bolder cursor-pointer'
                onClick={() => setShowModalEmpty(true)}
              >
                <em>Empty Trash</em>
              </u>
            ) : (
              <u className='text-gray-400 fw-bolder' style={{cursor: 'not-allowed'}}>
                <em>Empty Trash</em>
              </u>
            )}
          </>
        )}
      </div>

      <div className='card card-table card-custom'>
        <div className='card-table-header d-flex align-items-center'>
          <div className='d-flex align-items-center position-relative me-4 px-2'>
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
            <Filter
              onFilter={(e: any) => {
                setPage(1)
                setFilter(e)
              }}
            />
          </div>

          {dataChecked?.length > 0 && (
            <div className='ms-auto'>
              {hasPermissionDelete && (
                <Tooltip placement='top' title='Delete Forever'>
                  <button
                    type='button'
                    data-cy='btn-delete'
                    className='btn btn-sm btn-icon w-30px h-30px btn-light-danger rounded ms-3'
                    onClick={() => {
                      setShowModalConfirmBulk(true)
                      setConfirmMessage(messageConfirm1)
                    }}
                  >
                    <i className='las la-trash-alt fs-1' />
                  </button>
                </Tooltip>
              )}
              {hasPermissionRestore && (
                <Tooltip placement='top' title='Restore'>
                  <button
                    type='button'
                    data-cy='btn-restore'
                    className='btn btn-sm btn-icon w-30px h-30px btn-light-success rounded ms-5 me-3'
                    onClick={() => {
                      setShowModalRestore(true)
                      setConfirmMessage(messageConfirm2)
                    }}
                  >
                    <i className='las la-history fs-1' />
                  </button>
                </Tooltip>
              )}
            </div>
          )}
        </div>

        <div className='card-body'>
          <DataTable
            page={page}
            data={dataTrash}
            limit={limit}
            total={totalPage}
            columns={columns}
            render={onRender}
            onChecked={onChecked}
            onChangePage={onPageChange}
            onChangeLimit={onChangeLimit}
            onSort={onSort}
            loading={!queryDataTrash?.isFetched || !filtered?.length}
            customEmptyTable='Your trash is empty'
          />
        </div>
      </div>

      <Alert
        key={'restore'}
        type={'restore'}
        loading={loading}
        body={confirmMessage}
        showModal={showrestore}
        title={`Restore Trash`}
        confirmLabel={'Restore'}
        onConfirm={confirmRestore}
        setShowModal={setShowModalRestore}
        onCancel={() => setShowModalRestore(false)}
      />

      <Alert
        loading={false}
        type={'delete'}
        key={'bulk-delete'}
        body={confirmMessage}
        title={`Delete Trash`}
        confirmLabel={'Delete'}
        showModal={showModalBulk}
        setShowModal={setShowModalConfirmBulk}
        onCancel={() => setShowModalConfirmBulk(false)}
        onConfirm={() => {
          onBulkDelete() //dataChecked
          setShowModalConfirmBulk(false)
        }}
      />

      <Alert
        key={'empty'}
        type={'delete'}
        loading={false}
        onConfirm={onEmpty}
        title={`Empty Trash`}
        showModal={showModalEmpty}
        confirmLabel={'Empty Trash'}
        setShowModal={setShowModalEmpty}
        onCancel={() => setShowModalEmpty(false)}
        body={
          'This action will effect on all data in the trash. Data will be deleted forever. Are you sure want to continue ?'
        }
      />
    </>
  )
}

const Index = memo(
  IndexTrash,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)

export default Index
