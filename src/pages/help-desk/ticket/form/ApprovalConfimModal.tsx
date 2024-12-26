import {ToastMessage} from '@components/toast-message'
import {ErrorMessage, Field, Form, Formik} from 'formik'
import {FC, useState} from 'react'
import {Button, Modal} from 'react-bootstrap'
import * as Yup from 'yup'

import {updateApproval} from '../Service'

type ApprovalConfimProps = {
  showModal: any
  setShowModal: any
  ticketGuid: any
  setReloadTicket: any
  reloadTicket: any
  approvalTicketData: any
}

const ApprovalConfirm: FC<ApprovalConfimProps> = ({
  showModal,
  setShowModal,
  ticketGuid,
  setReloadTicket,
  reloadTicket,
  approvalTicketData,
}) => {
  const [loading, setLoading] = useState(false)
  const configClass: any = {
    label: 'space-3 text-uppercase fw-bolder fs-8 mb-1  mt-5 text-black-600',
    grid: 'col-md-6 col-xl-4 mb-5',
    size: 'sm',
  }

  const ApprovalConfirmSchema = Yup.object().shape({
    notes: Yup.string().when({
      is: () => approvalTicketData?.approve_action === 'rejected',
      then: () => Yup.string().required('Notes is required'),
    } as any),
  })

  const onSubmit = (value: any, actions: any) => {
    setLoading(true)
    if (approvalTicketData) {
      let params: any = {
        status: approvalTicketData.approve_action,
      }
      if (approvalTicketData.approve_action === 'rejected') {
        params = {...params, approver_note: value.notes}
      }
      if (approvalTicketData.approve_action === 'approved') {
        if (approvalTicketData.assign_to_type === 'agent') {
          params = {
            ...params,
            assign_to_type: 'user',
            assign_user_guid: approvalTicketData.assign_user_guid,
          }
        } else {
          params = {
            ...params,
            assign_to_type: approvalTicketData.assign_to_type,
            assign_team_guid: approvalTicketData.assign_team_guid,
          }
        }
      }

      updateApproval(ticketGuid, params)
        .then((res: any) => {
          setLoading(false)
          setShowModal(false)
          ToastMessage({type: 'success', message: res?.data?.message})
          setReloadTicket(reloadTicket + 1)
        })
        .catch((err: any) => {
          setLoading(false)
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
    }
  }

  return (
    <Modal dialogClassName='modal-md' show={showModal} onHide={() => setShowModal(false)}>
      <Formik
        initialValues={{
          notes: '',
        }}
        validationSchema={ApprovalConfirmSchema}
        enableReinitialize
        onSubmit={(value: any, actions: any) => onSubmit(value, actions)}
      >
        {() => (
          <Form className='justify-content-center' noValidate>
            <Modal.Header>
              <Modal.Title>
                {approvalTicketData?.approve_action === 'approved' ? 'Approve' : 'Reject'}
                Ticket
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className='text-black-800 mb-3'>
                Are you sure want to
                {approvalTicketData?.approve_action === 'approved' ? 'Approve' : 'Reject'}
                <strong> {approvalTicketData.name} </strong> ?
              </div>
              {approvalTicketData.approve_action === 'rejected' && (
                <div className='mb-1'>
                  <label htmlFor='notes' className={`${configClass.label} required`}>
                    Notes
                  </label>
                  <Field
                    component='textarea'
                    rows='4'
                    name='notes'
                    placeholder='Enter Notes'
                    className={configClass?.form}
                  />
                  <div className='fv-plugins-message-container invalid-feedback'>
                    <ErrorMessage name='notes' />
                  </div>
                </div>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button className='btn-sm' type='submit' form-id='' variant='primary'>
                {!loading && <span className='indicator-label'>Save</span>}
                {loading && (
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

export default ApprovalConfirm
