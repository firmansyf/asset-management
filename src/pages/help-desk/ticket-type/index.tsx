/* eslint-disable react-hooks/exhaustive-deps */
import {Alert} from '@components/alert'
import {DataTable} from '@components/datatable'
import {matchColumns} from '@components/dnd/table'
import {ExportPdfExcel} from '@components/export/ExportPdfExcel'
import {FilterAll, FilterColumns} from '@components/filter/FilterAll'
import {Search} from '@components/form/searchAlert'
import {ToastMessage} from '@components/toast-message'
import {guidBulkChecked, hasPermission, KTSVG} from '@helpers'
import {PageTitle} from '@metronic/layout/core'
import AddEditTicketType from '@pages/help-desk/ticket-type/AddEditTicketType'
import {
  bulkDeleteTicketType,
  deleteTicketType,
  exportTicketType,
  getTicketType,
  getTicketTypeOptionsColumns,
} from '@pages/help-desk/ticket-type/core/service'
import {ModalDetailTicketType} from '@pages/help-desk/ticket-type/DetailTicketType'
import {useQuery} from '@tanstack/react-query'
import {FC, memo, useCallback, useEffect, useMemo, useState} from 'react'
import {Dropdown} from 'react-bootstrap'
import {useIntl} from 'react-intl'

type Props = {
  setGuid: any
  setName: any
  detailTicketType: any
  setDetailTicketType: any
  setShowModalDelete: any
  setShowModalDetail: any
  setShowModalDeleteBulk: any
  dataChecked: any
  setDataChecked: any
  setShowModalTicketType: any
  showModalTicketType: any
  showModalDetail: any
  reloadDelete?: any
  setReloadDelete?: any
  page: any
  setPage: any
  setPageFrom: any
  totalPage: any
  setTotalPage: any
  resetKeyword: any
  setResetKeyword: any
}
const CardTicketType: FC<Props> = ({
  setName,
  setGuid,
  setShowModalDeleteBulk,
  setShowModalDelete,
  detailTicketType,
  setDetailTicketType,
  setShowModalDetail,
  setDataChecked,
  dataChecked,
  setShowModalTicketType,
  showModalTicketType,
  showModalDetail,
  reloadDelete,
  setReloadDelete,
  page,
  setPage,
  setPageFrom,
  totalPage,
  setTotalPage,
  resetKeyword,
  setResetKeyword,
}) => {
  const [limit, setLimit] = useState<number>(10)
  const [keyword, setKeyword] = useState<string>('')
  const [orderDir, setOrderDir] = useState<string>('asc')
  const [orderCol, setOrderCol] = useState<string>('name')
  const [filterAll, setFilterAll] = useState<any>({})
  const [reload, setReload] = useState<number>(0)

  const columns: any = useMemo(
    () => [
      {header: 'checkbox', width: '20px'},
      {header: 'View', width: '20px'},
      {header: 'Ticket Type', value: 'name', sort: true},
      {header: 'Description', value: 'description', sort: true},
      {header: 'Edit', width: '20px'},
      {header: 'Delete', width: '20px'},
    ],
    []
  )

  // Export Function
  const onExport = (e: any) => {
    exportTicketType({type: e, keyword, ...(filterAll?.child || {})})
      .then(({data: res}: any) => {
        const {data, message}: any = res || {}
        const {url}: any = data || {}
        url && setTimeout(() => window.open(url, '_blank'), 800)
        ToastMessage({message, type: 'success'})
      })
      .catch(({response}: any) => {
        const {message} = response?.data || {}
        ToastMessage({message, type: 'error'})
      })
  }

  // Sort Data
  const onSort = (e: any) => {
    setOrderCol(e)
    setOrderDir(orderDir === 'asc' ? 'desc' : 'asc')
  }

  // onChange Limit
  const onChangeLimit = (e: any) => {
    setPage(1)
    setLimit(e)
    setDataChecked([])
  }

  // onChange Page
  const onChangePage = (e: any) => {
    setPage(e)
    setDataChecked([])
  }

  // Edit Data Modal
  const onEdit = (e: any) => {
    setDetailTicketType(e)
    setShowModalTicketType(true)
  }

  // Delete Data
  const onDelete = (e: any) => {
    const {name, guid} = e
    setName(name)
    setGuid(guid)
    setShowModalDelete(e)
  }

  // Search
  const onSearch = (e: any) => {
    setPage(1)
    setKeyword(e ? `*${e}*` : '')
  }

  useEffect(() => {
    if (resetKeyword) {
      onSearch('')
      setResetKeyword(false)
    }
  }, [resetKeyword])

  // Chacked bulk delete
  const onChecked = (e: any) => {
    const ar_guid: any = guidBulkChecked(e)
    setDataChecked(ar_guid)
  }

  // Detail Data Modal
  const onDetail = (e: any) => {
    setDetailTicketType(e)
    setShowModalDetail(true)
  }

  useEffect(() => {
    setTimeout(() => ToastMessage({type: 'clear'}), 1000)
  }, [])

  const ticketTypeQuery: any = useQuery({
    // initialData: {data: []},
    queryKey: [
      'getTicketType',
      {
        page,
        limit,
        orderDir,
        orderCol,
        keyword,
        columns,
        reload,
        reloadDelete,
        setReloadDelete,
        filterAll,
      },
    ],
    queryFn: async () => {
      const res: any = await getTicketType({
        page,
        limit,
        orderDir,
        orderCol,
        keyword,
        ...(filterAll?.child || {}),
      })
      const {current_page, per_page, total, from} = res?.data?.meta || {}
      setTotalPage(total)
      setPage(current_page)
      setLimit(per_page)
      setPageFrom(from)

      return matchColumns(res?.data?.data, columns)
    },
    // refactor react-query v5 (change onError => throwOnError)
    onError: ({response}: any) => {
      ToastMessage({message: response?.data?.message, type: 'error'})
    },
  })

  const dataTicketType: any = ticketTypeQuery?.data || []

  useEffect(() => {
    ToastMessage({type: 'clear'})
  }, [])

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
                {dataChecked?.length > 0 && (
                  <button
                    data-cy='bulkDelete'
                    type='button'
                    className='btn btn-sm btn-primary me-2'
                    onClick={() => {
                      setShowModalDeleteBulk(true)
                    }}
                  >
                    <span className='indicator-label'>Delete Selected</span>
                  </button>
                )}
                <button
                  data-cy='add'
                  className='btn btn-sm btn-primary'
                  type='button'
                  onClick={() => {
                    setDetailTicketType(undefined)
                    setShowModalTicketType(true)
                  }}
                >
                  + Add New Ticket Type
                </button>
              </div>
              <div className='dropdown' style={{marginRight: '5px'}}>
                <Dropdown>
                  <Dropdown.Toggle
                    variant='light-primary'
                    size='sm'
                    id='dropdown-basic'
                    data-cy='actions'
                  >
                    Actions
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <ExportPdfExcel onExport={onExport} />
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </div>
          </div>

          <FilterColumns
            setPage={setPage}
            filterAll={filterAll}
            onChange={setFilterAll}
            api={getTicketTypeOptionsColumns}
          />
        </div>

        <div className='card-body'>
          <DataTable
            page={page}
            limit={limit}
            onEdit={onEdit}
            onSort={onSort}
            total={totalPage}
            columns={columns}
            onDelete={onDelete}
            onDetail={onDetail}
            data={dataTicketType}
            onChecked={onChecked}
            onChangePage={onChangePage}
            onChangeLimit={onChangeLimit}
            loading={!ticketTypeQuery?.isFetched}
            render={(val: any, _data: any) => {
              return {
                contact_count: val ? <span className='fw-bolder'>{val} contacts</span> : '-',
                ticket_count: val ? <span className='fw-bolder'>{val} tickets</span> : '-',
              }
            }}
            edit={hasPermission('help-desk.tag.edit')}
            del={hasPermission('help-desk.tag.delete')}
            bulk={hasPermission('help-desk.tag.delete')}
          />
        </div>
      </div>

      <AddEditTicketType
        showModal={showModalTicketType}
        typeDetail={detailTicketType}
        setReload={setReload}
        setShowModal={setShowModalTicketType}
        reload={reload}
      />

      <ModalDetailTicketType
        data={detailTicketType}
        showDetail={showModalDetail}
        setShowDetail={setShowModalDetail}
      />
    </>
  )
}

let TicketType: FC<any> = () => {
  const intl: any = useIntl()
  const [showModal, setShowModalConfirm] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [name, setName] = useState<string>('')
  const [guid, setGuid] = useState<string>('')
  const [dataChecked, setDataChecked] = useState<any>([])
  const [detailTicketType, setDetailTicketType] = useState<any>()
  const [showModalBulk, setShowModalConfirmBulk] = useState<boolean>(false)
  const [reloadDelete, setReloadDelete] = useState<number>(1)
  const [showModalDetail, setShowModalDetail] = useState<boolean>(false)
  const [showModalTicketType, setShowModalTicketType] = useState<boolean>(false)
  const [page, setPage] = useState<number>(1)
  const [totalPage, setTotalPage] = useState<number>(0)
  const [pageFrom, setPageFrom] = useState<number>(0)
  const [resetKeyword, setResetKeyword] = useState<boolean>(false)

  // Single Delete
  const handleDelete = useCallback(() => {
    setLoading(true)
    deleteTicketType(guid)
      .then((res: any) => {
        if (res.status === 200) {
          ToastMessage({message: res?.data?.message, type: 'success'})
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
          setTimeout(() => {
            setLoading(false)
            setShowModalConfirm(false)
            setReloadDelete(reloadDelete + 1)
            setDataChecked([])
          }, 1000)
        }
      })
      .catch(() => {
        setLoading(false)
        // ToastMessage({message: err?.data?.message, type: 'error'})
      })
  }, [reloadDelete, guid])

  // Bulk Delete
  const handleBulkDelete = useCallback(() => {
    setLoading(true)
    bulkDeleteTicketType({guids: dataChecked})
      .then((res: any) => {
        if (res.status === 200) {
          ToastMessage({message: res?.data?.message, type: 'success'})
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
          setLoading(false)
          setShowModalConfirmBulk(false)
          setDataChecked([])
          setReloadDelete(reloadDelete + 1)
        }
      })
      .catch(() => '')
  }, [dataChecked, reloadDelete])

  const msg_alert_delete = [
    'Are you sure you want to delete this type ',
    <strong key='delete'>{name}</strong>,
    ' ?',
  ]

  const msg_alert_bulk_delete = [
    'Are you sure you want to delete',
    <strong key='bulk_delete'> {dataChecked?.length} </strong>,
    ' type of ticket data?',
  ]

  return (
    <>
      <PageTitle breadcrumbs={[]}>{intl.formatMessage({id: 'HELPDESK.TYPE'})}</PageTitle>
      <CardTicketType
        dataChecked={dataChecked}
        setDataChecked={setDataChecked}
        detailTicketType={detailTicketType}
        setDetailTicketType={setDetailTicketType}
        setName={setName}
        setGuid={setGuid}
        setShowModalDelete={setShowModalConfirm}
        setShowModalDetail={setShowModalDetail}
        setShowModalDeleteBulk={setShowModalConfirmBulk}
        setShowModalTicketType={setShowModalTicketType}
        showModalTicketType={showModalTicketType}
        showModalDetail={showModalDetail}
        setReloadDelete={setReloadDelete}
        reloadDelete={reloadDelete}
        page={page}
        setPage={setPage}
        setPageFrom={setPageFrom}
        totalPage={totalPage}
        setTotalPage={setTotalPage}
        resetKeyword={resetKeyword}
        setResetKeyword={setResetKeyword}
      />

      {/* Single Delete */}
      <Alert
        setShowModal={setShowModalConfirm}
        showModal={showModal}
        loading={loading}
        body={msg_alert_delete}
        type={'delete'}
        title={'Delete Ticket Type'}
        confirmLabel={'Delete'}
        onConfirm={() => {
          handleDelete()
        }}
        onCancel={() => {
          setShowModalConfirm(false)
        }}
      />

      {/* Bulk Delete */}
      <Alert
        setShowModal={setShowModalConfirm}
        showModal={showModalBulk}
        loading={loading}
        body={msg_alert_bulk_delete}
        type={'bulk delete'}
        title={'Bulk Delete Ticket Type'}
        confirmLabel={'Bulk Delete'}
        onConfirm={() => {
          handleBulkDelete()
        }}
        onCancel={() => {
          setShowModalConfirmBulk(false)
        }}
      />
    </>
  )
}

TicketType = memo(
  TicketType,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export default TicketType
