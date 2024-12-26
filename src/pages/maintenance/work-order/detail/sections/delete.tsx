import {ToastMessage} from '@components/toast-message'
import {errorExpiredToken} from '@helpers'
import {deleteWorkOrder} from '@pages/maintenance/Service'
import {Form, Formik} from 'formik'
import {FC, memo, useState} from 'react'
import {Button, Modal} from 'react-bootstrap'
import {useNavigate} from 'react-router-dom'
import * as Yup from 'yup'

type DeleteProps = {
  showModal: any
  setShowModal: any
  setReloadWorkOrder: any
  reloadWorkOrder: any
  workOrderName: any
  workOrderGuid: any
}

const WorkOrderSchema = Yup.object().shape({
  name: Yup.string().required('This asset status name is required').nullable(),
})

let Delete: FC<DeleteProps> = ({showModal, setShowModal, workOrderName, workOrderGuid}) => {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = () => {
    setLoading(true)
    if (workOrderGuid) {
      deleteWorkOrder(workOrderGuid)
        .then((res: any) => {
          ToastMessage({type: 'success', message: res?.data?.message})
          setLoading(false)
          setShowModal(false)
          setTimeout(() => {
            navigate('/maintenance/work-order')
          }, 1000)
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
          name: workOrderName || '',
        }}
        validationSchema={WorkOrderSchema}
        enableReinitialize
        onSubmit={handleSubmit}
      >
        {() => (
          <Form className='justify-content-center' noValidate>
            <Modal.Header>
              <Modal.Title>Delete Work Order</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div>
                Are you sure want to remove
                <span className='fw-bolder'> {workOrderName} </span>
                Work Order ?
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

Delete = memo(Delete, (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next))
export default Delete
