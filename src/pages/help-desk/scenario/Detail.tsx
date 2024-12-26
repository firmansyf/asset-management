import {FC} from 'react'
import {Modal} from 'react-bootstrap'

export const Detail: FC<any> = ({showModal, setShowModal}) => {
  return (
    <Modal dialogClassName='modal-md' show={showModal} onHide={() => setShowModal(false)}>
      <Modal.Header>
        <Modal.Title>Working Hour Detail</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className='row'>
          <div className='col-md-12'>
            <p className='m-0'>
              <u>Detail Scenario</u>
            </p>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <button type='button' className='btn btn-sm btn-light' onClick={() => setShowModal(false)}>
          Cancel
        </button>
      </Modal.Footer>
    </Modal>
  )
}
