/* eslint-disable react-hooks/exhaustive-deps */
import {Alert} from '@components/alert'
import {DataTable} from '@components/datatable'
import {matchColumns, toColumns} from '@components/dnd/table'
import {ExportPdfExcel} from '@components/export/ExportPdfExcel'
import {Search} from '@components/form/searchAlert'
import {ToastMessage} from '@components/toast-message'
import {guidBulkChecked, hasPermission, KTSVG, setColumn} from '@helpers'
import {useQuery} from '@tanstack/react-query'
import {FC, memo, useCallback, useEffect, useState} from 'react'
import Dropdown from 'react-bootstrap/Dropdown'
import {useNavigate} from 'react-router-dom'

import {AddAlertSetting} from './AddAlertSetting'
import {DetailAlert} from './Detail'
import {
  deleteBulkAlertSetting,
  exportAlertSetting,
  getAlertSetting,
  getAlertSettingColumn,
  getDetailAlertSetting,
} from './Service'

interface Props {
  onDelete: any
  dataChecked: any
  setDataChecked: any
  // loading: any
  setPage: any
  limit: any
  setLimit: any
  totalPage: any
  keyword: any
  setKeyword: any
  reload: any
  setReload: any
  orderDir: any
  setOrderDir: any
  orderCol: any
  setOrderCol: any
  // columns: any
  // setColumns: any
  // res_man?: any
  resetKeyword?: any
  setResetKeyword?: any
  page?: any
  totalPerPage?: any
  setTotalPage?: any
  setMeta?: any
  setTotalPerPage?: any
}

const label = 'Alert Setting'
let CardAlertSetting: FC<Props> = ({
  onDelete,
  dataChecked,
  setDataChecked,
  // loading,
  setPage,
  limit,
  setLimit,
  totalPage,
  keyword,
  setKeyword,
  reload,
  setReload,
  orderDir,
  setOrderDir,
  orderCol,
  setOrderCol,
  // columns,
  // setColumns,
  // res_man,
  resetKeyword,
  setResetKeyword,
  page,
  totalPerPage,
  setTotalPage,
  setMeta,
  setTotalPerPage,
}) => {
  const navigate: any = useNavigate()

  const [detail, setDetail] = useState<any>({})
  const [messageAlert, setMessage] = useState<any>()
  const [showModalDetail, setShowModalDetail] = useState<boolean>(false)
  const [showModalBulk, setShowModalConfirmBulk] = useState<boolean>(false)
  const [showModalAlertTeam, setShowModalAlertSetting] = useState<boolean>(false)

  // const [dataAlert, setDataAlert] = useState<any>([])

  const permissionAdd: any = hasPermission('alert.add') || false
  const permissionView: any = hasPermission('alert.view') || false
  const permissionEdit: any = hasPermission('alert.edit') || false
  const permissionDelete: any = hasPermission('alert.delete') || false

  const onExport = (e: any) => {
    const cols: any = 'name,module_name,module_field_name,start_time,team_name,frequency,type_name'

    exportAlertSetting({type: e, keyword, columns: cols, orderCol, orderDir})
      .then(({data: {data, message}}: any) => {
        ToastMessage({type: 'success', message})
        setTimeout(() => totalPage <= 500 && window.open(data?.url || null, '_blank'), 1000)
      })
      .catch(({response}: any) => {
        const {message}: any = response?.data || {}
        ToastMessage({message, type: 'error'})
      })
  }

  const onSearch = useCallback(
    (e: any) => {
      if (!resetKeyword) {
        setPage(1)
      }
      setKeyword(e ? `*${e}*` : '')
    },
    [setKeyword, setPage, resetKeyword]
  )

  const onSort = (value: any) => {
    setOrderCol(value)
    setOrderDir(orderDir === 'asc' ? 'desc' : 'asc')
  }

  const onChangeLimit = (e: any) => {
    setPage(1)
    setLimit(e)
  }

  const onPageChange = (e: any) => {
    setPage(e)
  }

  const onEdit = ({guid}: any) => {
    setShowModalAlertSetting(true)
    getDetailAlertSetting(guid).then(({data: {data}}: any) => {
      setDetail(data || {})
    })
  }

  const onDetail = ({guid}: any) => {
    setShowModalDetail(true)
    getDetailAlertSetting(guid).then(({data: {data}}: any) => {
      setDetail(data || {})
    })
  }

  const onChecked = (e: any) => {
    const ar_guid: any = guidBulkChecked(e)
    setDataChecked(ar_guid)
  }

  const onBulkDelete = (e: any) => {
    deleteBulkAlertSetting({guids: e})
      .then(({data: {message}}: any) => {
        setReload(reload + 1)
        const total_data_page: number = totalPage - totalPerPage
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
        ToastMessage({message, type: 'success'})
      })
      .catch(({response}: any) => {
        const {message}: any = response?.data || {}
        ToastMessage({type: 'error', message})
      })
  }

  const alert_bulk_delete: any = [
    `Are you sure want to delete `,
    <strong key='notunique'>{dataChecked?.length || 0}</strong>,
    ` ${dataChecked?.length > 1 ? 'alert settings' : 'alert settings'} ?`,
  ]

  const handleConfirmBulkDelete = () => {
    setDataChecked([])
    onBulkDelete(dataChecked)
    setShowModalConfirmBulk(false)
  }

  const columnsQuery: any = useQuery({
    queryKey: ['getAlertSettingColumn'],
    queryFn: async () => {
      const res: any = await getAlertSettingColumn()
      const {fields}: any = res?.data?.data || {}
      const mapColumns: any = toColumns(fields, {checked: true, order: true})?.map(
        ({value, label: header}: any) => {
          return {
            value,
            header,
            sort: true,
          }
        }
      )
      const dataResult: any = setColumn(mapColumns)
      return dataResult
    },
  })
  const columns: any = columnsQuery?.data || []

  const dataAlertSettingQuery: any = useQuery({
    // initialData: {data: []},
    queryKey: [
      'getAlertSetting',
      {
        keyword,
        limit,
        orderCol,
        orderDir,
        page,
        reload,
        columns,
      },
    ],
    queryFn: async () => {
      if (columns?.length > 0) {
        const res: any = await getAlertSetting({
          page,
          limit,
          keyword,
          orderDir,
          orderCol,
        })
        const {data: result, meta}: any = res?.data || {}
        const {total}: any = meta || {}

        setTotalPage(total)
        setMeta(res?.data?.meta || {})
        setTotalPerPage(result?.length || 0)
        const dataResult: any = res?.data?.data?.map((m: any) => ({
          ...m,
          original: m,
          date: m?.start_time + ' to ' + m?.end_time || '-',
          type_name: m?.types
            ? m?.types?.[1]
              ? `${m?.types?.[0]?.name || ''}, ${m?.types?.[1]?.name || ''}`
              : m?.types?.[0]?.name || ''
            : m?.type_name || '-',
          module_name: m?.module?.name || m?.module_name || '-',
          module_field_name: m?.module_field?.name || m?.module_field_name || '-',
          team_name: m?.team?.name || m?.team_name || '-',
        }))

        return matchColumns(dataResult, columns)
      } else {
        return []
      }
    },
    // refactor react-query v5 (change onError => throwOnError)
    onError: ({response}: any) => {
      ToastMessage({message: response?.data?.message, type: 'error'})
    },
  })
  const dataAlertSetting: any = dataAlertSettingQuery?.data || []

  useEffect(() => {
    if (resetKeyword) {
      onSearch('')
      setResetKeyword(false)
    }
  }, [resetKeyword, setResetKeyword])

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
                {permissionDelete && dataChecked?.length > 0 && (
                  <button
                    type='button'
                    data-cy='bulkDeleteSetting'
                    className='btn btn-sm btn-primary me-2'
                    onClick={() => {
                      setShowModalConfirmBulk(true)
                      setMessage(alert_bulk_delete)
                    }}
                  >
                    <span className='indicator-label'>Delete Selected</span>
                  </button>
                )}

                {permissionAdd && (
                  <button
                    type='button'
                    data-cy='add'
                    data-bs-toggle='modal'
                    className='btn btn-sm btn-primary'
                    data-bs-target='#kt_modal_create_app'
                    onClick={() => {
                      setDetail(undefined)
                      setShowModalAlertSetting(true)
                    }}
                  >
                    + Add New {label || ''}
                  </button>
                )}
              </div>

              <div className='dropdown' style={{marginRight: '5px'}}>
                <Dropdown>
                  <Dropdown.Toggle
                    size='sm'
                    id='dropdown-basic'
                    data-cy='actionSetting'
                    variant='light-primary'
                  >
                    Actions
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <ExportPdfExcel onExport={onExport} />
                    {permissionView && (
                      <Dropdown.Item
                        href='#'
                        onClick={() => navigate('/setup/alert/settings/columns')}
                      >
                        Setup Column
                      </Dropdown.Item>
                    )}
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </div>
          </div>
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
            onChecked={onChecked}
            edit={permissionEdit}
            view={permissionView}
            del={permissionDelete}
            data={dataAlertSetting}
            onChangePage={onPageChange}
            onChangeLimit={onChangeLimit}
            loading={!dataAlertSettingQuery?.isFetched || !columnsQuery?.isFetched}
          />
        </div>
      </div>

      <DetailAlert
        dataDetail={detail}
        showModal={showModalDetail}
        setShowModal={setShowModalDetail}
      />

      <AddAlertSetting
        reload={reload}
        detail={detail}
        setReload={setReload}
        setDetail={setDetail}
        showModal={showModalAlertTeam}
        setShowModal={setShowModalAlertSetting}
      />

      <Alert
        loading={false}
        type={'delete'}
        body={messageAlert}
        confirmLabel={'Delete'}
        showModal={showModalBulk}
        title={'Delete Alert Setting'}
        onConfirm={handleConfirmBulkDelete}
        setShowModal={setShowModalConfirmBulk}
        onCancel={() => setShowModalConfirmBulk(false)}
      />
    </>
  )
}

CardAlertSetting = memo(
  CardAlertSetting,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export {CardAlertSetting}
