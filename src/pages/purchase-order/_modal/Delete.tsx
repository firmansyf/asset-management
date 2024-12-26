import {ToastMessage} from '@components/toast-message'
import {errorValidation} from '@helpers'
import {deletePO} from '@pages/purchase-order/Services'
import {FC, useState} from 'react'
import {Button, Modal} from 'react-bootstrap'

type Props = {
  showModal: any
  setShowModal: any
  setReload: any
  reload: any
  detail: any
}

const Delete: FC<Props> = ({detail, showModal, setShowModal, setReload, reload}) => {
  const [loadingModal, setLoadingModal] = useState(false)

  const onSubmit: any = () => {
    if (detail?.guid) {
      setLoadingModal(true)
      deletePO(detail?.guid)
        .then(({data: {message}}: any) => {
          ToastMessage({type: 'success', message})
          setShowModal(false)
          setReload(!reload)
        })
        .catch((err: any) => {
          Object.values(errorValidation(err) || {})?.map((message: any) =>
            ToastMessage({type: 'error', message})
          )
        })
        .finally(() => {
          setLoadingModal(false)
        })
    }
  }

  return (
    <Modal dialogClassName='modal-md' show={showModal} onHide={() => setShowModal(false)}>
      <Modal.Header>
        <Modal.Title>Confirm Delete</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className=''>
          Are you sure want to delete
          <span className='fw-bold'> &ldquo;{detail?.name}&rdquo; </span>?
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button className='btn-sm' type='submit' form-id='' variant='primary' onClick={onSubmit}>
          {!loadingModal && <span className='indicator-label'>Delete</span>}
          {loadingModal && (
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
    </Modal>
  )
}

export default Delete
