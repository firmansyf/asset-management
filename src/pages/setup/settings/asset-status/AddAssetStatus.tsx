import {InputText} from '@components/InputText'
import {PageLoader} from '@components/loader/cloud'
import {ToastMessage} from '@components/toast-message'
import {
  addEditFormPermission,
  configClass,
  errorExpiredToken,
  FieldMessageError,
  hasPermission,
  useTimeOutMessage,
} from '@helpers'
import {Form, Formik} from 'formik'
import {FC, useEffect, useState} from 'react'
import {Button, Modal} from 'react-bootstrap'
import * as Yup from 'yup'

import {addAssetStatus, editAssetStatus} from './Service'

const AssetStatusSchema: any = Yup.object().shape({
  name: Yup.string().required('Asset Status Name is required').nullable(),
})

const AddAssetStatus: FC<any> = ({
  showModal,
  setShowModal,
  setReloadAssetStatus,
  reloadAssetStatus,
  assetStatusDetail,
}) => {
  const [showForm, setShowForm] = useState<boolean>(false)
  const [onClickForm, setOnClickForm] = useState<boolean>(true)
  const [loadingForm, setLoadingForm] = useState<boolean>(true)
  const [loading, setLoadingAssetStatus] = useState<boolean>(false)
  const [errSubmitForm, setErrSubmitForm] = useState<boolean>(true)

  const require_filed_message: any = 'Please fill in mandatory field(s) to continue.'
  const addAssetStatusPermission: any = hasPermission('setting.status.add') || false
  const editAssetStatusPermission: any = hasPermission('setting.status.edit') || false

  useEffect(() => {
    showModal &&
      addEditFormPermission(
        setShowModal,
        setShowForm,
        assetStatusDetail,
        addAssetStatusPermission,
        editAssetStatusPermission,
        'Add Asset Status',
        'Edit Asset Status'
      )
  }, [
    addAssetStatusPermission,
    assetStatusDetail,
    editAssetStatusPermission,
    setShowModal,
    showModal,
  ])

  useEffect(() => {
    showModal && setLoadingForm(true)
    showModal && setTimeout(() => setLoadingForm(false), 600)
  }, [showModal])

  const onSubmit = (value: any) => {
    setLoadingAssetStatus(true)
    const {guid}: any = assetStatusDetail || {}

    const params: any = {
      name: value?.name || '',
      description: value?.description || '',
      is_default: 1,
      status: 1,
    }

    if (guid) {
      editAssetStatus(params, guid)
        .then(({data: {message}}: any) => {
          setShowForm(false)
          setShowModal(false)
          setLoadingAssetStatus(false)
          useTimeOutMessage('clear', 200)
          useTimeOutMessage('success', 250, message)
          setReloadAssetStatus(reloadAssetStatus + 1)
        })
        .catch((e: any) => {
          errorExpiredToken(e)
          setLoadingAssetStatus(false)
          FieldMessageError(e, [])
        })
    } else {
      addAssetStatus(params)
        .then(({data: {message}}: any) => {
          setShowForm(false)
          setShowModal(false)
          setLoadingAssetStatus(false)
          useTimeOutMessage('clear', 200)
          useTimeOutMessage('success', 250, message)
          setReloadAssetStatus(reloadAssetStatus + 1)
        })
        .catch((e: any) => {
          errorExpiredToken(e)
          setLoadingAssetStatus(false)
          FieldMessageError(e, [])
        })
    }
  }

  const initValues: any = {
    name: assetStatusDetail?.name || '',
    description: assetStatusDetail?.description || '',
  }

  const onClose = () => {
    setShowModal(false)
    setErrSubmitForm(true)
    setOnClickForm(false)
    setShowForm(false)
    useTimeOutMessage('clear', 200)
  }

  return (
    <Modal dialogClassName='modal-md' show={showForm} onHide={onClose}>
      <Formik
        initialValues={initValues}
        validationSchema={AssetStatusSchema}
        enableReinitialize
        onSubmit={onSubmit}
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
                <Modal.Title>{assetStatusDetail ? 'Edit' : 'Add'} Asset Status</Modal.Title>
              </Modal.Header>
              {loadingForm ? (
                <div className='row'>
                  <div className='col-12 text-center'>
                    <PageLoader height={250} />
                  </div>
                </div>
              ) : (
                <Modal.Body>
                  <div className='mb-5'>
                    <label htmlFor='name' className={`${configClass?.label}`}>
                      Asset Status Name <span className='text-danger'>*</span>
                    </label>
                    <InputText
                      name='name'
                      type='text'
                      className={configClass?.form}
                      placeholder='Enter Asset Status Name'
                      onClickForm={onClickForm}
                    />
                    {errors?.name && (
                      <div className='fv-plugins-message-container invalid-feedback mb-2 mt-2'>
                        {errors?.name || ''}
                      </div>
                    )}
                  </div>
                  <div className=''>
                    <label htmlFor='name' className={`${configClass?.label}`}>
                      Description
                    </label>
                    <InputText
                      name='description'
                      type='text'
                      className={configClass?.form}
                      placeholder='Enter Description'
                      errors={errors}
                    />
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
                      {assetStatusDetail ? 'Save' : 'Add'}
                    </span>
                  )}
                  {loading && (
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

export {AddAssetStatus}
