/* eslint-disable react-hooks/exhaustive-deps */
import {Alert} from '@components/alert'
import {DataTable} from '@components/datatable'
import {Search} from '@components/form/searchValue'
import {ToastMessage} from '@components/toast-message'
import {KTSVG, preferenceDateTime} from '@helpers'
import {DetailNotification} from '@pages/help-desk/notification/component/ModalDetail'
import {
  deleteBulkNotification,
  deleteNotification,
  getNotification,
} from '@pages/help-desk/notification/Service'
import moment from 'moment'
import {FC, useCallback, useEffect, useMemo, useState} from 'react'

function convertDate(inputDateStr: any) {
  const parts = inputDateStr?.split(' ')
  const dateParts = parts?.[0]?.split('-')
  const timeParts = parts?.[1]?.split(':')
  const convertedDate = new Date(
    dateParts?.[2],
    dateParts?.[1] - 1,
    dateParts?.[0],
    timeParts?.[0],
    timeParts?.[1],
    timeParts?.[2]
  )
  return convertedDate || ''
}

type Props = {
  module: any
  setTotalRead: any
  reload: any
  setReload: any
  dataChecked: any
  setDataChecked: any
}

const NotificationRead: FC<Props> = ({
  module,
  setTotalRead,
  reload,
  setReload,
  dataChecked,
  setDataChecked,
}) => {
  const pref_date_time: any = preferenceDateTime()

  const [data, setData] = useState<any>([])
  const [page, setPage] = useState<number>(1)
  const [limit, setLimit] = useState<number>(10)
  const [keyword, setKeyword] = useState<string>('')
  const [pageFrom, setPageFrom] = useState<number>(0)
  const [dataDetail, setDataDetail] = useState<any>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [totalPage, setTotalPage] = useState<number>(0)
  const [orderDir, setOrderDir] = useState<string>('desc')
  const [showModal, setShowModal] = useState<boolean>(false)
  const [messageAlert, setMessage] = useState<boolean>(false)
  const [orderCol, setOrderCol] = useState<string>('created_at')
  const [resetKeyword, setResetKeyword] = useState<boolean>(false)
  const [notificationName, setNotificationName] = useState<string>('')
  const [notificationGuid, setNotificationGuid] = useState<string>('')
  const [showModalConfirm, setShowModalConfirm] = useState<boolean>(false)
  const [showModalBulk, setShowModalConfirmBulk] = useState<boolean>(false)

  const onDetail = (e: any) => {
    setDataDetail(e)
    setShowModal(true)
  }

  const onSort = (value: any) => {
    setOrderCol(value)
    setOrderDir(orderDir === 'asc' ? 'desc' : 'asc')
  }

  const onChangePage = (e: any) => {
    setPage(e)
  }

  const onLimit = (e: any) => {
    setPage(1)
    setLimit(e)
  }

  const onChecked = (e: any) => {
    const ar_guid: any = []
    e?.forEach((ck: any) => {
      const {checked}: any = ck || {}
      if (checked) {
        const {original}: any = ck || {}
        const {guid}: any = original || {}
        ar_guid?.push(guid)
      }
    })
    setDataChecked(ar_guid as never[])
  }

  const setMessageAlert: any = [
    `Are you sure want to delete `,
    <strong key='chcek-bulk'>{dataChecked?.length || 0}</strong>,
    ` ${dataChecked?.length > 1 ? 'notifications' : 'notification'} ?`,
  ]

  useEffect(() => {
    setLoading(true)
    getNotification({
      page,
      orderDir,
      orderCol,
      limit,
      keyword,
      'filter[module]': module,
      'filter[is_read]': 1,
    })
      .then(({data: {data: res, meta}}: any) => {
        const {current_page, per_page, total, from}: any = meta || {}
        setLoading(false)
        setPageFrom(from)
        setLimit(per_page)
        setTotalPage(total)
        setTotalRead(total)
        setPage(current_page)

        const data: any = res?.map((item: any) => {
          const {action_data, trigger_time}: any = item || {}
          const {main_message: message, description, request_title, text}: any = action_data || {}
          return {
            original: item,
            checkbox: item,
            view: 'view',
            message: message || request_title || '-',
            description: description || text || '-',
            created_at: trigger_time
              ? moment(convertDate(trigger_time || ''))?.format(pref_date_time)
              : '-',
            delete: 'Delete',
          }
        })
        setData(data as never[])
      })
      .catch(() => setLoading(false))
  }, [page, orderDir, orderCol, limit, keyword, reload])

  const onBulkDelete = (e: any) => {
    deleteBulkNotification({guids: e})
      .then(({data: {message}}: any) => {
        const total_data_page: number = totalPage - pageFrom
        const newPage: any = page
        if (total_data_page - dataChecked?.length <= 0) {
          if (newPage > 1) {
            setPage(newPage - 1)
          } else {
            setPage(newPage)
            setResetKeyword(true)
          }
        } else {
          setPage(newPage)
        }

        setDataChecked([])
        setReload(reload + 1)
        ToastMessage({message: message, type: 'success'})
      })
      .catch(({response}: any) => {
        const {message}: any = response?.data || {}
        ToastMessage({message, type: 'error'})
      })
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

  const onDelete = (e: any) => {
    const {action_data, guid}: any = e || {}
    const {main_message}: any = action_data || {}

    setLoading(false)
    setShowModalConfirm(true)
    setNotificationGuid(guid || '')
    setNotificationName(main_message || '')
  }

  const confirmDelete = useCallback(() => {
    setLoading(true)
    deleteNotification(notificationGuid)
      .then(({data: {message}}: any) => {
        ToastMessage({message, type: 'success'})
        setTimeout(() => {
          const total_data_page: number = totalPage - pageFrom
          const newPage: any = page
          if (total_data_page - 1 <= 0) {
            if (newPage > 1) {
              setPage(newPage - 1)
            } else {
              setPage(newPage)
              setResetKeyword(true)
            }
          } else {
            setPage(newPage)
          }

          setLoading(false)
          setDataChecked([])
          setReload(reload + 1)
          setShowModalConfirm(false)
        }, 800)
      })
      .catch(({response}: any) => {
        setLoading(false)
        const {message}: any = response?.data || {}
        ToastMessage({message, type: 'error'})
      })
  }, [notificationGuid, reload])

  const msg_alert: any = [
    'Are you sure you want to delete this notification ',
    <strong key='full_name'>{notificationName || ''}</strong>,
    '?',
  ]

  const columns: any = useMemo(
    () => [
      {header: 'checkbox', width: '20px'},
      {header: 'View', width: '20px'},
      {header: 'Message', value: 'message', sort: false},
      {header: 'Description', value: 'description', sort: false},
      {header: 'Notification Date', value: 'created_at', sort: true},
      {header: 'Delete', width: '20px'},
    ],
    []
  )

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
                    type='button'
                    data-cy='btnBulkDelete'
                    className='btn btn-sm btn-danger me-2'
                    onClick={() => {
                      setShowModalConfirmBulk(true)
                      setMessage(setMessageAlert)
                    }}
                  >
                    <span className='indicator-label'>Delete Selected</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className='card-body'>
          <DataTable
            page={page}
            data={data}
            limit={limit}
            onSort={onSort}
            loading={loading}
            total={totalPage}
            columns={columns}
            onDelete={onDelete}
            onDetail={onDetail}
            onChecked={onChecked}
            onChangeLimit={onLimit}
            onChangePage={onChangePage}
          />
        </div>
      </div>

      <DetailNotification
        showModal={showModal}
        dataDetail={dataDetail}
        setShowModal={setShowModal}
      />

      <Alert
        loading={false}
        type={'delete'}
        body={messageAlert}
        confirmLabel={'Delete'}
        showModal={showModalBulk}
        title={'Delete Notifications'}
        setShowModal={setShowModalConfirmBulk}
        onCancel={() => setShowModalConfirmBulk(false)}
        onConfirm={() => {
          setDataChecked([])
          onBulkDelete(dataChecked)
          setShowModalConfirmBulk(false)
        }}
      />

      <Alert
        type={'delete'}
        body={msg_alert}
        loading={loading}
        confirmLabel={'Delete'}
        showModal={showModalConfirm}
        title={'Delete Notification'}
        onConfirm={() => confirmDelete()}
        setShowModal={setShowModalConfirm}
        onCancel={() => setShowModalConfirm(false)}
      />
    </>
  )
}

export default NotificationRead
