import {ToastMessage} from '@components/toast-message'
import {configClass, errorExpiredToken} from '@helpers'
import {ErrorMessage, Field, Form, Formik} from 'formik'
import {FC, memo, useState} from 'react'
import {Button, Modal} from 'react-bootstrap'

import {importCaseID} from '../Service'

let ManualImport: FC<any> = ({showModal, setShowModal, setReload, reload}) => {
  const [loading, setLoading] = useState<boolean>(false)

  const handleSubmit = (values: any) => {
    setLoading(true)
    importCaseID(values)
      .then(({data: {message}}: any) => {
        setLoading(false)
        setShowModal(false)
        setReload(reload + 1)
        ToastMessage({message, type: 'success'})
      })
      .catch((e: any) => {
        setLoading(false)
        errorExpiredToken(e)
        const {response} = e || {}
        const {data, message}: any = response?.data || {}
        const {fields} = data || {}

        if (fields !== undefined) {
          const error: any = fields || {}
          for (const key in error) {
            const value: any = error?.[key] || []
            ToastMessage({type: 'error', message: value?.[0] || ''})
          }
        } else {
          ToastMessage({type: 'error', message})
        }
      })
  }
  return (
    <Modal dialogClassName='modal-md' show={showModal} onHide={() => setShowModal(false)}>
      <Formik initialValues={{case_id: ''}} enableReinitialize onSubmit={handleSubmit}>
        {() => (
          <Form className='justify-content-center' noValidate>
            <Modal.Header closeButton>
              <Modal.Title>Manual Import</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <label className={configClass?.label}>Please Input Case ID</label>
              <Field
                type='text'
                name='case_id'
                placeholder='Enter Case ID'
                className={configClass?.form}
              />
              <div className='fv-plugins-message-container invalid-feedback'>
                <ErrorMessage name='case_id' />
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
export {ManualImport}
