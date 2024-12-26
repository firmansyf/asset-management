/* eslint-disable react-hooks/exhaustive-deps */
import {Alert} from '@components/alert'
import {DataTable} from '@components/datatable'
import {matchColumns} from '@components/dnd/table'
import {ExportPdfExcel} from '@components/export/ExportPdfExcel'
import {Search} from '@components/form/searchAlert' //search
import {ToastMessage} from '@components/toast-message'
import {guidBulkChecked, KTSVG} from '@helpers'
import {PageTitle} from '@metronic/layout/core'
import {useQuery} from '@tanstack/react-query'
import {FC, useCallback, useEffect, useMemo, useState} from 'react'
import Dropdown from 'react-bootstrap/Dropdown'
import {useIntl} from 'react-intl'

import AddSLA from './AddEdit'
import {bulkDeleteSlaPolicy, deleteSlaPolicy, exportData, getListSlaPolicy} from './core/service'

type Props = {
  setGuid: any
  setName: any
  setShowModalDelete: any
  reloadDelete: any
  setShowModalBulkDel: any
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

const Card: FC<Props> = ({
  setGuid,
  setName,
  setShowModalDelete,
  reloadDelete,
  setShowModalBulkDel,
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
  const [detail, setDetail] = useState<any>({})
  const [reload, setReload] = useState<any>([])
  const [limit, setLimit] = useState<number>(10)
  const [keyword, setKeyword] = useState<any>('')
  const [orderDir, setOrderDir] = useState<string>('asc')
  const [orderCol, setOrderCol] = useState<string>('name')
  const [showModalAdd, setShowModalAdd] = useState<boolean>(false)

  const columns: any = useMemo(
    () => [
      {header: 'checkbox', width: '20px'},
      {header: 'View', width: '20px'},
      {header: 'SLA Policy', value: 'name', sort: true},
      {header: 'Description', value: 'description', sort: true},
      {header: 'Edit', width: '20px'},
      {header: 'Delete', width: '20px'},
    ],
    []
  )

  const onExport = (e: any) => {
    const fields = columns
      ?.filter(({value}: any) => value)
      ?.map(({value}: any) => value)
      ?.join()
    exportData({type: e, columns: fields, keyword})
      .then(
        ({
          data: {
            message,
            data: {url},
          },
        }: any) => {
          window.open(url, '_blank')
          ToastMessage({message, type: 'success'})
        }
      )
      .catch(() => '')
  }

  const onDetail = () => ''

  const onDelete = (e: any) => {
    const {name, guid} = e
    setName(name)
    setGuid(guid)
    setShowModalDelete(e)
  }

  const onEdit = (e: any) => {
    setDetail(e)
    setShowModalAdd(true)
  }

  const onChecked = (e: any) => {
    const ar_guid: any = guidBulkChecked(e)
    setDataChecked(ar_guid)
  }

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

  const onSort = (value: any) => {
    setOrderCol(value)
    setOrderDir(orderDir === 'asc' ? 'desc' : 'asc')
  }

  useEffect(() => {
    setTimeout(() => ToastMessage({type: 'clear'}), 1000)
  }, [])

  const slaPolicyQuery: any = useQuery({
    // initialData: {data: []},
    queryKey: [
      'getListSlaPolicy',
      {page, limit, orderDir, orderCol, keyword, columns, reload, reloadDelete},
    ],
    queryFn: async () => {
      const res: any = await getListSlaPolicy({
        page,
        orderDir,
        keyword,
        orderCol,
        limit,
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

  const dataSlaPolicy: any = slaPolicyQuery?.data || []

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
            </div>
            <div className='d-flex my-1'>
              <div style={{marginRight: '5px'}}>
                {dataChecked?.length > 0 && (
                  <button
                    data-cy='bulkDelete'
                    type='button'
                    className='btn btn-sm btn-primary me-2'
                    onClick={() => {
                      setShowModalBulkDel(true)
                    }}
                  >
                    <span className='indicator-label'>Delete Selected</span>
                  </button>
                )}

                <button
                  className='btn btn-sm btn-primary'
                  type='button'
                  data-cy='addSLA'
                  onClick={() => {
                    setDetail(undefined)
                    setShowModalAdd(true)
                  }}
                >
                  + Add New SLA Policy
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
                    {' '}
                    Actions{' '}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <ExportPdfExcel onExport={onExport} />
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </div>
          </div>
        </div>
        <div className='card-body'>
          <DataTable
            loading={!slaPolicyQuery?.isFetched}
            limit={limit}
            total={totalPage}
            page={page}
            data={dataSlaPolicy}
            columns={columns}
            onChangePage={(e: any) => {
              setDataChecked([])
              setPage(e)
            }}
            onChangeLimit={(e: any) => {
              setDataChecked([])
              setPage(1)
              setLimit(e)
            }}
            onDelete={onDelete}
            onDetail={onDetail}
            onEdit={onEdit}
            onSort={onSort}
            onChecked={onChecked}
          />
        </div>
      </div>

      <AddSLA
        showModal={showModalAdd}
        setShowModal={setShowModalAdd}
        detail={detail}
        reload={reload}
        setReload={setReload}
        setDataChecked={setDataChecked}
      />
    </>
  )
}

const SlaPolicy: FC = () => {
  const intl: any = useIntl()

  const [guid, setGuid] = useState<string>('')
  const [name, setName] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [dataChecked, setDataChecked] = useState<any>([])
  const [reloadDelete, setReloadDelete] = useState<number>(1)
  const [showModal, setShowModalConfirm] = useState<boolean>(false)
  const [showModalBulkDel, setShowModalBulkDel] = useState<boolean>(false)
  const [page, setPage] = useState<number>(1)
  const [totalPage, setTotalPage] = useState<number>(0)
  const [pageFrom, setPageFrom] = useState<number>(0)
  const [resetKeyword, setResetKeyword] = useState<boolean>(false)

  const handleDelete = useCallback(() => {
    setLoading(true)
    deleteSlaPolicy(guid)
      .then(({data}: any) => {
        ToastMessage({message: data?.message || '', type: 'success'})
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
        }, 1000)
      })
      .catch(({response}: any) => {
        setLoading(false)
        const {data} = response || {}
        ToastMessage({message: data?.message || '', type: 'error'})
      })
  }, [reloadDelete, guid])

  const confirmBulkDelete = useCallback(() => {
    setLoading(true)
    bulkDeleteSlaPolicy({guids: dataChecked})
      .then(({data, status}: any) => {
        if (status === 200) {
          ToastMessage({message: data?.message, type: 'success'})
          setTimeout(() => {
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
            setShowModalBulkDel(false)
            setDataChecked([])
            setReloadDelete(reloadDelete + 1)
          }, 1000)
        }
      })
      .catch(({response}: any) => {
        const {message} = response?.data || {}
        ToastMessage({message, type: 'error'})
        setLoading(false)
      })
  }, [reloadDelete, dataChecked])

  const msg_alert_delete: any = [
    'Are you sure you want to remove ',
    <strong key='delete'>{name}</strong>,
    ' Sla Policy ?',
  ]

  const msg_alert_bulk_delete: any = [
    'Are you sure you want to delete',
    <strong key='full_name'> {dataChecked?.length} </strong>,
    'Sla Policy data?',
  ]

  return (
    <>
      <PageTitle breadcrumbs={[]}>{intl.formatMessage({id: 'SLA.POLICY.PAGE'})}</PageTitle>
      <Card
        setGuid={setGuid}
        setName={setName}
        setShowModalDelete={setShowModalConfirm}
        reloadDelete={reloadDelete}
        setShowModalBulkDel={setShowModalBulkDel}
        dataChecked={dataChecked}
        setDataChecked={setDataChecked}
        page={page}
        setPage={setPage}
        setPageFrom={setPageFrom}
        totalPage={totalPage}
        setTotalPage={setTotalPage}
        resetKeyword={resetKeyword}
        setResetKeyword={setResetKeyword}
      />

      <Alert
        setShowModal={setShowModalConfirm}
        showModal={showModal}
        loading={loading}
        body={msg_alert_delete}
        type={'delete'}
        title={'Delete Sla Policies'}
        confirmLabel={'Delete'}
        onConfirm={() => {
          handleDelete()
        }}
        onCancel={() => {
          setShowModalConfirm(false)
        }}
      />

      <Alert
        setShowModal={setShowModalBulkDel}
        showModal={showModalBulkDel}
        loading={loading}
        body={msg_alert_bulk_delete}
        type={'delete'}
        title={'Delete Bulk Sla Policy'}
        confirmLabel={'Delete'}
        onConfirm={() => {
          confirmBulkDelete()
        }}
        onCancel={() => {
          setShowModalBulkDel(false)
        }}
      />
    </>
  )
}

export default SlaPolicy
