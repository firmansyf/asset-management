import {ToastMessage} from '@components/toast-message'
import {configClass} from '@helpers'
import {ErrorMessage, Field, Form, Formik} from 'formik'
import {FC, memo, useState} from 'react'
import {Button, Modal} from 'react-bootstrap'
import * as Yup from 'yup'

import {sendReview1} from '../Service'

const validationSchema = Yup.object().shape({
  comment: Yup.string().required('The review comment is required'),
  review_status: Yup.string().required('The review Status Not Selected'),
})

let ModalReview1: FC<any> = ({showModal, setShowModal, setReload, reload, id}) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [claimable, setClaimable] = useState<boolean>(true)

  const handleSubmit = (value: any) => {
    setLoading(true)
    const params: any = {
      review_comment: value?.comment || '',
      is_claimable: claimable === true ? 1 : 0,
      review_status: value?.review_status,
    }
    sendReview1(params, id)
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
          review_status: '',
        }}
        validationSchema={validationSchema}
        enableReinitialize
        onSubmit={(value: any) => handleSubmit(value)}
      >
        {() => (
          <Form className='justify-content-center' noValidate>
            <Modal.Header closeButton>
              <Modal.Title>Review 1</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className='row'>
                <div className='col-4'>
                  <label className={configClass?.label}>Claimable</label>
                </div>
                <div className='col-8 py-3'>
                  <label htmlFor='claimable-yes' className='form-checkform-check-solid'>
                    <input
                      type='checkbox'
                      name='claimable-yes'
                      checked={claimable}
                      onClick={() => setClaimable(true)}
                      style={{position: 'relative', top: '2px'}}
                    />
                    <span className='form-check-label mx-2'>Yes</span>
                  </label>
                  <label htmlFor='claimable-no' className='form-checkform-check-solid'>
                    <input
                      type='checkbox'
                      name='claimable-no'
                      checked={!claimable}
                      onClick={() => setClaimable(false)}
                      style={{position: 'relative', top: '2px'}}
                    />
                    <span className='form-check-label mx-2'>No</span>
                  </label>
                </div>
              </div>
              <div className='row mt-1 mb-3'>
                <div className='col-4 font-weight-bold'>
                  <label className={configClass?.label} htmlFor='review_status'>
                    Review Status
                  </label>
                </div>
                <div className='col-8'>
                  <Field name='review_status' as='select' type='text' className={configClass?.form}>
                    <option className='text-dark' value=''>
                      Choose Claim Status
                    </option>

                    <option className='text-dark' value={1}>
                      Pass Review
                    </option>
                    <option className='text-dark' value={0}>
                      Propose to reject and close
                    </option>
                  </Field>
                  <div className='fv-plugins-message-container invalid-feedback'>
                    <ErrorMessage name='review_status' />
                  </div>
                </div>
              </div>
              <div className='mt-5'>
                <Field
                  name='comment'
                  as='textarea'
                  type='text'
                  placeholder='Enter submission comment (if any)'
                  className={configClass?.form}
                />
                <div className='fv-plugins-message-container invalid-feedback'>
                  <ErrorMessage name='comment' />
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button
                className='btn-sm'
                type='submit'
                disabled={loading}
                form-id=''
                variant='primary'
              >
                {!loading && <span className='indicator-label'>Submit Review 1</span>}
                {loading && (
                  <span className='indicator-progress' style={{display: 'block'}}>
                    Please wait...
                    <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                  </span>
                )}
              </Button>
              <Button
                className='btn-sm'
                variant='secondary'
                onClick={(e: any) => {
                  e.preventDefault()
                  setShowModal(false)
                }}
              >
                Cancel
              </Button>
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </Modal>
  )
}

ModalReview1 = memo(
  ModalReview1,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export default ModalReview1
