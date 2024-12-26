import {deleteRole} from '@api/role-and-permision'
import {ToastMessage} from '@components/toast-message'
import {errorExpiredToken} from '@helpers'
import {Form, Formik} from 'formik'
import {FC, memo, useState} from 'react'
import {Button, Modal} from 'react-bootstrap'
import * as Yup from 'yup'

type DeleteRoleProps = {
  showModal: any
  setShowModal: any
  setReloadRoles: any
  reloadRoles: any
  dataChecked: any
  dataCheckedLabel: any
  setDataChecked: any
  setDataCheckedLabel: any
}

const AssetStatusSchema = Yup.object().shape({
  name: Yup.string().required('This asset status name is required').nullable(),
})

let DeleteRole: FC<DeleteRoleProps> = ({
  showModal,
  setShowModal,
  setReloadRoles,
  reloadRoles,
  dataChecked,
  dataCheckedLabel,
  setDataChecked,
  setDataCheckedLabel,
}) => {
  const [loading, setLoading] = useState(false)

  const onSubmit = () => {
    setLoading(true)
    if (dataChecked) {
      deleteRole(dataChecked)
        .then((res: any) => {
          ToastMessage({type: 'success', message: res?.data?.message})
          setLoading(false)
          setShowModal(false)
          setDataChecked(undefined)
          setDataCheckedLabel(undefined)
          setReloadRoles(reloadRoles + 1)
        })
        .catch((e: any) => {
          errorExpiredToken(e)
          setShowModal(false)
          setLoading(false)
          ToastMessage({type: 'error', message: e?.response?.data?.code})
        })
    }
  }

  return (
    <Modal dialogClassName='modal-md' show={showModal} onHide={() => setShowModal(false)}>
      <Formik
        initialValues={{
          name: dataCheckedLabel || '',
        }}
        validationSchema={AssetStatusSchema}
        enableReinitialize
        onSubmit={onSubmit}
      >
        {() => (
          <Form className='justify-content-center' noValidate>
            <Modal.Header>
              <Modal.Title>Delete Role</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className='text-black-400 mb-3 text-center'>
                Are you sure you want to delete this role
                <span style={{color: 'black'}}> {dataCheckedLabel} </span> ?
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button className='btn-sm' type='submit' form-id='' variant='primary'>
                {!loading && <span className='indicator-label'>Delete</span>}
                {loading && (
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
          </Form>
        )}
      </Formik>
    </Modal>
  )
}

DeleteRole = memo(
  DeleteRole,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export default DeleteRole
