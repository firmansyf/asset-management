import {ToastMessage} from '@components/toast-message'
import {errorExpiredToken} from '@helpers'
import {deleteInventory} from '@pages/inventory/redux/InventoryCRUD'
import {Form, Formik} from 'formik'
import {FC, useState} from 'react'
import {Button, Modal} from 'react-bootstrap'
import {useNavigate} from 'react-router-dom'
import * as Yup from 'yup'

type DeleteProps = {
  showModal: any
  setShowModal: any
  setReloadInventory: any
  reloadInventory: any
  inventoryName: any
  inventoryGuid: any
}

const InventorySchema = Yup.object().shape({
  name: Yup.string().required('This asset status name is required').nullable(),
})

const Delete: FC<DeleteProps> = ({
  showModal,
  setShowModal,
  setReloadInventory,
  reloadInventory,
  inventoryName,
  inventoryGuid,
}) => {
  const [loadingCategory, setLoadingLocation] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = () => {
    setLoadingLocation(true)
    if (inventoryGuid) {
      deleteInventory(inventoryGuid)
        .then((res: any) => {
          ToastMessage({type: 'success', message: res?.data?.message})
          setLoadingLocation(false)
          setShowModal(false)
          setReloadInventory(reloadInventory + 1)

          navigate('/inventory')
        })
        .catch((e: any) => {
          errorExpiredToken(e)
        })
    }
  }

  return (
    <Modal dialogClassName='modal-md' show={showModal} onHide={() => setShowModal(false)}>
      <Formik
        initialValues={{
          name: inventoryName || '',
        }}
        validationSchema={InventorySchema}
        enableReinitialize
        onSubmit={handleSubmit}
      >
        {() => (
          <Form className='justify-content-center' noValidate>
            <Modal.Header>
              <Modal.Title>Delete Inventory</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className=''>
                Are you sure want to remove
                <span className='fw-bolder'> {inventoryName} </span>
                Inventory?
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button className='btn-sm' type='submit' form-id='' variant='primary'>
                {!loadingCategory && <span className='indicator-label'>Delete</span>}
                {loadingCategory && (
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

export {Delete}
