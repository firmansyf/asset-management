import {dispatchFireBase} from '@api/firebase'
import {activateEmail, resendVerificationEmail, suspendUser} from '@api/UserCRUD'
import {ToastMessage} from '@components/toast-message'
import {FC, memo, useState} from 'react'
// import { useFormikContext } from 'formik'
import {Button, Modal} from 'react-bootstrap'
import {useNavigate} from 'react-router-dom'

interface Props {
  handleDelete?: () => void
  user: any
  reloadUser: any
  setReloadUser: any
  setShowForm: any
  setShowModalUser: any
}

let SuspendUser: FC<Props> = ({user, reloadUser, setReloadUser, setShowForm, setShowModalUser}) => {
  const navigate = useNavigate()
  const [showModal, setShowModal] = useState(false)
  const isSuspend = user?.status === 1 ? 'Suspend' : 'Reactivate'
  const userAction = user?.status === 0 ? 'Resend verification Email' : isSuspend

  const handleSuspend = () => {
    setShowModal(true)
  }

  const confirmAction = () => {
    const {guid}: any = user || {}
    if (user?.status === 0) {
      resendVerificationEmail(guid)
        .then((res: any) => {
          setShowForm(false)
          setShowModal(false)
          setShowModalUser(false)
          setReloadUser(reloadUser + 1)
          ToastMessage({message: res?.data?.message, type: 'success'})
          setTimeout(() => navigate(0), 15000)
        })
        .catch((err: any) => err)
    }

    if (user?.status === 1) {
      suspendUser(guid)
        .then((res: any) => {
          setShowForm(false)
          setShowModal(false)
          setShowModalUser(false)
          setReloadUser(reloadUser + 1)
          ToastMessage({message: res?.data?.message, type: 'success'})
          dispatchFireBase(`user_guid/${guid}`, {deleted_at: Date.now()})
        })
        .catch((err: any) => err)
    }

    if (user?.status === 2) {
      activateEmail(guid)
        .then((res: any) => {
          setShowForm(false)
          setShowModal(false)
          setShowModalUser(false)
          setReloadUser(reloadUser + 1)
          ToastMessage({message: res?.data?.message, type: 'success'})
        })
        .catch((err: any) => err)
    }
  }

  return (
    <>
      <div className='d-flex justify-content-end'>
        <Button onClick={handleSuspend} variant='secondary' size='sm'>
          {userAction}
        </Button>
      </div>
      <Modal dialogClassName='modal-md' show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header>
          <Modal.Title>{userAction} User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Are you sure that you want to {userAction} this user
            <b>{` ${user?.first_name}  ${user?.last_name}`}</b>
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={() => setShowModal(false)}
            variant='secondary'
            className='mx-3'
            size='sm'
          >
            Cancel
          </Button>
          <Button onClick={confirmAction} variant='primary' size='sm'>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

SuspendUser = memo(
  SuspendUser,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export {SuspendUser}
