import {deleteCustomer} from '@api/customer'
import {ToastMessage} from '@components/toast-message'
import {errorExpiredToken} from '@helpers'
import {Form, Formik} from 'formik'
import {FC, memo, useState} from 'react'
import {Button, Modal} from 'react-bootstrap'
import * as Yup from 'yup'

type ModalDeleteCustomerProps = {
  showModal: any
  setShowModal: any
  setReloadCustomer: any
  reloadCustomer: any
  detailCustomer: any
}

const CustomerSchema = Yup.object().shape({
  name: Yup.string().required('Customer name is required.'),
})

let ModalDeleteCustomer: FC<ModalDeleteCustomerProps> = ({
  showModal,
  setShowModal,
  setReloadCustomer,
  reloadCustomer,
  detailCustomer,
}) => {
  const [loadingCustomer, setLoadingCustomer] = useState(false)

  const handleOnSubmit = () => {
    setLoadingCustomer(true)

    if (detailCustomer) {
      deleteCustomer(detailCustomer?.guid)
        .then((res: any) => {
          setLoadingCustomer(false)
          setShowModal(false)
          setReloadCustomer(reloadCustomer + 1)
          ToastMessage({type: 'error', message: res?.data?.message})
        })
        .catch((err: any) => {
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
          name: detailCustomer?.name || '',
        }}
        validationSchema={CustomerSchema}
        enableReinitialize
        onSubmit={handleOnSubmit}
      >
        {() => (
          <Form className='justify-content-center' noValidate>
            <Modal.Header>
              <Modal.Title>Delete Customer</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className='text-black-400 mb-3 text-center'>
                Are you sure want to remove
                <span style={{color: 'black'}}> {detailCustomer.name} </span> ?
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button className='btn-sm' type='submit' form-id='' variant='primary'>
                {!loadingCustomer && <span className='indicator-label'>Delete</span>}
                {loadingCustomer && (
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
