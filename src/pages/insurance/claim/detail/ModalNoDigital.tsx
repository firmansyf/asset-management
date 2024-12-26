import {ToastMessage} from '@components/toast-message'
import {Form, Formik} from 'formik'
import {FC, memo, useState} from 'react'
import {Button, Modal} from 'react-bootstrap'
import {useIntl} from 'react-intl'

import {AssignDigitalREInsurance} from '../Service'

let ModalNoDigital: FC<any> = ({showModal, setShowModal, setReload, reload, id}) => {
  const intl: any = useIntl()

  const [loading, setLoading] = useState<boolean>(false)

  const onSubmit = () => {
    AssignDigitalREInsurance(id, {type: 'unassign'})
      .then(({data: {message}}: any) => {
        setLoading(false)
        setShowModal(false)
        setReload(reload + 1)
        ToastMessage({message, type: 'success'})
      })
      .catch(({response}: any) => {
        setLoading(false)
        const {message}: any = response?.data || {}
        ToastMessage({message, type: 'error'})
      })
  }
  return (
    <Modal dialogClassName='modal-md' show={showModal} onHide={() => setShowModal(false)}>
      <Formik initialValues={{}} enableReinitialize onSubmit={() => onSubmit()}>
        {() => (
          <Form className='justify-content-center' noValidate>
            <Modal.Header closeButton>
              <Modal.Title>{intl.formatMessage({id: 'CONFIRM_ASSIGN_TO_DIGITAL_RE'})}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className=''>
                <span>
                  {intl.formatMessage({
                    id: 'ARE_YOU_SURE_ASSIGN_TO_DIGITAL_RE_THIS_INSURANCE_CLAIM',
                  })}
                </span>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button className='btn-sm' variant='secondary' onClick={() => setShowModal(false)}>
                Close
              </Button>
              <Button className='btn-sm' type='submit' variant='primary'>
                {!loading && <span className='indicator-label'>Yes</span>}
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

ModalNoDigital = memo(
  ModalNoDigital,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export default ModalNoDigital
