import {ToastMessage} from '@components/toast-message'
import {Form, Formik} from 'formik'
import {FC, memo, useState} from 'react'
import {Button, Modal} from 'react-bootstrap'
import {useIntl} from 'react-intl'

import {resubmitInsurance} from '../Service'

let ModalSubmission: FC<any> = ({showModal, setShowModal, setReload, reload, id}) => {
  const intl = useIntl()
  const [loading, setLoading] = useState(false)

  const onSubmit = () => {
    resubmitInsurance(id)
      .then(({data}: any) => {
        ToastMessage({message: data?.message, type: 'success'})
        setLoading(false)
        setShowModal(false)
        setReload(reload + 1)
      })
      .catch(() => {
        setLoading(false)
      })
  }
  return (
    <Modal dialogClassName='modal-md' show={showModal} onHide={() => setShowModal(false)}>
      <Formik
        initialValues={{}}
        // validationSchema={ManufacturerSchema}
        enableReinitialize
        onSubmit={() => onSubmit()}
      >
        {() => (
          <Form className='justify-content-center' noValidate>
            <Modal.Header closeButton>
              <Modal.Title>Confirm Resubmission</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className=''>
                <h5>
                  {intl.formatMessage({
                    id: 'ARE_YOU_SURE_TO_RESUBMIT_THIS_INSURANCE_CLAIM',
                  })}
                </h5>
                <h5>
                  {intl.formatMessage({
                    id: 'AN_ALERT_WILL_BE_SENT_TO_NOTIFY_REVIEWER',
                  })}
                </h5>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button className='btn-sm' variant='secondary' onClick={() => setShowModal(false)}>
                Close
              </Button>
              <Button className='btn-sm' type='submit' variant='primary'>
                {!loading && <span className='indicator-label'>Yes, Confirm</span>}
                {loading && (
                  <span className='indicator-progress' style={{display: 'block'}}>
                    Please wait...
                    <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                  </span>
                )}
              </Button>
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </Modal>
  )
}

ModalSubmission = memo(
  ModalSubmission,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export default ModalSubmission
