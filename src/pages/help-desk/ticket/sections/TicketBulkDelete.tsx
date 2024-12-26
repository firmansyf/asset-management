import {ToastMessage} from '@components/toast-message'
import {Form, Formik} from 'formik'
import {FC, useState} from 'react'
import {Button, Modal} from 'react-bootstrap'

import {deleteTicket} from '../Service'
type BulkDeleteProps = {
  showModal: any
  setShowModal: any
  setReloadTicket: any
  onSubmitTicket?: any
  ToastMessage: any
  reloadTicket: any
  dataChecked: any
  setDataChecked: any
}

const TicketBulkDelete: FC<BulkDeleteProps> = ({
  showModal,
  setShowModal,
  setReloadTicket,
  // onSubmitTicket,
  reloadTicket,
  dataChecked,
  setDataChecked,
}) => {
  const [loadingTicket, setLoadingTicket] = useState(false)

  return (
    <Modal dialogClassName='modal-md' show={showModal} onHide={() => setShowModal(false)}>
      <Formik
        initialValues={{
          name: dataChecked?.length || '',
        }}
        enableReinitialize
        onSubmit={() => {
          setLoadingTicket(true)
          if (dataChecked?.length > 0) {
            deleteTicket({guids: dataChecked})
              .then((res: any) => {
                ToastMessage({type: 'success', message: res?.data?.message})
                setLoadingTicket(false)
                setShowModal(false)
                setDataChecked([])
                setReloadTicket(reloadTicket + 1)
              })
              .catch((e: any) => {
                const {message} = e?.response?.data || {}
                ToastMessage({type: 'error', message})
              })
          }
        }}
      >
        {() => (
          <Form className='justify-content-center' noValidate>
            <Modal.Header>
              <Modal.Title>Delete Ticket</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className='text-gray-400 mb-3 text-center'>
                Are you sure want to remove
                <span className='text-dark fw-bolder'> {dataChecked?.length} </span> tickets ?
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button className='btn-sm' type='submit' form-id='' variant='primary'>
                {!loadingTicket && <span className='indicator-label'>Delete</span>}
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

export default TicketBulkDelete
