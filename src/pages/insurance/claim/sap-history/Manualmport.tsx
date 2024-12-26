import {ToastMessage} from '@components/toast-message'
import {configClass, errorExpiredToken, errorValidation} from '@helpers'
import {ErrorMessage, Field, Form, Formik} from 'formik'
import {FC, memo, useState} from 'react'
import {Button, Modal} from 'react-bootstrap'

import {importRONumber} from '../Service'

let ManualImport: FC<any> = ({showModal, setShowModal, setReload, reload}) => {
  const [loading, setLoading] = useState<boolean>(false)

  const handleSubmit = (values: any) => {
    setLoading(true)
    importRONumber(values)
      .then(({data: {message}}: any) => {
        setLoading(false)
        setShowModal(false)
        setReload(reload + 1)
        ToastMessage({message, type: 'success'})
      })
      .catch((err: any) => {
        setLoading(false)
        errorExpiredToken(err)
        Object.values(errorValidation(err))?.map((message: any) =>
          ToastMessage({type: 'error', message})
        )
      })
  }

  return (
    <Modal dialogClassName='modal-md' show={showModal} onHide={() => setShowModal(false)}>
      <Formik initialValues={{ro_number: ''}} enableReinitialize onSubmit={handleSubmit}>
        {({setFieldValue, values}: any) => (
          <Form className='justify-content-center' noValidate>
            <Modal.Header closeButton>
              <Modal.Title>Manual Import</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <label className={configClass?.label}>Please Input RO Number</label>
              <Field
                type='text'
                maxLength='15'
                name='ro_number'
                placeholder='Enter RO Number'
                className={configClass?.form}
                value={values?.ro_number || ''}
                onChange={({target: {value}}: any) => {
                  setFieldValue('ro_number', value?.replace(/\D/g, '') || '')
                }}
              />
              <div className='fv-plugins-message-container invalid-feedback'>
                <ErrorMessage name='ro_number' />
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button className='btn-sm' variant='secondary' onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button className='btn-sm' type='submit' variant='primary'>
                {!loading && <span className='indicator-label'>Submit</span>}
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

ManualImport = memo(
  ManualImport,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export default ManualImport
