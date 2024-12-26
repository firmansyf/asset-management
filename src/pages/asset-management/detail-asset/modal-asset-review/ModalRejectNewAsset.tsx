import {configClass} from '@helpers'
import {rejectAssetReview} from '@pages/asset-management/redux/AssetRedux'
import {ErrorMessage, Field, Form, Formik} from 'formik'
import {FC, memo, useState} from 'react'
import {Button, Modal} from 'react-bootstrap'
import Swal from 'sweetalert2'
import * as Yup from 'yup'

const RejectSchema = Yup.object().shape({
  comment: Yup.string().required('Reject commnet is required'),
})

const ModalRejectComment: FC<any> = ({
  showModal,
  setShowModal,
  detailAsset,
  setReloadAssetApproval,
}) => {
  const {guid}: any = detailAsset || {}
  const [loading, setLoading] = useState<boolean>(false)

  const onReject = (values: any) => {
    setLoading(true)
    const params: any = {
      comment: values?.comment || '',
    }
    rejectAssetReview(guid, params).then(({data}: any) => {
      setLoading(false)
      setShowModal(false)
      Swal.fire({
        imageUrl: '/images/rejected.png',
        imageWidth: 65,
        imageHeight: 65,
        imageAlt: 'Custom image',
        html: `<h2>Asset Rejected</h2>
          <p>Asset Assignee status changed to Rejected</p>
          <p>Ticket created for assignee to review</p><br>
          <p>Ticket Number: <a href="${window.location.origin}/help-desk/ticket/detail/${data?.ticket?.guid}" target="_blank">${data?.ticket?.id}</a></p>
          <p>Assignee: ${data?.ticket?.assignee}</p>
          `,
        allowOutsideClick: false,
        showConfirmButton: true,
        confirmButtonColor: '#050990',
        confirmButtonText: 'Ok',
      }).then(() => {
        if (data) {
          setReloadAssetApproval(true)
        }
      })
    })
  }

  return (
    <Modal
      dialogClassName='modal-md modal-dialog-centered'
      show={showModal}
      onHide={() => setShowModal(false)}
    >
      <Formik
        initialValues={{
          comment: '',
        }}
        enableReinitialize
        validationSchema={RejectSchema}
        onSubmit={onReject}
      >
        {() => {
          return (
            <Form className='justify-content-center' noValidate>
              <Modal.Body style={{overflowY: 'auto', marginRight: '23px'}}>
                <div className='mt-2'>
                  <label htmlFor='comment' className={`${configClass?.label} required`}>
                    Reject Comments
                  </label>
                  <Field
                    name='comment'
                    as='textarea'
                    type='text'
                    placeholder='Enter Reject Comments'
                    className={configClass?.form}
                    style={{height: '150 !important'}}
                  />
                  <div className='fv-plugins-message-container invalid-feedback'>
                    <ErrorMessage name='comment' />
                  </div>
                </div>
              </Modal.Body>
              <Modal.Footer>
                <Button className='btn-sm' variant='secondary' onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
                <Button className='btn-sm' type='submit' form-id='' variant='danger'>
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
          )
        }}
      </Formik>
    </Modal>
  )
}

const ModalRejectNewAsset = memo(
  ModalRejectComment,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export default ModalRejectNewAsset
