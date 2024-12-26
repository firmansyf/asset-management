import 'react-datetime/css/react-datetime.css'

import {Alert} from '@components/alert'
import {Select} from '@components/select/ajax'
import {ToastMessage} from '@components/toast-message'
import {ErrorMessage, Field, Form, Formik} from 'formik'
import parse from 'html-react-parser'
import moment from 'moment'
import {FC, useCallback, useState} from 'react'
import {Button, Modal} from 'react-bootstrap'
import * as Yup from 'yup'

import {getListType, getPriority, getReportChannel, getReporter, updateStatus} from '../Service'

type ResolverTikcetProps = {
  showModal: any
  setShowModal: any
  setReloadTicket: any
  reloadTicket: any
  ticketDetail: any
}

const ResolverTikcet: FC<ResolverTikcetProps> = ({
  showModal,
  setShowModal,
  setReloadTicket,
  reloadTicket,
  ticketDetail,
}) => {
  const {guid} = ticketDetail
  const [loadingTicket, setLoadingTicket] = useState(false)
  const [checkResolve, setCheckResolve] = useState(false)
  const [showModalConfirm, setShowModalConfirm] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleOnSubmit = (_values: any) => {
    setLoadingTicket(true)
    setShowModal(false)
    setShowModalConfirm(true)
  }

  const resolveConfirm = useCallback(() => {
    if (checkResolve && ticketDetail?.available_status) {
      setLoading(true)
      const param = {status_guid: ticketDetail?.available_status?.[0]?.guid}
      updateStatus(guid, param)
        .then((res: any) => {
          setTimeout(() => {
            ToastMessage({message: res?.data?.message, type: 'success'})
            setLoading(false)
            setShowModalConfirm(false)
            setReloadTicket(reloadTicket + 1)
          }, 1000)
        })
        .catch((error: any) => {
          const {code, message} = error?.response?.data
          if (code === 'err_cannot_change_status_ticket_user') {
            ToastMessage({
              message: "You don't have permission to change this ticket status",
              type: 'error',
            })
          } else {
            ToastMessage({message: message, type: 'error'})
          }
          setLoading(false)
        })
    }
  }, [reloadTicket, checkResolve, guid, setReloadTicket, ticketDetail?.available_status])

  const configClass: any = {
    label: 'space-3 text-uppercase fw-bolder fs-8 mb-1  mt-5 text-black-600',
    grid: 'col-md-6 col-xl-4 mb-5',
    size: 'sm',
    body: 'bg-gray-100 p-2 rounded',
  }

  const ApprovalSchema: any = Yup.object().shape({
    resolve_action: Yup.string().when({
      is: () => !checkResolve,
      then: () => Yup.string().required('Resolve action is required'),
    } as any),
  })

  const onClose = () => {
    setShowModal(false)
    setCheckResolve(false)
  }

  const confirm_alert_message = [
    'Are you sure ticket ',
    <strong key='full_name'> {ticketDetail?.name} </strong>,
    'is Done?',
  ]

  return (
    <>
      <Modal dialogClassName='modal-lg' size='lg' show={showModal} onHide={() => onClose()}>
        <Formik
          initialValues={{
            name: ticketDetail?.name || '-',
            reporter_guid: ticketDetail?.reporter_guid || '-',
            type_guid: ticketDetail?.type_guid || '-',
            submitter_name: ticketDetail.submitter_name || '-',
            due_time: ticketDetail?.due_time
              ? moment(ticketDetail?.due_time).format('YYYY-MM-DD HH:mm')
              : '',
            created_at: moment(ticketDetail?.created_at).format('YYYY-MM-DD HH:mm') || '-',
            priority_guid: ticketDetail?.priority_guid || '-',
            report_channel_guid: ticketDetail?.report_channel_guid || '-',
            email: ticketDetail?.email || '-',
            description: ticketDetail?.description || '-',
            report_channel_other: ticketDetail.report_channel_other || '-',
            resolve_action: '',
          }}
          enableReinitialize
          validationSchema={ApprovalSchema}
          onSubmit={(values: any) => handleOnSubmit(values)}
        >
          {({setFieldValue}) => {
            return (
              <Form className='justify-content-center' noValidate>
                <Modal.Header>
                  <Modal.Title>Resolve Ticket</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <div className='mt-3'>
                    <div className='row'>
                      <div className='col-md-6'>
                        <div className='mb-1'>
                          <label htmlFor='name' className={`${configClass.label}`}>
                            Ticket Name
                          </label>
                          <Field type='text' readOnly name='name' className={configClass?.form} />
                          <div className='fv-plugins-message-container invalid-feedback'>
                            <ErrorMessage name='name' />
                          </div>
                        </div>
                        <div className='mb-1'>
                          <label htmlFor='type_guid' className={`${configClass.label}`}>
                            {' '}
                            Type Ticket{' '}
                          </label>
                          <Select
                            sm={true}
                            className='col p-0'
                            name='type_guid'
                            api={getListType}
                            params={false}
                            reload={false}
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
                                value: e.guid,
                                label: e.name,
                              }
                            }}
                            isDisabled={true}
                          />
                        </div>
                        <div className='mb-1'>
                          <label htmlFor='priority_guid' className={`${configClass.label}`}>
                            {' '}
                            Priority{' '}
                          </label>
                          <Select
                            sm={true}
                            className='col p-0'
                            api={getPriority}
                            params={false}
                            reload={false}
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
                                value: e.guid,
                                label: e.name,
                              }
                            }}
                            isDisabled={true}
                          />
                        </div>
                        <div className='mb-1'>
                          <label htmlFor='created_at' className={`${configClass.label}`}>
                            Created Date
                          </label>
                          <div className='input-group input-group-solid'>
                            <span className='input-group-text pe-0'>
                              <i className='fa fa-calendar-alt text-primary'></i>
                            </span>
                            <Field
                              type='text'
                              name='created_at'
                              placeholder='Created At'
                              className={configClass?.form}
                              readOnly
                            />
                          </div>
                        </div>
                        <div className='mb-1'>
                          <label htmlFor='description' className={`${configClass.label}`}>
                            {' '}
                            Description{' '}
                          </label>
                          <div className={`${configClass.body}`}>
                            {parse(`${ticketDetail?.description}`)}
                          </div>
                        </div>
                      </div>
                      <div className='col-md-6'>
                        <div className='mb-1'>
                          <div className='mb-1'>
                            <label htmlFor='submitter_name' className={`${configClass.label}`}>
                              {' '}
                              Submiter{' '}
                            </label>
                            <Field
                              type='text'
                              name='submitter_name'
                              placeholder='Enter Submiter'
                              className={configClass?.form}
                              readOnly
                            />
                          </div>
                        </div>
                        <div className='mb-1'>
                          <label htmlFor='reporter_guid' className={`${configClass.label}`}>
                            {' '}
                            Reporter{' '}
                          </label>
                          <Select
                            sm={true}
                            className='col p-0'
                            name='reporter_guid'
                            api={getReporter}
                            params={false}
                            reload={false}
                            placeholder='Select Reporter'
                            defaultValue={{
                              value: ticketDetail?.reporter_guid,
                              label: ticketDetail?.reporter_name || '-',
                            }}
                            onChange={(e: any) => {
                              setFieldValue('reporter_guid', e?.value || '')
                            }}
                            parse={(e: any) => {
                              return {
                                value: e.guid,
                                label: e.name,
                              }
                            }}
                            isDisabled={true}
                          />
                        </div>
                        <div className='mb-1'>
                          <label htmlFor='due_time' className={`${configClass.label}`}>
                            Due Time
                          </label>
                          <div className='input-group input-group-solid'>
                            <span className='input-group-text pe-0'>
                              <i className='fa fa-calendar-alt text-primary'></i>
                            </span>
                            <Field
                              type='text'
                              name='due_time'
                              placeholder='Select Due Time'
                              className={configClass?.form}
                              readOnly
                            />
                          </div>
                        </div>
                        <div className='mb-1'>
                          <label htmlFor='report_channel' className={`${configClass.label}`}>
                            {' '}
                            Report Channel{' '}
                          </label>
                          <Select
                            sm={true}
                            className='col p-0'
                            api={getReportChannel}
                            params={false}
                            reload={false}
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
                                value: e.guid,
                                label: e.name,
                              }
                            }}
                            isDisabled={true}
                          />
                        </div>
                        {ticketDetail.report_channel_other && (
                          <div className='mb-1'>
                            <label
                              htmlFor='report_channel_other'
                              className={`${configClass.label}`}
                            >
                              {' '}
                              Other Report Channel{' '}
                            </label>
                            <Field
                              type='text'
                              readOnly
                              name='report_channel_other'
                              placeholder='Enter Reporter Channel'
                              className={configClass?.form}
                            />
                          </div>
                        )}
                        <div className='mb-1'>
                          <label
                            htmlFor='resolve_action'
                            className={`${configClass.label} required`}
                          >
                            {' '}
                            Action{' '}
                          </label>
                          <label className='form-check form-check-custom form-check-sm form-check-solid bg-f7 rounded px-2'>
                            <input
                              type='checkbox'
                              data-cy='issueResolved'
                              name='resolve_action'
                              className='form-check-input border border-gray-400'
                              defaultChecked={checkResolve}
                              onChange={() => {
                                setCheckResolve(!checkResolve)
                              }}
                            />
                            <span className='m-2 cursor-pointer fw-bold text-dark fs-7'>
                              Issue Resolved
                            </span>
                          </label>
                          <div className='fv-plugins-message-container invalid-feedback'>
                            <ErrorMessage name='resolve_action' />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Modal.Body>
                <Modal.Footer>
                  <Button
                    data-cy='saveResolve'
                    disabled={loadingTicket}
                    className='btn-sm'
                    type='submit'
                    variant='primary'
                  >
                    {!loadingTicket && <span className='indicator-label'>Save</span>}
                    {loadingTicket && (
                      <span className='indicator-progress' style={{display: 'block'}}>
                        Please wait...
                        <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                      </span>
                    )}
                  </Button>
                  <Button className='btn-sm' variant='secondary' onClick={() => onClose()}>
                    Cancel
                  </Button>
                </Modal.Footer>
              </Form>
            )
          }}
        </Formik>
      </Modal>

      <Alert
        setShowModal={setShowModalConfirm}
        showModal={showModalConfirm}
        loading={loading}
        body={confirm_alert_message}
        type={'confirm'}
        title={'Ticket Resolved'}
        confirmLabel={'Save'}
        onConfirm={() => {
          resolveConfirm()
          setLoadingTicket(false)
        }}
        onCancel={() => {
          setShowModalConfirm(false)
          setLoadingTicket(false)
          setCheckResolve(false)
        }}
      />
    </>
  )
}

export default ResolverTikcet
