import {ToastMessage} from '@components/toast-message'
import {errorExpiredToken} from '@helpers'
import {Form, Formik} from 'formik'
import {FC, useState} from 'react'
import {Button, Modal} from 'react-bootstrap'
import * as Yup from 'yup'

import {deleteInventory} from './redux/InventoryCRUD'

type DeleteInventoryProps = {
  showModal: any
  setShowModal: any
  setReloadInventory: any
  reloadInventory: any
  inventoryName: any
  inventoryGuid: any
  setDataChecked: any
  totalPage: any
  pageFrom: any
  setPage: any
  page: any
  setResetKeyword: any
}

const InventorySchema = Yup.object().shape({
  name: Yup.string().required('This asset status name is required').nullable(),
})

const DeleteInventory: FC<DeleteInventoryProps> = ({
  showModal,
  setShowModal,
  setReloadInventory,
  reloadInventory,
  inventoryName,
  inventoryGuid,
  setDataChecked,
  totalPage,
  pageFrom,
  setPage,
  page,
  setResetKeyword,
}) => {
  const [loadingCategory, setLoadingLocation] = useState<boolean>(false)

  const handleSubmit = () => {
    setLoadingLocation(true)
    if (inventoryGuid) {
      deleteInventory(inventoryGuid)
        .then(({data: {message}}: any) => {
          ToastMessage({type: 'success', message})
          setLoadingLocation(false)
          setShowModal(false)
          const total_data_page: number = totalPage - pageFrom
          const newPage: number = page
          if (total_data_page - 1 <= 0) {
            if (newPage > 1) {
              setPage(newPage - 1)
            } else {
              setPage(newPage)
              setResetKeyword(true)
            }
          } else {
            setPage(newPage)
          }
          setReloadInventory(reloadInventory + 1)
          setDataChecked([])
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
                <span className='fw-bolder'> {inventoryName || ''} </span>
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

export default DeleteInventory
