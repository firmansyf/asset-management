import {configClass} from '@helpers'
import {ErrorMessage, Field, Form, Formik} from 'formik'
import {FC, memo} from 'react'
import {Button, Modal} from 'react-bootstrap'
import * as Yup from 'yup'

type ModalSaveAsProps = {
  detailReport: any
  showModal: any
  setShowModal: any
  saveType: any
  onSubmitReport: any
}

const saveAsSchema = Yup.object().shape({
  name: Yup.string()
    .required('Report Name is required.')
    .max(45, 'This report name can not be greater than 45 characters'),
})

let ModalSaveAs: FC<ModalSaveAsProps> = ({
  detailReport,
  showModal,
  setShowModal,
  saveType,
  onSubmitReport,
}) => {
  const handleOnSubmit = (values: any) => {
    onSubmitReport(values)
  }
  return (
    <Modal dialogClassName='modal-md' show={showModal} onHide={() => setShowModal(false)}>
      <Formik
        initialValues={{
          name: detailReport?.name || '',
          available_for_all: detailReport?.available_for_all || false,
        }}
        validationSchema={saveAsSchema}
        enableReinitialize
        onSubmit={handleOnSubmit}
      >
        {() => (
          <Form className='justify-content-center' noValidate>
            <Modal.Header>
              <Modal.Title>Save Custom Report</Modal.Title>
            </Modal.Header>
            {saveType === 'save' ? (
              <Modal.Body>
                <div className='form-group text-center'>
                  Are you sure want to save changes made to this report?
                </div>
              </Modal.Body>
            ) : (
              <Modal.Body>
                <div className='form-group mb-4'>
                  <label className={`${configClass?.label} required`}>Report Name</label>
                  <Field type='text' name='name' className={configClass?.form} />
                  <div className='fv-plugins-message-container invalid-feedback'>
                    <ErrorMessage name='name' />
                  </div>
                </div>
                <div className='form-group row'>
                  <div className='my-3'>
                    <label className='d-flex align-items-center'>
                      Save this report for other users too
                      <Field type='checkbox' name='available_for_all' className='ms-2' />
                    </label>
                  </div>
                </div>
              </Modal.Body>
            )}
            <Modal.Footer>
              <Button className='btn-sm' variant='secondary' onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button className='btn-sm' type='submit' form-id='' variant='primary'>
                <span className='indicator-label'>Save</span>
              </Button>
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </Modal>
  )
}

ModalSaveAs = memo(
  ModalSaveAs,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export default ModalSaveAs
