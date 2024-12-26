import {ToastMessage} from '@components/toast-message'
import {configClass, errorValidation} from '@helpers'
import {Field, Form, Formik} from 'formik'
import {FC, useState} from 'react'
import {Button, Modal} from 'react-bootstrap'
import * as Yup from 'yup'

import {createOrUpdateGroup} from './service'

const validationSchema = Yup.object().shape({
  label: Yup.string().required('This Group name is required').nullable(),
})

const Index: FC<any> = ({detail, show, setShow, setReload, moduleName}) => {
  const [loading, setLoading] = useState(false)
  const handleOnSubmit = (val: any) => {
    setLoading(true)
    const params: any = {
      module: moduleName,
      label: val?.label,
    }
    createOrUpdateGroup(params, detail?.guid)
      .then(({data: {data, message}}: any) => {
        setLoading(false)
        setShow(false)
        ToastMessage({type: 'success', message})
        setReload(data)
      })
      .catch((err: any) => {
        setLoading(false)
        Object.values(errorValidation(err) || {}).map((message: any) =>
          ToastMessage({type: 'error', message})
        )
      })
  }

  return (
    <Modal dialogClassName='modal-md' show={show} onHide={() => setShow(false)}>
      <Formik
        initialValues={{label: detail?.label || ''}}
        validationSchema={validationSchema}
        enableReinitialize
        onSubmit={handleOnSubmit}
      >
        {({errors}: any) => (
          <Form className='justify-content-center' noValidate>
            <Modal.Header closeButton>
              <Modal.Title>{detail ? 'Edit' : 'Add New'} Group</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className='row'>
                <div className='col-md-12'>
                  <label
                    htmlFor='label'
                    className='text-uppercase fs-8 space-1 fw-bolder text-dark required mb-1'
                  >
                    Group Name
                  </label>
                  <Field
                    name='label'
                    className={configClass?.form}
                    type='text'
                    placeholder='Enter Group Name'
                  />
                  {errors?.label && <div className='mt-1 fs-8 text-danger'>{errors?.label}</div>}
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button className='btn-sm' type='submit' form-id='' variant='primary'>
                {!loading && <span className='indicator-label'>{detail ? 'Save' : 'Add'}</span>}
                {loading && (
                  <span className='indicator-progress' style={{display: 'block'}}>
                    Please wait...
                    <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                  </span>
                )}
              </Button>
              <Button className='btn-sm' variant='secondary' onClick={() => setShow(false)}>
                Cancel
              </Button>
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </Modal>
  )
}

export default Index
