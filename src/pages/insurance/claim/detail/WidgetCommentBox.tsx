import {getUserV1} from '@api/UserCRUD'
import {Alert} from '@components/alert'
import TextEditor from '@components/form/TextEditorSun'
import {Select as SelectMultiple} from '@components/select/ajaxMultiple'
import {ToastMessage} from '@components/toast-message'
import {errorExpiredToken, KTSVG} from '@helpers'
import {ErrorMessage, Form, Formik} from 'formik'
import {FC, memo, useEffect, useRef, useState} from 'react'
import {Button, OverlayTrigger, Tooltip} from 'react-bootstrap'
import * as Yup from 'yup'

import {getCommentBox, sendCommentBox} from '../Service'

let WidgetCommentBox: FC<any> = ({id}) => {
  const bottomRef: any = useRef<HTMLDivElement>(null)

  const [tmpParams, setParams] = useState<any>()
  const [reload, setReload] = useState<number>(1)
  const [listChat, setListChat] = useState<any>()
  const [loading, setLoading] = useState<boolean>(false)
  const [hideChat, setHideChat] = useState<boolean>(true)
  const [sendNotify, setSendNotify] = useState<boolean>(false)
  const [reloadComment, setReloadCommet] = useState<boolean>(true)
  const [loadingAlert, setLoadingAlert] = useState<boolean>(false)
  const [loadingHandle, setLoadingHandle] = useState<boolean>(false)
  const [showModalConfirm, setModalConfirm] = useState<boolean>(false)
  const [messageValue, setMessageValue] = useState<any>('<div><br />&nbsp;</div>')

  const msg_alert: any = ['Are you sure to add this message without recipient?']

  const ValidationSchema: any = Yup.object().shape({
    message: Yup.string().required('The message field is required'),
    send_notify: Yup.boolean().nullable(),
    notify_to: Yup.array().test({
      name: 'notify_to',
      test: function () {
        const {notify_to, send_notify}: any = this.parent || {}
        if (send_notify && notify_to?.length === 0) {
          return this.createError({
            message: `User can not be empty`,
          })
        } else {
          return true
        }
      },
    }),
  })

  const handleSubmit = (value: any, {resetForm}: any) => {
    const params: any = {
      message: value?.message || '',
      notify_to: value?.notify_to || [],
      send_notify: sendNotify,
    }
    setParams(params)

    if (params?.notify_to?.length === 0 && !params?.send_notify) {
      setModalConfirm(true)
    } else {
      setLoading(true)

      setLoadingHandle(true)
      sendCommentBox(params, id)
        .then(({data: {message}}: any) => {
          resetForm()
          setLoading(false)
          setSendNotify(false)
          setReload(reload + 1)
          setReloadCommet(false)
          setLoadingHandle(false)
          ToastMessage({message, type: 'success'})
          setMessageValue('<div><br />&nbsp;</div>')
          setTimeout(() => setReloadCommet(true), 100)
        })
        .catch((err: any) => {
          setLoading(false)
          setLoadingHandle(false)
          errorExpiredToken(err)

          const {response}: any = err || {}
          const {devMessage, data, message}: any = response?.data || {}
          const {fields}: any = data || {}

          if (response && !devMessage) {
            if (fields === undefined) {
              ToastMessage({message, type: 'error'})
            }

            if (fields && Object.keys(fields || {})?.length > 0) {
              Object.keys(fields || {})?.map((item: any) => {
                ToastMessage({message: fields?.[item]?.[0] || '', type: 'error'})
                return true
              })
            }
          }
        })
    }
  }

  useEffect(() => {
    id &&
      getCommentBox(id)
        .then(({data: {data: res}}: any) => {
          res && setListChat(res)
        })
        .catch(() => '')
  }, [reload, id])

  useEffect(() => {
    setMessageValue('<div><br />&nbsp;</div>')
  }, [reloadComment])

  const initValue = {
    message: '',
    notify_to: [],
    notify_value: [],
    send_notify: false,
  }

  useEffect(() => {
    if (bottomRef?.current) {
      bottomRef.current.scrollTop = bottomRef?.current?.scrollHeight + 100
    }
  }, [listChat])

  return (
    <Formik
      enableReinitialize
      onSubmit={handleSubmit}
      initialValues={initValue}
      validationSchema={ValidationSchema}
    >
      {({values, setFieldValue, resetForm}: any) => {
        return (
          <Form className='justify-content-center' noValidate>
            <Alert
              type={'delete'}
              body={msg_alert}
              confirmLabel={'Send'}
              loading={loadingAlert}
              title={'Send Message'}
              showModal={showModalConfirm}
              setShowModal={setModalConfirm}
              onConfirm={(e: any) => {
                e?.preventDefault()
                setLoadingAlert(true)

                sendCommentBox(tmpParams, id)
                  .then(({data: {message}}: any) => {
                    setReload(reload + 1)
                    setLoadingAlert(false)
                    setModalConfirm(false)
                    setReloadCommet(false)
                    setMessageValue('<div><br />&nbsp;</div>')
                    setTimeout(() => setReloadCommet(true), 100)
                    ToastMessage({message, type: 'success'})
                    resetForm()
                  })
                  .catch((err: any) => {
                    setLoadingAlert(false)
                    errorExpiredToken(err)
                    const {response}: any = err || {}
                    const {devMessage, data, message}: any = response?.data || {}
                    const {fields}: any = data || {}

                    if (response && !devMessage) {
                      if (fields === undefined) {
                        ToastMessage({message, type: 'error'})
                      }

                      if (fields && Object.keys(fields || {})?.length > 0) {
                        Object.keys(fields || {})?.map((item: any) => {
                          ToastMessage({message: fields?.[item]?.[0] || '', type: 'error'})
                          return true
                        })
                      }
                    }
                  })
              }}
              onCancel={(e: any) => {
                e.preventDefault()
                setModalConfirm(false)
              }}
            />

            <div
              hidden={hideChat}
              className='shadow'
              style={{
                position: 'fixed',
                bottom: '130px',
                right: '20px',
                zIndex: 100,
                width: '400px',
              }}
            >
              <div className='bg-primary p-3 text-light rounded-top'>
                <span className='text-light fw-bolder'>Comment/Query</span>
                <span
                  className='text-light fw-bolder float-end'
                  style={{cursor: 'pointer'}}
                  onClick={() => {
                    setHideChat(true)
                    setReloadCommet(false)
                    setTimeout(() => setReloadCommet(true), 100)
                  }}
                >
                  x
                </span>
              </div>

              <div
                ref={bottomRef}
                className='p-2 bg-white'
                style={{height: '200px', overflowY: 'scroll'}}
              >
                {listChat &&
                  listChat?.length > 0 &&
                  listChat?.map(
                    ({message, notify_to: list_user, created_at, creator}: any, key: any) => {
                      const users: any = list_user?.map(({name}: any) => name || '') as never[]

                      return (
                        <div key={key || 0} className='bg-light p-3 rounded mb-3'>
                          <div className=''>
                            <div className='fw-bold text-capitalize'>{creator?.name || '-'}</div>
                            <div className='text-black-50'>{created_at || '-'}</div>
                          </div>
                          <div className='my-3' dangerouslySetInnerHTML={{__html: message}} />
                          {users?.length !== 0 && (
                            <small>
                              Notified to {users?.length > 1 ? users?.[0] : users?.join(', ')}
                              {users?.length > 1 && (
                                <OverlayTrigger
                                  placement='bottom'
                                  delay={{show: 250, hide: 400}}
                                  overlay={(props: any) => (
                                    <Tooltip
                                      id='tooltip'
                                      className={{
                                        position: 'relative',
                                        zIndex: '1151 !important',
                                      }}
                                      {...props}
                                    >
                                      {users &&
                                        users?.length > 0 &&
                                        users?.map((item: any, key: any) => {
                                          if (key !== 0) {
                                            const cusComma: any =
                                              users?.length - 1 !== key ? ', ' : ' '
                                            return item + cusComma
                                          }
                                          return true
                                        })}
                                    </Tooltip>
                                  )}
                                >
                                  <span style={{fontSize: '10px'}} className='mb-0'>
                                    and <u>{users?.length - 1} others</u>
                                  </span>
                                </OverlayTrigger>
                              )}
                            </small>
                          )}
                        </div>
                      )
                    }
                  )}

                <div className=''>&nbsp;</div>
              </div>

              <div className='p-2 bg-secondary rounded-bottom'>
                <div className='row mt-3 position-relative'>
                  <div className='col' style={{zIndex: 0}}>
                    <div className={`bg-white overflow-auto rounded p-3 pb-15 max-h-300px`}>
                      {!loadingAlert && !loadingHandle && (
                        <TextEditor
                          className=''
                          defaultData={messageValue}
                          options={{className: 'pb-0'}}
                          onChange={(value: any) => {
                            setMessageValue(value || '')
                            setFieldValue('message', value || '')
                          }}
                        />
                      )}
                    </div>
                    <div className='fv-plugins-message-container invalid-feedback'>
                      <ErrorMessage name='message' />
                    </div>
                  </div>
                  <div className={`col-auto ps-0 position-absolute end-0 bottom-0 mb-3 me-2`}>
                    <Button className='btn btn-sm w-100' variant='primary' type='submit'>
                      {!loading && <span className='indicator-label'>Send</span>}
                      {loading && (
                        <span className='indicator-progress' style={{display: 'block'}}>
                          Please wait...
                          <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                        </span>
                      )}
                    </Button>
                  </div>
                </div>

                <div className='py-3'>
                  <label htmlFor='send_notify' className='form-checkform-check-solid'>
                    {!loadingHandle && (
                      <input
                        type='checkbox'
                        name='send_notify'
                        defaultChecked={sendNotify}
                        onChange={() => {
                          setSendNotify(!sendNotify)
                          setFieldValue('send_notify', !sendNotify)
                          if (sendNotify) {
                            setFieldValue('notify_to', [])
                            setFieldValue('notify_value', [])
                          }
                        }}
                        style={{position: 'relative', top: '2px'}}
                      />
                    )}
                    <span className='form-check-label mx-2'>Notify User</span>
                  </label>
                </div>

                <div className='mb-2'>
                  <SelectMultiple
                    isMulti
                    name='notify_to'
                    api={getUserV1}
                    params={false}
                    isDisabled={!sendNotify}
                    placeholder='Select user'
                    defaultValue={values?.notify_value || ''}
                    parse={({guid, first_name, last_name}: any) => ({
                      value: guid || '',
                      label: `${first_name} ${last_name}`,
                    })}
                    onChange={(props: any) => {
                      const value: any = props?.map(({value}: any) => value) || []
                      setFieldValue('notify_to', value)
                      setFieldValue('notify_value', props)
                    }}
                  />
                  <div className='fv-plugins-message-container invalid-feedback'>
                    <ErrorMessage name='notify_to' />
                  </div>
                </div>
              </div>
            </div>

            <Button
              variant='primary'
              className='btn-sm'
              style={{position: 'fixed', zIndex: 100, bottom: '80px', right: '20px'}}
              onClick={(e: any) => {
                e?.preventDefault()

                resetForm()
                setHideChat(!hideChat)
                setReloadCommet(false)
                setTimeout(() => setReloadCommet(true), 100)
              }}
            >
              <KTSVG path='/media/icons/duotone/Communication/Chat.svg' className='svg-icon-2x' />
            </Button>
          </Form>
        )
      }}
    </Formik>
  )
}

WidgetCommentBox = memo(
  WidgetCommentBox,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export default WidgetCommentBox
