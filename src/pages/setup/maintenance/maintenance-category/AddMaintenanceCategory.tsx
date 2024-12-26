import {PageLoader} from '@components/loader/cloud'
import {ToastMessage} from '@components/toast-message'
import {configClass, errorExpiredToken, FieldMessageError, useTimeOutMessage} from '@helpers'
import {ErrorMessage, Field, Form, Formik} from 'formik'
import {FC, memo, useEffect, useState} from 'react'
import {Button, Modal} from 'react-bootstrap'
import {useIntl} from 'react-intl'
import * as Yup from 'yup'

import {addMaintenanceCategory, editMaintenanceCategory} from './Service'

const MaintenanceCategorySchema: any = Yup.object().shape({
  name: Yup.string().required('Work Orders Category Name is required'),
})

interface CustomerTypes {
  name: string
}

type ModalAddMaintenanceCategoryProps = {
  showModal: any
  setShowModal: any
  setReloadMaintenanceCategory: any
  reloadMaintenanceCategory: any
  detailMaintenanceCategory: any
}

let ModalMaintenanceCategory: FC<ModalAddMaintenanceCategoryProps> = ({
  showModal,
  setShowModal,
  setReloadMaintenanceCategory,
  reloadMaintenanceCategory,
  detailMaintenanceCategory,
}) => {
  const intl: any = useIntl()

  const [loadingForm, setLoadingForm] = useState<boolean>(true)
  const [errSubmitForm, setErrSubmitForm] = useState<boolean>(true)
  const [loadingMaintenanceCategory, setLoadingMaintenanceCategory] = useState<boolean>(false)

  const require_filed_message: any = intl.formatMessage({id: 'MANDATORY_FORM_MESSAGE'})

  useEffect(() => {
    showModal && setLoadingForm(true)
    showModal && setTimeout(() => setLoadingForm(false), 400)
  }, [showModal])

  const handleOnSubmit = (values: CustomerTypes) => {
    setLoadingMaintenanceCategory(true)
    const params = {
      name: values?.name || '',
    }

    if (detailMaintenanceCategory) {
      const {guid} = detailMaintenanceCategory || {}
      editMaintenanceCategory(params, guid)
        .then(({data: {message}}: any) => {
          setShowModal(false)
          setLoadingMaintenanceCategory(false)
          useTimeOutMessage('clear', 200)
          useTimeOutMessage('success', 250, message)
          setReloadMaintenanceCategory(reloadMaintenanceCategory + 1)
        })
        .catch((err: any) => {
          errorExpiredToken(err)
          FieldMessageError(err, [])
          setLoadingMaintenanceCategory(false)
        })
    } else {
      addMaintenanceCategory(params)
        .then(({data: {message}}: any) => {
          setShowModal(false)
          setLoadingMaintenanceCategory(false)
          useTimeOutMessage('clear', 200)
          useTimeOutMessage('success', 250, message)
          setReloadMaintenanceCategory(reloadMaintenanceCategory + 1)
        })
        .catch((err: any) => {
          errorExpiredToken(err)
          FieldMessageError(err, [])
          setLoadingMaintenanceCategory(false)
        })
    }
  }

  const onClose = () => {
    setShowModal(false)
    setErrSubmitForm(true)
    ToastMessage({type: 'clear'})
  }

  const initValues: any = {
    name: detailMaintenanceCategory?.name || '',
  }

  return (
    <Modal dialogClassName='modal-md' show={showModal} onHide={onClose}>
      <Formik
        initialValues={initValues}
        validationSchema={MaintenanceCategorySchema}
        enableReinitialize
        onSubmit={handleOnSubmit}
      >
        {({isSubmitting, errors, setSubmitting, isValidating}: any) => {
          if (isSubmitting && errSubmitForm && Object.keys(errors || {})?.length > 0) {
            ToastMessage({
              message: require_filed_message,
              type: 'error',
            })
            setErrSubmitForm(false)
            setSubmitting(false)
          }

          if (
            isSubmitting &&
            isValidating &&
            !errSubmitForm &&
            Object.keys(errors || {})?.length > 0
          ) {
            ToastMessage({
              message: require_filed_message,
              type: 'error',
            })
          }

          return (
            <Form className='justify-content-center' noValidate>
              <Modal.Header>
                <Modal.Title>
                  {detailMaintenanceCategory ? 'Edit' : 'Add'} Maintenance Category
                </Modal.Title>
              </Modal.Header>

              {loadingForm ? (
                <div className='row'>
                  <div className='col-12 text-center'>
                    <PageLoader height={250} />
                  </div>
                </div>
              ) : (
                <Modal.Body>
                  <div className='mt-5'>
                    <div className='col-md-12 mb-4'>
                      <label htmlFor='category' className={`${configClass?.label} mb-2 required`}>
                        Maintenance Category Name
                      </label>
                      <Field
                        type='text'
                        name='name'
                        placeholder='Enter Maintenance Category Name'
                        className={configClass?.form}
                      />
                      <div className='fv-plugins-message-container invalid-feedback'>
                        <ErrorMessage name='name' />
                      </div>
                    </div>
                  </div>
                </Modal.Body>
              )}

              <Modal.Footer>
                <Button className='btn-sm' type='submit' form-id='' variant='primary'>
                  {!loadingMaintenanceCategory && (
                    <span className='indicator-label'>
                      {detailMaintenanceCategory ? 'Save' : 'Add'}
                    </span>
                  )}
                  {loadingMaintenanceCategory && (
                    <span className='indicator-progress' style={{display: 'block'}}>
                      Please wait...
                      <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                    </span>
                  )}
                </Button>
                <Button className='btn-sm' variant='secondary' onClick={onClose}>
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

ModalMaintenanceCategory = memo(
  ModalMaintenanceCategory,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export default ModalMaintenanceCategory
