import {ToastMessage} from '@components/toast-message'
import {errorExpiredToken} from '@helpers'
import {Form, Formik} from 'formik'
import {FC, memo, useState} from 'react'
import {Button, Modal} from 'react-bootstrap'
import * as Yup from 'yup'

import {deleteMaintenanceChecklist} from './Service'

type ModalDeleteMaintenanceChecklistProps = {
  showModal: any
  setShowModal: any
  setReloadMaintenanceChecklist: any
  reloadMaintenanceChecklist: any
  detailMaintenanceChecklist: any
  totalPage: any
  pageFrom: any
  setPage: any
  page: any
  setResetKeyword: any
}

const MaintenanceChecklistSchema = Yup.object().shape({
  name: Yup.string().required('Customer name is required.'),
})

let ModalDeleteCustomer: FC<ModalDeleteMaintenanceChecklistProps> = ({
  showModal,
  setShowModal,
  setReloadMaintenanceChecklist,
  reloadMaintenanceChecklist,
  detailMaintenanceChecklist,
  totalPage,
  pageFrom,
  setPage,
  page,
  setResetKeyword,
}) => {
  const [loadingMaintenanceChecklist, setLoadingMaintenanceChecklist] = useState(false)
  const handleOnSubmit = () => {
    setLoadingMaintenanceChecklist(true)
    if (detailMaintenanceChecklist) {
      deleteMaintenanceChecklist(detailMaintenanceChecklist?.guid)
        .then((res: any) => {
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
          setLoadingMaintenanceChecklist(false)
          setShowModal(false)
          setReloadMaintenanceChecklist(reloadMaintenanceChecklist + 1)
          ToastMessage({type: 'success', message: res?.data?.message})
        })
        .catch((err: any) => {
          setLoadingMaintenanceChecklist(false)
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
          name: detailMaintenanceChecklist?.name || '',
        }}
        validationSchema={MaintenanceChecklistSchema}
        enableReinitialize
        onSubmit={handleOnSubmit}
      >
        {() => (
          <Form className='justify-content-center' noValidate>
            <Modal.Header>
              <Modal.Title>Delete Checklist</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className='text-black mb-3'>
                Are you sure to delete
                <strong> {detailMaintenanceChecklist.name} </strong> ?
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button className='btn-sm' type='submit' form-id='' variant='primary'>
                {!loadingMaintenanceChecklist && <span className='indicator-label'>Delete</span>}
                {loadingMaintenanceChecklist && (
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
