import {PageLoader} from '@components/loader/cloud'
import {ToastMessage} from '@components/toast-message'
import {configClass} from '@helpers'
import {ErrorMessage, Field, Form, Formik} from 'formik'
import {FC, memo, useEffect, useState} from 'react'
import {Button, Modal} from 'react-bootstrap'
import {useIntl} from 'react-intl'
import * as Yup from 'yup'

import {addTicketType, editTicketType} from './core/service'

const TypeSchema = Yup.object().shape({
  ticket_type: Yup.string().required('Ticket Type is required').nullable(),
})

type PropsTicketType = {
  showModal: any
  typeDetail: any
  reload: any
  setShowModal: any
  setReload: any
}
let AddEditTicketType: FC<PropsTicketType> = ({
  showModal,
  typeDetail,
  setReload,
  setShowModal,
  reload,
}) => {
  const intl = useIntl()
  const require_filed_message = intl.formatMessage({id: 'MANDATORY_FORM_MESSAGE'})

  const [loading, setLoading] = useState(false)
  const [errForm, setErrForm] = useState<any>(true)
  const [_onClickForm, setOnClickForm] = useState<boolean>(true)
  const [loadingForm, setLoadingForm] = useState<boolean>(true)

  useEffect(() => {
    if (showModal) {
      setLoadingForm(true)
      setTimeout(() => {
        setLoadingForm(false)
      }, 400)
    }
  }, [showModal])

  const successMessage = (message: any) => {
    setTimeout(() => ToastMessage({type: 'clear'}), 300)
    setTimeout(() => ToastMessage({type: 'success', message}), 400)
  }

  const handleOnSubmit: any = (val: any) => {
    const params = {
      name: val?.ticket_type,
      description: val?.description,
      is_default: 1,
      order: 5,
    }
    setLoading(true)
    if (typeDetail) {
      editTicketType(params, typeDetail?.guid)
        .then(({data: {message}}: any) => {
          successMessage(message)
          setLoading(false)
          setShowModal(false)
          setReload(reload + 1)
        })
        .catch((err: any) => {
          ToastMessage({type: 'error', message: err?.response?.data?.data?.fields?.name[0]})
          setLoading(false)
        })
    } else {
      addTicketType(params)
        .then(({data: {message}}: any) => {
          successMessage(message)
          setLoading(false)
          setShowModal(false)
          setReload(reload + 1)
        })
        .catch((err: any) => {
          ToastMessage({type: 'error', message: err?.response?.data?.data?.fields?.name[0]})
          setLoading(false)
        })
    }
  }
  const closeModal = () => {
    setShowModal(false)
    setErrForm(true)
    ToastMessage({type: 'clear'})
  }

  return (
    <Modal dialogClassName='modal-md' show={showModal} onHide={closeModal}>
      <Formik
        initialValues={{ticket_type: typeDetail?.name, description: typeDetail?.description}}
        validationSchema={TypeSchema}
        enableReinitialize
        onSubmit={handleOnSubmit}
      >
        {({setSubmitting, isSubmitting, errors, isValidating, values}) => {
          if (isSubmitting && errForm && Object.keys(errors || {})?.length > 0) {
            ToastMessage({
              message: require_filed_message,
              type: 'error',
            })
            setErrForm(false)
            setSubmitting(false)
          }
          if (isSubmitting && isValidating && !errForm && Object.keys(errors || {})?.length > 0) {
            ToastMessage({
              message: require_filed_message,
              type: 'error',
            })
          }
          return (
            <Form className='justify-content-center' noValidate>
              <Modal.Header closeButton>
                <Modal.Title>{typeDetail ? 'Edit' : 'Add'} Ticket Type</Modal.Title>
              </Modal.Header>
              {loadingForm ? (
                <div className='row'>
                  <div className='col-12 text-center'>
                    <PageLoader height={250} />
                  </div>
                </div>
              ) : (
                <Modal.Body>
                  <div className='row'>
                    <div className='col-md-12'>
                      <label htmlFor='ticket_type' className={`${configClass?.label} required`}>
                        Ticket Type
                      </label>
                      <Field
                        type='text'
                        maxLength='20'
                        name='ticket_type'
                        placeholder='Enter Ticket Type'
                        className={configClass?.form}
                        value={values?.ticket_type}
                      />
                      <div className='fv-plugins-message-container invalid-feedback'>
                        <ErrorMessage name='ticket_type' />
                      </div>
                    </div>
                    <div className='col-md-12'>
                      <label htmlFor='description' className={`${configClass?.label}`}>
                        Description
                      </label>
                      <Field
                        type='text'
                        maxLength='50'
                        name='description'
                        placeholder='Enter Description'
                        className={configClass?.form}
                        value={values?.description}
                      />
                    </div>
                  </div>
                </Modal.Body>
              )}
              <Modal.Footer>
                <Button className='btn-sm' type='submit' form-id='' variant='primary'>
                  {!loading && (
                    <span
                      className='indicator-label'
                      onClick={() => {
                        setOnClickForm(true)
                      }}
                    >
                      {typeDetail ? 'Save' : 'Add'}
                    </span>
                  )}
                  {loading && (
                    <span className='indicator-progress' style={{display: 'block'}}>
                      Please wait...
                      <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                    </span>
                  )}
                </Button>
                <Button className='btn-sm' variant='secondary' onClick={closeModal}>
                  Cancel
                </Button>
              </Modal.Footer>
            </Form>
          )
        }}
      </Formik>
    </Modal>
  )
}

AddEditTicketType = memo(
  AddEditTicketType,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export default AddEditTicketType
