import {FC} from 'react'
import {Button, Modal} from 'react-bootstrap'

type Props = {
  showModal: any
  setShowModal: any
  body: any
  body2?: any
  title: any
  type?: any
  onConfirm: any
  onCancel: any
  confirmLabel: any
  loading: any
}

const Alert: FC<Props> = ({
  onCancel,
  onConfirm,
  body,
  body2,
  title,
  showModal,
  setShowModal,
  confirmLabel,
  loading,
}) => {
  return (
    <Modal dialogClassName='modal-md' show={showModal} onHide={() => setShowModal(false)}>
      <Modal.Header>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {body}
        <br />
        {body2}
      </Modal.Body>
      <Modal.Footer>
        <Button
          className='btn-sm'
          type='submit'
          variant='primary'
          disabled={loading}
          onClick={onConfirm}
        >
          {!loading && <span className='indicator-label'>{confirmLabel}</span>}
          {loading && (
            <span className='indicator-progress' style={{display: 'block'}}>
              Please wait...
              <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
            </span>
          )}
        </Button>
        <Button disabled={loading} className='btn-sm' variant='secondary' onClick={onCancel}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export {Alert}
