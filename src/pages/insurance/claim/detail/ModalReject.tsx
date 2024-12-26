import {ToastMessage} from '@components/toast-message'
import {configClass} from '@helpers'
import {ErrorMessage, Field, Form, Formik} from 'formik'
import {FC, memo, useState} from 'react'
import {Button, Modal} from 'react-bootstrap'
import {useIntl} from 'react-intl'
import * as Yup from 'yup'

import {rejectInsurance} from '../Service'

const RejectShcema = Yup.object().shape({
  comment: Yup.string().required('This Reject Reason is required').nullable(),
})

let ModalReject: FC<any> = ({setReload, reload, showModal, setShowModal, id}) => {
  const intl: any = useIntl()

  const [loading, setLoading] = useState<boolean>(false)

  const handleSubmit = (value: any) => {
    setLoading(true)
    const params: any = {
      comment: value?.comment || '',
    }
    rejectInsurance(params, id)
      .then(({data: {message}}: any) => {
        setLoading(false)
        setShowModal(false)
        setReload(reload + 1)
        ToastMessage({message, type: 'success'})
      })
      .catch(({response}: any) => {
        setLoading(false)
        const {message} = response?.data || {}
        ToastMessage({message, type: 'error'})
      })
  }

  return (
    <Modal dialogClassName='modal-md' show={showModal} onHide={() => setShowModal(false)}>
      <Formik
        initialValues={{
          comment: '',
        }}
        validationSchema={RejectShcema}
        enableReinitialize
        onSubmit={handleSubmit}
      >
        {() => (
          <Form className='justify-content-center' noValidate>
            <Modal.Header closeButton>
              <Modal.Title>Reject Insurance Claim</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className='mb-3 mt-2'>
                <div className='d-flex my-1'>
                  <div style={{width: '20%'}} className='ms-2 mt-5'>
                    <img
                      src='/media/icons/duotone/Code/Warning-2.svg'
                      alt='Warning'
                      style={{width: '65px'}}
                      className='ms-2'
                    />
                  </div>
                  <div style={{width: '80%'}} className='ms-2'>
                    <label htmlFor='textReject' style={{fontWeight: 500, fontSize: '16px'}}>
                      {intl.formatMessage({
                        id: 'ARE_YOU_SURE_WANT_TO_REJECT_THIS_INSURANCE_CLAIM',
                      })}
                    </label>
                    <p id='textReject' className='mt-3' style={{fontSize: '12px'}}>
                      {intl.formatMessage({
                        id: 'IF_YES_PELASE_STATE_YOUR_REASONS_FOR_REJECTING_BELOW_BEFORE_PROCEED',
                      })}
                    </p>
                  </div>
                </div>
              </div>

              <div className='mt-3 mb-5'>
                <label className={`${configClass?.label} required`}>Reject Reason</label>
                <Field
                  type='text'
                  name='comment'
                  as='textarea'
                  placeholder='Enter Reject Reason'
                  className={configClass?.form}
                ></Field>
                <div className='fv-plugins-message-container invalid-feedback'>
                  <ErrorMessage name='comment' />
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button className='btn-sm' type='submit' form-id='' variant='primary'>
                {!loading && <span className='indicator-label'>Reject</span>}
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

ModalReject = memo(
  ModalReject,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export default ModalReject
