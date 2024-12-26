import {AddInputBtn} from '@components/button/Add'
import {InputText} from '@components/InputText'
import {PageLoader} from '@components/loader/cloud'
import {Select} from '@components/select/ajax'
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
import {useIntl} from 'react-intl'
import * as Yup from 'yup'

import {getManufacturer} from '../manufacture/Service'
import {addModel, editModel} from './Service'

const ModelSchema = Yup.object().shape({
  name: Yup.string().required('Model is required'),
  manufacturer_guid: Yup.string().required('Manufacturer is required'),
})

type Props = {
  showModal: any
  setShowModal: any
  setReloadModel: any
  reloadModel: any
  modelDetail?: any
  setManufacturerDetail?: any
  setShowModalManufacturer?: any
  reloadManufacturer?: any
  SetAddDataModal?: any
  modalType?: any
}
const AddModel: FC<Props> = ({
  showModal,
  setShowModal,
  setReloadModel,
  reloadModel,
  modelDetail,
  setManufacturerDetail = () => '',
  setShowModalManufacturer,
  reloadManufacturer,
  SetAddDataModal,
  modalType,
}) => {
  const intl: any = useIntl()
  const require_filed_message: any = intl.formatMessage({id: 'MANDATORY_FORM_MESSAGE'})

  const [loading, setLoading] = useState<boolean>(false)
  const [errSubmitForm, setErrSubmitForm] = useState<boolean>(true)
  const [showForm, setShowForm] = useState<boolean>(false)
  const [loadingForm, setLoadingForm] = useState<boolean>(true)

  const addModelPermission: any = hasPermission('setting.model.add') || false
  const editModelPermission: any = hasPermission('setting.model.edit') || false

  useEffect(() => {
    if (showModal) {
      addEditFormPermission(
        setShowModal,
        setShowForm,
        modelDetail,
        addModelPermission,
        editModelPermission,
        'Add Model',
        'Edit Model'
      )
    }
  }, [addModelPermission, editModelPermission, modelDetail, setShowModal, showModal])

  useEffect(() => {
    showModal && setLoadingForm(true)
    showModal && setTimeout(() => setLoadingForm(false), 400)
  }, [showModal])

  const handleSubmit = (value: any) => {
    setLoading(true)

    if (modelDetail?.guid !== undefined) {
      const params: any = {
        manufacturer_guid: value?.manufacturer_guid || '',
        name: value?.name || '',
      }

      editModel(params, modelDetail?.guid)
        .then(({data: {message}}: any) => {
          setLoading(false)
          setShowModal(false)
          setShowForm(false)
          setReloadModel(reloadModel + 1)
          useTimeOutMessage('clear', 200)
          useTimeOutMessage('success', 250, message)
        })
        .catch((e: any) => {
          setLoading(false)
          errorExpiredToken(e)
          FieldMessageError(e, [])
        })
    } else {
      const params: any = {
        manufacturer_guid: value?.manufacturer_guid || '',
        models: [{name: value?.name || ''}],
      }

      addModel(params)
        .then(({data}: any) => {
          setLoading(false)
          setShowModal(false)
          setShowForm(false)
          setReloadModel(reloadModel + 1)
          useTimeOutMessage('clear', 200)
          useTimeOutMessage('success', 250, data?.[0]?.message)

          if (modalType === 'asset') {
            SetAddDataModal({
              value: data?.[0]?.data?.guid || '',
              guid: value?.manufacturer_guid || '',
              label: value?.name || '',
              modules: 'asset.manufacturer_model',
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

  const onClose = () => {
    setShowModal(false)
    setShowForm(false)
    useTimeOutMessage('clear', 200)
  }

  return (
    <Modal dialogClassName='modal-md' show={showForm} onHide={onClose}>
      <Formik
        initialValues={{
          manufacturer_guid: modelDetail?.manufacturer?.guid || '',
          name: modelDetail?.name || '',
        }}
        validationSchema={ModelSchema}
        enableReinitialize
        onSubmit={handleSubmit}
      >
        {({isSubmitting, errors, setSubmitting, isValidating, setFieldValue}: any) => {
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
              <Modal.Header closeButton>
                <Modal.Title>{modelDetail ? 'Edit' : 'Add'} Model</Modal.Title>
              </Modal.Header>
              {loadingForm ? (
                <div className='row'>
                  <div className='col-12 text-center'>
                    <PageLoader height={250} />
                  </div>
                </div>
              ) : (
                <Modal.Body>
                  <div className='mb-3'>
                    <label htmlFor='manufacturer_guid' className={`${configClass?.label} required`}>
                      Manufacturer
                    </label>
                    <div className='d-flex align-items-center input-group input-group-solid'>
                      <Select
                        sm={true}
                        className='col p-0'
                        api={getManufacturer}
                        params={{orderCol: 'name', orderDir: 'asc'}}
                        reload={reloadManufacturer}
                        placeholder='Choose Manufacturer'
                        isClearable={false}
                        defaultValue={{
                          value: modelDetail?.manufacturer?.guid || '',
                          label: modelDetail?.manufacturer?.name || '',
                        }}
                        onChange={({value}: any) => setFieldValue('manufacturer_guid', value || '')}
                        parse={(e: any) => {
                          return {
                            value: e?.guid,
                            label: e?.name,
                          }
                        }}
                      />
                      <AddInputBtn
                        size={'sm'}
                        dataCy='addManufacturer'
                        onClick={() => {
                          setManufacturerDetail(undefined)
                          setShowModalManufacturer(true)
                        }}
                      />
                    </div>
                    {errors?.manufacturer_guid && (
                      <div className='fv-plugins-message-container invalid-feedback'>
                        {/* <ErrorMessage name='manufacturer_guid' /> */}
                        {errors?.manufacturer_guid}
                      </div>
                    )}
                  </div>
                  <div className=''>
                    <label htmlFor='name' className={`${configClass?.label} required`}>
                      Model
                    </label>
                    <InputText
                      type='text'
                      name='name'
                      placeholder='Enter Model Name'
                      className={configClass?.form}
                    />
                    {errors?.name && (
                      <div className='fv-plugins-message-container invalid-feedback'>
                        {/* <ErrorMessage name='name' /> */}
                        {errors?.name}
                      </div>
                    )}
                  </div>
                </Modal.Body>
              )}
              <Modal.Footer>
                <Button
                  disabled={loading}
                  className='btn-sm'
                  type='submit'
                  form-id=''
                  variant='primary'
                >
                  {!loading && (
                    <span className='indicator-label'>{modelDetail ? 'Save' : 'Add'}</span>
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

export {AddModel}
