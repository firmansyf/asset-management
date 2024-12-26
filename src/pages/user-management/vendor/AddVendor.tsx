import 'react-datetime/css/react-datetime.css'

import {InputText} from '@components/InputText'
import {PageLoader} from '@components/loader/cloud'
import {Select} from '@components/select/select'
import {ToastMessage} from '@components/toast-message'
import {configClass} from '@helpers'
import {ScrollTopComponent} from '@metronic/assets/ts/components'
import {addVendor, editVendor} from '@pages/user-management/vendor/redux/VendorCRUD'
import {ErrorMessage, Field, Form, Formik} from 'formik'
import {FC, memo, useEffect, useState} from 'react'
import {Button, Modal} from 'react-bootstrap'
import {useIntl} from 'react-intl'
import {shallowEqual, useSelector} from 'react-redux'
import * as Yup from 'yup'

const validationSchema: any = Yup.object().shape({
  name: Yup.string().required('Vendor Name is required'),
  status: Yup.string().required('Status is required'),
})

let AddVendor: FC<any> = ({
  vendorDetail,
  setShowModaVendor,
  showModal,
  setReloadVendor,
  reloadVendor,
}) => {
  const intl: any = useIntl()
  const preferenceStore: any = useSelector(({preference}: any) => preference, shallowEqual)
  const {preference: dataPreference, phone_code: dataPhoneCode}: any = preferenceStore || {}

  const [phoneCode, setPhoneCode] = useState<any>([])
  const [errForm, setErrForm] = useState<boolean>(true)
  const [loadingForm, setLoadingForm] = useState<boolean>(true)
  const [loadingVendor, setLoadingVendor] = useState<boolean>(false)
  const [phoneCodeMatchPref, setPhodeCodeMatchPref] = useState<any>()

  const require_filed_message: any = intl.formatMessage({id: 'MANDATORY_FORM_MESSAGE'})

  const initValues: any = {
    name: vendorDetail?.name || '',
    type: vendorDetail?.type || '',
    address: vendorDetail?.address || '',
    website: vendorDetail?.website || '',
    fax_number: vendorDetail?.fax_number || '',
    description: vendorDetail?.description || '',
    contact_name: vendorDetail?.contact_name || '',
    contact_number: vendorDetail?.contact_number || '',
    status:
      vendorDetail?.status === 'Active' ? '1' : vendorDetail?.status === 'Non-Active' ? '0' : '',
    phone_number:
      vendorDetail?.phone_number !== undefined && vendorDetail?.phone_number !== null
        ? vendorDetail?.phone_number?.split(' ')?.[1]
        : '',
    phone_code:
      vendorDetail?.phone_number !== undefined && vendorDetail?.phone_number !== null
        ? vendorDetail?.phone_number?.split(' ')?.[0]
        : phoneCodeMatchPref?.phone_code || '',
  }

  const handleSubmit = (values: any, actions: any) => {
    setLoadingVendor(true)
    let phone_code: any = ''
    let errorOnSubmit: boolean = true
    const {guid}: any = vendorDetail || {}

    if (vendorDetail?.phone_number !== undefined && vendorDetail?.phone_number !== null) {
      const phoneCode: any = [vendorDetail?.phone_number?.split(' ')?.[0]]
      if (phoneCode?.[0] === values?.phone_code?.value) {
        phone_code = phoneCode || ''
      } else {
        phone_code = values?.phone_code || ''
      }
    } else {
      phone_code = values?.phone_code || ''
    }

    if (values?.phone_number !== undefined && values?.phone_number?.length > 15) {
      if (values?.phone_number?.length > 15) {
        actions.setFieldError('phone_number', 'Maximum phone number length is 16 digits')
        actions.setSubmitting(false)
        setLoadingVendor(false)
      }
    } else {
      errorOnSubmit = false
    }

    const params: any = {
      type: values?.type || '',
      name: values?.name || '',
      status: values?.status || '',
      website: values?.website || '',
      address: values?.address || '',
      fax_number: values?.fax_number || '',
      description: values?.description || '',
      contact_name: values?.contact_name || '',
      contact_number: values?.contact_number || '',
      phone_number:
        phone_code && values?.phone_number && values?.phone_number !== undefined
          ? `${phone_code} ${values?.phone_number || ''}`
          : '',
    }

    if (!errorOnSubmit) {
      if (guid) {
        editVendor(params, guid)
          .then(({data: {message}}: any) => {
            setTimeout(() => ToastMessage({type: 'clear'}), 300)
            setLoadingVendor(false)
            setShowModaVendor(false)
            setReloadVendor(reloadVendor + 1)
            setTimeout(() => ToastMessage({type: 'success', message}), 400)
          })
          .catch(({response}: any) => {
            setLoadingVendor(false)
            const {devMessage, data, message} = response?.data || {}
            const {fields} = data || {}

            if (!devMessage) {
              if (fields === undefined) {
                ToastMessage({message, type: 'error'})
              } else {
                Object.keys(fields || {})?.map((item: any) => {
                  if (item?.includes('global_custom_fields')) {
                    if (fields?.[item] !== 'The global custom fields field is required.') {
                      actions.setFieldError(item, fields?.[item] || '')
                    }
                  } else {
                    ToastMessage({message: fields?.[item]?.[0] || '', type: 'error'})
                  }
                  return true
                })
              }
            }
          })
      } else {
        addVendor(params)
          .then(({data: {message}}: any) => {
            setTimeout(() => ToastMessage({type: 'clear'}), 300)
            setLoadingVendor(false)
            setShowModaVendor(false)
            setReloadVendor(reloadVendor + 1)
            setTimeout(() => ToastMessage({type: 'success', message}), 400)
          })
          .catch(({response}: any) => {
            setLoadingVendor(false)
            const {devMessage, data, message} = response?.data || {}
            const {fields} = data || {}

            if (!devMessage) {
              if (fields === undefined) {
                ToastMessage({message, type: 'error'})
              } else {
                Object.keys(fields || {})?.map((item: any) => {
                  if (item?.includes('global_custom_fields')) {
                    if (fields?.[item] !== 'The global custom fields field is required.') {
                      actions.setFieldError(item, fields?.[item] || '')
                    }
                  } else {
                    ToastMessage({message: fields?.[item]?.[0] || '', type: 'error'})
                  }
                  return true
                })
              }
            }
          })
      }
    }
  }

  const onClose = () => {
    setErrForm(true)
    setLoadingVendor(false)
    setShowModaVendor(false)
    setTimeout(() => ToastMessage({type: 'clear'}), 800)
  }

  useEffect(() => {
    showModal && setLoadingForm(true)
    showModal && setTimeout(() => setLoadingForm(false), 500)
    showModal && setTimeout(() => ToastMessage({type: 'clear'}), 800)
  }, [showModal])

  useEffect(() => {
    if (dataPhoneCode) {
      const data: any = dataPhoneCode?.map(({key, label}: any) => ({
        value: key || '',
        label: `${label || ''} (+${key || ''})`,
      }))
      setPhoneCode(data as never[])
    }
  }, [dataPhoneCode])

  useEffect(() => {
    if (dataPreference && dataPreference?.length > 0) {
      setPhodeCodeMatchPref(dataPreference)
    }
  }, [dataPreference])

  return (
    <Modal dialogClassName='modal-lg' show={showModal} onHide={onClose}>
      <Formik
        initialValues={initValues}
        validationSchema={validationSchema}
        enableReinitialize={true}
        onSubmit={handleSubmit}
      >
        {({setSubmitting, isSubmitting, errors, values, setFieldValue, isValidating}: any) => {
          if (isSubmitting && errForm && Object.keys(errors || {})?.length > 0) {
            ToastMessage({
              message: `${require_filed_message}`,
              type: 'error',
            })
            setErrForm(false)
            setSubmitting(false)
          }

          if (isSubmitting && isValidating && !errForm && Object.keys(errors || {})?.length > 0) {
            ToastMessage({
              message: `${require_filed_message}`,
              type: 'error',
            })
          }

          ScrollTopComponent.goTop()

          return (
            <Form className='justify-content-center' noValidate>
              <Modal.Header closeButton>
                <Modal.Title>{vendorDetail?.guid ? 'Edit' : 'Add'} Vendor</Modal.Title>
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
                    <label htmlFor='description' className={configClass?.label}>
                      Description
                    </label>
                    <InputText
                      type='text'
                      name='description'
                      className={configClass?.form}
                      placeholder='Enter Description vendor'
                    />
                  </div>
                  <div className='mb-5'>
                    <label htmlFor='name' className={`${configClass?.label} required`}>
                      Vendor Name
                    </label>
                    <InputText
                      name='name'
                      type='text'
                      className={configClass?.form}
                      placeholder='Enter Vendor Name'
                    />
                    <div className='fv-plugins-message-container mt-0 invalid-feedback'>
                      <ErrorMessage name='name' />
                    </div>
                  </div>

                  <div className='row'>
                    <div className='col-6'>
                      <div className='mb-5'>
                        <label htmlFor='address' className={configClass?.label}>
                          Address
                        </label>
                        <InputText
                          type='text'
                          name='address'
                          className={configClass?.form}
                          placeholder='Enter Address'
                        />
                      </div>

                      <div className='mb-5'>
                        <label htmlFor='phone_number' className={configClass?.label}>
                          Phone Number
                        </label>
                        <div className='input-group-sm d-flex input-group input-group-solid'>
                          <div className='col-6'>
                            <Select
                              sm={true}
                              data={phoneCode}
                              name='phone_code'
                              className='col p-0'
                              isClearable={false}
                              placeholder='Enter Country Code'
                              defaultValue={values?.phone_code}
                              onChange={(e: any) => setFieldValue('phone_code', e?.value || {})}
                            />
                          </div>
                          <div className='col-6'>
                            <Field
                              type='text'
                              minLength='8'
                              maxLength='13'
                              name='phone_number'
                              value={values?.phone_number || ''}
                              className={configClass?.form}
                              placeholder='Enter Phone Number'
                              onChange={({target: {value}}: any) => {
                                setFieldValue('phone_number', value?.replace(/\D/g, '') || '')
                              }}
                            />
                          </div>
                        </div>
                        <div className='fv-plugins-message-container mt-0 invalid-feedback'>
                          <ErrorMessage name='phone_number' />
                        </div>
                      </div>

                      <div className='mb-5'>
                        <label htmlFor='website' className={configClass?.label}>
                          Website
                        </label>
                        <InputText
                          type='text'
                          name='website'
                          placeholder='Enter Website'
                          className={configClass?.form}
                        />
                      </div>

                      <div className='mb-5'>
                        <label htmlFor='contact_name' className={configClass?.label}>
                          Contact Name
                        </label>
                        <InputText
                          type='text'
                          name='contact_name'
                          className={configClass?.form}
                          placeholder='Enter Contact Name'
                        />
                      </div>
                    </div>
                    <div className='col-6'>
                      <div className='mb-5'>
                        <label htmlFor='status' className={`${configClass?.label} required`}>
                          Status
                        </label>
                        <Select
                          sm={true}
                          data={[
                            {
                              value: '1',
                              label: 'Active',
                            },
                            {
                              value: '0',
                              label: 'Non-Active',
                            },
                          ]}
                          name={`status`}
                          isClearable={false}
                          placeholder='Enter Status'
                          defaultValue={values?.status || ''}
                          onChange={({value}: any) => setFieldValue(`status`, value || '')}
                        />
                        <div className='fv-plugins-message-container mt-0 invalid-feedback'>
                          <ErrorMessage name='status' />
                        </div>
                      </div>

                      <div className='mb-5'>
                        <label htmlFor='fax_number' className={configClass?.label}>
                          Fax Number
                        </label>
                        <InputText
                          type='text'
                          name='fax_number'
                          className={configClass?.form}
                          placeholder='Enter Asset Status Name'
                        />
                      </div>

                      <div className=''>
                        <label htmlFor='type' className={configClass?.label}>
                          Type
                        </label>
                        <InputText
                          name='type'
                          type='text'
                          placeholder='Enter Type'
                          className={configClass?.form}
                        />
                      </div>

                      <div className='mt-5'>
                        <label htmlFor='contact_number' className={configClass?.label}>
                          Contact Number
                        </label>
                        <Field
                          type='text'
                          name='contact_number'
                          maxLength='15'
                          className={configClass?.form}
                          placeholder='Enter Contact Number'
                          onChange={({target}: any) => {
                            setFieldValue('contact_number', target?.value?.replace(/\D/g, '') || '')
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </Modal.Body>
              )}
              <Modal.Footer>
                <Button type='submit' variant='primary' className='btn-sm' disabled={loadingVendor}>
                  {!loadingVendor && (
                    <span className='indicator-label'>{vendorDetail?.guid ? 'Save' : 'Add'}</span>
                  )}
                  {loadingVendor && (
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

AddVendor = memo(AddVendor, (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next))
export {AddVendor}
