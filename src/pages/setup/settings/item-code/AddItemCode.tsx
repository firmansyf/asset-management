import {AddInputBtn} from '@components/button/Add'
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
import {getDatabaseAsset} from '@pages/setup/databases/Serivce'
import {ErrorMessage, Field, Form, Formik} from 'formik'
import {keyBy} from 'lodash'
import {FC, memo, useEffect, useState} from 'react'
import {Button, Modal} from 'react-bootstrap'
import {useIntl} from 'react-intl'
import * as Yup from 'yup'

import {AddBrand} from '../brand/AddBrand'
import {getBrand} from '../brand/Service'
import {ModalAddCategory} from '../categories/AddCategory'
import {getCategory} from '../categories/redux/CategoryCRUD'
import {AddManufacturer} from '../manufacture/AddManufacturer'
import {getManufacturer} from '../manufacture/Service'
import {AddModel} from '../model/AddModel'
import {getModel} from '../model/Service'
import {AddType} from '../type/AddType'
import {getType} from '../type/Service'
import {addItemCode, editItemCode} from './Service'

type Props = {
  detail: any
  showModal: any
  setShowModal: any
  reloadItemCode: any
  setReloadItemCode: any
  SetAddDataModal?: any
  modalType?: any
}

let AddItemCode: FC<Props> = ({
  detail,
  showModal,
  setShowModal,
  reloadItemCode,
  setReloadItemCode,
  SetAddDataModal,
  modalType,
}) => {
  const intl = useIntl()
  const require_filed_message = intl.formatMessage({id: 'MANDATORY_FORM_MESSAGE'})
  const addItemCodePermission: any = hasPermission('setting.brand.add') || false
  const editItemCodePermission: any = hasPermission('setting.brand.edit') || false

  const [errSubmitForm, setErrSubmitForm] = useState<boolean>(true)
  const [showForm, setShowForm] = useState<boolean>(false)
  const [ModelDetail, setModelDetail] = useState()
  const [categoryGuid, setCategoryGuid] = useState<any>('')
  const [manufacturerGuid, setManufacturerGuid] = useState<any>('')
  const [manufacturerModelGuid, setManufacturerModelGuid] = useState<any>('')
  const [loading, setLoading] = useState(false)
  const [loadingForm, setLoadingForm] = useState<boolean>(true)
  const [database, setDatabase] = useState<any>({})

  const [showModalCategory, setShowModalCategory] = useState<boolean>(false)
  const [showModalType, setShowModalType] = useState<boolean>(false)
  const [showModalManufacturer, setShowModalManufacturer] = useState<boolean>(false)
  const [showModalModel, setShowModalModel] = useState<boolean>(false)
  const [showModalBrand, setShowModalBrand] = useState<boolean>(false)

  const [reloadCategory, setReloadCategory] = useState<number>(0)
  const [reloadType, setReloadType] = useState<number>(0)
  const [reloadManufacturer, setReloadManufacturer] = useState<number>(0)
  const [reloadModel, setReloadModel] = useState<number>(0)
  const [reloadBrand, setReloadBrand] = useState<number>(0)

  const ItemCodeSchema = Yup.object().shape({
    item_name: Yup.string().when({
      is: () => database?.name?.is_required,
      then: () => Yup.string().required('Item Name is required'),
    } as any),
    description: Yup.string().when({
      is: () => database?.description?.is_required,
      then: () => Yup.string().required('Description is required'),
    } as any),
    item_category: Yup.string().when({
      is: () => database?.category_guid?.is_required,
      then: () => Yup.string().required('Item Category is required'),
    } as any),
    item_type: Yup.string().when({
      is: () => database?.type_guid?.is_required,
      then: () => Yup.string().required('Item Type is required'),
    } as any),
    manufacturer_guid: Yup.string().when({
      is: () => database?.manufacturer_guid?.is_required,
      then: () => Yup.string().required(database?.manufacturer_guid?.label + ' is required'),
    } as any),
    manufacturer_model_guid: Yup.string().when({
      is: () => database?.manufacturer_model_guid?.is_required,
      then: () => Yup.string().required(database?.manufacturer_model_guid?.label + ' is required'),
    } as any),
    manufacturer_brand_guid: Yup.string().when({
      is: () => database?.manufacturer_brand_guid?.is_required,
      then: () => Yup.string().required(database?.manufacturer_brand_guid?.label + ' is required'),
    } as any),
  })

  useEffect(() => {
    ToastMessage({type: 'clear'})
  }, [])

  useEffect(() => {
    if (showModal) {
      addEditFormPermission(
        setShowModal,
        setShowForm,
        detail,
        addItemCodePermission,
        editItemCodePermission,
        'Add Item Code',
        'Edit Item Code'
      )
    }
  }, [addItemCodePermission, detail, editItemCodePermission, setShowModal, showModal])

  useEffect(() => {
    if (showModal) {
      setCategoryGuid('')
      setManufacturerGuid('')
      setManufacturerModelGuid('')
      setLoadingForm(true)
      setTimeout(() => {
        setLoadingForm(false)
      }, 400)
    }
  }, [showModal])

  const handleSubmit = (value: any) => {
    setLoading(true)
    const params: any = {
      name: value?.item_name,
      description: value?.description,
      category_guid: value?.item_category,
      type_guid: value?.item_type,
      manufacturer_guid: value?.manufacturer_guid,
      manufacturer_model_guid: value?.manufacturer_model_guid,
      manufacturer_brand_guid: value?.manufacturer_brand_guid,
    }

    if (detail) {
      editItemCode(params, detail?.guid)
        .then(({data: {message}}: any) => {
          setLoading(false)
          setShowModal(false)
          setShowForm(false)
          useTimeOutMessage('clear', 200)
          useTimeOutMessage('success', 250, message)
          setReloadItemCode(reloadItemCode + 1)
        })
        .catch((err: any) => {
          setLoading(false)
          errorExpiredToken(err)
          FieldMessageError(err, [])
        })
    } else {
      addItemCode(params)
        .then(({data: {message, data: res}}: any) => {
          setLoading(false)
          setShowModal(false)
          setShowForm(false)
          setReloadItemCode(reloadItemCode + 1)
          useTimeOutMessage('clear', 200)
          useTimeOutMessage('success', 250, message)
          if (modalType === 'asset') {
            SetAddDataModal({
              value: res?.guid || '',
              label: value?.item_name || '',
              modules: 'asset.item_code',
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
    setShowModal(false)
    setErrSubmitForm(true)
    setShowForm(false)
    useTimeOutMessage('clear', 200)
  }

  useEffect(() => {
    if (showModal) {
      getDatabaseAsset({})
        .then(({data: {data}}: any) => {
          const database_asset = data?.map(
            ({field, group, is_default, is_required, is_selected, label}: any) => {
              if (group === 'asset') {
                return {
                  field: field?.replace('asset.', ''),
                  group: group,
                  is_default: is_default,
                  is_required: is_required,
                  is_selected: is_selected,
                  label: label,
                }
              } else {
                return false
              }
            }
          )
          setDatabase(keyBy(database_asset, 'field'))
        })
        .catch(() => setDatabase({}))
    }
  }, [showModal])

  return (
    <>
      <Modal dialogClassName='modal-lg' show={showForm} onHide={onClose}>
        <Formik
          initialValues={{
            item_code_id: detail?.code || '',
            item_name: detail?.name || '',
            description: detail?.description || '',
            item_category: detail?.category?.guid || '',
            item_type: detail?.type?.guid || '',
            manufacturer_guid: detail?.manufacturer?.guid || '',
            manufacturer_model_guid: detail?.manufacturer_model?.guid || '',
            manufacturer_brand_guid: detail?.manufacturer_brand?.guid || '',
          }}
          validationSchema={ItemCodeSchema}
          enableReinitialize
          onSubmit={handleSubmit}
        >
          {({setFieldValue, errors, isSubmitting, setSubmitting, isValidating}) => {
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
                  <Modal.Title>{detail ? 'Edit' : 'Add'} Item Code</Modal.Title>
                </Modal.Header>
                {loadingForm ? (
                  <div className='row'>
                    <div className='col-12 text-center'>
                      <PageLoader height={250} />
                    </div>
                  </div>
                ) : (
                  <Modal.Body>
                    <div className='mt-3'>
                      <div className='row'>
                        {detail && (
                          <div className='col-md-6 mb-4'>
                            <div className='mb-4'>
                              <label htmlFor='item_code_id' className={`${configClass?.label}`}>
                                Item Code ID
                              </label>
                              <Field
                                name='item_code_id'
                                type='text'
                                className={`${configClass?.form} text-dark }`}
                                placeholder='Enter Item Code Id'
                                disabled={true}
                              />
                            </div>
                          </div>
                        )}

                        {database?.name?.is_selected && (
                          <div className='col-md-6 mb-4'>
                            <div className='mb-4'>
                              <label
                                htmlFor='item_name'
                                className={`${configClass?.label} ${
                                  database?.name?.is_required ? 'required' : ''
                                }`}
                              >
                                Item Name
                              </label>
                              <Field
                                name='item_name'
                                type='text'
                                className={`${configClass?.form} text-dark }`}
                                placeholder='Enter Item name'
                              />
                              <div className='fv-plugins-message-container invalid-feedback mb-2'>
                                <ErrorMessage name='item_name' />
                              </div>
                            </div>
                          </div>
                        )}

                        {database?.description?.is_selected && (
                          <div className='col-md-6 mb-4'>
                            <div className='mb-4'>
                              <label
                                htmlFor='item_name'
                                className={`${configClass?.label} ${
                                  database?.description?.is_required ? 'required' : ''
                                }`}
                              >
                                Description
                              </label>
                              <Field
                                name='description'
                                type='text'
                                className={`${configClass?.form} text-dark }`}
                                placeholder='Enter Description'
                              />
                              <div className='fv-plugins-message-container invalid-feedback mb-2'>
                                <ErrorMessage name='description' />
                              </div>
                            </div>
                          </div>
                        )}

                        {database?.category_guid?.is_selected && (
                          <div className='col-md-6 mb-4'>
                            <div className='mb-4'>
                              <label
                                htmlFor='item_category'
                                className={`${configClass?.label} ${
                                  database?.category_guid?.is_required ? 'required' : ''
                                }`}
                              >
                                Item Category
                              </label>
                              <div className='d-flex align-items-center input-group input-group-solid'>
                                <Select
                                  sm={true}
                                  name='item_category'
                                  className='col p-0'
                                  api={getCategory}
                                  params={{orderCol: 'name', orderDir: 'asc'}}
                                  reload={reloadCategory}
                                  isClearable={false}
                                  placeholder='Choose Category'
                                  defaultValue={{
                                    value: detail?.category?.guid,
                                    label: detail?.category?.name,
                                  }}
                                  onChange={(e: any) => {
                                    setCategoryGuid(e?.value)
                                    setFieldValue('item_category', e?.value || '')
                                  }}
                                  parse={(e: any) => {
                                    return {
                                      value: e?.guid,
                                      label: e?.name,
                                    }
                                  }}
                                />
                                <AddInputBtn
                                  size={configClass?.size}
                                  onClick={() => {
                                    setShowModalCategory(true)
                                  }}
                                />
                              </div>
                              {database?.category_guid?.is_required && (
                                <div className='fv-plugins-message-container invalid-feedback'>
                                  <ErrorMessage name='item_category' />
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {database?.type_guid?.is_selected && (
                          <div className='col-md-6 mb-4'>
                            <div className='mb-4'>
                              <label
                                htmlFor='item_type'
                                className={`${configClass?.label} ${
                                  database?.type_guid?.is_required ? 'required' : ''
                                }`}
                              >
                                Item Type
                              </label>
                              <div className='d-flex align-items-center input-group input-group-solid'>
                                <Select
                                  sm={true}
                                  name='item_type'
                                  className='col p-0'
                                  api={getType}
                                  params={{
                                    'filter[category_guid]': categoryGuid || '-',
                                    orderCol: 'name',
                                    orderDir: 'asc',
                                  }}
                                  reload={reloadType}
                                  isClearable={false}
                                  placeholder='Choose Type'
                                  defaultValue={{
                                    value: detail?.type?.guid,
                                    label: detail?.type?.name,
                                  }}
                                  onChange={(e: any) => {
                                    setFieldValue('item_type', e?.value || '')
                                  }}
                                  parse={(e: any) => {
                                    return {
                                      value: e?.guid,
                                      label: e?.name,
                                    }
                                  }}
                                />
                                <AddInputBtn
                                  size={configClass?.size}
                                  onClick={() => {
                                    setShowModalType(true)
                                  }}
                                />
                              </div>
                              {database?.type_guid?.is_required && (
                                <div className='fv-plugins-message-container invalid-feedback'>
                                  <ErrorMessage name='item_type' />
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {database?.manufacturer_guid?.is_selected && (
                          <div className='col-md-6 mb-4'>
                            <div className='mb-4'>
                              <label
                                htmlFor='manufacturer_guid'
                                className={`${configClass?.label} ${
                                  database?.manufacturer_guid?.is_required ? 'required' : ''
                                }`}
                              >
                                Manufacturer
                              </label>
                              <div className='d-flex align-items-center input-group input-group-solid'>
                                <Select
                                  sm={true}
                                  name='manufacturer_guid'
                                  className='col p-0'
                                  api={getManufacturer}
                                  params={{orderCol: 'name', orderDir: 'asc'}}
                                  reload={reloadManufacturer}
                                  isClearable={false}
                                  placeholder='Choose Manufacturer'
                                  defaultValue={{
                                    value: detail?.manufacturer?.guid,
                                    label: detail?.manufacturer?.name,
                                  }}
                                  onChange={(e: any) => {
                                    setManufacturerGuid(e?.value)
                                    setFieldValue('manufacturer_guid', e?.value || '')
                                    setFieldValue('manufacturer_model_guid', '')
                                  }}
                                  parse={(e: any) => {
                                    return {
                                      value: e?.guid,
                                      label: e?.name,
                                    }
                                  }}
                                />
                                <AddInputBtn
                                  size={configClass?.size}
                                  onClick={() => {
                                    setShowModalManufacturer(true)
                                  }}
                                />
                              </div>
                              {database?.manufacturer_guid?.is_required && (
                                <div className='fv-plugins-message-container invalid-feedback'>
                                  <ErrorMessage name='manufacturer_guid' />
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                        {database?.manufacturer_model_guid?.is_selected && (
                          <div className='col-md-6 mb-4'>
                            <div className='mb-4'>
                              <label
                                htmlFor='manufacturer_model_guid'
                                className={`${configClass?.label} ${
                                  database?.manufacturer_model_guid?.is_required ? 'required' : ''
                                }`}
                              >
                                Model
                              </label>
                              <div className='d-flex align-items-center input-group input-group-solid'>
                                <Select
                                  sm={true}
                                  name='manufacturer_model_guid'
                                  className='col p-0'
                                  api={getModel}
                                  params={{
                                    'filter[manufacturer_guid]': manufacturerGuid || '-',
                                    orderCol: 'name',
                                    orderDir: 'asc',
                                  }}
                                  reload={reloadModel}
                                  isClearable={false}
                                  placeholder='Choose Model'
                                  defaultValue={{
                                    value: detail?.manufacturer_model?.guid,
                                    label: detail?.manufacturer_model?.name,
                                  }}
                                  onChange={(e: any) => {
                                    setManufacturerModelGuid(e?.value)
                                    setFieldValue('manufacturer_model_guid', e?.value || '')
                                  }}
                                  parse={(e: any) => {
                                    return {
                                      value: e?.guid,
                                      label: e?.name,
                                    }
                                  }}
                                />
                                <AddInputBtn
                                  size={configClass?.size}
                                  onClick={() => {
                                    setModelDetail(undefined)
                                    setShowModalModel(true)
                                  }}
                                />
                              </div>
                              {database?.manufacturer_model_guid?.is_required && (
                                <div className='fv-plugins-message-container invalid-feedback'>
                                  <ErrorMessage name='manufacturer_model_guid' />
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {database?.manufacturer_brand_guid?.is_selected && (
                          <div className='col-md-6 mb-4'>
                            <div className='mb-4'>
                              <label
                                htmlFor='manufacturer_brand_guid'
                                className={`${configClass?.label} ${
                                  database?.manufacturer_brand_guid?.is_required ? 'required' : ''
                                }`}
                              >
                                Brand
                              </label>
                              <div className='d-flex align-items-center input-group input-group-solid'>
                                <Select
                                  sm={true}
                                  name='manufacturer_brand_guid'
                                  className='col p-0'
                                  api={getBrand}
                                  params={{
                                    'filter[manufacturer_model_guid]': manufacturerModelGuid || '-',
                                    orderCol: 'name',
                                    orderDir: 'asc',
                                  }}
                                  reload={reloadBrand}
                                  isClearable={false}
                                  placeholder='Choose Brand'
                                  defaultValue={{
                                    value: detail?.manufacturer_brand?.guid,
                                    label: detail?.manufacturer_brand?.name,
                                  }}
                                  onChange={(e: any) =>
                                    setFieldValue('manufacturer_brand_guid', e?.value || '')
                                  }
                                  parse={(e: any) => {
                                    return {
                                      value: e?.guid,
                                      label: e?.name,
                                    }
                                  }}
                                />
                                <AddInputBtn
                                  size={configClass?.size}
                                  onClick={() => {
                                    setModelDetail(undefined)
                                    setShowModalBrand(true)
                                  }}
                                />
                              </div>
                              {database?.manufacturer_brand_guid?.is_required && (
                                <div className='fv-plugins-message-container invalid-feedback'>
                                  <ErrorMessage name='manufacturer_brand_guid' />
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </Modal.Body>
                )}
                <Modal.Footer>
                  <Button disabled={loading} className='btn-sm' type='submit' variant='primary'>
                    {!loading && <span className='indicator-label'>{detail ? 'Save' : 'Add'}</span>}
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
      <ModalAddCategory
        setReloadCategory={setReloadCategory}
        reloadCategory={reloadCategory}
        showModal={showModalCategory}
        setShowModal={setShowModalCategory}
        categoryDetail={undefined}
      />

      <AddType
        showModal={showModalType}
        setShowModal={setShowModalType}
        setReloadType={setReloadType}
        reloadType={reloadType}
        typeDetail={undefined}
        SetAddDataModal={undefined}
        modalType={undefined}
      />
      <AddManufacturer
        showModal={showModalManufacturer}
        setShowModal={setShowModalManufacturer}
        setReloadManufacturer={setReloadManufacturer}
        reloadManufacturer={reloadManufacturer}
        manufacturerDetail={undefined}
      />
      <AddModel
        setShowModal={setShowModalModel}
        showModal={showModalModel}
        modelDetail={ModelDetail}
        setReloadModel={setReloadModel}
        reloadModel={reloadModel}
        setManufacturerDetail={undefined}
        setShowModalManufacturer={setShowModalManufacturer}
        reloadManufacturer={reloadManufacturer}
      />
      <AddBrand
        brandDetail={undefined}
        showModal={showModalBrand}
        setShowModal={setShowModalBrand}
        reloadBrand={reloadBrand}
        setReloadBrand={setReloadBrand}
        SetAddDataModal={undefined}
        modalType={undefined}
      />
    </>
  )
}

AddItemCode = memo(
  AddItemCode,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export {AddItemCode}
