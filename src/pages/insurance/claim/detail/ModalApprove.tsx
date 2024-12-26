import {ToastMessage} from '@components/toast-message'
import {FC, memo, useState} from 'react'
import {Button, Modal} from 'react-bootstrap'

import {approveInsurance} from '../Service'

let ModalApprove: FC<any> = ({setReload, reload, showModal, setShowModal, id}) => {
  const [loading, setLoading] = useState<boolean>(false)

  const handleSubmit = () => {
    setLoading(true)
    approveInsurance({is_claimable: 1}, id)
      .then(({data: {message}}: any) => {
        setLoading(false)
        setShowModal(false)
        setReload(reload + 1)
        ToastMessage({message, type: 'success'})
      })
      .catch(({response}: any) => {
        setLoading(false)
        const {message}: any = response?.data || {}
        ToastMessage({message, type: 'error'})
      })
  }

  return (
    <Modal dialogClassName='modal-md' show={showModal} onHide={() => setShowModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Approve Insurance Claim</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className='text-black-400 mb-3 text-center'>
          Are you sure you want to approve this insurance claim ?
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button
          className='btn-sm'
          variant='secondary'
          onClick={(e: any) => {
            e.preventDefault()
            setShowModal(false)
          }}
        >
          Cancel
        </Button>
        <Button
          className='btn-sm'
          type='submit'
          form-id=''
          variant='primary'
          onClick={handleSubmit}
        >
          {!loading && <span className='indicator-label'>Yes, Approve</span>}
          {loading && (
            <span className='indicator-progress' style={{display: 'block'}}>
              Please wait...
              <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
            </span>
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

ModalApprove = memo(
  ModalApprove,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export default ModalApprove
