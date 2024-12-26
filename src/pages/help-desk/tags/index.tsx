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
import {useQuery} from '@tanstack/react-query'
import {FC, memo, useCallback, useEffect, useMemo, useState} from 'react'
import Dropdown from 'react-bootstrap/Dropdown'
import {useIntl} from 'react-intl'

import {AddEditTags} from './AddEditTags'
import {
  bulkDeleteTags,
  deleteTag,
  detailTags,
  exportTag,
  getTags,
  getTagsOptionsColumns,
} from './core/service'
import {ModalDetailTag} from './DetailTag'

type Props = {
  setGuid: any
  setName: any
  detailTag: any
  setDetailTag: any
  setShowModalDelete: any
  setShowModalDetail: any
  setShowModalDeleteBulk: any
  dataChecked: any
  setDataChecked: any
  setShowModalTags: any
  showModalTags: any
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
const CardTags: FC<Props> = ({
  setName,
  setGuid,
  setShowModalDeleteBulk,
  setShowModalDelete,
  detailTag,
  setDetailTag,
  setShowModalDetail,
  setDataChecked,
  dataChecked,
  setShowModalTags,
  showModalTags,
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
  const [reload, setReload] = useState<number>(0)
  const [filterAll, setFilterAll] = useState<any>({})
  const [orderDir, setOrderDir] = useState<string>('asc')
  const [orderCol, setOrderCol] = useState<string>('name')

  const columns: any = useMemo(
    () => [
      {header: 'checkbox', width: '20px'},
      {header: 'View', width: '20px'},
      {header: 'Tag Name', value: 'name', sort: true},
      {header: 'Tickets', value: 'ticket_count', sort: true},
      {header: 'Contacts', value: 'contact_count', sort: true},
      {header: 'Edit', width: '20px'},
      {header: 'Delete', width: '20px'},
    ],
    []
  )

  // Export Function
  const onExport = (e: any) => {
    // let fields = columns.filter(({value}: any) => value)?.map(({value}: any) => value).join()
    exportTag({type: e, keyword, ...(filterAll?.child || {})})
      .then(({data: res}) => {
        const {data} = res || {}
        const {url} = data || {}
        if (url) {
          setTimeout(() => {
            window.open(url, '_blank')
          }, 1000)
        }
        ToastMessage({message: res.message, type: 'success'})
      })
      .catch((err: any) => {
        ToastMessage({message: err?.response?.data?.message, type: 'error'})
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
    setDetailTag(e)
    setShowModalTags(true)
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
    setDetailTag(e)
    setShowModalDetail(e)
    setShowModalDetail(true)
    if (e?.guid) {
      detailTags(e?.guid).then(({data: {data: res}}: any) => {
        setDetailTag(res)
      })
    }
  }

  useEffect(() => {
    setTimeout(() => ToastMessage({type: 'clear'}), 1000)
  }, [])

  const tagsQuery: any = useQuery({
    // initialData: {data: []},
    queryKey: [
      'getTags',
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
      const res: any = await getTags({
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

  const dataTags: any = tagsQuery?.data || []

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
                {hasPermission('help-desk.tag.add') && (
                  <button
                    data-cy='add'
                    className='btn btn-sm btn-primary'
                    type='button'
                    onClick={() => {
                      setDetailTag(undefined)
                      setShowModalTags(true)
                    }}
                  >
                    + Add New Tags
                  </button>
                )}
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
                  {hasPermission('help-desk.tag.export') && (
                    <Dropdown.Menu>
                      <ExportPdfExcel onExport={onExport} />
                    </Dropdown.Menu>
                  )}
                </Dropdown>
              </div>
            </div>
          </div>
          <FilterColumns
            api={getTagsOptionsColumns}
            filterAll={filterAll}
            onChange={setFilterAll}
            setPage={setPage}
          />
        </div>
        <div className='card-body'>
          <DataTable
            loading={!tagsQuery?.isFetched}
            limit={limit}
            total={totalPage}
            page={page}
            data={dataTags}
            columns={columns}
            onChangePage={onChangePage}
            onChangeLimit={onChangeLimit}
            onDelete={onDelete}
            onDetail={onDetail}
            onEdit={onEdit}
            onSort={onSort}
            onChecked={onChecked}
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

      <AddEditTags
        showModal={showModalTags}
        tagsDetail={detailTag}
        setReload={setReload}
        setShowModal={setShowModalTags}
        reload={reload}
      />

      <ModalDetailTag
        data={detailTag}
        showDetail={showModalDetail}
        setShowDetail={setShowModalDetail}
      />
    </>
  )
}

let Tags: FC<any> = () => {
  const intl: any = useIntl()
  const [showModal, setShowModalConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState('')
  const [guid, setGuid] = useState('')
  const [dataChecked, setDataChecked] = useState([])
  const [detailTag, setDetailTag] = useState()
  const [showModalBulk, setShowModalConfirmBulk] = useState(false)
  const [reloadDelete, setReloadDelete] = useState(1)
  const [showModalDetail, setShowModalDetail] = useState(false)
  const [showModalTags, setShowModalTags] = useState(false)
  const [page, setPage] = useState<number>(1)
  const [totalPage, setTotalPage] = useState<number>(0)
  const [pageFrom, setPageFrom] = useState<number>(0)
  const [resetKeyword, setResetKeyword] = useState<boolean>(false)

  // Single Delete
  const handleDelete = useCallback(() => {
    setLoading(true)
    deleteTag(guid)
      .then((res: any) => {
        if (res.status === 200) {
          ToastMessage({message: res?.data?.message, type: 'success'})
          setTimeout(() => {
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
    bulkDeleteTags({guids: dataChecked})
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

  const msg_alert_delete: any = [
    'Are you sure you want to remove ',
    <strong key='delete'>{name}</strong>,
    ' Tag ?',
  ]

  const msg_alert_bulk_delete: any = [
    'Are you sure you want to remove',
    <strong key='bulk_delete'> {dataChecked?.length} </strong>,
    'Tag data?',
  ]

  return (
    <>
      <PageTitle breadcrumbs={[]}>{intl.formatMessage({id: 'HELPDESK.TAGS'})}</PageTitle>
      <CardTags
        dataChecked={dataChecked}
        setDataChecked={setDataChecked}
        detailTag={detailTag}
        setDetailTag={setDetailTag}
        setName={setName}
        setGuid={setGuid}
        setShowModalDelete={setShowModalConfirm}
        setShowModalDetail={setShowModalDetail}
        setShowModalDeleteBulk={setShowModalConfirmBulk}
        setShowModalTags={setShowModalTags}
        showModalTags={showModalTags}
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
        title={'Delete Tag'}
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
        title={'Bulk Delete Tag'}
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

Tags = memo(Tags, (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next))
export default Tags
