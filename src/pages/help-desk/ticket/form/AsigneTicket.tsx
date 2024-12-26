import 'react-datetime/css/react-datetime.css'

import {getUserV1} from '@api/UserCRUD'
import {Select} from '@components/select/ajax'
import {ToastMessage} from '@components/toast-message'
import {getAlertTeam} from '@pages/setup/alert/team/Service'
import {ErrorMessage, Field, Form, Formik} from 'formik'
import parse from 'html-react-parser'
import moment from 'moment'
import {FC, useState} from 'react'
import {Button, Modal} from 'react-bootstrap'
import * as Yup from 'yup'

import {assignTo, getListType, getPriority, getReportChannel, getReporter} from '../Service'

type AsignTicketProps = {
  showModal: any
  setShowModal: any
  setReloadTicket: any
  reloadTicket: any
  ticketDetail: any
}

const AsignTicket: FC<AsignTicketProps> = ({
  showModal,
  setShowModal,
  setReloadTicket,
  reloadTicket,
  ticketDetail,
}) => {
  const [loadingTicket, setLoadingTicket] = useState(false)
  const [assignToApprover, setAssignToApprover] = useState(true)
  const [assignToUser, setAssignToUser] = useState(true)
  const [assignToTeam, setAssignToTeam] = useState(true)
  const [resetOption, setResetOption] = useState(false)
  const [assignToApproverValue, setAssignToApproverValue] = useState('')
  const [assignToUserValue, setAssignToUserValue] = useState('')
  const [assignToTeamValue, setAssignToTeamValue] = useState('')

  const handleOnSubmit = (values: any, actions: any) => {
    setLoadingTicket(true)
    const {guid} = ticketDetail
    let params: any = {
      assign_to_type: values.assign_to_type,
    }

    if (values.approver_guid !== '') {
      params = {...params, approver_guid: values.approver_guid}
    }

    if (values.assign_user_guid !== '') {
      params = {...params, assign_user_guid: values.assign_user_guid}
    }

    if (values.assign_team_guid !== '') {
      params = {...params, assign_team_guid: values.assign_team_guid}
    }
    assignTo(guid, params)
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
          ToastMessage({type: 'error', message: err?.response?.data.message})
        }
      })
  }

  const AssigneSchema: any = Yup.object().shape({
    assign_to_type: Yup.string().when({
      is: () => assignToApprover && assignToUser && assignToTeam,
      then: () => Yup.string().required('Assigned to is required'),
    } as any),
    approver_guid: Yup.string().when({
      is: () => !assignToApprover && assignToApproverValue === '',
      then: () => Yup.string().required('Select approver is required'),
    } as any),
    assign_user_guid: Yup.string().when({
      is: () => !assignToUser && assignToUserValue === '',
      then: () => Yup.string().required('Select user is required'),
    } as any),
    assign_team_guid: Yup.string().when({
      is: () => !assignToTeam && assignToTeamValue === '',
      then: () => Yup.string().required('Select team is required'),
    } as any),
  })

  const configClass: any = {
    label: 'space-3 text-uppercase fw-bolder fs-8 mb-1  mt-5 text-black-600',
    grid: 'col-md-6 col-xl-4 mb-5',
    size: 'sm',
    body: 'bg-gray-100 p-2 rounded',
  }
  return (
    <Modal dialogClassName='modal-lg' size='lg' show={showModal} onHide={() => setShowModal(false)}>
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
          assign_to_type: '',
          approver_guid: '',
        }}
        validationSchema={AssigneSchema}
        enableReinitialize
        onSubmit={(values: any, actions: any) => handleOnSubmit(values, actions)}
      >
        {({setFieldValue}) => (
          <Form className='justify-content-center' noValidate>
            <Modal.Header>
              <Modal.Title>Ticket Assigned To</Modal.Title>
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
                    <div className='my-3'>
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
                        <label htmlFor='report_channel_other' className={`${configClass.label}`}>
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
                      <label htmlFor='assign_to_type' className={`${configClass.label}`}>
                        {' '}
                        Assigned To{' '}
                      </label>
                      <div className='row'>
                        <div className='col-auto mb-3'>
                          <label className='form-check form-check-custom form-check-sm form-check-solid bg-f7 rounded px-2'>
                            <input
                              data-cy='assignedToApprover'
                              type='radio'
                              className='form-check-input border border-gray-400'
                              name='assign_to_type'
                              onChange={({target: {checked}}: any) => {
                                if (checked) {
                                  setFieldValue('assign_to_type', 'approver')
                                  setFieldValue('approver_guid', '')
                                  setFieldValue('assign_user_guid', '')
                                  setFieldValue('assign_team_guid', '')
                                  setAssignToApprover(false)
                                  setAssignToUser(true)
                                  setAssignToTeam(true)
                                  setResetOption(true)
                                }
                              }}
                            />
                            <span className='m-2 cursor-pointer fw-bold text-dark fs-7'>
                              Approver
                            </span>
                          </label>
                        </div>
                        <div className='col-auto mb-3'>
                          <label className='form-check form-check-custom form-check-sm form-check-solid bg-f7 rounded px-2'>
                            <input
                              data-cy='assignedToAgent'
                              type='radio'
                              className='form-check-input border border-gray-400'
                              name='assign_to_type'
                              onChange={({target: {checked}}: any) => {
                                if (checked) {
                                  setFieldValue('assign_to_type', 'user')
                                  setFieldValue('approver_guid', '')
                                  setFieldValue('assign_user_guid', '')
                                  setFieldValue('assign_team_guid', '')
                                  setAssignToApprover(true)
                                  setAssignToUser(false)
                                  setAssignToTeam(true)
                                  setResetOption(true)
                                }
                              }}
                            />
                            <span className='m-2 cursor-pointer fw-bold text-dark fs-7'>Agent</span>
                          </label>
                        </div>
                        <div className='col-auto mb-3'>
                          <label className='form-check form-check-custom form-check-sm form-check-solid bg-f7 rounded px-2'>
                            <input
                              data-cy='assignedToTeam'
                              type='radio'
                              className='form-check-input border border-gray-400'
                              name='assign_to_type'
                              onChange={({target: {checked}}: any) => {
                                if (checked) {
                                  setFieldValue('assign_to_type', 'team')
                                  setFieldValue('approver_guid', '')
                                  setFieldValue('assign_user_guid', '')
                                  setFieldValue('assign_team_guid', '')
                                  setAssignToApprover(true)
                                  setAssignToUser(true)
                                  setAssignToTeam(false)
                                  setResetOption(true)
                                }
                              }}
                            />
                            <span className='m-2 cursor-pointer fw-bold text-dark fs-7'>Team</span>
                          </label>
                        </div>

                        {!assignToApprover && (
                          <div className='row'>
                            <div className='col-12 mt-1'>
                              <div className='input-group input-group-solid'>
                                <Select
                                  sm={true}
                                  className='col p-0 select_approver_guid_cypress'
                                  api={getUserV1}
                                  params={false}
                                  reload={false}
                                  name='approver_guid'
                                  placeholder='Select Approver'
                                  onChange={(e: any) => {
                                    setFieldValue('approver_guid', e.value)
                                    setAssignToApproverValue(e.value)
                                  }}
                                  parse={(e: any) => {
                                    return {
                                      value: e.guid,
                                      label: `${e.first_name} ${e.last_name}`,
                                    }
                                  }}
                                  setResetOption={setResetOption}
                                  resetOption={resetOption}
                                  isDisabled={assignToApprover}
                                />
                              </div>
                            </div>
                          </div>
                        )}

                        {!assignToUser && (
                          <div className='row'>
                            <div className='col-12 mt-1'>
                              <div className='input-group input-group-solid'>
                                <Select
                                  sm={true}
                                  className='col p-0 select_agent_guid_cypress'
                                  api={getUserV1}
                                  params={{
                                    orderCol: 'first_name',
                                    orderDir: 'asc',
                                    'filter[role_name]': 'agent' || '-',
                                  }}
                                  reload={false}
                                  name='assign_user_guid'
                                  placeholder='Select Agent'
                                  onChange={(e: any) => {
                                    setFieldValue('assign_user_guid', e.value)
                                    setAssignToUserValue(e.value)
                                  }}
                                  parse={(e: any) => {
                                    return {
                                      value: e.guid,
                                      label: `${e.first_name} ${e.last_name}`,
                                    }
                                  }}
                                  setResetOption={setResetOption}
                                  resetOption={resetOption}
                                  isDisabled={assignToUser}
                                />
                              </div>
                            </div>
                          </div>
                        )}

                        {!assignToTeam && (
                          <div className='row'>
                            <div className='col-12 mt-1'>
                              <div className='input-group input-group-solid'>
                                <Select
                                  sm={true}
                                  className='col p-0 select_team_guid_cypress'
                                  api={getAlertTeam}
                                  params={false}
                                  reload={false}
                                  name='assign_team_guid'
                                  placeholder='Select Team'
                                  onChange={(e: any) => {
                                    setFieldValue('assign_team_guid', e.value)
                                    setAssignToTeamValue(e.value)
                                  }}
                                  parse={(e: any) => {
                                    return {
                                      value: e.guid,
                                      label: e.name,
                                    }
                                  }}
                                  setResetOption={setResetOption}
                                  resetOption={resetOption}
                                  isDisabled={assignToTeam}
                                />
                              </div>
                            </div>
                          </div>
                        )}
                        <div className='fv-plugins-message-container invalid-feedback'>
                          <ErrorMessage name='assign_to_type' />
                        </div>
                        <div className='fv-plugins-message-container invalid-feedback'>
                          <ErrorMessage name='approver_guid' />
                        </div>
                        <div className='fv-plugins-message-container invalid-feedback'>
                          <ErrorMessage name='assign_user_guid' />
                        </div>
                        <div className='fv-plugins-message-container invalid-feedback'>
                          <ErrorMessage name='assign_team_guid' />
                        </div>
                      </div>
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

export default AsignTicket
