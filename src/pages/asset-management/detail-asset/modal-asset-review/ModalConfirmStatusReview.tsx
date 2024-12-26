import {FC, memo} from 'react'
import {Button, Modal} from 'react-bootstrap'

const ModalStatusReview: FC<any> = ({showModal, setShowModal}) => {
  return (
    <Modal
      dialogClassName='modal-lg modal-dialog-centered'
      show={showModal}
      onHide={() => setShowModal(false)}
    >
      <Modal.Header>
        <Modal.Title>Review Asset</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className='text-center'>Please login to mobile app to confirm/decline asset</p>
      </Modal.Body>
      <Modal.Footer>
        <Button className='btn-sm' variant='secondary' onClick={() => setShowModal(false)}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

const ModalConfirmStatusReview = memo(
  ModalStatusReview,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export default ModalConfirmStatusReview
