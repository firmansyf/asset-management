import {ToastMessage} from '@components/toast-message'
import {errorExpiredToken} from '@helpers'
import {deleteMeter} from '@pages/maintenance/Service'
import {Form, Formik} from 'formik'
import {FC, memo, useState} from 'react'
import {Button, Modal} from 'react-bootstrap'
import {useNavigate} from 'react-router-dom'
import * as Yup from 'yup'

type DeleteProps = {
  showModal: any
  setShowModal: any
  setReloadMeter: any
  reloadMeter: any
  meterName: any
  meterGuid: any
}

const MeterSchema = Yup.object().shape({
  name: Yup.string().required('This asset status name is required').nullable(),
})

let Delete: FC<DeleteProps> = ({
  showModal,
  setShowModal,
  setReloadMeter,
  reloadMeter,
  meterName,
  meterGuid,
}) => {
  const [loadingMeter, setLoadingMeter] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = () => {
    if (meterGuid) {
      setLoadingMeter(true)
      deleteMeter(meterGuid)
        .then((res: any) => {
          ToastMessage({type: 'success', message: res.data.message})
          setLoadingMeter(false)
          setShowModal(false)
          setReloadMeter(reloadMeter + 1)
          setTimeout(() => {
            navigate('/maintenance/meter')
          }, 1500)
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
          name: meterName || '',
        }}
        validationSchema={MeterSchema}
        enableReinitialize
        onSubmit={handleSubmit}
      >
        {() => (
          <Form className='justify-content-center' noValidate>
            <Modal.Header>
              <Modal.Title>Delete Meter</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div>
                Are you sure want to remove
                <span className='fw-bolder'> {meterName} </span>
                Meter ?
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button className='btn-sm' type='submit' form-id='' variant='primary'>
                {!loadingMeter && <span className='indicator-label'>Delete</span>}
                {loadingMeter && (
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
