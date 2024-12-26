import {InputText} from '@components/InputText'
import {
  configClass,
  errorExpiredToken,
  errorValidation,
  FieldMessageError,
  useTimeOutMessage,
} from '@helpers'
import {ErrorMessage, Field, Form, Formik} from 'formik'
import {FC, useState} from 'react'
import {Button, Modal} from 'react-bootstrap'
import * as Yup from 'yup'

import {addPeril, editPeril} from './Service'

const PerilSchema: any = Yup.object().shape({
  name: Yup.string().required('Type of Peril is required').nullable(),
})

const AddTypeOfPeril: FC<any> = ({showModal, setShowModal, setReload, reload, detail}) => {
  const [validation, setValidation] = useState<any>({})
  const [loading, setLoading] = useState<boolean>(false)

  const initValue: any = {
    name: detail?.name || '',
    deductible_amount: detail?.deductible_amount?.replaceAll(',', '') || '',
    description: detail?.description || '',
  }

  const handleSubmit = (value: any) => {
    setValidation({})
    setLoading(true)

    const params: any = {
      name: value?.name || '',
      deductible_amount: value?.deductible_amount || '',
      description: value?.description || '',
    }

    if (detail) {
      editPeril(params, detail?.guid)
        .then(({data: {message}}: any) => {
          setLoading(false)
          setShowModal(false)
          setReload(reload + 1)
          useTimeOutMessage('clear', 200)
          useTimeOutMessage('success', 250, message)
        })
        .catch((e: any) => {
          setLoading(false)
          errorExpiredToken(e)
          FieldMessageError(e, [])
          setValidation(errorValidation(e))
        })
    } else {
      addPeril(params)
        .then(({data: {message}}: any) => {
          setLoading(false)
          setShowModal(false)
          setReload(reload + 1)
          useTimeOutMessage('clear', 200)
          useTimeOutMessage('success', 250, message)
        })
        .catch((e: any) => {
          setLoading(false)
          errorExpiredToken(e)
          FieldMessageError(e, [])
          setValidation(errorValidation(e))
        })
    }
  }

  return (
    <Modal dialogClassName='modal-md' show={showModal} onHide={() => setShowModal(false)}>
      <Formik
        initialValues={initValue}
        validationSchema={PerilSchema}
        enableReinitialize
        onSubmit={handleSubmit}
      >
        {({errors}: any) => (
          <Form className='justify-content-center' noValidate>
            <Modal.Header>
              <Modal.Title>{detail ? 'Edit' : 'Add'} Type Of Peril</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className='row align-items-center mb-5'>
                <div className='col-4'>
                  <label className={configClass?.label} htmlFor='name'>
                    Type of Peril <span className='text-danger'>*</span>
                  </label>
                </div>
                <div className='col-8'>
                  <Field
                    name='name'
                    type='text'
                    placeholder='Enter Type Peril'
                    className={
                      errors?.name || validation?.name
                        ? `${configClass?.form} is-invalid`
                        : configClass?.form
                    }
                  />
                  <div className='fv-plugins-message-container invalid-feedback'>
                    {validation?.name && (
                      <>
                        <span>{validation?.name || ''}</span> <br />
                      </>
                    )}
                    <ErrorMessage name='name' />
                  </div>
                </div>
              </div>
              <div className='row align-items-center mb-5'>
                <div className='col-4'>
                  <label className={configClass?.label} htmlFor='deductible_amount'>
                    Deductible Amount (RM)
                  </label>
                </div>
                <div className='col-8'>
                  <InputText
                    name='deductible_amount'
                    type='number'
                    className={configClass?.form}
                    placeholder='Enter Deductible Amount'
                  />
                </div>
              </div>
              <div className='row align-items-center'>
                <div className='col-4'>
                  <label className={configClass?.label} htmlFor='description'>
                    Description
                  </label>
                </div>
                <div className='col-8'>
                  <InputText
                    name='description'
                    type='text'
                    className={configClass?.form}
                    placeholder='Peril Description'
                  />
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

              <Button
                className='btn-sm'
                variant='secondary'
                onClick={() => {
                  setShowModal(false)
                  useTimeOutMessage('clear', 200)
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

export {AddTypeOfPeril}
