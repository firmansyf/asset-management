import {InputText} from '@components/InputText'
import {PageLoader} from '@components/loader/cloud'
import {Select} from '@components/select/select'
import {ToastMessage} from '@components/toast-message'
import {
  addEditFormPermission,
  configClass,
  errorExpiredToken,
  FieldMessageError,
  hasPermission,
  useTimeOutMessage,
} from '@helpers'
import {ErrorMessage, Field, Form, Formik} from 'formik'
import {FC, memo, useEffect, useState} from 'react'
import {Button, Modal} from 'react-bootstrap'
import {useIntl} from 'react-intl'
import {shallowEqual, useSelector} from 'react-redux'
import * as Yup from 'yup'

import {addSupplier, editSupplier} from './Service'

const SupplierSchema: any = Yup.object().shape({
  name: Yup.string().required('Supplier Name is required').nullable(),
  contact_number: Yup.string().matches(/^(\+)?([0-9]){0,16}$/g, 'Phone number is not valid'),
})

type Props = {
  showModal: any
  setShowModal: any
  setReloadSupplier?: any
  reloadSupplier?: any
  detailSupplier?: any
  editCountry?: any
  setEditCountry?: any
  SetAddDataModal?: any
  modalType?: any
}

let AddSupplier: FC<Props> = ({
  showModal,
  setShowModal,
  setReloadSupplier,
  reloadSupplier,
  detailSupplier,
  editCountry,
  setEditCountry,
  SetAddDataModal,
  modalType,
}) => {
  const intl: any = useIntl()
  const preferenceStore: any = useSelector(({preference}: any) => preference, shallowEqual)
  const {
    preference: dataPreference,
    phone_code: dataPhoneCode,
    country: dataCountry,
  }: any = preferenceStore || {}

  const [country, setCountry] = useState<any>([])
  const [phoneCode, setPhoneCode] = useState<any>([])
  const [preference, setPreference] = useState<any>({})
  const [loading, setLoading] = useState<boolean>(false)
  const [showForm, setShowForm] = useState<boolean>(false)
  const [loadingForm, setLoadingForm] = useState<boolean>(true)
  const [errSubmitForm, setErrSubmitForm] = useState<boolean>(true)
  const [phoneCodeMatchPref, setPhodeCodeMatchPref] = useState<any>()

  const addSuppilerPermission: any = hasPermission('setting.supplier.add') || false
  const editSuppilerPermission: any = hasPermission('setting.supplier.edit') || false
  const require_filed_message: any = intl.formatMessage({id: 'MANDATORY_FORM_MESSAGE'})

  useEffect(() => {
    showModal &&
      addEditFormPermission(
        setShowModal,
        setShowForm,
        detailSupplier,
        addSuppilerPermission,
        editSuppilerPermission,
        'Add Supplier',
        'Edit Supplier'
      )
  }, [addSuppilerPermission, detailSupplier, editSuppilerPermission, setShowModal, showModal])

  useEffect(() => {
    if (dataPhoneCode && dataPhoneCode?.length > 0) {
      const data: any = dataPhoneCode?.map(({key, label}: any) => ({
        value: key || '',
        label: `${label || ''} (+${key || ''})`,
      }))
      setPhoneCode(data as never[])
    }
  }, [dataPhoneCode])

  useEffect(() => {
    dataPreference && dataPreference?.length > 0 && setPhodeCodeMatchPref(dataPreference)
  }, [dataPreference])

  useEffect(() => {
    if (detailSupplier && showModal) {
      const {country_code}: any = detailSupplier || {}
      setEditCountry(country_code !== undefined ? country_code : '')
    }
  }, [detailSupplier, setEditCountry, showModal])

  useEffect(() => {
    if (Object.keys(dataPreference || {})?.length > 0 && showModal) {
      const {country_code, phone_code}: any = dataPreference || {}
      setPreference({
        country_code: country_code || '',
        phone_code: phone_code || '',
      })
    }
  }, [dataPreference, showModal])

  useEffect(() => {
    showModal && setLoadingForm(true)
    showModal && setTimeout(() => setLoadingForm(false), 400)
  }, [showModal])

  useEffect(() => {
    if (showModal && dataCountry) {
      setCountry(dataCountry?.map(({iso_code: value, name: label}: any) => ({value, label})))
    }
  }, [dataCountry, showModal])

  const onSubmit = (value: any, actions: any) => {
    setLoading(true)

    let phone_code: any = ''
    let errorOnSubmit: boolean = true
    const {guid, contact_number}: any = detailSupplier || {}
    if (contact_number !== undefined && contact_number !== null) {
      const phoneCode: any = [contact_number?.split(' ')?.[0]]
      if (phoneCode?.[0] === value?.phone_code?.value) {
        phone_code = phoneCode || ''
      } else {
        phone_code = value?.phone_code || ''
      }
    } else {
      phone_code = value?.phone_code || ''
    }

    if (value?.contact_number !== undefined && value?.contact_number?.length > 15) {
      if (value?.contact_number?.length > 15) {
        actions.setFieldError('phone_number', 'Maximum phone number length is 15 digits')
        actions.setSubmitting(false)
        setLoading(false)
      }
    } else {
      errorOnSubmit = false
    }

    const params: any = {
      email: '',
      website: '',
      name: value?.name || '',
      city: value?.city || '',
      registration_number: '',
      state: value?.state || '',
      phone_code: phone_code || '',
      contact_number_alternate: null,
      postcode: value?.postcode || '',
      address_1: value?.address_1 || '',
      address_2: value?.address_2 || '',
      contact_person: value?.contact_person || '',
      country_code: value?.country !== 'null' ? value?.country : null,
      contact_number:
        value?.phone_code && value?.contact_number
          ? `${value?.phone_code || ''} ${value?.contact_number || ''}`
          : '',
    }

    if (!errorOnSubmit) {
      if (guid) {
        editSupplier(params, guid)
          .then(({data: {message}}: any) => {
            setLoading(false)
            setShowForm(false)
            setShowModal(false)
            setReloadSupplier(reloadSupplier + 1)
            useTimeOutMessage('clear', 200)
            useTimeOutMessage('success', 250, message)
          })
          .catch((err: any) => {
            setLoading(false)
            errorExpiredToken(err)
            FieldMessageError(err, [])
          })
      } else {
        addSupplier(params)
          .then(({data: {data: res, message}}: any) => {
            setLoading(false)
            setShowForm(false)
            setShowModal(false)
            setReloadSupplier(reloadSupplier + 1)
            useTimeOutMessage('clear', 200)
            useTimeOutMessage('success', 250, message)

            if (modalType === 'asset') {
              SetAddDataModal({
                value: res?.guid || '',
                label: value?.name || '',
                modules: 'asset.supplier',
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
  }

  const initValue: any = {
    name: detailSupplier?.name || '',
    city: detailSupplier?.city || '',
    state: detailSupplier?.state || '',
    postcode: detailSupplier?.postcode || '',
    address_1: detailSupplier?.address_one || '',
    address_2: detailSupplier?.address_two || '',
    contact_person: detailSupplier?.contact_person || '',
    contact_number: detailSupplier?.contact_number?.split(' ')?.[1] || '',
    country: detailSupplier?.country_code ? editCountry : preference?.country_code || '',
    phone_code:
      detailSupplier?.contact_number?.split(' ')?.[0] || phoneCodeMatchPref?.phone_code || '',
  }

  const onClose = () => {
    setShowModal(false)
    setShowForm(false)
    useTimeOutMessage('clear', 200)
  }

  return (
    <Modal dialogClassName='modal-md' show={showForm} onHide={onClose}>
      <Formik
        initialValues={initValue}
        validationSchema={SupplierSchema}
        enableReinitialize
        onSubmit={onSubmit}
      >
        {({errors, isSubmitting, setSubmitting, setFieldValue, isValidating, values}: any) => {
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
                <Modal.Title>{detailSupplier ? 'Edit' : 'Add'} Supplier</Modal.Title>
              </Modal.Header>
              {loadingForm ? (
                <div className='row'>
                  <div className='col-12 text-center'>
                    <PageLoader height={250} />
                  </div>
                </div>
              ) : (
                <Modal.Body>
                  <div className='row mb-5'>
                    <div className='col-md-12'>
                      <label htmlFor='name' className={`${configClass?.label} required`}>
                        Supplier Name
                      </label>
                      <Field
                        name='name'
                        type='text'
                        className={configClass?.form}
                        placeholder='Enter Supplier Name'
                      />
                      <div className='fv-plugins-message-container invalid-feedback'>
                        <ErrorMessage name='name' />
                      </div>
                    </div>
                  </div>

                  <div className='row'>
                    <div className='col-md-12'>
                      <h5 className='text-dark'>
                        <b>Address Detail</b>
                      </h5>
                      <hr />
                      <div className='col-md-12'>
                        <label htmlFor='address_1' className={`${configClass?.label}`}>
                          Address 1
                        </label>
                        <InputText name='address_1' type='text' placeholder='Enter Address 1' />
                      </div>

                      <div className='col-md-12'>
                        <label htmlFor='address_2' className={`${configClass?.label}`}>
                          Address 2
                        </label>
                        <InputText name='address_2' type='text' placeholder='Enter Address 2' />
                      </div>

                      <div className='row'>
                        <div className='col-md-6'>
                          <label htmlFor='city' className={`${configClass?.label}`}>
                            City
                          </label>
                          <InputText name='city' type='text' placeholder='Enter City' />
                        </div>

                        <div className='col-md-6'>
                          <label htmlFor='state' className={`${configClass?.label}`}>
                            State/Province
                          </label>
                          <InputText name='state' type='text' placeholder='Enter State/Province' />
                        </div>

                        <div className='col-md-6'>
                          <label htmlFor='postalCode' className={`${configClass?.label}`}>
                            Zip/Postal Code
                          </label>
                          <Field
                            type='text'
                            maxLength='10'
                            name='postcode'
                            className={configClass?.form}
                            value={values?.postcode || ''}
                            placeholder='Enter Zip/Postal Code'
                            onChange={({target: {value}}: any) => {
                              setFieldValue('postcode', value || '')
                            }}
                          />
                        </div>

                        <div className='col-md-6'>
                          <label htmlFor='country' className={`${configClass?.label}`}>
                            Country
                          </label>
                          <Select
                            sm={true}
                            name='country'
                            data={country}
                            placeholder='Choose Country'
                            defaultValue={values?.country || ''}
                            onChange={({value}: any) => setFieldValue('country', value || '')}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className='mt-5'>
                    <h5 className='text-dark'>
                      <b>Contact Detail</b>
                    </h5>
                    <hr />
                    <div className='row'>
                      <div className='col-md-6'>
                        <label htmlFor='contact_person' className={`${configClass?.label}`}>
                          Contact Person
                        </label>
                        <InputText
                          type='text'
                          name='contact_person'
                          placeholder='Enter Contact Person'
                        />
                      </div>

                      <div className='col-12'>
                        <label htmlFor='contact_number' className={`${configClass?.label}`}>
                          Contact Number
                        </label>
                        <div className='row'>
                          <div className='col-6'>
                            <Select
                              sm={true}
                              data={phoneCode}
                              name='phone_code'
                              className='col p-0'
                              isClearable={false}
                              placeholder='Enter Country Code'
                              defaultValue={values?.phone_code || ''}
                              onChange={({value}: any) => setFieldValue('phone_code', value || {})}
                            />
                          </div>

                          <div className='col-6'>
                            <Field
                              type='text'
                              maxLength='13'
                              name='contact_number'
                              className={configClass?.form}
                              placeholder='Enter Contact Number'
                              value={values?.contact_number || ''}
                              onChange={({target: {value}}: any) => {
                                setFieldValue('contact_number', value?.replace(/\D/g, '') || '')
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Modal.Body>
              )}
              <Modal.Footer>
                <Button className='btn-sm' type='submit' form-id='' variant='primary'>
                  {!loading && (
                    <span className='indicator-label'>{detailSupplier ? 'Save' : 'Add'}</span>
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

AddSupplier = memo(
  AddSupplier,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export {AddSupplier}
