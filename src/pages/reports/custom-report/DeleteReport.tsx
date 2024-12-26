import {FC, memo} from 'react'
import {Button, Modal} from 'react-bootstrap'

let ModalDelete: FC<any> = ({detailReport, showModal, setShowModal, onDeleteReport}) => {
  return (
    <Modal
      dialogClassName='modal-md modal-dialog-centered'
      show={showModal}
      onHide={() => setShowModal(false)}
    >
      <Modal.Header>
        <Modal.Title>Delete Custom Report</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className='text-center'>
          Are you sure want to delete <span className='fw-bolder'>{detailReport?.name}</span> ?
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button className='btn-sm' variant='secondary' onClick={() => setShowModal(false)}>
          Cancel
        </Button>
        <Button
          className='btn-sm'
          variant='primary'
          onClick={() => onDeleteReport(detailReport?.guid)}
        >
          <span className='indicator-label'>Delete</span>
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

ModalDelete = memo(
  ModalDelete,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export default ModalDelete
