/* eslint-disable react-hooks/exhaustive-deps */
import Tooltip from '@components/alert/tooltip'
import {InputTags} from '@components/form/tags'
import TextEditor from '@components/form/TextEditorSun'
import {ToastMessage} from '@components/toast-message'
import {configClass, preferenceDateTime} from '@helpers'
import moment from 'moment'
import {FC, Fragment, useCallback, useEffect, useState} from 'react'
import {Button} from 'react-bootstrap'
import Swal from 'sweetalert2'

import {closeTicket, getConversation, sendForward} from '../Service'
import {sendReplyTicket} from './../Service'
import TicketActions from './TicketActions'
import ModalProcessLog from './TicketProcessLog'

const TicketInteraction: FC<any> = ({
  detailTicket,
  setClassBar,
  classBar,
  dataMessage,
  setdataMessage,
  loadingTextEditor,
  setReloadTicket,
  reloadTicket,
  setShowModalSendEmail,
  setReloadAll,
  reloadAll,
  classBarCannedForms,
  setClassBarCannedForms,
  setShowModalAsigne,
  setShowModalConvertToForum,
}) => {
  const pref_date_time: any = preferenceDateTime()
  const {guid}: any = detailTicket || {}

  const [params] = useState<any>({})
  const [email, setEmail] = useState<any>([])
  const [dataCC, setdataCC] = useState<any>([])
  const [dataBCC, setdataBCC] = useState<any>([])
  const [template, setTemplate] = useState<any>('')
  const [toEmail, setToEmail] = useState<string>('')
  const [showCC, setShowCC] = useState<boolean>(false)
  const [showBCC, setShowBCC] = useState<boolean>(false)
  const [showReply, setShowReply] = useState<boolean>(false)
  const [reloadProcessLog, setReloadProcessLog] = useState(0)
  const [loadingReply, setLoadingReply] = useState<any>(false)
  const [loadingCancel, setLoadingCancel] = useState<any>(false)
  const [closeButton, setCloseButton] = useState<boolean>(false)
  const [showForward, setShowForward] = useState<boolean>(false)
  const [replyLoading, setReplyLoading] = useState<boolean>(false)
  const [loadingForward, setLoadingForward] = useState<any>(false)
  const [dataConversation, setdataConversation] = useState<any>([])
  const [forwardButton, setForwardButton] = useState<boolean>(true)
  const [forwardLoading, setforwardLoading] = useState<boolean>(false)
  const [showModalProcessLog, setShowModalProcessLog] = useState<any>(false)
  const [sortDataConversation, setSortDataConversation] = useState<any>(true)

  const sendReplyButton = useCallback(() => {
    if (detailTicket?.guid !== undefined) {
      setLoadingReply(true)
      const params: any = {
        files: [],
        to_name: '',
        canned_form_guid: '',
        cc_emails: dataCC || [],
        body: dataMessage || '',
        bcc_emails: dataBCC || [],
        to_email: toEmail[0] || '',
        subject: detailTicket?.ticket_id || 'Subject',
      }

      if (dataMessage !== '') {
        sendReplyTicket(detailTicket?.guid, params)
          .then(({data: {message}}: any) => {
            showHideRightBar()
            setLoadingReply(false)
            showHideRightBarCannedForms()
            ToastMessage({type: 'success', message})
            setTimeout(() => setShowReply(false), 1000)
          })
          .catch(({response}: any) => {
            setLoadingForward(false)
            const {data, message} = response?.data?.data || {}
            const {fields} = data || {}
            if (fields !== undefined) {
              Object.keys(fields || {})?.map((key: any) => {
                if (key === 'to_email') {
                  ToastMessage({type: 'error', message: 'email is required'})
                } else {
                  ToastMessage({message: key + ' : ' + fields?.[key]?.[0], type: 'error'})
                }
                return true
              })
            } else {
              ToastMessage({type: 'error', message})
            }
          })
      } else {
        ToastMessage({type: 'error', message: 'message is required'})
      }
    }
  }, [detailTicket, dataBCC, dataMessage, dataCC, toEmail])

  const showHideRightBar = () => {
    setClassBar(classBar === '' ? 'coolclass' : '')
    setClassBarCannedForms('')
  }

  const showHideRightBarCannedForms = () => {
    setClassBarCannedForms(classBarCannedForms === '' ? 'coolclass' : '')
    setClassBar('')
  }

  const procesLog = () => {
    setShowModalProcessLog(true)
    setReloadProcessLog(reloadProcessLog + 1)
  }

  const sortByTime = () => {
    const sorted: any = [...dataConversation]?.sort((a: any, b: any) => (a > b ? 1 : -1))
    setdataConversation(sorted)
    setSortDataConversation(!sortDataConversation)
  }

  const handleCloseTicket = async () => {
    const {value: remarks}: any = await Swal.fire({
      imageUrl: '/images/alert.png',
      imageWidth: 65,
      imageHeight: 60,
      imageAlt: 'Close Alert',
      title: 'Alert',
      input: 'textarea',
      inputLabel: 'Remarks *',
      inputPlaceholder: 'Type remarks here',
      inputAttributes: {
        'aria-label': 'Type remarks here',
      },
      html:
        '<p>Are you sure to close the ticket?</p>' +
        '<i>Reporter will be notified when this ticket is closed</i>',
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonColor: '#050990',
      confirmButtonText: 'Yes',
      inputValidator: (value: any) => {
        return new Promise((resolve: any) => {
          if (value?.length === 0) {
            resolve('Remarks is required')
          } else {
            resolve('')
          }
        })
      },
    })

    if (remarks) {
      const {guid}: any = detailTicket || {}
      const params: any = {
        close_remarks: remarks || '',
      }

      closeTicket(guid, params)
        .then(({data: {message}}: any) => {
          setReloadTicket(reloadTicket + 1)
          ToastMessage({type: 'success', message})
        })
        .catch(({response}: any) => {
          setLoadingForward(false)
          const {data, message} = response?.data?.data || {}
          const {fields} = data || {}

          if (fields !== undefined) {
            Object.keys(fields || {})?.map((key: any) => {
              ToastMessage({message: key + ' : ' + (fields?.[key]?.[0] || ''), type: 'error'})
              return true
            })
          } else {
            ToastMessage({type: 'error', message})
          }
        })
    }
  }

  const cancelButton = () => {
    setLoadingCancel(true)
    setTimeout(() => {
      setEmail([])
      setdataCC([])
      setdataBCC([])
      setTemplate('')
      setdataMessage('')
      setShowReply(false)
      setShowForward(false)
      setLoadingCancel(false)
    }, 1000)
  }

  const saveButton = () => {
    const {guid}: any = detailTicket || {}

    if (guid !== undefined) {
      setLoadingForward(true)
      const params: any = {
        recipients: email || [],
        cc_emails: dataCC || [],
        body: dataMessage || '',
        bcc_emails: dataBCC || [],
      }

      sendForward(guid, params)
        .then(({data: {message}}: any) => {
          setLoadingForward(false)
          ToastMessage({type: 'success', message})
          setTimeout(() => setShowForward(false), 1000)
        })
        .catch(({response}: any) => {
          setLoadingForward(false)
          const {data, message} = response?.data?.data || {}
          const {fields} = data || {}
          if (fields !== undefined) {
            Object.keys(fields || {})?.map((key: any) => {
              if (key === 'to_email') {
                ToastMessage({type: 'error', message: 'email is required'})
              } else {
                ToastMessage({message: key + ' : ' + fields?.[key]?.[0], type: 'error'})
              }
              return true
            })
          } else {
            ToastMessage({type: 'error', message})
          }
        })
    }
  }

  useEffect(() => {
    if (detailTicket?.status_unique_id === 'done') {
      setCloseButton(true)
    }
  }, [detailTicket])

  useEffect(() => {
    if (dataConversation?.length > 0) {
      setForwardButton(false)
    }
  }, [dataConversation])

  useEffect(() => {
    const {guid}: any = detailTicket || {}
    if (guid !== undefined) {
      getConversation(guid, params)
        .then(({data: {data: res}}: any) => {
          res && setdataConversation(res)
        })
        .catch(() => setdataConversation([]))
    }
  }, [detailTicket, loadingForward, loadingReply, params])

  return (
    <>
      <div className='card'>
        <div className='card-body p-5 pt-1'>
          <div className='row'>
            <div className='col-12 row p-0'>
              <button
                className='btn btn-outline btn-outline-primary btn-sm me-2 col-12 col-lg-auto mb-1 text-nowrap'
                style={{height: '35px'}}
                onClick={() => {
                  setTemplate('')
                  setdataMessage('')
                  setShowForward(false)
                  setReplyLoading(true)
                  setShowReply(!showReply)
                  setTimeout(() => setReplyLoading(false), 1500)
                }}
              >
                {replyLoading ? (
                  <span className='spinner-border spinner-border-sm' />
                ) : (
                  <>
                    <i className='fa-solid fa-reply btn-outline-icon'></i>Reply
                  </>
                )}
              </button>

              <button
                className='btn btn-outline btn-outline-primary btn-sm me-2 col-12 col-lg-auto mb-1 text-nowrap'
                style={{height: '35px'}}
                onClick={() => {
                  const lastConversation: any = dataConversation?.[0] || {}
                  if (lastConversation) {
                    const templateMessage: any = (
                      <div className=''>
                        <p className='mb-2'>-------- Forwarded --------</p>
                        <p className='m-0'>
                          From : <span className='fw-bolder'>Support Helpdesk</span> &lt;
                          {lastConversation?.from_email || ''}&gt;
                        </p>
                        <p className='m-0'>
                          Date :{' '}
                          {moment(new Date(lastConversation?.created_at || '')).format(
                            'YYYY-MM-DD HH:mm A'
                          )}
                        </p>
                        <p className='m-0'>Subject : {lastConversation?.subject || '-'}</p>
                        <p className='m-0'>To : {lastConversation?.to_email || '-'}</p>
                        <p className='my-2'>---------------------------</p>
                      </div>
                    )
                    setTemplate(templateMessage)
                  }

                  setdataMessage('')
                  setShowReply(false)
                  setforwardLoading(true)
                  setShowForward(!showForward)
                  setTimeout(() => setforwardLoading(false), 1500)
                }}
                disabled={forwardButton}
              >
                {forwardLoading ? (
                  <span className='spinner-border spinner-border-sm' />
                ) : (
                  <>
                    <i className='fa-solid fa-share btn-outline-icon'></i>Forward
                  </>
                )}
              </button>

              <button
                className='btn btn-outline btn-outline-primary btn-sm me-2 col-12 col-lg-auto mb-1 text-nowrap'
                style={{height: '35px'}}
                onClick={handleCloseTicket}
                disabled={closeButton}
              >
                <i className='fa-regular fa-circle-xmark btn-outline-icon'></i>Close
              </button>

              <TicketActions
                detailTicket={detailTicket}
                reloadTicket={reloadTicket}
                setReloadTicket={setReloadTicket}
                setShowModalAsigne={setShowModalAsigne}
                setShowModalEmail={setShowModalSendEmail}
                onScenarioExecuted={() => setReloadAll(!reloadAll)}
                setShowModalConvertToForum={setShowModalConvertToForum}
              />

              <div className='col-sm-12 col-md-2 col-lg-1 mx-5'>&nbsp;</div>

              <button
                onClick={procesLog}
                className='btn btn-outline btn-outline-primary btn-sm float-end col-12 col-lg-auto mb-1 ms-auto text-nowrap'
                style={{height: '35px'}}
              >
                <i className='fas fa-clock me-1 btn-outline-icon'></i>Process Log
              </button>
            </div>

            <div className='col-12 mt-5'>
              <button
                onClick={sortByTime}
                className='btn btn-outline btn-outline-primary btn-sm float-end'
              >
                <i
                  className={`text-primary btn-outline-icon las la-arrow-${
                    sortDataConversation ? 'down' : 'up'
                  }`}
                />
                Sort By Time
              </button>
            </div>

            <div className='col-12 float-end'>
              {showForward && (
                <div className='row mt-5 mb-3'>
                  <div className='col-12'>
                    <div className='card border border-gray-300 p-2 rounded'>
                      <div className='row mb-3'>
                        <div className='col-sm-12 col-md-2 col-lg-1'>
                          <div className='fw-bolder text-dark text-end mb-1 mt-2 to-cus'>To :</div>
                        </div>

                        <div className='col-sm-12 col-md-8 col-lg-10'>
                          <InputTags
                            type='email'
                            required={false}
                            placeholder='Enter Email'
                            onChange={(e: any) => setEmail(e)}
                          />
                        </div>

                        <div className='col-sm-12 col-md-2 col-lg-1 mt-2 p-0 cc-bcc-cus'>
                          <span
                            onClick={() => setShowCC(!showCC)}
                            className='cursor-pointer text-dark me-1'
                            style={{fontWeight: 700, fontSize: '14px'}}
                          >
                            Cc
                          </span>
                          <span
                            onClick={() => setShowBCC(!showBCC)}
                            className='cursor-pointer text-dark'
                            style={{fontWeight: 700, fontSize: '14px'}}
                          >
                            Bcc
                          </span>
                        </div>
                      </div>

                      {showCC && (
                        <div className='row mt-3'>
                          <div className='col-sm-12 col-md-2 col-lg-1'>
                            <div className='fw-bolder text-dark text-end mb-1 mt-2 to-cus'>
                              Cc :
                            </div>
                          </div>

                          <div className='col-sm-12 col-md-8 col-lg-10'>
                            <InputTags
                              type='email'
                              required={false}
                              placeholder='Enter Email'
                              onChange={(e: any) => setdataCC(e)}
                            />
                          </div>

                          <div className='col-sm-12 col-md-2 col-lg-1'>&nbsp;</div>
                        </div>
                      )}

                      {showBCC && (
                        <div className='row mt-3'>
                          <div className='col-sm-12 col-md-2 col-lg-1'>
                            <div className='fw-bolder text-dark text-end mb-1 mt-2 to-cus'>
                              Bcc :
                            </div>
                          </div>

                          <div className='col-sm-12 col-md-8 col-lg-10'>
                            <InputTags
                              type='email'
                              required={false}
                              placeholder='Enter Email'
                              onChange={(e: any) => setdataBCC(e)}
                            />
                          </div>

                          <div className='col-sm-12 col-md-2 col-lg-1'>&nbsp;</div>
                        </div>
                      )}

                      <div className='row mb-3'>
                        <div className='col-sm-12 col-md-2 col-lg-1'>&nbsp;</div>
                        <div className='col-sm-12 col-md-8 col-lg-10'>
                          {template && (
                            <div className='input-group d-flex flex-column align-items-center input-group-solid mb-3'>
                              <div className={`${configClass?.form} d-flex w-100 pb-0`}>
                                {template}
                              </div>
                            </div>
                          )}
                          <div className='w-100'>
                            <TextEditor
                              id='editor'
                              height={200}
                              placeholder='Enter Message'
                              className='p-1 border border-gray-300 bg-white radius-5'
                              defaultData={dataMessage}
                              loading={loadingTextEditor}
                              setContent={true}
                              onChange={(e: any) => setdataMessage(e)}
                              options={{
                                mode: 'classic',
                                className: 'bg-white',
                              }}
                            />
                          </div>
                        </div>

                        <div className='col-sm-12 col-md-2 col-lg-1'>
                          <Tooltip placement='top' title='Canned Response'>
                            <div
                              data-cy='AttachCannedResponse'
                              className='d-flex align-items-center justify-content-center w-30px h-30px radius-50 cursor-pointer'
                              style={{
                                marginTop: '10px',
                                backgroundColor: '#F5F8FA',
                                border: '1px',
                                borderStyle: 'solid',
                                borderWidth: '1px',
                                borderColor: '#D7DDE3',
                              }}
                              onClick={showHideRightBar}
                            >
                              <i className='las fs-3 la-comment' style={{color: '#535353'}}></i>
                            </div>
                          </Tooltip>

                          <Tooltip placement='top' title='Canned Form'>
                            <div
                              className='d-flex align-items-center justify-content-center w-30px h-30px radius-50 cursor-pointer'
                              style={{
                                marginTop: '10px',
                                backgroundColor: '#F5F8FA',
                                border: '1px',
                                borderStyle: 'solid',
                                borderWidth: '1px',
                                borderColor: '#D7DDE3',
                              }}
                              onClick={showHideRightBarCannedForms}
                            >
                              <i className='fab fa-wpforms' style={{color: '#535353'}}></i>
                            </div>
                          </Tooltip>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className='border-top border-gray-300 pt-4 text-end'></div>

                  <div className='text-end'>
                    <Button
                      type='button'
                      variant='secondary'
                      onClick={cancelButton}
                      className='btn-sm ms-3'
                      disabled={loadingCancel}
                    >
                      {!loadingCancel && <span className='indicator-label'>{'Cancel'}</span>}
                      {loadingCancel && (
                        <span className='indicator-progress' style={{display: 'block'}}>
                          Please wait...
                          <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                        </span>
                      )}
                    </Button>

                    <Button
                      type='button'
                      variant='primary'
                      onClick={saveButton}
                      className='btn-sm ms-3'
                      disabled={loadingForward}
                    >
                      {!loadingForward && <span className='indicator-label'>{'Save'}</span>}
                      {loadingForward && (
                        <span className='indicator-progress' style={{display: 'block'}}>
                          Please wait...
                          <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                        </span>
                      )}
                    </Button>
                  </div>
                </div>
              )}

              {showReply && (
                <div className='row mt-5 mb-3'>
                  <div className='col-12'>
                    <div className='card border border-gray-300 p-2 rounded'>
                      <div className='row mb-3'>
                        <div className='col-sm-12 col-md-2 col-lg-1'>
                          <div className='fw-bolder text-dark text-end mb-1 mt-2 to-cus'>To :</div>
                        </div>

                        <div className='col-sm-12 col-md-8 col-lg-10'>
                          <InputTags
                            type='email'
                            required={false}
                            placeholder='Enter Email'
                            onChange={(e: any) => setToEmail(e)}
                          />
                        </div>

                        <div className='col-sm-12 col-md-2 col-lg-1 mt-2 p-0 cc-bcc-cus'>
                          <span
                            onClick={() => setShowCC(!showCC)}
                            className='cursor-pointer text-dark me-1'
                            style={{fontWeight: 700, fontSize: '14px'}}
                          >
                            Cc
                          </span>
                          <span
                            onClick={() => setShowBCC(!showBCC)}
                            className='cursor-pointer text-dark'
                            style={{fontWeight: 700, fontSize: '14px'}}
                          >
                            Bcc
                          </span>
                        </div>
                      </div>

                      {showCC && (
                        <div className='row mt-3'>
                          <div className='col-sm-12 col-md-2 col-lg-1'>
                            <div className='fw-bolder text-dark text-end mb-1 mt-2 to-cus'>
                              Cc :
                            </div>
                          </div>

                          <div className='col-sm-12 col-md-8 col-lg-10'>
                            <InputTags
                              type='email'
                              required={false}
                              placeholder='Enter Email'
                              onChange={(e: any) => setdataCC(e)}
                            />
                          </div>

                          <div className='col-sm-12 col-md-2 col-lg-1'>&nbsp;</div>
                        </div>
                      )}

                      {showBCC && (
                        <div className='row mt-3'>
                          <div className='col-sm-12 col-md-2 col-lg-1'>
                            <div className='fw-bolder text-dark text-end mb-1 mt-2 to-cus'>
                              Bcc :
                            </div>
                          </div>

                          <div className='col-sm-12 col-md-8 col-lg-10'>
                            <InputTags
                              type='email'
                              required={false}
                              placeholder='Enter Email'
                              onChange={(e: any) => setdataBCC(e)}
                            />
                          </div>

                          <div className='col-sm-12 col-md-2 col-lg-1'>&nbsp;</div>
                        </div>
                      )}

                      <div className='row mb-3'>
                        <div className='col-sm-12 col-md-2 col-lg-1'>&nbsp;</div>

                        <div className='col-sm-12 col-md-8 col-lg-10'>
                          {template && (
                            <div className='input-group d-flex flex-column align-items-center input-group-solid mb-3'>
                              <div className={`${configClass?.form} d-flex w-100 pb-0`}>
                                {template}
                              </div>
                            </div>
                          )}
                          <div className='w-100'>
                            <TextEditor
                              id='editor'
                              height={200}
                              placeholder='Enter Message'
                              className='p-1 border border-gray-300 bg-white radius-5'
                              defaultData={dataMessage}
                              loading={loadingTextEditor}
                              setContent={true}
                              onChange={(e: any) => setdataMessage(e)}
                              options={{
                                mode: 'classic',
                                className: 'bg-white',
                              }}
                            />
                          </div>
                        </div>

                        <div className='col-sm-12 col-md-2 col-lg-1'>
                          <Tooltip placement='top' title='Canned Response'>
                            <div
                              data-cy='AttachCannedResponse'
                              className='d-flex align-items-center justify-content-center w-30px h-30px radius-50 cursor-pointer'
                              style={{
                                marginTop: '10px',
                                backgroundColor: '#F5F8FA',
                                border: '1px',
                                borderStyle: 'solid',
                                borderWidth: '1px',
                                borderColor: '#D7DDE3',
                              }}
                              onClick={showHideRightBar}
                            >
                              <i className='las fs-3 la-comment' style={{color: '#535353'}}></i>
                            </div>
                          </Tooltip>
                          <Tooltip placement='top' title='Canned Form'>
                            <div
                              className='d-flex align-items-center justify-content-center w-30px h-30px radius-50 cursor-pointer'
                              style={{
                                marginTop: '10px',
                                backgroundColor: '#F5F8FA',
                                border: '1px',
                                borderStyle: 'solid',
                                borderWidth: '1px',
                                borderColor: '#D7DDE3',
                              }}
                              onClick={showHideRightBarCannedForms}
                            >
                              <i className='fab fa-wpforms' style={{color: '#535353'}}></i>
                            </div>
                          </Tooltip>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className='border-top border-gray-300 pt-4 text-end'></div>

                  <div className='text-end'>
                    <Button
                      type='button'
                      variant='secondary'
                      onClick={cancelButton}
                      className='btn-sm ms-3'
                      disabled={loadingCancel}
                    >
                      {!loadingCancel && <span className='indicator-label'>{'Cancel'}</span>}
                      {loadingCancel && (
                        <span className='indicator-progress' style={{display: 'block'}}>
                          Please wait...
                          <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                        </span>
                      )}
                    </Button>

                    <Button
                      type='button'
                      variant='primary'
                      disabled={loadingReply}
                      className='btn-sm ms-3'
                      onClick={sendReplyButton}
                    >
                      {!loadingReply && <span className='indicator-label'>{'Send'}</span>}
                      {loadingReply && (
                        <span className='indicator-progress' style={{display: 'block'}}>
                          Please wait...
                          <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                        </span>
                      )}
                    </Button>
                  </div>
                </div>
              )}

              {dataConversation?.length === 0 && !showForward && !showReply && (
                <div className='h-500px'>&nbsp;</div>
              )}

              <div className='row mt-5'>
                {dataConversation &&
                  dataConversation?.length > 0 &&
                  dataConversation?.map((item: any, index: any) => {
                    const {subject, created_at, to_email, body, to_name, type}: any = item || {}
                    const isForward: boolean = subject?.includes('Fwd: ')
                    const messageDate: any = moment(created_at || '')?.fromNow()

                    return (
                      <Fragment key={index}>
                        <div
                          className='row border bg-primary'
                          style={{
                            borderTopLeftRadius: '15px',
                            borderTopRightRadius: '15px',
                          }}
                        >
                          <div className='col-6 pt-4 pb-3 text-white fw-bolder'>AssetData.io</div>

                          <div
                            style={{fontSize: '11px'}}
                            className='col-6 pt-4 pb-3 text-white text-end'
                          >
                            {messageDate || ''}
                          </div>
                        </div>

                        <div
                          key={index || 0}
                          className='row border mb-5 py-5'
                          style={{
                            borderBottomLeftRadius: '15px',
                            borderBottomRightRadius: '15px',
                          }}
                        >
                          <div className='col-12'>
                            <div className='mb-5'>
                              <span style={{color: '#050990'}}>
                                {to_name ||
                                  (isForward ? JSON.parse(to_email || '')?.join(', ') : to_email) ||
                                  '-'}
                              </span>{' '}
                              <span className='fw-bold fst-italic ms-2 text-gray-500 text-capitalize'>
                                ~ {type || ''} ~
                              </span>
                              <br />
                              <i style={{fontSize: '11px'}}>
                                {messageDate || ''} ({' '}
                                {moment(created_at || '')?.format(pref_date_time)} )
                              </i>
                            </div>
                          </div>
                          <div
                            className='col-12'
                            dangerouslySetInnerHTML={{__html: body || ''}}
                          ></div>
                        </div>
                      </Fragment>
                    )
                  })}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>
        {`
          @media screen and (max-width: 420px) {
            .to-cus {
              text-align: left !important;
            }
            .cc-bcc-cus {
              padding-left: 10px !important;
            }
          }
        `}
      </style>

      <ModalProcessLog
        guid={guid}
        showModal={showModalProcessLog}
        reloadProcessLog={reloadProcessLog}
        setShowModal={setShowModalProcessLog}
      />
    </>
  )
}

export default TicketInteraction
