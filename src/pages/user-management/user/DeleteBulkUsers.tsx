import {bulkSuspendUser, deleteBulkUsers} from '@api/UserCRUD'
import {ToastMessage} from '@components/toast-message'
import {errorExpiredToken, hasPermission} from '@helpers'
import {Form, Formik} from 'formik'
import {FC, memo, useState} from 'react'
import {Button, Modal} from 'react-bootstrap'
import * as Yup from 'yup'

type DeleteBulkUsersProps = {
  showModal: any
  setShowModal: any
  setReloadUser: any
  reloadUser: any
  dataChecked: any
  isUnverifiedUser: boolean
  setDataChecked: any
  totalPage: any
  pageFrom: any
  setPage: any
  page: any
  setResetKeyword: any
}

const UserSchema = Yup.object().shape({
  name: Yup.string().required('This asset status name is required').nullable(),
})

let DeleteBulkUsers: FC<DeleteBulkUsersProps> = ({
  showModal,
  setShowModal,
  setReloadUser,
  reloadUser,
  dataChecked,
  isUnverifiedUser,
  setDataChecked,
  totalPage,
  pageFrom,
  setPage,
  page,
  setResetKeyword,
}) => {
  const [loadingModal, setLoadingModal] = useState(false)
  const handleSubmit = () => {
    setLoadingModal(true)
    if (dataChecked?.length > 0) {
      deleteBulkUsers({guids: dataChecked})
        .then((res: any) => {
          ToastMessage({type: 'success', message: res?.data?.message})
          const total_data_page: number = totalPage - pageFrom
          if (total_data_page - dataChecked?.length <= 0) {
            if (page > 1) {
              setPage(page - 1)
            } else {
              setPage(page)
              setResetKeyword(true)
            }
          } else {
            setPage(page)
          }
          setLoadingModal(false)
          setShowModal(false)
          setReloadUser(reloadUser + 1)
          setDataChecked([])
        })
        .catch((e: any) => {
          errorExpiredToken(e)
          setLoadingModal(false)
          ToastMessage({type: 'error', message: e?.response?.data?.message})
        })
    }
  }

  const confirmSuspend = () => {
    setShowModal(false)
    if (dataChecked?.length > 0) {
      bulkSuspendUser({guids: dataChecked})
        .then((res: any) => {
          ToastMessage({message: res?.data?.message, type: 'success'})
          setLoadingModal(false)
          setShowModal(false)
          setReloadUser(reloadUser + 1)
        })
        .catch(() => '')
    }
  }

  return (
    <Modal dialogClassName='modal-md' show={showModal} onHide={() => setShowModal(false)}>
      <Formik
        initialValues={{
          name: dataChecked?.length || '',
        }}
        validationSchema={UserSchema}
        enableReinitialize
        onSubmit={handleSubmit}
      >
        {() => (
          <Form className='justify-content-center' noValidate>
            <Modal.Header>
              <Modal.Title>Delete/Suspend User</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className=''>
                Are you sure want to delete or suspend
                <span style={{color: 'black'}}> {dataChecked?.length} </span>
                Users ?
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button className='btn-sm' type='submit' form-id='' variant='primary'>
                {!loadingModal && <span className='indicator-label'>Delete</span>}
                {loadingModal && (
                  <span className='indicator-progress' style={{display: 'block'}}>
                    Please wait...
                    <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                  </span>
                )}
              </Button>
              {hasPermission('user-management.suspend') && (
                <>
                  {isUnverifiedUser ? (
                    <Button
                      className='btn-sm'
                      onClick={confirmSuspend}
                      disabled
                      variant='secondary'
                    >
                      Suspend
                    </Button>
                  ) : (
                    <Button className='btn-sm' onClick={confirmSuspend} variant='secondary'>
                      Suspend
                    </Button>
                  )}
                </>
              )}
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </Modal>
  )
}

DeleteBulkUsers = memo(
  DeleteBulkUsers,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export {DeleteBulkUsers}
