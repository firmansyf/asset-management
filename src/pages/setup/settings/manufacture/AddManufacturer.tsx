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
import {FC, memo, useEffect, useState} from 'react'
import {Button, Modal} from 'react-bootstrap'
import {useIntl} from 'react-intl'
import * as Yup from 'yup'

import {addManufacturer, editManufacturer} from './Service'

const ManufacturerSchema: any = Yup.object().shape({
  name: Yup.string().required('Manufacturer Name is required').nullable(),
})

type Props = {
  showModal: any
  setShowModal: any
  setReloadManufacturer: any
  reloadManufacturer: any
  manufacturerDetail: any
  SetAddDataModal?: any
  modalType?: any
}

let AddManufacturer: FC<Props> = ({
  showModal,
  setShowModal,
  setReloadManufacturer,
  reloadManufacturer,
  manufacturerDetail,
  SetAddDataModal,
  modalType,
}) => {
  const intl: any = useIntl()

  const [loading, setLoading] = useState<boolean>(false)
  const [showForm, setShowForm] = useState<boolean>(false)
  const [loadingForm, setLoadingForm] = useState<boolean>(true)
  const [onClickForm, setOnClickForm] = useState<boolean>(true)
  const [errSubmitForm, setErrSubmitForm] = useState<boolean>(true)

  const require_filed_message: any = intl.formatMessage({id: 'MANDATORY_FORM_MESSAGE'})
  const addManufacturerPermission: any = hasPermission('setting.manufacturer.add') || false
  const editManufacturerPermission: any = hasPermission('setting.manufacturer.edit') || false

  useEffect(() => {
    showModal &&
      addEditFormPermission(
        setShowModal,
        setShowForm,
        manufacturerDetail,
        addManufacturerPermission,
        editManufacturerPermission,
        'Add Manufacturer',
        'Edit Manufacturer'
      )
  }, [
    addManufacturerPermission,
    editManufacturerPermission,
    manufacturerDetail,
    setShowModal,
    showModal,
  ])

  useEffect(() => {
    showModal && setLoadingForm(true)
    showModal && setTimeout(() => setLoadingForm(false), 400)
  }, [showModal])

  const onSubmit = (value: any) => {
    setLoading(true)
    const {guid} = manufacturerDetail || {}
    const params: any = {
      name: value?.name || '',
      description: value?.description || '',
      is_default: 1,
      status: 1,
    }

    if (guid) {
      editManufacturer(params, guid)
        .then(({data: {message}}: any) => {
          setLoading(false)
          setShowForm(false)
          setShowModal(false)
          useTimeOutMessage('clear', 200)
          useTimeOutMessage('success', 250, message)
          setReloadManufacturer(reloadManufacturer + 1)
        })
        .catch((e: any) => {
          setLoading(false)
          errorExpiredToken(e)
          FieldMessageError(e, [])
        })
    } else {
      addManufacturer(params)
        .then(({data: {message, data: res}}: any) => {
          setLoading(false)
          setShowForm(false)
          setShowModal(false)
          useTimeOutMessage('clear', 200)
          useTimeOutMessage('success', 250, message)
          setReloadManufacturer(reloadManufacturer + 1)

          if (modalType === 'asset') {
            SetAddDataModal({
              value: res?.guid || '',
              label: value?.name || '',
              modules: 'asset.manufacturer',
            })
          }
        })
        .catch((e: any) => {
          setLoading(false)
          errorExpiredToken(e)
          FieldMessageError(e, [])
        })
    }
  }

  const initValues: any = {
    name: manufacturerDetail?.name || '',
    description: manufacturerDetail?.description || '',
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
        validationSchema={ManufacturerSchema}
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
                <Modal.Title>{manufacturerDetail ? 'Edit' : 'Add'} Manufacturer</Modal.Title>
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
                    <label htmlFor='name' className={`${configClass?.label} required`}>
                      Manufacturer Name
                    </label>
                    <InputText
                      type='text'
                      name='name'
                      onClickForm={onClickForm}
                      className={configClass?.form}
                      placeholder='Enter Manufacturer Name'
                    />
                    {errors?.name && (
                      <div className='fv-plugins-message-container invalid-feedback'>
                        {errors?.name || ''}
                      </div>
                    )}
                  </div>

                  <div className=''>
                    <label htmlFor='description' className={`${configClass?.label}`}>
                      Manufacturer Description
                    </label>
                    <InputText
                      type='text'
                      name='description'
                      className={configClass?.form}
                      placeholder='Enter Manufacturer Description'
                    />
                  </div>
                </Modal.Body>
              )}

              <Modal.Footer>
                <Button className='btn-sm' type='submit' form-id='' variant='primary'>
                  {!loading && (
                    <span className='indicator-label' onClick={() => setOnClickForm(true)}>
                      {manufacturerDetail ? 'Save' : 'Add'}
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

AddManufacturer = memo(
  AddManufacturer,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export {AddManufacturer}
