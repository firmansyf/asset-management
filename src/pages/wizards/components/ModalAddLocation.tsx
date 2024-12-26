/* eslint-disable sonar/no-wildcard-import */
import {getCountry} from '@api/preference'
import {Select} from '@components/select/ajax'
import {ToastMessage} from '@components/toast-message'
import {configClass} from '@helpers'
import {getDatabaseLocation} from '@pages/setup/databases/Serivce'
import {ErrorMessage, Field, Form, Formik} from 'formik'
import {keyBy} from 'lodash'
import {FC, memo, useEffect, useState} from 'react'
import {Button, Modal} from 'react-bootstrap'
import {useIntl} from 'react-intl'
import * as Yup from 'yup'

import {addLocation, editLocation} from '../redux/WizardService'

type ModalAddlocationProps = {
  showModal: any
  setShowModalLocation: any
  locationStatus: any
  setReloadLocation: any
  reloadLocation: any
  locationDetail: any
  matchPreference: any
}

let ModalAddLocation: FC<ModalAddlocationProps> = ({
  locationStatus,
  showModal,
  setShowModalLocation,
  setReloadLocation,
  reloadLocation,
  locationDetail,
  matchPreference,
}) => {
  const intl: any = useIntl()

  const [errForm, setErrForm] = useState<boolean>(true)
  const [status, setLocationStatus] = useState<string>('')
  const [loadingLocation, setLoadingLocation] = useState<boolean>(false)
  const [locationSchema, setLocationSchema] = useState<any>([])
  const [locationDatabase, setLocationDatabase] = useState<any>({})

  const require_filed_message: any = intl.formatMessage({id: 'MANDATORY_FORM_MESSAGE'})

  useEffect(() => {
    if (locationStatus) {
      const location: any = locationStatus?.find(({unique_id}: any) => unique_id === 'available')
      const {guid}: any = location || {}
      setLocationStatus(guid)
    }
  }, [locationStatus])

  const onClose = () => {
    setShowModalLocation(false)
    setErrForm(true)
    setTimeout(() => ToastMessage({type: 'clear'}), 300)
  }

  const setValue: any = (value1: any, value2: any) => {
    if (value1) {
      return value1
    } else {
      return value2
    }
  }

  const objectMessage: any = (devMessage: any, fields: any, actions: any) => {
    if (!devMessage && fields && Object.keys(fields || {})?.length > 0) {
      Object.keys(fields)?.map((item: any) => {
        ToastMessage({message: fields?.[item]?.[0] || '', type: 'error'})
        actions.setSubmitting(false)
        return false
      })
    }
  }

  const onSubmit = (values: any, actions: any) => {
    setLoadingLocation(true)
    const {guid}: any = locationDetail || {}

    const params: any = {
      status: 0,
      name: setValue(values?.name, ''),
      city: setValue(values?.city, ''),
      state: setValue(values?.state, ''),
      street: setValue(values?.street, ''),
      address: setValue(values?.address, ''),
      postcode: setValue(values?.postal_code, ''),
      description: setValue(values?.description, ''),
      country_code: setValue(values?.country?.value, ''),
      location_availability_guid: setValue(values?.location_status, ''),
    }

    if (guid) {
      editLocation(params, guid)
        .then(({data: {message}}: any) => {
          setLoadingLocation(false)
          setShowModalLocation(false)
          setReloadLocation(reloadLocation + 1)
          setTimeout(() => ToastMessage({type: 'clear'}), 300)
          setTimeout(() => ToastMessage({message, type: 'success'}), 400)
        })
        .catch(({response}: any) => {
          setLoadingLocation(false)
          const {devMessage, data}: any = response?.data || {}
          const {fields}: any = data || {}
          objectMessage(devMessage, fields, actions)
        })
    } else {
      addLocation(params)
        .then(({data: {message}}: any) => {
          setLoadingLocation(false)
          setShowModalLocation(false)
          setReloadLocation(reloadLocation + 1)
          setTimeout(() => ToastMessage({type: 'clear'}), 300)
          setTimeout(() => ToastMessage({message, type: 'success'}), 400)
        })
        .catch(({response}: any) => {
          setLoadingLocation(false)
          const {devMessage, data} = response?.data || {}
          const {fields} = data || {}
          objectMessage(devMessage, fields, actions)
        })
    }
  }

  const initValues: any = {
    name: locationDetail?.name || '',
    street: locationDetail?.street || '',
    address: locationDetail?.address || '',
    description: locationDetail?.description || '',
    city: locationDetail?.city !== '-' ? locationDetail?.city : '',
    state: locationDetail?.state !== '-' ? locationDetail?.state : '',
    postal_code: locationDetail?.postcode !== '-' ? locationDetail?.postcode : '',
    country:
      locationDetail?.country_code !== undefined
        ? {value: locationDetail?.country_code || '', label: locationDetail?.country_name || ''}
        : {value: matchPreference?.country_code, label: matchPreference?.country},
    location_status:
      locationDetail?.availability !== undefined ? locationDetail?.availability?.guid : status,
  }

  useEffect(() => {
    getDatabaseLocation({}).then(({data: {data: res}}: any) => {
      setLocationDatabase(keyBy(res, 'field'))
    })
  }, [])

  useEffect(() => {
    let validationShape: any = {
      name: Yup.string().required('Location is required'),
      location_status: Yup.string().required('Location Status is required'),
    }

    if (Object.keys(locationDatabase).length > 1) {
      if (locationDatabase?.description?.is_required) {
        validationShape = {
          ...validationShape,
          description: Yup.string().required('Description is required'),
        }
      }
      if (locationDatabase?.address?.is_required) {
        validationShape = {
          ...validationShape,
          address: Yup.string().required('Address 1 is required'),
        }
      }
      if (locationDatabase?.street?.is_required) {
        validationShape = {
          ...validationShape,
          street: Yup.string().required('Address 2 is required'),
        }
      }
      if (locationDatabase?.city?.is_required) {
        validationShape = {
          ...validationShape,
          city: Yup.string().required('City is required'),
        }
      }
      if (locationDatabase?.state?.is_required) {
        validationShape = {
          ...validationShape,
          state: Yup.string().required('State/Province is required'),
        }
      }
      if (locationDatabase?.postcode?.is_required) {
        validationShape = {
          ...validationShape,
          postal_code: Yup.string().required('Zip/Postal Code is required'),
        }
      }
      if (locationDatabase?.country_code?.is_required) {
        validationShape = {
          ...validationShape,
          country: Yup.object().required('Country is required'),
        }
      }
    }

    const schema = Yup.object().shape(validationShape)
    setLocationSchema(schema)
  }, [locationDatabase])

  return (
    <Modal dialogClassName='modal-md' show={showModal} onHide={onClose}>
      <Formik
        enableReinitialize
        initialValues={initValues}
        validationSchema={locationSchema}
        onSubmit={onSubmit}
      >
        {({isSubmitting, setSubmitting, errors, isValidating, values, setFieldValue}: any) => {
          if (isSubmitting && errForm && Object.keys(errors || {})?.length > 0) {
            ToastMessage({message: `${require_filed_message}`, type: 'error'})
            setErrForm(false)
            setSubmitting(false)
          }

          if (isSubmitting && isValidating && !errForm && Object.keys(errors || {})?.length > 0) {
            ToastMessage({message: `${require_filed_message}`, type: 'error'})
            setErrForm(false)
          }

          return (
            <Form className='justify-content-center' noValidate>
              <Modal.Header>
                <Modal.Title>{locationDetail ? 'Edit' : 'Add'} a Location</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <span className='text-black-400 mb-3'>
                  {intl.formatMessage({
                    id: 'ENTER_THE_INFORMATION_ABOUT_YOUR_NEW_LOCATION_IN_THE_FIELDS_BELOW_AND_WE_WILL_ADD_IT_TO_YOUR_LIST',
                  })}
                </span>

                <div className='mt-3'>
                  <div className='form-group row mb-4'>
                    <label className={`${configClass?.label} required col-lg-4 pt-3`}>
                      Location
                    </label>
                    <div className='col-lg-8'>
                      <Field
                        type='text'
                        name='name'
                        data-cy='name'
                        placeholder='Enter Location'
                        className={configClass?.form}
                      />
                      <div
                        data-cy='error_name'
                        className='fv-plugins-message-container invalid-feedback'
                        style={{width: '25rem'}}
                      >
                        <ErrorMessage name='name' />
                      </div>
                    </div>
                  </div>

                  <div className='form-group row mb-3'>
                    <label className={`${configClass?.label} required col-lg-4 pt-3`}>
                      Location Status
                    </label>
                    <div className='col-lg-8'>
                      <Field
                        as='select'
                        name='location_status'
                        data-cy='location_status'
                        className={configClass?.select}
                      >
                        {Array.isArray(locationStatus) &&
                          locationStatus?.length > 0 &&
                          locationStatus?.map(({guid, name}: any, index: number) => {
                            return (
                              <option key={index || 0} value={guid || ''}>
                                {name || '-'}
                              </option>
                            )
                          })}
                      </Field>
                      <div className='fv-plugins-message-container invalid-feedback'>
                        <ErrorMessage name='location_status' />
                      </div>
                    </div>
                  </div>

                  <div className='form-group row mb-4'>
                    {locationDatabase?.description?.is_selected && (
                      <>
                        {locationDatabase?.description?.is_required && (
                          <label
                            htmlFor='description'
                            className={`col-lg-4 pt-3 ${configClass.label} required`}
                          >
                            Description
                          </label>
                        )}
                        {!locationDatabase?.description?.is_required && (
                          <label
                            htmlFor='description'
                            className={`col-lg-4 pt-3 ${configClass.label}`}
                          >
                            Description
                          </label>
                        )}
                        <div className='col-lg-8'>
                          <Field
                            type='text'
                            name='description'
                            placeholder='Enter Description'
                            className={configClass?.form}
                          />
                          {locationDatabase?.description?.is_required && (
                            <div className='fv-plugins-message-container invalid-feedback'>
                              <ErrorMessage name='description' />
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>

                  <div className='form-group row mb-4'>
                    {locationDatabase?.address?.is_selected && (
                      <>
                        {locationDatabase?.address?.is_required && (
                          <label
                            htmlFor='address'
                            className={`col-lg-4 pt-3 ${configClass.label} required`}
                          >
                            Address 1
                          </label>
                        )}
                        {!locationDatabase?.address?.is_required && (
                          <label htmlFor='address' className={`col-lg-4 pt-3 ${configClass.label}`}>
                            Address 1
                          </label>
                        )}
                        <div className='col-lg-8'>
                          <Field
                            type='text'
                            data-cy='address1'
                            name='address'
                            placeholder='Enter Address 1'
                            className={configClass?.form}
                          />
                          {locationDatabase?.address?.is_required && (
                            <div className='fv-plugins-message-container invalid-feedback'>
                              <ErrorMessage name='address' />
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>

                  <div className='form-group row mb-4'>
                    {locationDatabase?.street?.is_selected && (
                      <>
                        {locationDatabase?.street?.is_required && (
                          <label
                            htmlFor='street'
                            className={`col-lg-4 pt-3 ${configClass.label} required`}
                          >
                            Address 2
                          </label>
                        )}
                        {!locationDatabase?.street?.is_required && (
                          <label htmlFor='street' className={`col-lg-4 pt-3 ${configClass.label}`}>
                            Address 2
                          </label>
                        )}
                        <div className='col-lg-8'>
                          <Field
                            type='text'
                            data-cy='street'
                            name='street'
                            placeholder='Enter Address 2'
                            className={configClass?.form}
                          />
                          {locationDatabase?.street?.is_required && (
                            <div className='fv-plugins-message-container invalid-feedback'>
                              <ErrorMessage name='street' />
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>

                  <div className='form-group row mb-4'>
                    {locationDatabase?.city?.is_selected && (
                      <>
                        {locationDatabase?.city?.is_required && (
                          <label
                            htmlFor='city'
                            className={`col-lg-4 pt-3 ${configClass.label} required`}
                          >
                            City
                          </label>
                        )}
                        {!locationDatabase?.city?.is_required && (
                          <label htmlFor='city' className={`col-lg-4 pt-3 ${configClass.label}`}>
                            City
                          </label>
                        )}
                        <div className='col-lg-8'>
                          <Field
                            type='text'
                            data-cy='city'
                            name='city'
                            placeholder='Enter City'
                            className={configClass?.form}
                          />
                          {locationDatabase?.city?.is_required && (
                            <div className='fv-plugins-message-container invalid-feedback'>
                              <ErrorMessage name='city' />
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>

                  <div className='form-group row mb-4'>
                    {locationDatabase?.state?.is_selected && (
                      <>
                        {locationDatabase?.state?.is_required && (
                          <label
                            htmlFor='state'
                            className={`col-lg-4 pt-3 ${configClass.label} required`}
                          >
                            State/Province
                          </label>
                        )}
                        {!locationDatabase?.state?.is_required && (
                          <label htmlFor='state' className={`col-lg-4 pt-3 ${configClass.label}`}>
                            State/Province
                          </label>
                        )}
                        <div className='col-lg-8'>
                          <Field
                            type='text'
                            data-cy='state'
                            name='state'
                            placeholder='Enter State/Province'
                            className={configClass?.form}
                          />
                          {locationDatabase?.state?.is_required && (
                            <div className='fv-plugins-message-container invalid-feedback'>
                              <ErrorMessage name='state' />
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>

                  <div className='form-group row mb-4'>
                    {locationDatabase?.postcode?.is_selected && (
                      <>
                        {locationDatabase?.postcode?.is_required && (
                          <label
                            htmlFor='postal_code'
                            className={`col-lg-4 pt-3 ${configClass.label} required`}
                          >
                            Zip/Postal Code
                          </label>
                        )}
                        {!locationDatabase?.postcode?.is_required && (
                          <label
                            htmlFor='postal_code'
                            className={`col-lg-4 pt-3 ${configClass.label}`}
                          >
                            Zip/Postal Code
                          </label>
                        )}
                        <div className='col-lg-8'>
                          <Field
                            type='text'
                            maxLength='10'
                            name='postal_code'
                            placeholder='Enter Zip/Postal Code'
                            className={configClass?.form}
                            onChange={({target: {value}}: any) => {
                              // setFieldValue('postal_code', target?.value?.replace(/\D/g, '') || '')
                              setFieldValue('postal_code', value || '')
                            }}
                          />
                          {locationDatabase?.postcode?.is_required && (
                            <div className='fv-plugins-message-container invalid-feedback'>
                              <ErrorMessage name='postal_code' />
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>

                  <div className='form-group row mb-4'>
                    {locationDatabase?.country_code?.is_selected && (
                      <>
                        {locationDatabase?.country_code?.is_required && (
                          <label
                            htmlFor='country'
                            className={`col-lg-4 pt-3 ${configClass.label} required`}
                          >
                            Country
                          </label>
                        )}
                        {!locationDatabase?.country_code?.is_required && (
                          <label htmlFor='country' className={`col-lg-4 pt-3 ${configClass.label}`}>
                            Country
                          </label>
                        )}
                        <div className='col-lg-8'>
                          <Select
                            sm={true}
                            name='country'
                            data-cy='country'
                            className='col p-0'
                            api={getCountry}
                            params={false}
                            reload={false}
                            isClearable={false}
                            placeholder='Choose Country'
                            defaultValue={values?.country}
                            onChange={(e: any) => {
                              setFieldValue('country', e || '')
                            }}
                            parse={(e: any) => {
                              return {
                                value: e?.iso_code,
                                label: e?.name,
                              }
                            }}
                          />
                          {locationDatabase?.country_code?.is_required && (
                            <div className='fv-plugins-message-container invalid-feedback'>
                              <ErrorMessage name='country' />
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </Modal.Body>
              <Modal.Footer>
                <Button
                  type='submit'
                  variant='primary'
                  className='btn-sm'
                  disabled={loadingLocation}
                  data-cy='submitModalAddLocation'
                >
                  {!loadingLocation && (
                    <span className='indicator-label'>{locationDetail ? 'Save' : 'Add'}</span>
                  )}
                  {loadingLocation && (
                    <span className='indicator-progress' style={{display: 'block'}}>
                      Please wait...
                      <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                    </span>
                  )}
                </Button>
                <Button
                  onClick={onClose}
                  className='btn-sm'
                  variant='secondary'
                  data-cy='cancelAddLocation'
                >
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

ModalAddLocation = memo(
  ModalAddLocation,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export {ModalAddLocation}
