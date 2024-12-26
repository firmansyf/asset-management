import 'react-datetime/css/react-datetime.css'

import {getUserV1} from '@api/UserCRUD'
import {Select} from '@components/select/ajax'
import {getAlertTeam} from '@pages/setup/alert/team/Service'
import {ErrorMessage, Field, Form, Formik} from 'formik'
import parse from 'html-react-parser'
import moment from 'moment'
import {FC, useState} from 'react'
import {Button, Modal} from 'react-bootstrap'
import * as Yup from 'yup'

import {getListType, getPriority, getReportChannel, getReporter} from './../Service'
import ApprovalConfirm from './ApprovalConfimModal'

type AsignTicketProps = {
  showModal: any
  setShowModal: any
  setReloadTicket: any
  reloadTicket: any
  ticketDetail: any
}

const ApprovalTicket: FC<AsignTicketProps> = ({
  showModal,
  setShowModal,
  setReloadTicket,
  reloadTicket,
  ticketDetail,
}) => {
  const {guid} = ticketDetail
  const [loadingTicket, setLoadingTicket] = useState(false)
  const [approveTicket, setApproveTicket] = useState(true)
  const [rejectTicket, setRejectTicket] = useState(true)
  const [assignToUser, setAssignToUser] = useState(true)
  const [assignToTeam, setAssignToTeam] = useState(true)
  const [assignToType, setAssignToType] = useState('')
  const [assignToUserValue, setAssignToUserValue] = useState('')
  const [assignToTeamValue, setAssignToTeamValue] = useState('')
  const [resetOption, setResetOption] = useState(false)
  const [showModalConfirmApprove, setShowModalConfirmApprove] = useState(false)
  const [approvalTicketData, setApprovalTicketData] = useState('')

  const handleOnSubmit = (values: any) => {
    setLoadingTicket(true)
    setApprovalTicketData(values)
    setShowModalConfirmApprove(true)
    setLoadingTicket(false)
    setShowModal(false)
  }
  const configClass: any = {
    label: 'space-3 text-uppercase fw-bolder fs-8 mb-1 text-black-600',
    grid: 'col-md-6 col-xl-4 mb-5',
    size: 'sm',
    body: 'bg-gray-100 p-2 rounded',
  }

  const ApprovalSchema: any = Yup.object().shape({
    approve_action: Yup.string().required('Approval action is required'),
    assign_to_type: Yup.string().when({
      is: () => approveTicket && assignToType === '',
      then: () => Yup.string().required('Assigned to is required'),
    } as any),
    assign_user_guid: Yup.string().when({
      is: () => approveTicket && assignToType === 'user' && assignToUserValue === '',
      then: () => Yup.string().required('Select agent is required'),
    } as any),
    assign_team_guid: Yup.string().when({
      is: () => approveTicket && assignToType === 'team' && assignToTeamValue === '',
      then: () => Yup.string().required('Select team is required'),
    } as any),
  })

  const onClose = () => {
    setShowModal(false)
    setApproveTicket(false)
    setRejectTicket(false)
    setResetOption(true)
    setAssignToUser(true)
    setAssignToTeam(true)
  }

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
            approve_action: '',
            assign_to_type: '',
            assign_user_guid: '',
            assign_team_guid: '',
          }}
          enableReinitialize
          validationSchema={ApprovalSchema}
          onSubmit={(values: any) => handleOnSubmit(values)}
        >
          {({setFieldValue}) => {
            return (
              <Form className='justify-content-center' noValidate>
                <Modal.Header>
                  <Modal.Title>Approval Ticket</Modal.Title>
                </Modal.Header>
                <Modal.Body className='py-0'>
                  <div className='mt-0'>
                    <div className='row'>
                      <div className='col-md-6'>
                        <div className='my-3'>
                          <label htmlFor='name' className={`${configClass.label}`}>
                            Ticket Names
                          </label>
                          <Field type='text' readOnly name='name' className={configClass?.form} />
                          <div className='fv-plugins-message-container invalid-feedback'>
                            <ErrorMessage name='name' />
                          </div>
                        </div>
                        <div className='my-3'>
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
                        <div className='my-3'>
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
                        <div className='my-3'>
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
                        <div className='my-3'>
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
                        <div className='my-3'>
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
                        <div className='my-3'>
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
                        <div className='my-3'>
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
                          <div className='my-3'>
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
                        <div className='my-3'>
                          <label
                            htmlFor='approve_action'
                            className={`${configClass.label} required`}
                          >
                            {' '}
                            Action
                          </label>
                          <div className='row'>
                            <div className='col-md-12 my-1'>
                              <label className='form-check form-check-custom form-check-sm form-check-solid bg-f7 rounded px-2'>
                                <input
                                  data-cy='approveTicket'
                                  type='radio'
                                  className='form-check-input border border-gray-400'
                                  name='approve_action'
                                  onChange={({target: {checked}}: any) => {
                                    if (checked) {
                                      setFieldValue('approve_action', 'approved')
                                      setApproveTicket(true)
                                      setRejectTicket(false)
                                      setResetOption(true)
                                    }
                                  }}
                                />
                                <span className='m-2 cursor-pointer fw-bold text-dark fs-7'>
                                  Approve
                                </span>
                              </label>
                            </div>
                          </div>

                          <div className='row'>
                            <div className='col-md-12 my-1'>
                              <label className='form-check form-check-custom form-check-sm form-check-solid bg-f7 rounded px-2'>
                                <input
                                  data-cy='rejectTicket'
                                  type='radio'
                                  className='form-check-input border border-gray-400'
                                  name='approve_action'
                                  onChange={({target: {checked}}: any) => {
                                    if (checked) {
                                      setFieldValue('approve_action', 'rejected')
                                      setApproveTicket(false)
                                      setRejectTicket(true)
                                      setResetOption(true)

                                      setFieldValue('assign_to_type', '')
                                      setAssignToUser(true)
                                      setAssignToTeam(true)
                                    }
                                  }}
                                />
                                <span className='m-2 cursor-pointer fw-bold text-dark fs-7'>
                                  Reject
                                </span>
                              </label>
                            </div>
                          </div>
                          <div className='fv-plugins-message-container invalid-feedback'>
                            <ErrorMessage name='approve_action' />
                          </div>
                        </div>
                        {approveTicket && !rejectTicket && (
                          <div className='my-3'>
                            <label
                              htmlFor='assign_to_type'
                              className={`${configClass.label} required`}
                              data-cy='assignedToApprove'
                            >
                              {' '}
                              Assigned To{' '}
                            </label>
                            <div className='row'>
                              <div className='col-auto'>
                                <label className='form-check form-check-custom form-check-sm form-check-solid bg-f7 rounded px-2'>
                                  <input
                                    data-cy='assignedToAgent'
                                    type='radio'
                                    className='form-check-input border border-gray-400'
                                    name='assign_to_type'
                                    onChange={({target: {checked}}: any) => {
                                      if (checked) {
                                        setFieldValue('assign_to_type', 'agent')
                                        setFieldValue('assign_user_guid', '')
                                        setFieldValue('assign_team_guid', '')
                                        setAssignToType('agent')
                                        setAssignToUser(false)
                                        setAssignToTeam(true)
                                        setResetOption(true)
                                      }
                                    }}
                                  />
                                  <span className='m-2 cursor-pointer fw-bold text-dark fs-7'>
                                    Agent
                                  </span>
                                </label>
                              </div>
                              <div className='col-auto'>
                                <label className='form-check form-check-custom form-check-sm form-check-solid bg-f7 rounded px-2'>
                                  <input
                                    data-cy='assignedToTeam'
                                    type='radio'
                                    className='form-check-input border border-gray-400'
                                    name='assign_to_type'
                                    onChange={({target: {checked}}: any) => {
                                      if (checked) {
                                        setFieldValue('assign_to_type', 'team')
                                        setFieldValue('assign_user_guid', '')
                                        setFieldValue('assign_team_guid', '')
                                        setAssignToType('team')
                                        setAssignToUser(true)
                                        setAssignToTeam(false)
                                        setResetOption(true)
                                      }
                                    }}
                                  />
                                  <span className='m-2 cursor-pointer fw-bold text-dark fs-7'>
                                    Team
                                  </span>
                                </label>
                              </div>
                            </div>
                            {assignToType && (
                              <div className='row'>
                                <div className='col-12 mt-3'>
                                  {assignToType === 'agent' && (
                                    <div className='input-group input-group-solid'>
                                      <Select
                                        sm={true}
                                        id='select-assign_user_guid'
                                        className='col p-0 select-agent-cypress'
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
                                          setAssignToTeamValue('')
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
                                  )}
                                  {assignToType === 'team' && (
                                    <div className='input-group input-group-solid'>
                                      <Select
                                        sm={true}
                                        id='select-assign_team_guid'
                                        className='col p-0 select-team-cypress'
                                        api={getAlertTeam}
                                        params={false}
                                        reload={false}
                                        name='assign_team_guid'
                                        placeholder='Select Team'
                                        onChange={(e: any) => {
                                          setFieldValue('assign_team_guid', e.value)
                                          setAssignToUserValue('')
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
                                  )}
                                </div>
                              </div>
                            )}
                            <div className='fv-plugins-message-container invalid-feedback'>
                              <ErrorMessage name='assign_to_type' />
                            </div>
                            <div className='fv-plugins-message-container invalid-feedback'>
                              <ErrorMessage name='assign_user_guid' />
                            </div>
                            <div className='fv-plugins-message-container invalid-feedback'>
                              <ErrorMessage name='assign_team_guid' />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Modal.Body>
                <Modal.Footer>
                  <Button
                    data-cy='saveApproval'
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

      <ApprovalConfirm
        showModal={showModalConfirmApprove}
        setShowModal={setShowModalConfirmApprove}
        ticketGuid={guid}
        setReloadTicket={setReloadTicket}
        reloadTicket={reloadTicket}
        approvalTicketData={approvalTicketData}
      />
    </>
  )
}

export default ApprovalTicket
