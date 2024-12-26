import 'react-datetime/css/react-datetime.css'

import {getUser} from '@api/UserCRUD'
import {Select} from '@components/select/ajax'
import {ToastMessage} from '@components/toast-message'
import {configClass, errorValidation} from '@helpers'
import {ErrorMessage, Field, Form, Formik} from 'formik'
import moment from 'moment'
import {FC, useState} from 'react'
// import {useHistory} from 'react-router-dom'
import {Button, Modal} from 'react-bootstrap'
import Datetime from 'react-datetime'

import {TicketAddFile} from './sections/TicketAddFile'
import {addTicket, editTicket, getListType, getPriority, getReportChannel} from './Service'

type AddEditTicketProps = {
  showModal: any
  setShowModal: any
  setReloadTicket: any
  reloadTicket: any
  ticketDetail: any
  detailTicketFiles: any
  ticketSchema: any
  checkName?: any
  checkType: any
  checkPriority: any
  checkEmail: any
  checkDescription: any
  ticketDetailFiles?: any
}

const AddEditTicket: FC<AddEditTicketProps> = ({
  showModal,
  setShowModal,
  setReloadTicket,
  reloadTicket,
  ticketDetail,
  detailTicketFiles,
  ticketSchema,
  // checkName,
  checkType,
  checkPriority,
  checkEmail,
  checkDescription,
  // ticketDetailFiles,
}) => {
  const [loadingTicket, setLoadingTicket] = useState(false)
  const [showReportChanel, setShowReportChanel] = useState(false)
  const [validation, setValidation] = useState<any>()
  // const [dueTime, setDueTime] = useState<any>()

  const handleOnSubmit = (values: any, actions: any) => {
    setLoadingTicket(true)
    const params = {
      name: values.name,
      type_guid: values.type_guid,
      reporter_guid: values.reporter_guid,
      priority_guid: values.priority_guid || '',
      report_channel_guid: values.report_channel_guid || 'null',
      email: values.email || '',
      due_time: values.due_time || '',
      description: values.description || '',
      files: values.files || [],
    }

    if (ticketDetail) {
      const {guid} = ticketDetail
      editTicket(params, guid)
        .then((res: any) => {
          setLoadingTicket(false)
          setShowModal(false)
          ToastMessage({type: 'success', message: res?.data?.message})
          setReloadTicket(reloadTicket + 1)
        })
        .catch((err: any) => {
          setLoadingTicket(false)
          const {data} = err?.response?.data
          if (data.fields !== undefined) {
            actions.setFieldError('location', data.fields.name)
            const error = data.fields
            for (const key in error) {
              const value = error[key]
              ToastMessage({type: 'error', message: value[0]})
            }
          } else {
            ToastMessage({type: 'error', message: err?.response?.data?.message})
          }
        })
    } else {
      addTicket(params)
        .then((res: any) => {
          setLoadingTicket(false)
          setShowModal(false)
          ToastMessage({type: 'success', message: res?.data?.message})
          setReloadTicket(reloadTicket + 1)
        })
        .catch((err: any) => {
          setLoadingTicket(false)
          setValidation(errorValidation(err))
          if (err.response) {
            const {data} = err?.response?.data
            if (data.fields !== undefined) {
              actions.setFieldError('location', data.fields.name)
              const error = data.fields
              for (const key in error) {
                const value = error[key]
                ToastMessage({type: 'error', message: value[0]})
              }
            } else {
              ToastMessage({type: 'error', message: err?.response?.data?.message})
            }
          }
        })
    }
  }

  return (
    <Modal dialogClassName='modal-lg' size='lg' show={showModal} onHide={() => setShowModal(false)}>
      <Formik
        initialValues={{
          name: ticketDetail?.name || '',
          reporter_guid: ticketDetail?.reporter_guid || '',
          type_guid: ticketDetail?.type_guid || '',
          due_time: ticketDetail?.due_time || '',
          priority_guid: ticketDetail?.priority_guid || '',
          report_channel_guid: ticketDetail?.report_channel_guid || '',
          email: ticketDetail?.email || '',
          description: ticketDetail?.description || '',
        }}
        enableReinitialize
        validationSchema={ticketSchema}
        onSubmit={(values: any, actions: any) => handleOnSubmit(values, actions)}
      >
        {({setFieldValue}) => (
          <Form className='justify-content-center' noValidate>
            <Modal.Header>
              <Modal.Title>{ticketDetail ? 'Edit' : 'Add'} Ticket</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className='mt-3'>
                <div className='row'>
                  <div className='col-md-6'>
                    <div className='mb-1'>
                      <label htmlFor='name' className={`${configClass?.label} required`}>
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
                  </div>

                  <div className='col-md-6'>
                    <label htmlFor='reporter_guid' className={configClass?.label}>
                      Reporter
                    </label>
                    <Select
                      sm={true}
                      className='col p-0 select-reporter-cy'
                      id='selectReporterCy'
                      name='reporter_guid'
                      api={getUser}
                      params={false}
                      reload={false}
                      isClearable={false}
                      placeholder='Select Reporter'
                      defaultValue={{
                        value: ticketDetail?.reporter_guid,
                        label: ticketDetail?.reporter_name,
                      }}
                      onChange={(e: any) => {
                        setFieldValue('reporter_guid', e?.value || '')
                        if (e?.value) {
                          setShowReportChanel(true)
                        } else {
                          setShowReportChanel(false)
                        }
                      }}
                      parse={(e: any) => {
                        return {
                          value: e.guid,
                          label: e.first_name,
                        }
                      }}
                    />
                    <div className='fv-plugins-message-container invalid-feedback'>
                      <ErrorMessage name='reporter_guid' />
                    </div>
                    <div className='form-text mb-4'></div>
                  </div>

                  {checkType?.is_selected && (
                    <div className='col-md-6'>
                      {checkType?.is_required && (
                        <label htmlFor='type_guid' className={`${configClass?.label} required`}>
                          Type Ticket
                        </label>
                      )}
                      {!checkType?.is_required && (
                        <label htmlFor='type_guid' className={configClass?.label}>
                          Type Ticket
                        </label>
                      )}
                      <Select
                        sm={true}
                        className='col p-0 select-type-cy'
                        id='seletTypeCy'
                        name='type_guid'
                        api={getListType}
                        params={false}
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
                      {checkType?.is_required && (
                        <div className='fv-plugins-message-container invalid-feedback'>
                          <ErrorMessage name='type_guid' />
                        </div>
                      )}
                    </div>
                  )}

                  <div className='col-md-6'>
                    <label htmlFor='due_time' className={configClass?.label}>
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
                        onChange={(e: any) => {
                          const m = moment(e).format('YYYY-MM-DD HH:mm:ss')
                          // setDueTime(m)
                          setFieldValue('due_time', m)
                        }}
                        dateFormat='YYYY-MM-DD'
                        timeFormat='HH:mm'
                        timeConstraints={{
                          hours: {min: 0, max: 23, step: 1},
                          minutes: {min: 0, max: 59, step: 1},
                        }}
                        // value={ moment(dueTime).format('DD/MM/YYYY HH:mm:ss') }
                      />
                    </div>
                  </div>

                  {checkPriority?.is_selected && (
                    <div className='col-md-6'>
                      {checkPriority?.is_required && (
                        <label htmlFor='priority_guid' className={`${configClass?.label} required`}>
                          Priority
                        </label>
                      )}
                      {!checkPriority?.is_required && (
                        <label htmlFor='priority_guid' className={configClass?.label}>
                          Priority
                        </label>
                      )}
                      <Select
                        sm={true}
                        className='col p-0 select-priority-cy'
                        api={getPriority}
                        params={false}
                        reload={false}
                        id='selectPriorityCy'
                        name='priority_guid'
                        placeholder='Select Priority'
                        defaultValue={{
                          value: ticketDetail?.priority_guid,
                          label: ticketDetail?.priority_name,
                        }}
                        onChange={(e: any) => {
                          setFieldValue('priority_guid', e?.value || '')
                        }}
                        parse={(e: any) => {
                          return {
                            value: e?.guid,
                            label: e?.name,
                          }
                        }}
                      />
                      {checkPriority?.is_required && (
                        <div className='fv-plugins-message-container invalid-feedback'>
                          <ErrorMessage name='priority_guid' />
                        </div>
                      )}
                    </div>
                  )}

                  {(showReportChanel || ticketDetail?.reporter_guid) && (
                    <div className='col-md-6'>
                      <label htmlFor='report_channel' className={configClass?.label}>
                        Report Channel
                      </label>
                      <Select
                        sm={true}
                        className='col p-0 select-report-channel-cy'
                        api={getReportChannel}
                        params={false}
                        reload={false}
                        id='selectReportChannelCy'
                        name='report_channel_guid'
                        placeholder='Select Report Channel'
                        defaultValue={{
                          value: ticketDetail?.report_channel_guid,
                          label: ticketDetail?.report_channel_name,
                        }}
                        onChange={(e: any) => {
                          setFieldValue('report_channel_guid', e?.value || '')
                        }}
                        parse={(e: any) => {
                          return {
                            value: e?.guid,
                            label: e?.name,
                          }
                        }}
                      />
                    </div>
                  )}

                  {checkEmail?.is_selected && (
                    <div className='col-md-6'>
                      <div className='mb-1'>
                        {checkEmail?.is_required && (
                          <label htmlFor='email' className={`${configClass?.label} required`}>
                            Email
                          </label>
                        )}
                        {!checkEmail?.is_required && (
                          <label htmlFor='email' className={configClass?.label}>
                            Email
                          </label>
                        )}
                        <Field
                          type='text'
                          name='email'
                          placeholder='Enter Email'
                          className={configClass?.form}
                        />
                      </div>
                      {checkEmail?.is_required && (
                        <div className='fv-plugins-message-container invalid-feedback'>
                          <ErrorMessage name='email' />
                        </div>
                      )}
                    </div>
                  )}

                  {checkDescription?.is_selected && (
                    <div className='col-md-12'>
                      <div className='mb-1'>
                        {checkDescription?.is_required && (
                          <label htmlFor='description' className={`${configClass?.label} required`}>
                            Description
                          </label>
                        )}
                        {!checkDescription?.is_required && (
                          <label htmlFor='description' className={configClass?.label}>
                            Description
                          </label>
                        )}
                        <Field
                          component='textarea'
                          rows='4'
                          name='description'
                          placeholder='Enter Description'
                          className={configClass?.form}
                        />
                      </div>
                      {checkDescription?.is_required && (
                        <div className='fv-plugins-message-container invalid-feedback'>
                          <ErrorMessage name='description' />
                        </div>
                      )}
                    </div>
                  )}

                  <div className='row'>
                    <div className='col-md-12'>
                      <TicketAddFile
                        // loading={loadingForm}
                        validation={validation}
                        setFieldValue={setFieldValue}
                        files={detailTicketFiles}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button disabled={loadingTicket} className='btn-sm' type='submit' variant='primary'>
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
              <Button className='btn-sm' variant='secondary' onClick={() => setShowModal(false)}>
                Cancel
              </Button>
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </Modal>
  )
}

export default AddEditTicket
