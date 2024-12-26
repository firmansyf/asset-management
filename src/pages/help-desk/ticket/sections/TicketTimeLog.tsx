import {Accordion} from '@components/Accordion'
import {Alert as ModalDelete} from '@components/alert'
import Tooltip from '@components/alert/tooltip'
import {ToastMessage} from '@components/toast-message'
import {configClass, errorValidation, IMG} from '@helpers'
import {savePreference} from '@redux'
import {ErrorMessage, Field, Form, Formik} from 'formik'
import moment from 'moment'
import {FC, useEffect, useState} from 'react'
import {Modal} from 'react-bootstrap'
import {shallowEqual, useSelector} from 'react-redux'
import * as Yup from 'yup'

import {addTimeLog, deleteTimeLog, editTimeLog, timeLog} from '../Service'

type TimeLog = {
  showModal: any
  setShowModal: any
  detailTicket: any
  detailLog: any
  setDetailLog: any
  setReload: any
}

const timeLogSchema: any = Yup.object().shape({
  name: Yup.string().required('Summary is required'),
})

const ModalAddEdit: FC<TimeLog> = ({
  detailTicket,
  showModal,
  setShowModal,
  setReload,
  detailLog,
  setDetailLog,
}) => {
  const initialValues: any = {
    name: detailLog?.name || '',
  }
  const onSubmit: any = (value: any) => {
    const {guid} = detailTicket || {}
    if (guid) {
      if (detailLog?.guid) {
        editTimeLog(detailLog?.guid, {ticket_guid: guid, ...value})
          .then(({data: {message}}: any) => {
            ToastMessage({type: 'success', message})
            setShowModal(false)
            setDetailLog({})
            setReload(true)
          })
          .catch((err: any) => {
            Object.values(errorValidation(err)).map((message: any) =>
              ToastMessage({type: 'error', message})
            )
          })
      } else {
        addTimeLog({ticket_guid: guid, ...value})
          .then(({data: {message}}: any) => {
            ToastMessage({type: 'success', message})
            setShowModal(false)
            setReload(true)
          })
          .catch((err: any) => {
            Object.values(errorValidation(err)).map((message: any) =>
              ToastMessage({type: 'error', message})
            )
          })
      }
    }
  }
  return (
    <Modal
      dialogClassName='modal-md'
      show={showModal}
      onHide={() => {
        setShowModal(false)
        setDetailLog({})
      }}
    >
      <Modal.Header closeButton>
        <Modal.Title>Add Time Log</Modal.Title>
      </Modal.Header>
      <Formik
        validationSchema={timeLogSchema}
        initialValues={initialValues}
        validateOnChange
        enableReinitialize
        onSubmit={onSubmit}
      >
        {() => (
          <Form className='justify-content-center' noValidate>
            <Modal.Body>
              <div className='row'>
                <div className='col-12'>
                  <label className='text-uppercase space-3 fw-bolder fs-8 mb-2 px-2 required'>
                    Summary
                  </label>
                  <Field
                    name='name'
                    type='text'
                    placeholder='Enter Summary'
                    className={configClass?.form}
                  />
                  <div className='fv-plugins-message-container invalid-feedback'>
                    <ErrorMessage name='name' />
                  </div>
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <div className='row'>
                <div className='col-12'>
                  <div
                    className='btn btn-sm btn-light me-2'
                    onClick={() => {
                      setShowModal(false)
                      setDetailLog({})
                    }}
                  >
                    Cancel
                  </div>
                  <button type='submit' className='btn btn-sm btn-primary'>
                    <i className='fas fa-check me-1' />
                    Save
                  </button>
                </div>
              </div>
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </Modal>
  )
}

type Props = {
  detailTicket: any
  user: any
}

const TicketTimeLog: FC<Props> = ({detailTicket, user}) => {
  const preference: any = useSelector(({preference}: any) => preference, shallowEqual)
  const {activeLog: storage}: any = preference || {}
  const [data, setData] = useState<any>([])
  const [detail, setDetail] = useState<any>({})
  const [play, setPlay] = useState<any>(storage?.guid ? 'stop' : 'start')
  const [showModalAddEdit, setShowModalAddEdit] = useState<any>(false)
  const [showModalDelete, setShowModalDelete] = useState<any>(false)
  const [reload, setReload] = useState<any>(false)
  const [activeLog, setActiveLog] = useState<any>(storage || {})
  const [totalTime, setTotalTime] = useState<any>('00:00:00')
  const [ticketTotalTime, setTicketTotalTime] = useState<any>({})
  const [loadingSubmitBtn, setLoadingSubmitBtn] = useState<boolean>(false)
  const [reloadTimes, setReloadTimes] = useState<number>(0)

  useEffect(() => {
    let params: any = {}
    if (detailTicket?.guid !== undefined) {
      params = {...params, 'filter[ticket_guid]': detailTicket?.guid}
    }

    timeLog(params).then(({data: {data: res, total_time}}: any) => {
      if (totalTime) {
        setTicketTotalTime(total_time)
      }
      if (res) {
        setData(res)
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [detailTicket?.guid, reload, reloadTimes])

  useEffect(() => {
    if (!preference?.activeLog?.guid) {
      setPlay('start')
      setActiveLog({})
    } else if (preference?.activeLog?.guid) {
      setActiveLog(preference?.activeLog)
      setPlay('stop')
      setData(
        (prev: any) =>
          prev?.map((m: any) => {
            if (m?.guid === preference?.activeLog?.guid) {
              m = preference?.activeLog
            }
            return m
          })
      )
    }
  }, [preference?.activeLog, storage?.guid])

  useEffect(() => {
    let mapTotalTime: any = data?.map(({time}: any) => time)
    if (mapTotalTime?.length > 0) {
      mapTotalTime = mapTotalTime?.map((m: any) => {
        const times: any = m?.split(':')
        const hour: any = parseInt(times?.[0] || 0)
        const minute: any = parseInt(times?.[1] || 0)
        const second: any = parseInt(times?.[2] || 0)
        return {hour, minute, second}
      })
      const hour: any = mapTotalTime.reduce((a: any, {hour}: any) => a + hour, 0)
      const minute: any = mapTotalTime.reduce((a: any, {minute}: any) => a + minute, 0)
      const second: any = mapTotalTime.reduce((a: any, {second}: any) => a + second, 0)
      setTotalTime(moment().set({hour, minute, second}).format('HH:mm:ss'))
    }
  }, [data])

  const startSop: any = (m: any, playState: any) => {
    if (play === 'start' || playState === 'start') {
      setPlay('stop')
      setActiveLog(m)
      savePreference({activeLog: m})
    } else {
      setPlay('start')
      setActiveLog({})
      const dispatchArray: any = {
        timezone: [],
        date_format: [],
        time_format: [],
        country: [],
        currency: [],
        preference: [],
        userIdleTimer: null,
        userInactiveTimer: null,
        activeLog: {
          guid: '',
          name: '',
          ticket_guid: '',
          user_guid: '',
          created_at: '',
          updated_at: '',
          user_name: '',
          submitter_logtime: 0,
          all_time: {
            days: '',
            hours: '',
            minutes: '',
          },
          time: '',
        },
        activeLogWO: {
          time_log: '',
        },
      }
      savePreference({activeLog: dispatchArray})
    }
  }

  const confirmDelete = (guid: any) => {
    setLoadingSubmitBtn(true)
    deleteTimeLog(guid)
      .then(({data: {message}}: any) => {
        setDetail({})
        setLoadingSubmitBtn(false)
        setReload(!reload)
        setShowModalDelete(false)
        ToastMessage({type: 'success', message})
      })
      .catch((err: any) => {
        setLoadingSubmitBtn(false)
        setShowModalDelete(false)
        Object.values(errorValidation(err)).map((message: any) =>
          ToastMessage({type: 'error', message})
        )
      })
  }

  useEffect(() => {
    setTimeout(() => {
      setReloadTimes(reloadTimes + 1)
    }, 300000) // = 5 minute
  })

  return (
    <>
      <div className='card border border-gray-300 mt-5'>
        <div className='card-body align-items-center p-0'>
          <Accordion id='timeLog' default='log'>
            <div className='' data-value='log' data-label='Time Log'>
              {data?.length ? (
                <div className='row'>
                  <div className='col-12'>
                    <div className='p-3 bg-light rounded'>
                      <p className='m-0'>Total time tracked :</p>
                      <h1 className='m-0'>
                        {ticketTotalTime?.days > 0 ||
                        ticketTotalTime?.hours > 0 ||
                        ticketTotalTime?.minutes > 0 ? (
                          <div>
                            {ticketTotalTime?.days > 0 ? `${ticketTotalTime?.days}d ` : ''}
                            {ticketTotalTime?.hours}
                            {'h '}
                            {ticketTotalTime?.minutes}
                            {'m '}
                            <span style={{fontSize: '12px'}}>Logged</span>
                          </div>
                        ) : (
                          <span style={{fontSize: '12px'}}>No time logged</span>
                        )}
                        {/* {totalTime || '00:00:00'} */}
                      </h1>
                      <div
                        className='btn btn-sm btn-primary mt-2'
                        onClick={() => setShowModalAddEdit(true)}
                      >
                        <i className='las la-plus me-1' /> Add Time Log
                      </div>
                    </div>
                  </div>
                  <div className='col-12'>
                    <div className='row overflow-auto' style={{maxHeight: '50vh'}}>
                      {data?.map((m: any, index: number) => (
                        <div className='col-12 mt-4' key={index}>
                          <div className='p-3 bg-light rounded'>
                            <div className='d-flex align-items-center'>
                              <div className=''>
                                <h5 className='m-0 text-capitalize'>{m?.name}</h5>
                                <div className='text-danger fw-bolder fs-7'>{m?.time}</div>
                                <div className='d-flex align-items-center mt-2'>
                                  <IMG
                                    path={'/images/blank.png'}
                                    className='h-20px rounded-circle me-2'
                                  />
                                  <p className='m-0 fw-bold'>{m?.user_name}</p>
                                </div>
                              </div>
                              <div className='ms-auto'>
                                {m?.user_guid === user?.guid && activeLog?.guid === m?.guid ? (
                                  <div
                                    className={`btn btn-icon ${
                                      play === 'start' ? 'btn-success' : 'btn-danger'
                                    } w-25px h-25px rounded-circle`}
                                    onClick={() => startSop(m, play)}
                                  >
                                    <i
                                      className={`las la-${
                                        play === 'start' ? 'play' : 'stop'
                                      } fs-3`}
                                    />
                                  </div>
                                ) : m?.user_guid === user?.guid ? (
                                  <div
                                    className={`btn btn-icon btn-success w-25px h-25px rounded-circle`}
                                    onClick={() => startSop(m, 'start')}
                                  >
                                    <i className={`las la-play fs-3`} />
                                  </div>
                                ) : (
                                  <div className='btn btn-icon bg-gray-300 w-25px h-25px rounded-circle'>
                                    <i className='las la-play fs-3' />
                                  </div>
                                )}
                              </div>
                            </div>
                            {m?.user_guid === user?.guid && (
                              <div className='d-flex align-items-center justify-content-end mt-2 pt-2 border-top border-top-2 border-gray-300'>
                                <div className='me-2'>
                                  <Tooltip placement='top' title='Edit Summary'>
                                    <div
                                      className='btn btn-icon btn-light-warning border border-dashed border-warning w-20px h-20px rounded'
                                      onClick={() => {
                                        setDetail(m)
                                        setShowModalAddEdit(true)
                                      }}
                                    >
                                      <i className='las la-pencil-alt fs-6' />
                                    </div>
                                  </Tooltip>
                                </div>
                                <div className=''>
                                  <Tooltip placement='top' title='Delete Timelog'>
                                    <div
                                      className='btn btn-icon btn-light-danger border border-dashed border-danger w-20px h-20px rounded'
                                      onClick={() => {
                                        setDetail(m)
                                        setShowModalDelete(true)
                                      }}
                                    >
                                      <i className='las la-trash-alt fs-6' />
                                    </div>
                                  </Tooltip>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className='row'>
                  <div className='col-12 mb-3'>
                    Start tracking the time you spend on this ticket
                  </div>
                  <div className='col-12'>
                    <div
                      className='btn btn-sm btn-primary'
                      onClick={() => setShowModalAddEdit(true)}
                    >
                      <i className='las la-plus me-1' /> Add Time Log
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Accordion>
        </div>
      </div>
      <ModalAddEdit
        showModal={showModalAddEdit}
        setShowModal={setShowModalAddEdit}
        detailTicket={detailTicket}
        detailLog={detail}
        setDetailLog={setDetail}
        setReload={() => setReload(!reload)}
      />
      <ModalDelete
        showModal={showModalDelete}
        setShowModal={setShowModalDelete}
        loading={loadingSubmitBtn}
        type={'delete'}
        key='delete'
        title={'Delete Time Log'}
        confirmLabel={'Delete'}
        body={
          <div className=''>
            Are you sure want to delete <span className='fw-bolder'>{detail?.name}</span> ?
          </div>
        }
        onConfirm={() => confirmDelete(detail?.guid)}
        onCancel={() => setShowModalDelete(false)}
      />
    </>
  )
}

export default TicketTimeLog
