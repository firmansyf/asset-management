/* eslint-disable react-hooks/exhaustive-deps */
import 'react-datetime/css/react-datetime.css'

import {AddInputBtn} from '@components/button/Add'
import TextEditor from '@components/form/TextEditorSun'
import {PageLoader} from '@components/loader/cloud'
import {Select as Ajax} from '@components/select/ajax'
import {Select as SelectOpt} from '@components/select/select'
import {SelectMultiple} from '@components/select-multiple'
import {ToastMessage} from '@components/toast-message'
import {configClass, errorValidation, preferenceDate} from '@helpers'
import {ScrollTopComponent} from '@metronic/assets/ts/components'
import {AddEditTags} from '@pages/help-desk/tags/AddEditTags'
import {TicketAddFile} from '@pages/help-desk/ticket/sections/TicketAddFile'
import {
  addTicket,
  editTicket,
  getListType,
  getPriority,
  getReportChannel,
  getReporter,
} from '@pages/help-desk/ticket/Service'
import {ErrorMessage, Field, Form, Formik} from 'formik'
import {find, orderBy, set} from 'lodash'
import moment from 'moment'
import {FC, useEffect, useState} from 'react'
import {Button, Modal} from 'react-bootstrap'
import Datetime from 'react-datetime'
import {useIntl} from 'react-intl'
import {useNavigate} from 'react-router-dom'

type AddEditTicketProps = {
  showModal: any
  setShowModal: any
  setReloadTicket: any
  reloadTicket: any
  ticketDetail: any
  ticketSchema: any
  checkType: any
  checkPriority: any
  otherReportChanel: any
  setOtherReportChanel: any
  setContactDetail: any
  setShowModalContact: any
  dataTags?: any
  reloadContact?: any
  setReloadTags?: any
  reloadTags?: any
  setTypeDetail: any
  setShowModalType: any
}

const AddEditTicket: FC<AddEditTicketProps> = ({
  showModal,
  setShowModal,
  setReloadTicket,
  reloadTicket,
  ticketDetail,
  ticketSchema,
  checkType,
  checkPriority,
  otherReportChanel,
  setOtherReportChanel,
  setContactDetail,
  setShowModalContact,
  dataTags,
  reloadContact,
  setReloadTags,
  reloadTags,
  setTypeDetail,
  setShowModalType,
}) => {
  const intl = useIntl()
  const navigate = useNavigate()
  const pref_date: any = preferenceDate()
  const [loadingTicket, setLoadingTicket] = useState<boolean>(false)
  const [showReportChanel, setShowReportChanel] = useState<boolean>(false)
  const [validation, setValidation] = useState<any>()
  const [showModalAddTags, setShowModalAddTags] = useState<boolean>(false)
  const [priorityOption, setPriorityOption] = useState<any>([])
  const [reportChannelOption, setReportChannelOption] = useState<any>([])
  const [errForm, setErrForm] = useState<any>(true)
  const require_filed_message: any = intl.formatMessage({id: 'MANDATORY_FORM_MESSAGE'})
  const [formIsLoading, setFormIsLoading] = useState<boolean>(true)
  const [redirect, setRedirect] = useState<boolean>(false)
  const [resGuid, setResGuid] = useState<string>('')

  const successMessage = (message: any) => {
    setTimeout(() => ToastMessage({type: 'clear'}), 300)
    setTimeout(() => ToastMessage({type: 'success', message}), 400)
  }

  const handleOnSubmit = (values: any, actions: any) => {
    setLoadingTicket(true)
    const {tag}: any = values || {}

    let params: any = {
      name: values?.name || '',
      type_guid: values?.type_guid,
      reporter_guid: values?.reporter_guid,
      priority_guid: values?.priority_guid || '',
      report_channel_guid: values?.report_channel_guid || '',
      due_time: values?.due_time
        ? moment(ticketDetail?.due_time).format(pref_date) === values?.due_time
          ? ticketDetail?.due_time
          : moment(values?.due_time).format('YYYY-MM-DD HH:mm:ss')
        : '',
      description: values?.description || '',
      files: values?.files || [],
      tags: tag || '',
    }

    if (otherReportChanel || values?.report_channel_guid === ticketDetail?.report_channel_guid) {
      params = {...params, report_channel_other: values?.report_channel_other || ''}
    }

    if (ticketDetail) {
      const {guid} = ticketDetail
      editTicket(params, guid)
        .then(({data: {message}}: any) => {
          setLoadingTicket(false)
          setShowModal(false)
          successMessage(message)
          setReloadTicket(reloadTicket + 1)
        })
        .catch((err: any) => {
          setLoadingTicket(false)
          const {data} = err?.response?.data
          if (data.fields !== undefined) {
            actions.setFieldError('location', data?.fields?.name)
            const error = data?.fields
            for (const key in error) {
              const value = error[key]
              ToastMessage({type: 'error', message: value?.[0]})
            }
          } else {
            ToastMessage({type: 'error', message: err?.response?.data?.message})
          }
        })
    } else {
      addTicket(params)
        .then(({data: {message, data}}: any) => {
          const {guid}: any = data || {}
          setLoadingTicket(false)
          setShowModal(false)
          successMessage(message)
          setReloadTicket(reloadTicket + 1)
          setResGuid(guid)
          setTimeout(() => {
            setRedirect(true)
          }, 2000)
        })
        .catch((err: any) => {
          setLoadingTicket(false)
          setValidation(errorValidation(err))
          if (err?.response) {
            const {data} = err?.response?.data
            if (data?.fields !== undefined) {
              actions.setFieldError('location', data?.fields?.name)
              const error = data?.fields
              for (const key in error) {
                const value = error[key]
                ToastMessage({type: 'error', message: value?.[0]})
              }
            } else {
              ToastMessage({type: 'error', message: err?.response?.data?.message})
            }
          }
        })
    }
  }

  useEffect(() => {
    redirect && navigate(`/help-desk/ticket/detail/${resGuid}`)
  }, [redirect])

  useEffect(() => {
    if (showModal) {
      setFormIsLoading(true)
      setTimeout(() => {
        setFormIsLoading(false)
      }, 500)
    }
  }, [showModal])

  const closeModal = () => {
    setShowModal(false)
    setShowReportChanel(false)
    setOtherReportChanel(false)
    setLoadingTicket(false)
    setErrForm(true)
    setFormIsLoading(true)
    ToastMessage({type: 'clear'})
  }

  useEffect(() => {
    if (ticketDetail) {
      setShowReportChanel(true)
    }
  }, [ticketDetail])

  useEffect(() => {
    if (ticketDetail?.report_channel_unique_id === 'other') {
      setOtherReportChanel(true)
    }
  }, [ticketDetail, setOtherReportChanel])

  const initialValues: any = {
    name: ticketDetail?.name || '',
    reporter_guid: ticketDetail?.reporter_guid || '',
    type_guid: ticketDetail?.type_guid || '',
    due_time: ticketDetail?.due_time ? moment(ticketDetail?.due_time).format(pref_date) : '',
    priority_guid: ticketDetail?.priority_guid || '',
    report_channel_guid: ticketDetail?.report_channel_guid || '',
    description: ticketDetail?.description || '',
    report_channel_other: ticketDetail?.report_channel_other || '',
    tag: ticketDetail?.tags?.map(({guid}: any) => guid) || [],
    tags:
      ticketDetail?.tags?.map(({guid, name}: any) => {
        return {value: guid, label: name}
      }) || [],
  }

  useEffect(() => {
    getPriority({})
      .then(({data: {data: res}}: any) => {
        if (res) {
          const data_priority = orderBy(res, 'order', 'desc')
          setPriorityOption(
            data_priority.map((item: any) => ({value: item?.guid, label: item?.name}))
          )
        }
      })
      .catch(() => '')

    getReportChannel({})
      .then(({data: {data: res}}: any) => {
        if (res) {
          set(find(res, {unique_id: 'other'}), 'name', 'Other')
          setReportChannelOption(res.map((item: any) => ({value: item?.guid, label: item?.name})))
        }
      })
      .catch(() => '')
  }, [])

  return (
    <>
      <Modal dialogClassName='modal-lg' size='lg' show={showModal} onHide={() => closeModal()}>
        <Formik
          initialValues={initialValues}
          enableReinitialize
          validationSchema={ticketSchema}
          onSubmit={(values: any, actions: any) => handleOnSubmit(values, actions)}
        >
          {({values, setFieldValue, setSubmitting, isSubmitting, errors, isValidating}) => {
            if (isSubmitting && errForm && Object.keys(errors || {})?.length > 0) {
              ToastMessage({
                message: require_filed_message,
                type: 'error',
              })
              setErrForm(false)
              setSubmitting(false)
            }
            if (isSubmitting && isValidating && !errForm && Object.keys(errors || {})?.length > 0) {
              ToastMessage({
                message: require_filed_message,
                type: 'error',
              })
              setErrForm(false)
            }

            if (isSubmitting && Object.keys(errors || {})?.length > 0) {
              ScrollTopComponent.goTop()
              return false
            }

            return (
              <Form className='justify-content-center' noValidate>
                <Modal.Header>
                  <Modal.Title>{ticketDetail ? 'Edit' : 'Add'} Ticket</Modal.Title>
                </Modal.Header>
                {formIsLoading ? (
                  <div className='row'>
                    <div className='col-12 text-center'>
                      <PageLoader height={250} />
                    </div>
                  </div>
                ) : (
                  <Modal.Body>
                    <div className='row'>
                      <div className='col-md-6 mb-4'>
                        <div className='mb-4'>
                          <label htmlFor='name' className={`${configClass.label} required`}>
                            Ticket Name
                          </label>
                          <Field
                            type='text'
                            name='name'
                            placeholder='Enter Ticket Name'
                            className={configClass?.form}
                          />
                          <div className='fv-plugins-message-container invalid-feedback'>
                            <ErrorMessage name='name' />
                          </div>
                        </div>

                        {checkType?.is_selected && (
                          <div className='mb-4'>
                            {checkType?.is_required && (
                              <label
                                htmlFor='type_guid'
                                className={`${configClass.label} required`}
                              >
                                Type Ticket
                              </label>
                            )}
                            {!checkType?.is_required && (
                              <label htmlFor='type_guid' className={`${configClass.label}`}>
                                Type Ticket
                              </label>
                            )}
                            <div className='d-flex align-items-center input-group input-group-solid'>
                              <Ajax
                                sm={true}
                                className='col p-0'
                                name='type_guid'
                                api={getListType}
                                params={{orderCol: 'name', orderDir: 'asc'}}
                                reload={false}
                                isClearable={false}
                                placeholder='Select Type Ticket'
                                defaultValue={{
                                  value: ticketDetail?.type_guid,
                                  label: ticketDetail?.type_name,
                                }}
                                onChange={(e: any) => {
                                  setFieldValue('type_guid', e?.value || '')
                                }}
                                parse={(e: any) => {
                                  return {
                                    value: e?.guid,
                                    label: e?.name,
                                  }
                                }}
                              />
                              <AddInputBtn
                                size={configClass.size}
                                onClick={() => {
                                  setTypeDetail(undefined)
                                  setShowModalType(true)
                                }}
                              />
                            </div>
                            {checkType?.is_required && (
                              <div className='fv-plugins-message-container invalid-feedback'>
                                <ErrorMessage name='type_guid' />
                              </div>
                            )}
                          </div>
                        )}

                        {checkPriority?.is_selected && (
                          <div className='mb-4'>
                            {checkPriority?.is_required && (
                              <label
                                htmlFor='priority_guid'
                                className={`${configClass.label} required`}
                              >
                                Priority
                              </label>
                            )}
                            {!checkPriority?.is_required && (
                              <label htmlFor='priority_guid' className={`${configClass.label}`}>
                                Priority
                              </label>
                            )}
                            <SelectOpt
                              sm={true}
                              className='col p-0'
                              data={priorityOption}
                              name='priority_guid'
                              placeholder={`Select Priority`}
                              defaultValue={
                                ticketDetail?.priority_guid !== null
                                  ? ticketDetail?.priority_guid
                                  : ''
                              }
                              onChange={({value}: any) => {
                                setFieldValue('priority_guid', value || '')
                              }}
                            />
                            {checkPriority?.is_required && (
                              <div className='fv-plugins-message-container invalid-feedback'>
                                <ErrorMessage name='priority_guid' />
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      <div className='col-md-6 mb-4'>
                        <div className='mb-4'>
                          <label
                            htmlFor='reporter_guid'
                            className={`${configClass.label} required`}
                          >
                            Reporter
                          </label>
                          <div className='d-flex align-items-center input-group input-group-solid'>
                            <Ajax
                              sm={true}
                              className='col p-0'
                              name='reporter_guid'
                              api={getReporter}
                              params={{orderCol: 'name', orderDir: 'asc'}}
                              isClearable={false}
                              reload={reloadContact}
                              placeholder='Select Reporter'
                              defaultValue={{
                                value: ticketDetail?.reporter_guid,
                                label: ticketDetail?.reporter_name || '-',
                              }}
                              onChange={(e: any) => {
                                setFieldValue('reporter_guid', e?.value || '')
                                if (e.value) {
                                  setShowReportChanel(true)
                                } else {
                                  setShowReportChanel(false)
                                  setOtherReportChanel(false)
                                }
                              }}
                              parse={(e: any) => {
                                return {
                                  value: e?.guid,
                                  label: e?.name,
                                }
                              }}
                            />
                            <AddInputBtn
                              size={configClass.size}
                              onClick={() => {
                                setContactDetail(undefined)
                                setShowModalContact(true)
                              }}
                            />
                          </div>
                          <div className='fv-plugins-message-container invalid-feedback'>
                            <ErrorMessage name='reporter_guid' />
                          </div>
                        </div>

                        <div className='mb-4'>
                          <label htmlFor='due_time' className={`${configClass.label}`}>
                            Due Time
                          </label>
                          <div className='input-group input-group-solid'>
                            <span className='input-group-text pe-0'>
                              <i className='fa fa-calendar-alt text-primary'></i>
                            </span>
                            <Datetime
                              closeOnSelect
                              inputProps={{
                                autoComplete: 'off',
                                className: configClass?.form,
                                name: 'due_time',
                                placeholder: 'Select Due Time ',
                                readOnly: true,
                              }}
                              initialValue={initialValues.due_time}
                              onChange={(e: any) => {
                                const m = moment(e).format('YYYY-MM-DD')
                                setFieldValue('due_time', m)
                              }}
                              dateFormat={pref_date}
                              timeFormat={false}
                            />
                          </div>
                        </div>

                        <div className='mb-4'>
                          <label htmlFor='tags' className={`${configClass.label}`}>
                            Tags
                          </label>
                          <div className='d-flex w-100'>
                            <div className='col-md-10 ms-3'>
                              <SelectMultiple
                                options={dataTags}
                                className='col p-0'
                                inputId='tag'
                                name='tag'
                                placeholder='Enter Tags'
                                defaultValue={values?.tags}
                                onChange={(value: any) => {
                                  const type = value ? value.map((val: any) => val.value) : []
                                  setFieldValue('tag', type)
                                  setFieldValue('tags', value)
                                }}
                              />
                            </div>
                            <div
                              className='col-md-2'
                              style={{
                                paddingTop: '6px',
                                paddingLeft: '15px',
                                background: '#f5f8fa',
                                marginLeft: '-10px',
                                marginBottom: '4px',
                                borderRadius: '0.475rem',
                              }}
                            >
                              <AddInputBtn
                                size={configClass.size}
                                onClick={() => setShowModalAddTags(true)}
                              />
                            </div>
                          </div>
                        </div>

                        {(showReportChanel || ticketDetail?.reporter_guid) && (
                          <div className='mb-4'>
                            <label htmlFor='report_channel_guid' className={`${configClass.label}`}>
                              Report Channel
                            </label>
                            <SelectOpt
                              sm={true}
                              className='col p-0'
                              data={reportChannelOption}
                              name='report_channel_guid'
                              placeholder={`Select Report Channel`}
                              defaultValue={
                                ticketDetail?.report_channel_guid !== null
                                  ? ticketDetail?.report_channel_guid
                                  : ''
                              }
                              onChange={(e: any) => {
                                setOtherReportChanel(e.label === 'Other' ? true : false)
                                setFieldValue('report_channel_guid', e.value)
                              }}
                            />
                          </div>
                        )}

                        {((otherReportChanel && showReportChanel) ||
                          ticketDetail?.report_channel_unique_id === 'other') && (
                          <div className='mb-4'>
                            <label
                              htmlFor='report_channel_other'
                              className={`${configClass.label} required`}
                            >
                              Other Report Channel
                            </label>
                            <Field
                              type='text'
                              name='report_channel_other'
                              placeholder='Enter Reporter Channel'
                              className={configClass?.form}
                            />
                            <div className='fv-plugins-message-container invalid-feedback'>
                              <ErrorMessage name='report_channel_other' />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className='row'>
                      <div className='col-md-12'>
                        <div className='mb-4'>
                          <label htmlFor='description' className={`${configClass.label} required`}>
                            Description
                          </label>
                          <TextEditor
                            id='editor'
                            options={{minHeight: '150px'}}
                            placeholder='Enter Description Here'
                            defaultData={values?.description}
                            onChange={(e: any) => setFieldValue('description', e)}
                            setContent={false}
                          />
                        </div>
                        <div className='fv-plugins-message-container invalid-feedback'>
                          <ErrorMessage name='description' />
                        </div>
                      </div>
                      <div className='col-md-12'>
                        <TicketAddFile
                          validation={validation}
                          setFieldValue={setFieldValue}
                          files={ticketDetail?.files}
                        />
                      </div>
                    </div>
                  </Modal.Body>
                )}

                <Modal.Footer>
                  <Button
                    disabled={loadingTicket}
                    className='btn-sm'
                    type='submit'
                    variant='primary'
                  >
                    {!loadingTicket && (
                      <span className='indicator-label'>{ticketDetail ? 'Save' : 'Add'}</span>
                    )}
                    {loadingTicket && (
                      <span className='indicator-progress' style={{display: 'block'}}>
                        Please wait...
                        <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                      </span>
                    )}
                  </Button>
                  <Button className='btn-sm' variant='secondary' onClick={() => closeModal()}>
                    Cancel
                  </Button>
                </Modal.Footer>
              </Form>
            )
          }}
        </Formik>
      </Modal>

      <AddEditTags
        tagsDetail={undefined}
        showModal={showModalAddTags}
        setShowModal={setShowModalAddTags}
        setReload={setReloadTags}
        reload={reloadTags}
      />
    </>
  )
}

export default AddEditTicket
