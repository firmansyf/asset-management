import {ToastMessage} from '@components/toast-message'
import {errorExpiredToken} from '@helpers'
import {Form, Formik} from 'formik'
import {FC, memo, useState} from 'react'
import {Button, Modal} from 'react-bootstrap'
import * as Yup from 'yup'

import {deleteMaintenanceCategory} from './Service'

type ModalDeleteMaintenanceCategoryProps = {
  showModal: any
  setShowModal: any
  setReloadMaintenanceCategory: any
  reloadMaintenanceCategory: any
  detailMaintenanceCategory: any
  totalPage: any
  pageFrom: any
  setPage: any
  page: any
  setResetKeyword: any
}

const MaintenanceCategorySchema = Yup.object().shape({
  name: Yup.string().required('Customer name is required.'),
})

let ModalDeleteCustomer: FC<ModalDeleteMaintenanceCategoryProps> = ({
  showModal,
  setShowModal,
  setReloadMaintenanceCategory,
  reloadMaintenanceCategory,
  detailMaintenanceCategory,
  totalPage,
  pageFrom,
  setPage,
  page,
  setResetKeyword,
}) => {
  const [loadingMaintenanceCategory, setLoadingMaintenanceCategory] = useState(false)
  const handleOnSubmit = () => {
    setLoadingMaintenanceCategory(true)
    if (detailMaintenanceCategory) {
      deleteMaintenanceCategory(detailMaintenanceCategory?.guid)
        .then((res: any) => {
          setLoadingMaintenanceCategory(false)
          setShowModal(false)
          const total_data_page: number = totalPage - pageFrom
          if (total_data_page - 1 <= 0) {
            if (page > 1) {
              setPage(page - 1)
            } else {
              setPage(page)
              setResetKeyword(true)
            }
          } else {
            setPage(page)
          }
          setReloadMaintenanceCategory(reloadMaintenanceCategory + 1)
          ToastMessage({type: 'success', message: res?.data?.message})
        })
        .catch((err: any) => {
          setLoadingMaintenanceCategory(false)
          const {data} = err.response
          ToastMessage({type: 'error', message: data.message})
          errorExpiredToken(err)
        })
    }
  }

  return (
    <Modal dialogClassName='modal-md' show={showModal} onHide={() => setShowModal(false)}>
      <Formik
        initialValues={{
          name: detailMaintenanceCategory?.name || '',
        }}
        validationSchema={MaintenanceCategorySchema}
        enableReinitialize
        onSubmit={handleOnSubmit}
      >
        {() => (
          <Form className='justify-content-center' noValidate>
            <Modal.Header>
              <Modal.Title>Delete Work Orders Category</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className='text-black mb-3'>
                Are you sure to delete
                <strong> {detailMaintenanceCategory.name} </strong> ?
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button className='btn-sm' type='submit' form-id='' variant='primary'>
                {!loadingMaintenanceCategory && <span className='indicator-label'>Delete</span>}
                {loadingMaintenanceCategory && (
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

ModalDeleteCustomer = memo(
  ModalDeleteCustomer,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export default ModalDeleteCustomer
