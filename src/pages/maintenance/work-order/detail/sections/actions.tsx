import {Alert} from '@components/alert'
import Tooltip from '@components/alert/tooltip'
import {ToastMessage} from '@components/toast-message'
import {hasPermission} from '@helpers'
import {
  printWorkOrder,
  processLog,
  ShareEndcode,
  updateArchive,
  updateBookmark,
  updateCompleteWorkOrder,
  updateFlagWorkOrder,
} from '@pages/maintenance/Service'
import {FC, memo, useEffect, useRef, useState} from 'react'
import {useNavigate} from 'react-router-dom'

import {ModalProcessLog} from '../processLog'
import ModalShare from './share'

let Actions: FC<any> = ({
  data,
  onDelete,
  reload,
  setReload,
  setShowModalEmail,
  maintenanceAdvance,
}) => {
  const refLink: any = useRef(null)
  const navigate: any = useNavigate()
  const {guid, maintenance_guid} = data || {}

  const [showModalProcessLog, setShowModalProcessLog] = useState<boolean>(false)
  const [dataProcessLog, setDataProcessLog] = useState<any>()
  const [archiveLoading, setArchiveLoading] = useState<boolean>(false)
  const [archiveWorkOrder, setArchiveWorkOrder] = useState<any>(false)
  const [bookmarkLoading, setBookmarkLoading] = useState<boolean>(false)
  const [bookmarkTicket, setBookmarkTicket] = useState<any>('0')
  const [flagWorkOrder, setFlagWorkOrder] = useState<any>('0')
  const [flagLoading, setFlagLoading] = useState<boolean>(false)
  const [completeLoading, setCompleteLoading] = useState<boolean>(false)
  const [showModalComplete, setShowModalConfirmComplete] = useState<boolean>(false)
  const [messageComplete, setMessageComplete] = useState<any>([])
  const [showModalShare, setShowModalShare] = useState<boolean>(false)
  const [dataShare, setDataShare] = useState<string>('')
  const [printLoading, setPrintLoading] = useState<boolean>(false)

  const deletePermission: any = hasPermission('maintenance.delete') || false
  const editPermission: any = hasPermission('maintenance.edit') || false
  const changeStatusPermission: any = hasPermission('maintenance.change-status') || false
  const printPermission: any = hasPermission('maintenance.print') || false
  const flagPermission: any = hasPermission('maintenance.flag') || false
  const sharePermission: any = hasPermission('maintenance.share') || false

  const print = () => {
    setPrintLoading(true)
    const {guid} = data || {}

    printWorkOrder(guid)
      .then(({data: {url, message}}: any) => {
        ToastMessage({type: 'success', message})
        window.open(url, '_blank')
        setPrintLoading(false)
      })
      .catch(() => {
        setPrintLoading(false)
      })
  }

  const openModalProcessLog = () => {
    const {guid} = data || {}
    setShowModalProcessLog(true)
    processLog(guid).then(({data: {data: res}}) => {
      setDataProcessLog(res)
    })
  }

  const handelArchive = () => {
    setArchiveLoading(true)
    updateArchive(archiveWorkOrder, {guids: [guid]})
      .then(({data}: any) => {
        const {message} = data || {}

        ToastMessage({type: 'success', message})
        setReload(reload + 1)
        const thisArchiveWorkOrder: any = archiveWorkOrder
        setArchiveWorkOrder(thisArchiveWorkOrder)
        setArchiveLoading(false)
      })
      .catch((err: any) => {
        setArchiveLoading(false)
        const {data} = err?.response?.data || {}

        if (data?.fields !== undefined) {
          const error = data?.fields || {}

          for (const key in error) {
            const value = error[key]
            ToastMessage({type: 'error', message: value[0] || ''})
          }
        } else {
          ToastMessage({type: 'error', message: err?.response?.data?.message || ''})
        }
      })
  }

  const handleBookmark = () => {
    setBookmarkLoading(true)
    const value: any = bookmarkTicket === 1 ? 0 : 1
    const params: any = {is_star: value}
    updateBookmark(params, guid)
      .then(({data}) => {
        const {message} = data || {}

        ToastMessage({type: 'success', message})
        setReload(reload + 1)
        setBookmarkTicket(value)
        setBookmarkLoading(false)
      })
      .catch((err: any) => {
        const {data} = err?.response?.data || {}

        if (data?.fields !== undefined) {
          const error = data?.fields || {}

          for (const key in error) {
            const value = error[key]
            ToastMessage({type: 'error', message: value[0]})
          }
        } else {
          ToastMessage({type: 'error', message: err?.response?.data.message})
        }
        setBookmarkLoading(false)
      })
  }

  const handleFlag = () => {
    setFlagLoading(true)
    const value: any = flagWorkOrder === 1 ? 0 : 1
    const params: any = {is_flag: value}
    updateFlagWorkOrder(params, guid)
      .then(({data}) => {
        const {message} = data || {}

        ToastMessage({type: 'success', message})
        setFlagWorkOrder(value)
        setFlagLoading(false)
        setReload(reload + 1)
      })
      .catch((err: any) => {
        const {data} = err?.response?.data || {}

        if (data?.fields !== undefined) {
          const error = data?.fields || {}

          for (const key in error) {
            const value = error[key]
            ToastMessage({type: 'error', message: value[0]})
          }
        } else {
          ToastMessage({type: 'error', message: err?.response?.data.message})
        }
        setFlagLoading(false)
      })
  }

  const handleComplete = () => {
    setCompleteLoading(true)

    updateCompleteWorkOrder({}, guid)
      .then(({data}) => {
        const {message} = data || {}

        ToastMessage({type: 'success', message})
        setCompleteLoading(false)
        setReload(reload + 1)
      })
      .catch((err: any) => {
        setCompleteLoading(false)
        const {status, data}: any = err?.response || {}
        const {is_popup}: any = data || {}

        if (status === 400 && is_popup) {
          setShowModalConfirmComplete(true)
          setMessageComplete(['Are you sure want to complete this Work Order ?'])
        } else {
          ToastMessage({type: 'error', message: err?.response?.data.message})
        }
      })
  }

  const confirmCompleteWO = () => {
    setCompleteLoading(true)
    updateCompleteWorkOrder({close_popup: true}, guid)
      .then((res: any) => {
        setCompleteLoading(false)
        ToastMessage({type: 'success', message: res?.data?.message})
        setShowModalConfirmComplete(false)
        setReload(reload + 1)
      })
      .catch((err: any) => {
        setCompleteLoading(false)
        const {data} = err?.response?.data || {}

        if (data?.fields !== undefined) {
          const error = data?.fields || {}

          for (const key in error) {
            const value = error[key]
            ToastMessage({type: 'error', message: value[0]})
          }
        } else {
          ToastMessage({type: 'error', message: err?.response?.data.message})
        }
      })
  }

  const handleShare = () => {
    setShowModalShare(true)
    ShareEndcode({guid: guid}).then(({data: {data: res}}: any) => {
      if (res) {
        setDataShare(res || '')
      }
    })
  }

  useEffect(() => {
    setBookmarkTicket(data?.is_star)
    setFlagWorkOrder(data?.is_flag)
    setArchiveWorkOrder(data?.is_archive === 1 ? 'unarchive' : 'archive')
  }, [data?.is_archive, data?.is_star, data?.is_flag])

  return (
    <>
      <div className='row m-0 align-items-center' ref={refLink}>
        <div className='col-auto row'>
          {printPermission && (
            <div className='col-auto mb-5 pe-0'>
              <Tooltip placement='top' title='Print'>
                <div
                  className='d-flex align-items-center justify-content-center w-35px h-35px radius-10 cursor-pointer bg-light-primary border border-dashed border-primary shadow-sm'
                  onClick={print}
                >
                  {printLoading ? (
                    <span className='spinner-border spinner-border-sm text-primary' />
                  ) : (
                    <i className='fa fa-lg fa-print text-primary'></i>
                  )}
                </div>
              </Tooltip>
            </div>
          )}

          {editPermission && (
            <div className='col-auto mb-5 pe-0'>
              <Tooltip placement='top' title='Edit'>
                <div
                  onClick={() =>
                    navigate(`/maintenance/work-order/edit?id=${maintenance_guid || guid || ''}`)
                  }
                  className='d-flex align-items-center justify-content-center w-35px h-35px radius-10 cursor-pointer bg-light-warning border border-dashed border-warning shadow-sm'
                >
                  <i className='fa fa-lg fa-pencil-alt text-warning'></i>
                </div>
              </Tooltip>
            </div>
          )}

          {deletePermission && (
            <div className='col-auto mb-5 pe-0'>
              <Tooltip placement='top' title='Delete'>
                <div
                  className='d-flex align-items-center justify-content-center w-35px h-35px radius-10 cursor-pointer bg-light-danger border border-dashed border-danger shadow-sm'
                  onClick={onDelete}
                >
                  <i className='fa fa-lg fa-trash-alt text-danger'></i>
                </div>
              </Tooltip>
            </div>
          )}

          {maintenanceAdvance === 1 && (
            <div className='col-auto mb-5 pe-0'>
              <Tooltip
                placement='top'
                title={archiveWorkOrder === 'unarchive' ? 'Unarchive' : 'Archive'}
              >
                <div
                  data-cy='archiveWorkOrder'
                  className='d-flex align-items-center justify-content-center w-35px h-35px radius-10 cursor-pointer bg-light-dark shadow-sm'
                  style={{
                    border: '1px',
                    borderStyle: 'dashed',
                    borderWidth: '1px',
                    borderColor: '#1C1C1C',
                    backgroundColor: '#000',
                  }}
                  onClick={handelArchive}
                >
                  {archiveLoading ? (
                    <span className='spinner-border spinner-border-sm text-primary' />
                  ) : archiveWorkOrder === 'unarchive' ? (
                    <i className='fas fa-file-archive fa-lg' style={{color: '#000'}}></i>
                  ) : (
                    <i className='far fa-file-archive fa-lg' style={{color: '#000'}}></i>
                  )}
                </div>
              </Tooltip>
            </div>
          )}

          <div className='col-auto mb-5 mx-1 pe-0'>
            <Tooltip placement='top' title={bookmarkTicket === 1 ? 'Unbookmark' : 'Bookmark'}>
              <div
                data-cy='bookmarkTicket'
                className='d-flex align-items-center justify-content-center w-35px h-35px radius-10 cursor-pointer bg-light-primary shadow-sm'
                style={{
                  border: '1px',
                  borderStyle: 'dashed',
                  borderWidth: '1px',
                  borderColor: '#409FFF',
                }}
                onClick={handleBookmark}
              >
                {bookmarkLoading ? (
                  <span className='spinner-border spinner-border-sm text-primary' />
                ) : bookmarkTicket === 1 ? (
                  <i className='fas fa-lg fa-star' style={{color: '#0080FF'}}></i>
                ) : (
                  <i className='far fa-lg fa-star' style={{color: '#0080FF'}}></i>
                )}
              </div>
            </Tooltip>
          </div>

          {flagPermission && (
            <div className='col-auto mb-5 pe-0'>
              <Tooltip placement='top' title={flagWorkOrder === 1 ? 'Unflag' : 'Flag'}>
                <div
                  data-cy='flagWorkOrder'
                  className='d-flex align-items-center justify-content-center w-35px h-35px radius-10 cursor-pointer bg-light-danger shadow-sm'
                  style={{
                    border: '1px',
                    borderStyle: 'dashed',
                    borderWidth: '1px',
                    borderColor: '#FF7F00',
                  }}
                  onClick={handleFlag}
                >
                  {flagLoading ? (
                    <span className='spinner-border spinner-border-sm text-primary' />
                  ) : flagWorkOrder === 1 ? (
                    <i className='fas fa-lg fa-flag' style={{color: '#FF7F00'}}></i>
                  ) : (
                    <i className='far fa-lg fa-flag' style={{color: '#FF7F00'}}></i>
                  )}
                </div>
              </Tooltip>
            </div>
          )}

          <div className='col-auto mb-5 pe-0'>
            <Tooltip placement='top' title='Email'>
              <div
                className='d-flex align-items-center justify-content-center w-35px h-35px radius-10 cursor-pointer bg-light-success border border-dashed border-success shadow-sm'
                onClick={() => {
                  setShowModalEmail(true)
                }}
              >
                <i className='fa fa-lg fa-envelope text-success'></i>
              </div>
            </Tooltip>
          </div>

          {maintenanceAdvance === 1 && sharePermission && (
            <div className='col-auto mb-5 pe-0'>
              <Tooltip placement='top' title='Share'>
                <div
                  onClick={handleShare}
                  className='d-flex align-items-center justify-content-center w-35px h-35px radius-10 cursor-pointer bg-light-primary border border-dashed border-primary shadow-sm'
                >
                  <i className='fa fa-lg fa-share text-primary'></i>
                </div>
              </Tooltip>
            </div>
          )}

          {changeStatusPermission && (
            <>
              {data?.status?.unique_id !== 'completed' && (
                <div className='col-auto mb-5 pe-0'>
                  <Tooltip placement='top' title={'Complete'}>
                    <div
                      data-cy='CompleteWorkOrder'
                      className='d-flex align-items-center justify-content-center w-35px h-35px radius-10 cursor-pointer bg-light-success shadow-sm'
                      style={{
                        border: '1px',
                        borderStyle: 'dashed',
                        borderWidth: '1px',
                        borderColor: '#50cc89',
                      }}
                      onClick={handleComplete}
                    >
                      {completeLoading ? (
                        <span className='spinner-border spinner-border-sm text-success' />
                      ) : (
                        <i
                          className='las la-check-circle'
                          style={{color: '#50cc89', fontSize: '20px'}}
                        ></i>
                      )}
                    </div>
                  </Tooltip>
                </div>
              )}
            </>
          )}

          <div className='col-auto mb-5 pe-0'>
            <Tooltip placement='top' title='Process Log'>
              <div className='btn btn-sm btn-primary' onClick={openModalProcessLog}>
                Process Log
              </div>
            </Tooltip>
          </div>
        </div>
      </div>

      <ModalShare setShowModal={setShowModalShare} showModal={showModalShare} data={dataShare} />

      <ModalProcessLog
        setShowModal={setShowModalProcessLog}
        showModal={showModalProcessLog}
        data={dataProcessLog}
      />

      <Alert
        setShowModal={setShowModalConfirmComplete}
        showModal={showModalComplete}
        loading={completeLoading}
        body={messageComplete}
        type={'complete'}
        title={'Complete Work Order'}
        confirmLabel={'Complete'}
        onConfirm={() => {
          confirmCompleteWO()
        }}
        onCancel={() => {
          setShowModalConfirmComplete(false)
        }}
      />
    </>
  )
}

Actions = memo(Actions, (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next))
export default Actions
