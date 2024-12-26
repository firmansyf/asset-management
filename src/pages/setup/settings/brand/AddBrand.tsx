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
import {ErrorMessage, Form, Formik} from 'formik'
import {FC, memo, useEffect, useState} from 'react'
import {Button, Modal} from 'react-bootstrap'
import {useIntl} from 'react-intl'
import * as Yup from 'yup'

import {AddManufacturer} from '../manufacture/AddManufacturer'
import {getManufacturer} from '../manufacture/Service'
import {AddModel} from '../model/AddModel'
import {getModel} from '../model/Service'
import {addBrand, editBrand} from './Service'

const BrandSchema = Yup.object().shape({
  name: Yup.string().required('Brand is required'),
  manufacturer_guid: Yup.string().required('Manufacturer is required'),
  manufacturer_model_guid: Yup.string().required('Model is required'),
})

type Props = {
  brandDetail: any
  showModal: any
  setShowModal: any
  reloadBrand: any
  setReloadBrand: any
  SetAddDataModal?: any
  modalType?: any
}

let AddBrand: FC<Props> = ({
  brandDetail,
  showModal,
  setShowModal,
  reloadBrand,
  setReloadBrand,
  SetAddDataModal,
  modalType,
}) => {
  const intl: any = useIntl()
  const require_filed_messages: any = intl.formatMessage({id: 'MANDATORY_FORM_MESSAGE'})

  const [ModelDetail, setModelDetail] = useState<any>()
  const [reloadModel, setReloadModel] = useState<any>(0)
  const [loading, setLoading] = useState<boolean>(false)
  const [showForm, setShowForm] = useState<boolean>(false)
  const [loadingForm, setLoadingForm] = useState<boolean>(true)
  const [onClickForm, setOnClickForm] = useState<boolean>(true)
  const [errSubmitForm, setErrSubmitForm] = useState<boolean>(true)
  const [manufacturerGuid, setManufacturerGuid] = useState<string>('')
  const [showModalModel, setShowModalModel] = useState<boolean>(false)
  const [ManufacturerDetail, setManufacturerDetail] = useState<any>('')
  const [reloadManufacturer, setReloadManufacturer] = useState<number>(0)
  const [showModalManufacturer, setShowModalManufacturer] = useState<boolean>(false)

  const addBrandPermission: any = hasPermission('setting.brand.add') || false
  const editBrandPermission: any = hasPermission('setting.brand.edit') || false

  useEffect(() => {
    if (showModal) {
      addEditFormPermission(
        setShowModal,
        setShowForm,
        brandDetail,
        addBrandPermission,
        editBrandPermission,
        'Add Brand',
        'Edit Brand'
      )
    }
  }, [addBrandPermission, brandDetail, editBrandPermission, setShowModal, showModal])

  useEffect(() => {
    setLoadingForm(true)
    if (showModal) {
      setManufacturerGuid('')
      setOnClickForm(true)
      setTimeout(() => {
        setLoadingForm(false)
      }, 400)
    }
  }, [showModal])

  const initValues: any = {
    name: brandDetail?.name || '',
    manufacturer_guid: brandDetail?.manufacturer?.guid || '',
    manufacturer_model_guid: brandDetail?.manufacturer_model?.guid || '',
  }

  const handleSubmit = (value: any) => {
    setLoading(true)
    const params: any = {
      manufacturer_guid: value?.manufacturer_guid || '',
      manufacturer_model_guid: value?.manufacturer_model_guid || '',
      brands: [{name: value?.name || ''}],
      name: value?.name || '',
    }

    if (brandDetail) {
      editBrand(params, brandDetail?.guid)
        .then(({data: {message}}: any) => {
          setLoading(false)
          setShowForm(false)
          setReloadBrand(reloadBrand + 1)
          useTimeOutMessage('clear', 200)
          useTimeOutMessage('success', 250, message)
          setTimeout(() => setShowModal(false), 1000)
        })
        .catch((err: any) => {
          setLoading(false)
          errorExpiredToken(err)
          FieldMessageError(err, [])
        })
    } else {
      addBrand(params)
        .then(({data: {message, data}}: any) => {
          setLoading(false)
          setShowModal(false)
          setShowForm(false)
          setReloadBrand(reloadBrand + 1)
          useTimeOutMessage('clear', 200)
          useTimeOutMessage('success', 250, message)
          setTimeout(() => setShowModal(false), 1000)

          if (modalType === 'asset') {
            SetAddDataModal({
              value: data?.guids[0] || '',
              label: value?.name || '',
              guid: value?.manufacturer_model_guid || '',
              modules: 'asset.manufacturer_brand',
            })
          }
        })
        .catch((err: any) => {
          setLoading(false)
          errorExpiredToken(err)
          FieldMessageError(err, [])
        })
    }
  }

  const onClose = () => {
    setShowForm(false)
    setShowModal(false)
    setOnClickForm(false)
    setErrSubmitForm(true)
    useTimeOutMessage('clear', 200)
  }

  return (
    <>
      <Modal dialogClassName='modal-md' show={showForm} onHide={onClose}>
        <Formik
          initialValues={initValues}
          validationSchema={BrandSchema}
          enableReinitialize
          onSubmit={handleSubmit}
        >
          {({isSubmitting, errors, setSubmitting, isValidating, setFieldValue}) => {
            if (isSubmitting && errSubmitForm && Object.keys(errors || {})?.length > 0) {
              ToastMessage({
                message: `${require_filed_messages}`,
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
                message: `${require_filed_messages}`,
                type: 'error',
              })
            }

            return (
              <Form className='justify-content-center' noValidate>
                <Modal.Header>
                  <Modal.Title>{brandDetail ? 'Edit' : 'Add'} Brand</Modal.Title>
                </Modal.Header>
                {loadingForm ? (
                  <div className='row'>
                    <div className='col-12 text-center'>
                      <PageLoader height={250} />
                    </div>
                  </div>
                ) : (
                  <Modal.Body>
                    <div className='mb-4'>
                      <label
                        htmlFor='manufacturer_guid'
                        className={`${configClass?.label} required`}
                      >
                        Manufacturer
                      </label>
                      <div className='d-flex align-items-center input-group input-group-solid'>
                        <Select
                          sm={true}
                          api={getManufacturer}
                          className='col p-0'
                          isClearable={false}
                          name='manufacturer_guid'
                          reload={reloadManufacturer}
                          placeholder='Choose Manufacturer'
                          params={{orderCol: 'name', orderDir: 'asc'}}
                          parse={({guid, name}: any) => ({value: guid || '', label: name || ''})}
                          defaultValue={{
                            value: brandDetail?.manufacturer?.guid || '',
                            label: brandDetail?.manufacturer?.name || '',
                          }}
                          onChange={({value}: any) => {
                            setManufacturerGuid(value || '')
                            setFieldValue('manufacturer_guid', value || '')
                            setFieldValue('manufacturer_model_guid', '')
                          }}
                        />
                        <AddInputBtn
                          size={configClass?.size}
                          onClick={() => {
                            setManufacturerDetail(undefined)
                            setShowModalManufacturer(true)
                          }}
                        />
                      </div>
                      <div className='fv-plugins-message-container invalid-feedback'>
                        <ErrorMessage name='manufacturer_guid' />
                      </div>
                    </div>
                    <div className='mb-4'>
                      <label
                        htmlFor='manufacturer_model_guid'
                        className={`${configClass?.label} required`}
                      >
                        Model
                      </label>
                      <div className='d-flex align-items-center input-group input-group-solid'>
                        <Select
                          sm={true}
                          api={getModel}
                          params={{
                            'filter[manufacturer_guid]': manufacturerGuid || '-',
                            orderCol: 'name',
                            orderDir: 'asc',
                          }}
                          className='col p-0'
                          isClearable={false}
                          placeholder='Choose Model'
                          name='manufacturer_model_guid'
                          parse={({guid, name}: any) => ({value: guid || '', label: name || ''})}
                          defaultValue={{
                            value: brandDetail?.manufacturer_model?.guid || '',
                            label: brandDetail?.manufacturer_model?.name || '',
                          }}
                          onChange={({value}: any) =>
                            setFieldValue('manufacturer_model_guid', value || '')
                          }
                        />
                        <AddInputBtn
                          size={configClass?.size}
                          onClick={() => {
                            setModelDetail(undefined)
                            setShowModalModel(true)
                          }}
                        />
                      </div>
                      <div className='fv-plugins-message-container invalid-feedback'>
                        <ErrorMessage name='manufacturer_model_guid' />
                      </div>
                    </div>
                    <div className=''>
                      <label htmlFor='name' className={`${configClass?.label} required`}>
                        Brand
                      </label>
                      <InputText
                        name='name'
                        type='text'
                        errors={errors}
                        placeholder='Enter Brand'
                        onClickForm={onClickForm}
                        className={`${configClass?.form} text-dark fw-bolder }`}
                      />
                    </div>
                  </Modal.Body>
                )}
                <Modal.Footer>
                  <Button disabled={loading} className='btn-sm' type='submit' variant='primary'>
                    {!loading && (
                      <span className='indicator-label' onClick={() => setOnClickForm(true)}>
                        {brandDetail ? 'Save' : 'Add'}
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
      <AddManufacturer
        showModal={showModalManufacturer}
        setShowModal={setShowModalManufacturer}
        setReloadManufacturer={setReloadManufacturer}
        reloadManufacturer={reloadManufacturer}
        manufacturerDetail={ManufacturerDetail}
      />
      <AddModel
        setShowModal={setShowModalModel}
        showModal={showModalModel}
        modelDetail={ModelDetail}
        setReloadModel={setReloadModel}
        reloadModel={reloadModel}
        setManufacturerDetail={setManufacturerDetail}
        setShowModalManufacturer={setShowModalManufacturer}
        reloadManufacturer={reloadManufacturer}
      />
    </>
  )
}

AddBrand = memo(AddBrand, (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next))
export {AddBrand}
