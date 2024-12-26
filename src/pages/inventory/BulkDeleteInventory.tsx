import {ToastMessage} from '@components/toast-message'
import {errorExpiredToken} from '@helpers'
import {Form, Formik} from 'formik'
import {FC, useState} from 'react'
import {Button, Modal} from 'react-bootstrap'
import * as Yup from 'yup'

import {deleteBulkInventory} from './redux/InventoryCRUD'

type BulkDeleteInventoryProps = {
  showModal: any
  setShowModal: any
  setReloadInventory: any
  reloadInventory: any
  dataChecked: any
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

const BulkDeleteInventory: FC<BulkDeleteInventoryProps> = ({
  showModal,
  setShowModal,
  setReloadInventory,
  reloadInventory,
  dataChecked,
  setDataChecked,
  totalPage,
  pageFrom,
  setPage,
  page,
  setResetKeyword,
}) => {
  const [loadingModal, setLoadingModal] = useState<boolean>(false)

  const handleSubmit = () => {
    setLoadingModal(true)
    if (dataChecked?.length > 0) {
      deleteBulkInventory({guids: dataChecked})
        .then(({data: {message}}: any) => {
          ToastMessage({type: 'success', message})
          setLoadingModal(false)
          setShowModal(false)
          const total_data_page: number = totalPage - pageFrom
          const newPage: number = page
          if (total_data_page - dataChecked?.length <= 0) {
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
          setLoadingModal(false)
          const {message} = e?.response?.data || {}
          ToastMessage({type: 'error', message})
        })
    }
  }

  return (
    <Modal dialogClassName='modal-md' show={showModal} onHide={() => setShowModal(false)}>
      <Formik
        initialValues={{
          name: dataChecked?.length || '',
        }}
        validationSchema={InventorySchema}
        enableReinitialize
        onSubmit={handleSubmit}
      >
        {() => (
          <Form className='justify-content-center' noValidate>
            <Modal.Header>
              <Modal.Title>Bulk Delete Inventory</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className=''>
                Are you sure want to remove
                <span className=''> {dataChecked?.length} </span>
                Inventory ?
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

export default BulkDeleteInventory
