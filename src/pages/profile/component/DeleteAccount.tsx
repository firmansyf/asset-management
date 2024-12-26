import {ToastMessage} from '@components/toast-message'
import {FC, memo} from 'react'
import {Button, Modal} from 'react-bootstrap'
import {useNavigate} from 'react-router-dom'

import {deleteAccount} from './Service'

type ModalDeleteAccount = {
  showModal: any
  setShowModal: any
}

let DeleteAccount: FC<ModalDeleteAccount> = ({showModal, setShowModal}) => {
  const navigate = useNavigate()

  const handleOnSubmit = (event: any) => {
    event.preventDefault()

    deleteAccount()
      .then(() => {
        setShowModal(false)
        ToastMessage({
          message: 'Please check your email to complete your account deletion',
          type: 'success',
        })
      })
      .catch(({response}: any) => {
        const {status, data} = response || {}
        const {message} = data || {}
        ToastMessage({type: 'error', message})

        if (status === 403) {
          navigate('/error/403')
        }
      })

    setTimeout(() => {
      navigate('/dashboard')
    }, 2000)
  }

  return (
    <Modal dialogClassName='modal-md' show={showModal} onHide={() => setShowModal(false)}>
      <Modal.Header>
        <Modal.Title>Delete Account</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className='text-dark-400 mb-3 text-center'>
          Are you sure to delete account ? This action cannot be reversed
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button className='btn-sm' variant='secondary' onClick={() => setShowModal(false)}>
          Cancel
        </Button>
        <Button
          className='btn-sm'
          type='submit'
          onClick={handleOnSubmit}
          form-id=''
          variant='primary'
          data-cy='delConfirm'
        >
          <span className='indicator-label'>Confirm</span>
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

DeleteAccount = memo(DeleteAccount)
export {DeleteAccount}
