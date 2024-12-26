import {FC, memo} from 'react'
import {Button, Modal} from 'react-bootstrap'
import {useNavigate} from 'react-router-dom'

let BlockEdit: FC<any> = ({showModal, setShowModal, message, id}) => {
  const navigate = useNavigate()
  return (
    <Modal dialogClassName='modal-md' show={showModal} onHide={() => setShowModal(true)}>
      <Modal.Header>
        <Modal.Title>
          <i className='fas fa-lock text-dark' style={{fontSize: '16px'}}></i> &nbsp;Edit Lock
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className='mb-5'>
          <div>{message || ''}</div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button
          className='btn-sm'
          variant='primary'
          onClick={() => navigate('/insurance-claims/' + id + '/detail')}
        >
          Back to View screen
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

BlockEdit = memo(BlockEdit, (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next))
export default BlockEdit
