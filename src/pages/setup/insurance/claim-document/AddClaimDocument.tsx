import {
  configClass,
  errorExpiredToken,
  errorValidation,
  FieldMessageError,
  useTimeOutMessage,
} from '@helpers'
import {ErrorMessage, Field, Form, Formik} from 'formik'
import {FC, useEffect, useState} from 'react'
import {Button, Modal} from 'react-bootstrap'
import * as Yup from 'yup'

import {addDocument, editDocument} from './Service'

const DocumentSchema: any = Yup.object().shape({
  name: Yup.string().required('Document name is required').nullable(),
  insurance_claim_peril_guid: Yup.string().required('Type of Peril is required'),
})

const AddclaimDocument: FC<any> = ({
  showModal,
  setShowModal,
  setReload,
  reload,
  optPerils,
  detail,
}) => {
  const [validation, setValidation] = useState<any>({})
  const [loading, setLoading] = useState<boolean>(false)
  const [mandatory, setMandatory] = useState<boolean>(false)

  const initValue: any = {
    name: detail?.name || '',
    insurance_claim_peril_guid: detail?.peril?.guid || '',
  }

  const handleSubmit = (value: any) => {
    setValidation({})
    setLoading(true)
    const params: any = {
      name: value?.name || '',
      insurance_claim_peril_guid: value?.insurance_claim_peril_guid || '',
      is_mandatory_document: mandatory,
    }

    if (detail) {
      editDocument(params, detail?.guid)
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
      addDocument(params)
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

  useEffect(() => {
    if (detail) {
      setMandatory(detail?.is_mandatory_document)
    } else {
      setMandatory(false)
    }
  }, [detail])

  return (
    <Modal dialogClassName='modal-md' show={showModal} onHide={() => setShowModal(false)}>
      <Formik
        initialValues={initValue}
        validationSchema={DocumentSchema}
        enableReinitialize
        onSubmit={handleSubmit}
      >
        {({errors}: any) => (
          <Form className='justify-content-center' noValidate>
            <Modal.Header>
              <Modal.Title>{detail ? 'Edit' : 'Add'} Claim Document</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className='row align-items-center mb-5'>
                <div className='col-4'>
                  <label className={configClass?.label} htmlFor='peril'>
                    Type of Peril
                  </label>
                </div>
                <div className='col-8'>
                  <Field
                    as='select'
                    name='insurance_claim_peril_guid'
                    placeholder='Enter Country Code'
                    className={
                      errors?.insurance_claim_peril_guid
                        ? `${configClass?.form} is-invalid`
                        : configClass?.form
                    }
                  >
                    <option value=''>Choose Type of Peril</option>
                    {optPerils &&
                      optPerils?.length > 0 &&
                      optPerils?.map(({guid, name}: any) => {
                        return (
                          <option key={guid} value={guid || ''}>
                            {name || '-'}
                          </option>
                        )
                      })}
                  </Field>
                  <div className='fv-plugins-message-container invalid-feedback'>
                    <ErrorMessage name='insurance_claim_peril_guid' />
                  </div>
                </div>
              </div>
              <div className='row align-items-center mb-5'>
                <div className='col-4'>
                  <label className={configClass?.label} htmlFor='name'>
                    Document Name
                  </label>
                </div>
                <div className='col-8'>
                  <Field
                    name='name'
                    type='text'
                    placeholder='Enter Document Name'
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
              <div>
                <div className='d-flex align-items-center'>
                  <input
                    id='is_active'
                    name='is_active'
                    type='checkbox'
                    checked={mandatory}
                    onChange={() => setMandatory(!mandatory)}
                  />
                  <label htmlFor='is_active' className='ms-2'>
                    Mandatory document
                  </label>
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

export {AddclaimDocument}
