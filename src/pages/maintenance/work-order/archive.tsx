import {ToastMessage} from '@components/toast-message'
import {FC, memo, useState} from 'react'
import {Button, Modal} from 'react-bootstrap'

import {archive} from '../Service'

let ModalArchive: FC<any> = ({showModal, setShowModal, data, setReload, reload}) => {
  const [loading, setLoading] = useState<any>(false)

  const onConfirm = () => {
    setLoading(true)
    archive({guids: data})
      .then(({data: {message}}: any) => {
        ToastMessage({type: 'success', message})
        setLoading(false)
        setShowModal(false)
        setReload(reload + 1)
      })
      .catch((err: any) => {
        ToastMessage({message: err?.response?.data?.message, type: 'error'})
        setLoading(false)
      })
  }

  return (
    <Modal dialogClassName='modal-md' show={showModal} onHide={() => setShowModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Archive Work Order</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>
          <div className='fw-bold mb-3'>Are you sure you want archive this work order?</div>
          <p>
            Archiving a work order hides this form visibility unless you filter to display them. You
            can always unarchive work orders.
          </p>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button
          className='btn-sm'
          type='submit'
          variant='primary'
          disabled={loading}
          onClick={onConfirm}
        >
          {!loading && <span className='indicator-label'>Archive</span>}
          {loading && (
            <span className='indicator-progress' style={{display: 'block'}}>
              Please wait...
              <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
            </span>
          )}
        </Button>
        <Button
          disabled={loading}
          className='btn-sm'
          variant='secondary'
          onClick={() => {
            setShowModal(false)
          }}
        >
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

ModalArchive = memo(
  ModalArchive,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export {ModalArchive}
