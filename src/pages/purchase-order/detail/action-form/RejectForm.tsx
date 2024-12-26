import {ToastMessage} from '@components/toast-message'
import {configClass, errorValidation} from '@helpers'
import {approvalPO} from '@pages/purchase-order/Services'
import {ErrorMessage, Field, Form, Formik} from 'formik'
import {FC, useState} from 'react'
import {Button, Modal} from 'react-bootstrap'
import * as Yup from 'yup'

type Props = {
  showModal: any
  setShowModal: any
  setReload: any
  reload: any
  detail: any
}

const RejectForm: FC<Props> = ({showModal, setShowModal, setReload, reload, detail}) => {
  const [loadingButtonPO, setloadingButtonPO] = useState<boolean>(false)

  const PurchaseOrderSchema: any = Yup.object().shape({
    notes: Yup.string().required('Notes is required'),
  })

  const onClose = () => {
    setShowModal(false)
  }

  const initValues: any = {
    notes: '',
  }

  const handleApproval = ({notes}: any) => {
    setloadingButtonPO(true)
    if (detail?.guid) {
      const {guid} = detail || {}
      approvalPO(guid, {approved: 0, notes})
        .then(({data: {message}}: any) => {
          setReload(!reload)
          setShowModal(false)
          ToastMessage({type: 'success', message})
        })
        .catch((err: any) => {
          Object.values(errorValidation(err))?.map((message: any) =>
            ToastMessage({type: 'error', message})
          )
        })
        .finally(() => setloadingButtonPO(false))
    }
  }

  return (
    <Modal dialogClassName='modal-md' show={showModal} onHide={onClose}>
      <Formik
        initialValues={initValues}
        enableReinitialize
        validationSchema={PurchaseOrderSchema}
        onSubmit={handleApproval}
      >
        {({isValid}: any) => {
          return (
            <Form className='justify-content-center' noValidate>
              <Modal.Header>
                <Modal.Title>Reject Purchase Order</Modal.Title>
              </Modal.Header>
              <Modal.Body className='py-0'>
                <div className='mb-5'>
                  <div className='row'>
                    <div className='col-md-8 mx-auto'>
                      <div className='my-5'>
                        <span className=''>Are you sure want to reject</span>
                        <strong className='mx-2'>&ldquo;{detail?.po_id || '-'}&rdquo;</strong>
                        <span className=''>?</span>
                      </div>
                      <label htmlFor='quantity' className={`${configClass?.label} required`}>
                        Notes
                      </label>
                      <Field
                        type='text'
                        name='notes'
                        as='textarea'
                        placeholder='Enter Notes'
                        className={configClass?.form}
                      />
                      <div className='fv-plugins-message-container invalid-feedback'>
                        <ErrorMessage name='notes' />
                      </div>
                    </div>
                  </div>
                </div>
              </Modal.Body>
              <Modal.Footer>
                <Button className='btn-sm' variant='secondary' onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  type='submit'
                  variant='danger'
                  className='btn-sm'
                  disabled={!isValid || loadingButtonPO}
                >
                  {!loadingButtonPO && <span className='indicator-label'>Reject</span>}
                  {loadingButtonPO && (
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

export default RejectForm
